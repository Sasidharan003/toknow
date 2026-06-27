import fs from "fs";
import path from "path";
import * as schema from "./schema";

const DB_PATH = path.join(__dirname, "../../../db.json");

// Helper to convert snake_case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// Helper to get Table Name from Drizzle table symbol
function getTableName(table: any): string {
  if (typeof table === 'string') return table;
  let name = 'unknown';
  const symbolKey = Object.getOwnPropertySymbols(table).find(
    (sym) => sym.description === 'drizzle:BaseName'
  );
  if (symbolKey) {
    name = table[symbolKey];
  } else {
    name = table.name || 'unknown';
  }
  
  // Normalization mapping to match SEED_DATA and db.json keys
  if (name === 'gov_services') return 'services';
  if (name === 'complaint_guides') return 'complaints';
  if (name === 'news_articles') return 'news';
  if (name === 'document_templates') return 'documentTemplates';
  if (name === 'chat_messages') return 'chatMessages';
  if (name === 'suggested_questions') return 'suggestedQuestions';
  
  return name;
}

import { SEED_DATA } from "./seedData";

// ─── Database File IO Helpers ────────────────────────────────────────────────
function readDb(): Record<string, any[]> {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(SEED_DATA, null, 2), "utf8");
      return SEED_DATA;
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read JSON DB, returning seeds:", err);
    return SEED_DATA;
  }
}

function writeDb(data: Record<string, any[]>): void {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to JSON DB:", err);
  }
}

// ─── Fluent Query Builder Parser & Executor ──────────────────────────────────
function getConditionParams(sqlObj: any) {
  let colName: string | null = null;
  let targetVal: any = null;
  let isIlike = false;
  
  if (sqlObj && sqlObj.queryChunks) {
    for (const chunk of sqlObj.queryChunks) {
      if (chunk && typeof chunk === 'object' && chunk.constructor && chunk.constructor.name === 'StringChunk') {
        const val = String(chunk.value || '');
        if (val.toLowerCase().includes('like')) {
          isIlike = true;
        }
      }
    }
    
    for (const chunk of sqlObj.queryChunks) {
      if (chunk && typeof chunk === 'object') {
        if ('table' in chunk && 'name' in chunk) {
          colName = chunk.name;
        } else if ('value' in chunk && (!chunk.constructor || chunk.constructor.name !== 'StringChunk')) {
          targetVal = chunk.value;
        }
      } else if (typeof chunk === 'string' || typeof chunk === 'number' || typeof chunk === 'boolean') {
        targetVal = chunk;
      }
    }
  }
  
  return { colName, targetVal, isIlike };
}

function evalCondition(row: any, cond: any): boolean {
  if (!cond) return true;
  
  if (cond.queryChunks) {
    const subConds = cond.queryChunks.filter((c: any) => c && typeof c === 'object' && (c.constructor && (c.constructor.name === 'SQL' || c.queryChunks)));
    if (subConds.length > 0) {
      const strChunks = cond.queryChunks.filter((c: any) => c && typeof c === 'object' && c.constructor && c.constructor.name === 'StringChunk');
      const isOr = strChunks.some((sc: any) => String(sc.value || '').toLowerCase().includes(' or '));
      
      if (isOr) {
        return subConds.some((sc: any) => evalCondition(row, sc));
      } else {
        return subConds.every((sc: any) => evalCondition(row, sc));
      }
    }
    
    const { colName, targetVal, isIlike } = getConditionParams(cond);
    if (!colName) return true;
    
    const rowKey = toCamelCase(colName);
    const rowVal = row[rowKey];
    
    if (isIlike) {
      const search = String(targetVal || '').replace(/%/g, '').toLowerCase();
      return String(rowVal || '').toLowerCase().includes(search);
    } else {
      return String(rowVal).toLowerCase() == String(targetVal).toLowerCase();
    }
  }
  
  return true;
}

function getSortParams(sortObj: any) {
  let colName = 'id';
  let isDesc = false;
  
  if (sortObj) {
    if (sortObj.queryChunks) {
      for (const chunk of sortObj.queryChunks) {
        if (chunk && typeof chunk === 'object') {
          if ('table' in chunk && 'name' in chunk) {
            colName = chunk.name;
          }
        }
      }
      const strChunks = sortObj.queryChunks.filter((c: any) => c && typeof c === 'object' && c.constructor && c.constructor.name === 'StringChunk');
      isDesc = strChunks.some((sc: any) => String(sc.value || '').toLowerCase().includes('desc'));
    } else if (typeof sortObj === 'object' && 'name' in sortObj) {
      colName = sortObj.name;
    }
  }
  return { key: toCamelCase(colName), isDesc };
}

function sortData(data: any[], sortObj: any) {
  const { key, isDesc } = getSortParams(sortObj);
  return [...data].sort((a, b) => {
    let valA = a[key];
    let valB = b[key];
    if (valA instanceof Date) valA = valA.getTime();
    if (valB instanceof Date) valB = valB.getTime();
    if (typeof valA === 'string' && typeof valB === 'string') {
      return isDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }
    if (valA === undefined || valA === null) return isDesc ? 1 : -1;
    if (valB === undefined || valB === null) return isDesc ? -1 : 1;
    return isDesc ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
  });
}

// ─── Query Execution Logic ───────────────────────────────────────────────────
function convertRowDates(row: any): any {
  if (!row) return row;
  const processed = { ...row };
  for (const key of Object.keys(processed)) {
    if ((key.endsWith('At') || key.endsWith('_at') || key === 'createdAt' || key === 'updatedAt') && typeof processed[key] === 'string') {
      processed[key] = new Date(processed[key]);
    }
  }
  return processed;
}

// ─── Query Execution Logic ───────────────────────────────────────────────────
async function executeMockQuery(qb: MockQueryBuilder) {
  const dbStore = readDb();
  const tableName = getTableName(qb.tableObject);
  
  let tableData = (dbStore[tableName] || []).map((row: any) => {
    const processed = convertRowDates(row);
    
    // Ensure default dates if missing
    if (!processed.createdAt && !processed.created_at) {
      processed.createdAt = new Date();
    }
    if (!processed.updatedAt && !processed.updated_at) {
      processed.updatedAt = new Date();
    }
    if (tableName === 'news' && !processed.publishedAt && !processed.published_at) {
      processed.publishedAt = new Date();
    }
    
    return processed;
  });
  
  // 1. Filtering
  if (qb.whereCondition) {
    tableData = tableData.filter((row) => evalCondition(row, qb.whereCondition));
  }
  
  // 2. Custom Group By detection for categories
  if (qb.selectFields && qb.selectFields.category && qb.selectFields.count) {
    const counts: Record<string, number> = {};
    for (const row of tableData) {
      const cat = row.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    const grouped = Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      icon: null
    }));
    grouped.sort((a, b) => a.category.localeCompare(b.category));
    return grouped;
  }
  
  // 3. Custom Count projection detection
  if (qb.selectFields && Object.keys(qb.selectFields).length === 1 && 'count' in qb.selectFields) {
    return [{ count: tableData.length }];
  }
  
  // 4. Select operations
  if (qb.action === 'select') {
    if (qb.orderByField) {
      tableData = sortData(tableData, qb.orderByField);
    }
    if (qb.limitCount !== null) {
      tableData = tableData.slice(0, qb.limitCount);
    }
    return tableData;
  }
  
  // 4. Insert operations
  if (qb.action === 'insert') {
    const records = Array.isArray(qb.setValues) ? qb.setValues : [qb.setValues];
    const inserted: any[] = [];
    
    for (const rec of records) {
      const maxId = tableData.reduce((max, r) => (r.id > max ? r.id : max), 0);
      const newRow = convertRowDates({
        id: maxId + 1,
        ...rec,
        createdAt: rec.createdAt ? new Date(rec.createdAt) : new Date(),
        updatedAt: rec.updatedAt ? new Date(rec.updatedAt) : new Date(),
        publishedAt: rec.publishedAt ? new Date(rec.publishedAt) : new Date(),
      });
      if ('viewCount' in qb.tableObject) {
        newRow.viewCount = 0;
      }
      tableData.push(newRow);
      inserted.push(newRow);
    }
    
    dbStore[tableName] = tableData;
    writeDb(dbStore);
    return inserted;
  }
  
  // 5. Update operations
  if (qb.action === 'update') {
    const values = qb.setValues || {};
    const updated: any[] = [];
    const updatedTable = (dbStore[tableName] || []).map((row) => {
      const match = tableData.some((r) => r.id === row.id);
      if (match) {
        const updatedRow = convertRowDates({
          ...row,
          ...values,
          updatedAt: new Date(),
        });
        updated.push(updatedRow);
        return updatedRow;
      }
      return row;
    });
    
    dbStore[tableName] = updatedTable;
    writeDb(dbStore);
    return updated;
  }
  
  // 6. Delete operations
  if (qb.action === 'delete') {
    const remaining = (dbStore[tableName] || []).filter(
      (row) => !tableData.some((r) => r.id === row.id)
    );
    dbStore[tableName] = remaining;
    writeDb(dbStore);
    return [];
  }
  
  return [];
}

// ─── Query Builder Class ─────────────────────────────────────────────────────
class MockQueryBuilder {
  selectFields: any = null;
  tableObject: any = null;
  whereCondition: any = null;
  orderByField: any = null;
  limitCount: number | null = null;
  setValues: any = null;
  
  constructor(public action: 'select' | 'insert' | 'update' | 'delete', arg?: any) {
    if (action === 'select') {
      this.selectFields = arg;
    } else if (action === 'insert' || action === 'update') {
      this.tableObject = arg;
    } else if (action === 'delete') {
      this.tableObject = arg;
    }
  }
  
  select(fields?: any) {
    this.action = 'select';
    this.selectFields = fields;
    return this;
  }
  
  from(table: any) {
    this.tableObject = table;
    return this;
  }
  
  where(condition: any) {
    this.whereCondition = condition;
    return this;
  }
  
  orderBy(field: any) {
    this.orderByField = field;
    return this;
  }
  
  groupBy(...fields: any[]) {
    return this;
  }
  
  limit(count: number) {
    this.limitCount = count;
    return this;
  }
  
  values(values: any) {
    this.setValues = values;
    return this;
  }
  
  set(values: any) {
    this.setValues = values;
    return this;
  }
  
  returning() {
    return this;
  }
  
  // Custom execution trigger
  async execute() {
    return executeMockQuery(this);
  }
  
  // Make it awaitable
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

// ─── Exported mock db client interface ───────────────────────────────────────
export const db = {
  select: (fields?: any) => new MockQueryBuilder('select', fields),
  insert: (table: any) => new MockQueryBuilder('insert', table),
  update: (table: any) => new MockQueryBuilder('update', table),
  delete: (table: any) => new MockQueryBuilder('delete', table),
};

// Make sure to populate the database on load if it doesn't exist
readDb();

export * from "./schema";
