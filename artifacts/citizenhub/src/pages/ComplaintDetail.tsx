import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, ExternalLink, ChevronRight, CheckCircle2, ChevronLeft, Save, FileText, ClipboardList, Info, HelpCircle } from "lucide-react";
import { useGetComplaint } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

// Helper to determine document checklist based on category/formats
function getRequiredDocuments(category: string, downloadableFormats?: string | null): string[] {
  const docs: string[] = [];
  if (downloadableFormats) {
    docs.push(...downloadableFormats.split(",").map((d) => d.trim()));
  }
  
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes("consumer")) {
    docs.push("Invoice / Purchase Bill", "Proof of Payment (Bank receipt/SMS)", "Copy of written notice sent to vendor", "Photographs/Video of the defect");
  } else if (lowerCat.includes("cyber")) {
    docs.push("Bank account / Card statement", "Screenshots of fraud message/chat/call log", "Proof of Identity (Aadhaar/PAN)", "URL of fake account or site");
  } else if (lowerCat.includes("labour")) {
    docs.push("Employment contract / Offer letter", "Bank credit receipt / Pay slips", "Written request for pending wages", "Attendance record / ID card");
  } else if (lowerCat.includes("women")) {
    docs.push("Detailed log of date, time & description", "Evidence screenshot (WhatsApp/Emails)", "Witness statements (if any)", "Emergency contacts list");
  } else {
    docs.push("Aadhaar Card / ID Proof", "Written representation copy sent to department", "Reply or acknowledgement received (if any)");
  }
  return [...new Set(docs)]; // Deduplicate
}

export default function ComplaintDetail({ id }: { id: string }) {
  const complaintId = parseInt(id, 10);
  const { data: guide, isLoading } = useGetComplaint(complaintId, { query: { enabled: !!complaintId } as any });

  // Interactive Tracker states
  const [activeTab, setActiveTab] = useState<"issue" | "docs" | "steps" | "submit">("issue");
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [notes, setNotes] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Load localStorage data
  useEffect(() => {
    if (!complaintId) return;
    try {
      const storedDocs = JSON.parse(localStorage.getItem(`citizenhub_complaint_docs_${complaintId}`) ?? "[]");
      setCheckedDocs(storedDocs);

      const storedSteps = JSON.parse(localStorage.getItem(`citizenhub_complaint_steps_${complaintId}`) ?? "[]");
      setCompletedSteps(storedSteps);

      const storedNotes = localStorage.getItem(`citizenhub_complaint_notes_${complaintId}`) ?? "";
      setNotes(storedNotes);

      const storedTracking = localStorage.getItem(`citizenhub_complaint_tracking_${complaintId}`) === "true";
      setIsTracking(storedTracking);
    } catch (e) {
      console.error("Failed to load tracking data", e);
    }
  }, [complaintId]);

  // Persist tracking states
  const saveState = (key: string, value: any) => {
    try {
      localStorage.setItem(`citizenhub_complaint_${key}_${complaintId}`, typeof value === "string" ? value : JSON.stringify(value));
    } catch (e) {
      console.error("Failed to save state", e);
    }
  };

  const toggleDoc = (doc: string) => {
    const next = checkedDocs.includes(doc) ? checkedDocs.filter((d) => d !== doc) : [...checkedDocs, doc];
    setCheckedDocs(next);
    saveState("docs", next);
  };

  const toggleStep = (stepIdx: number) => {
    const next = completedSteps.includes(stepIdx) ? completedSteps.filter((s) => s !== stepIdx) : [...completedSteps, stepIdx];
    setCompletedSteps(next);
    saveState("steps", next);
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    saveState("notes", val);
    setSaveStatus("Saving...");
    const timeout = setTimeout(() => setSaveStatus("Saved"), 600);
    return () => clearTimeout(timeout);
  };

  const toggleTracking = () => {
    const next = !isTracking;
    setIsTracking(next);
    try {
      localStorage.setItem(`citizenhub_complaint_tracking_${complaintId}`, String(next));
    } catch {}
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full rounded-xl" /></div>;
  if (!guide) return <div className="text-center py-20 text-muted-foreground"><p>Guide not found</p></div>;

  const steps = guide.steps?.split("\n").filter(Boolean) ?? [];
  const requiredDocs = getRequiredDocuments(guide.category, guide.downloadableFormats);

  // Timeline completion calculations
  const docsComplete = requiredDocs.length > 0 && checkedDocs.length === requiredDocs.length;
  const stepsComplete = steps.length > 0 && completedSteps.length === steps.length;

  const overallProgress = Math.round(
    ((checkedDocs.length + completedSteps.length) / (requiredDocs.length + steps.length)) * 100
  ) || 0;

  return (
    <div className="space-y-6">
      <Link href="/complaints" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Complaint Center
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main: Guided Wizard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-5">
              <div>
                <Badge variant="outline" className="text-xs mb-1 bg-primary/5 text-primary">{guide.category}</Badge>
                <h1 className="text-xl font-bold">{guide.title}</h1>
              </div>
              <button
                onClick={toggleTracking}
                className={`text-xs px-3.5 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${isTracking ? "bg-green-50 border-green-200 text-green-700 font-bold" : "bg-white hover:bg-muted text-muted-foreground"}`}
              >
                {isTracking ? "✓ Active Tracker" : "+ Add to Active Cases"}
              </button>
            </div>

            {/* Wizard Navigation Tabs */}
            <div className="grid grid-cols-4 bg-muted rounded-lg p-1 text-xs font-semibold mb-6">
              <button onClick={() => setActiveTab("issue")} className={`py-2 rounded-md cursor-pointer transition-colors ${activeTab === "issue" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>1. Issue</button>
              <button onClick={() => setActiveTab("docs")} className={`py-2 rounded-md cursor-pointer transition-colors ${activeTab === "docs" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>2. Documents</button>
              <button onClick={() => setActiveTab("steps")} className={`py-2 rounded-md cursor-pointer transition-colors ${activeTab === "steps" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>3. Steps</button>
              <button onClick={() => setActiveTab("submit")} className={`py-2 rounded-md cursor-pointer transition-colors ${activeTab === "submit" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>4. Resolve</button>
            </div>

            {/* TAB CONTENTS */}
            <div key={activeTab} className="animate-tab-enter">
              {activeTab === "issue" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border rounded-xl p-4 flex gap-3 text-slate-800">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm">Citizen Guidance Notice</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">This guide outlines the standard grievance resolution path in India. Use the tracker to checklist your documents and verify each action step.</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground mb-1">Issue Summary</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{guide.issue}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("docs")}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity ml-auto"
                  >
                    Collect Documents <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeTab === "docs" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-foreground mb-1">Required Evidentiary Documents</h3>
                    <p className="text-xs text-muted-foreground">Ensure you have all the following documents ready before filing:</p>
                  </div>
                  <div className="space-y-2">
                    {requiredDocs.map((doc, idx) => {
                      const isChecked = checkedDocs.includes(doc);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleDoc(doc)}
                          className={`w-full text-left p-3.5 border rounded-xl flex items-center justify-between text-xs font-semibold cursor-pointer transition-all ${isChecked ? "bg-green-50/50 border-green-200 text-green-800" : "bg-card hover:bg-muted/10 border-slate-200"}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isChecked ? "bg-green-600 border-green-600 text-white" : "border-slate-300"}`}>
                              {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </span>
                            {doc}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{isChecked ? "Ready" : "Needed"}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setActiveTab("issue")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <ChevronLeft className="w-4 h-4" /> Back to Issue
                    </button>
                    <button
                      onClick={() => setActiveTab("steps")}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Action Steps <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "steps" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground">Interactive Action Wizard</h3>
                    <span className="text-xs text-muted-foreground">Step {activeStepIdx + 1} of {steps.length}</span>
                  </div>

                  {steps.length > 0 && (
                    <div className="bg-slate-50 border rounded-xl p-5 relative min-h-36 flex flex-col justify-between">
                      <div>
                        <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-3">{activeStepIdx + 1}</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">{steps[activeStepIdx].replace(/^\d+\.\s*/, "")}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <button
                          onClick={() => toggleStep(activeStepIdx)}
                          className={`text-xs px-3.5 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${completedSteps.includes(activeStepIdx) ? "bg-green-100 border-green-200 text-green-700" : "bg-white hover:bg-muted text-muted-foreground"}`}
                        >
                          {completedSteps.includes(activeStepIdx) ? "✓ Completed" : "Mark as Completed"}
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveStepIdx((prev) => Math.max(0, prev - 1))}
                            disabled={activeStepIdx === 0}
                            className="p-1.5 border rounded-lg hover:bg-muted disabled:opacity-40"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveStepIdx((prev) => Math.min(steps.length - 1, prev + 1))}
                            disabled={activeStepIdx === steps.length - 1}
                            className="p-1.5 border rounded-lg hover:bg-muted disabled:opacity-40"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <button onClick={() => setActiveTab("docs")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <ChevronLeft className="w-4 h-4" /> Back to Documents
                    </button>
                    <button
                      onClick={() => setActiveTab("submit")}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Filing Authority <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "submit" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-foreground">Filing and Resolution details</h3>
                    <div className="border rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Complaint Authority</p>
                        <p className="text-xs text-foreground font-semibold mt-0.5">{guide.authority || "Not Specified"}</p>
                      </div>
                      {guide.downloadableFormats && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Downloadable Forms</p>
                          <p className="text-xs text-primary font-semibold mt-0.5 flex items-center gap-1.5">
                            <FileText className="w-4 h-4" /> {guide.downloadableFormats}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {guide.officialPortal && (
                      <a
                        href={guide.officialPortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" /> File at Official Portal <ChevronRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex justify-between border-t pt-5 mt-6">
                    <button onClick={() => setActiveTab("steps")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <ChevronLeft className="w-4 h-4" /> Back to Steps
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Dynamic Timeline & Notes */}
        <div className="space-y-6">
          {/* Progress Timeline Card */}
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <ClipboardList className="w-4.5 h-4.5 text-primary" /> Case Status Timeline
              </h3>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1.5">
                <span>Progress Checklist</span>
                <span className="font-bold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-1.5 mt-1" />
            </div>

            {/* Vertical timeline steps */}
            <div className="relative pl-6 space-y-5 border-l-2 border-slate-100 ml-2 mt-4">
              <TimelineNode active={true} complete={true} label="Issue Defined" desc="Grievance identified" />
              <TimelineNode active={checkedDocs.length > 0} complete={docsComplete} label="Collect Documents" desc={`${checkedDocs.length}/${requiredDocs.length} items ready`} />
              <TimelineNode active={docsComplete} complete={stepsComplete} label="Follow Action Steps" desc={`${completedSteps.length}/${steps.length} completed`} />
              <TimelineNode active={stepsComplete} complete={stepsComplete} label="Verify Authority" desc={guide.authority || "Identify resolution body"} />
              <TimelineNode active={stepsComplete} complete={stepsComplete && !!guide.officialPortal} label="Official Filing" desc="Submit grievance" />
            </div>
          </div>

          {/* Interactive Notes Card */}
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Save className="w-4.5 h-4.5 text-secondary" /> Filing Notes
              </h3>
              <span className="text-[9px] text-muted-foreground font-semibold">{saveStatus}</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Record references, notice dispatch dates, phone numbers, or notes here..."
              className="w-full min-h-[140px] text-xs p-3 border rounded-xl bg-slate-50/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 resize-y leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              Use these notes to keep track of details. Everything is saved privately on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineNode({ active, complete, label, desc }: { active: boolean; complete: boolean; label: string; desc: string }) {
  return (
    <div className="relative">
      <span className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${complete ? "bg-green-600 border-green-600 text-white" : active ? "bg-primary border-primary text-white" : "bg-white border-slate-300 text-slate-300"}`}>
        {complete ? "✓" : ""}
      </span>
      <div>
        <h4 className={`text-xs font-semibold ${active || complete ? "text-foreground" : "text-muted-foreground"}`}>{label}</h4>
        <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
