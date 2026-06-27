import { useState } from "react";
import { BookOpen, FileDown, X, ArrowLeft, ArrowRight, Check, Printer, FileText } from "lucide-react";
import { useListDocumentTemplates, useGenerateDocument } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Documents() {
  const { data: templates, isLoading } = useListDocumentTemplates();
  const generateDoc = useGenerateDocument();
  
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0); // 0: Form inputs, 1: Draft review/edit
  const [generated, setGenerated] = useState<string | null>(null);

  const template = templates?.find((t) => t.id === selectedTemplate);
  const fields = template ? (JSON.parse(template.fields) as Array<{ key: string; label: string }>) : [];

  function handleGenerate() {
    if (!selectedTemplate) return;
    generateDoc.mutate({ data: { templateId: selectedTemplate, fieldValues } }, {
      onSuccess: (data) => {
        setGenerated(data.content);
        setCurrentStep(1); // Advance to preview step
      },
    });
  }

  function handleDownloadWord() {
    if (!generated || !template) return;
    
    // Format HTML content to be compatible with MS Word
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <title>${template.name}</title>
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 1in; }
          h1 { text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 24pt; }
          p { margin-bottom: 12pt; text-align: justify; }
          .disclaimer { margin-top: 40pt; font-size: 9pt; color: #555555; border-top: 1px solid #cccccc; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>${template.name.toUpperCase()}</h1>
        <div style="white-space: pre-line;">${generated.replace(/\n/g, '<br/>')}</div>
        <div class="disclaimer">
          This document was drafted using the TO KNOW Legal Document Creator. Disclaimer: Sworn drafts are educational templates only and should be reviewed by legal counsel.
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff' + htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, "_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrintPDF() {
    if (!generated || !template) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print/export the document.");
      return;
    }
    
    printWindow.document.write(`
      <html>
      <head>
        <title>${template.name}</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; padding: 50px; color: #111; max-width: 800px; margin: 0 auto; }
          h1 { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; }
          p { text-align: justify; margin-bottom: 15px; }
          .content { white-space: pre-wrap; font-size: 14px; text-align: justify; }
          .footer { margin-top: 60px; font-size: 10px; color: #666; border-top: 1px dashed #ccc; padding-top: 15px; text-align: center; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${template.name.toUpperCase()}</h1>
        <div class="content">${generated}</div>
        <div class="footer">Generated via TO KNOW Legal Document Creator. Disclaimer: Draft only. Get professional legal verification.</div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function resetForm() {
    setSelectedTemplate(null);
    setFieldValues({});
    setGenerated(null);
    setCurrentStep(0);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" /> Legal Documents Creator
        </h1>
        <p className="text-muted-foreground mt-1">Select a template, fill in form details, and export draft legal agreements instantly</p>
      </div>

      {/* Step 1: Select Template */}
      {!selectedTemplate && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates?.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t.id); setFieldValues({}); setGenerated(null); setCurrentStep(0); }}
                  className="text-left bg-card border rounded-xl p-5 hover-lift hover-glow transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {t.category && <Badge variant="outline" className="text-[10px] mb-2">{t.category}</Badge>}
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{t.name}</h3>
                    <p className="text-muted-foreground text-xs mt-1.5 line-clamp-2 leading-relaxed">{t.description}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-primary mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Create Draft <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Step 2: Fill out multi-step Form inputs */}
      {template && currentStep === 0 && (
        <div className="bg-card border rounded-xl p-6 space-y-5 max-w-2xl shadow-sm animate-tab-enter">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Draft Builder Wizard</span>
              <h2 className="font-bold text-base text-foreground mt-0.5">{template.name}</h2>
            </div>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground block">{field.label}</label>
                <Input
                  value={fieldValues[field.key] ?? ""}
                  onChange={(e) => setFieldValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="rounded-lg border-slate-200 focus-visible:ring-primary"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t">
            <button onClick={resetForm} className="px-4 py-2 text-sm border rounded-lg hover:bg-muted font-medium cursor-pointer transition-colors">
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={generateDoc.isPending || fields.some(f => !fieldValues[f.key]?.trim())}
              className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {generateDoc.isPending ? "Generating..." : <><Check className="w-4 h-4" /> Generate Draft</>}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview and Edit Generated Document */}
      {template && currentStep === 1 && generated && (
        <div className="bg-card border rounded-xl p-6 max-w-3xl space-y-5 shadow-sm animate-tab-enter">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentStep(0)} className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md hover:bg-muted">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-green-600">Draft Document Generated</span>
                <h2 className="font-bold text-base text-foreground mt-0.5">{template.name}</h2>
              </div>
            </div>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">Edit draft text below as needed:</label>
            <textarea
              value={generated}
              onChange={(e) => setGenerated(e.target.value)}
              className="w-full h-96 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-serif leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between pt-3 border-t">
            <p className="text-[11px] text-muted-foreground max-w-sm">
              ℹ️ You can double-check and modify any clause in the editor. Click options to download.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrintPDF}
                className="flex items-center gap-1.5 border border-slate-200 text-foreground hover:bg-muted px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
              <button
                onClick={handleDownloadWord}
                className="flex items-center gap-1.5 bg-green-600 text-white hover:bg-green-700 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-sm"
              >
                <FileDown className="w-4 h-4" /> Word (.DOC)
              </button>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800">
            <strong>Disclaimer:</strong> This is a draft template. Please consult a legal advocate to finalize, sign, and stamp before legal execution.
          </div>
        </div>
      )}
    </div>
  );
}
