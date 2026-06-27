import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, FileText, Bookmark, CheckCircle, ExternalLink, HelpCircle, ChevronRight, Info, AlertTriangle, Check, X } from "lucide-react";
import { useGetScheme, useCreateBookmark, getListBookmarksQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

interface QuestionOption {
  label: string;
  value: string;
  isExcluding?: boolean;
}

interface Question {
  id: string;
  q: string;
  options: QuestionOption[];
}

const SCHEME_QUESTIONS: Record<number, Question[]> = {
  1: [ // Ayushman Bharat (PM-JAY)
    {
      id: "secc",
      q: "Are you or your family listed in the SECC-2011 database, or do you hold an active BPL / Priority Ration Card?",
      options: [
        { label: "Yes, we have BPL/PHH card or SECC listing", value: "yes" },
        { label: "No, we do not have a BPL card or SECC listing", value: "no" }
      ]
    },
    {
      id: "senior",
      q: "Are you a senior citizen aged 70 years or older?",
      options: [
        { label: "Yes, I am 70 or above", value: "yes" },
        { label: "No, I am under 70", value: "no" }
      ]
    },
    {
      id: "gov_job",
      q: "Is any member of your household a regular government employee or earning a high salary (above ₹1.5L/year)?",
      options: [
        { label: "Yes, someone has a government job / high salary", value: "yes", isExcluding: true },
        { label: "No regular government job or high income", value: "no" }
      ]
    }
  ],
  2: [ // PM-KISAN
    {
      id: "land",
      q: "Do you or your family own cultivable agricultural land registered in your name?",
      options: [
        { label: "Yes, we own cultivable land", value: "yes" },
        { label: "No, we do not own agricultural land", value: "no", isExcluding: true }
      ]
    },
    {
      id: "tax",
      q: "Did you or any family member pay income tax in the last assessment year?",
      options: [
        { label: "Yes, we paid income tax", value: "yes", isExcluding: true },
        { label: "No, we are not income tax payers", value: "no" }
      ]
    },
    {
      id: "profession",
      q: "Is any member of your family a government employee, pensioner, or doctor/lawyer/engineer?",
      options: [
        { label: "Yes, they hold a professional/official post", value: "yes", isExcluding: true },
        { label: "No, none of the above", value: "no" }
      ]
    }
  ],
  3: [ // PMAY
    {
      id: "house",
      q: "Do you or any member of your family own a pucca (brick-and-mortar) house anywhere in India?",
      options: [
        { label: "Yes, we already own a pucca house", value: "yes", isExcluding: true },
        { label: "No, we do not own any pucca house", value: "no" }
      ]
    },
    {
      id: "income",
      q: "What is your total annual household income?",
      options: [
        { label: "Up to ₹3 Lakh (EWS)", value: "ews" },
        { label: "₹3 Lakh to ₹6 Lakh (LIG)", value: "lig" },
        { label: "₹6 Lakh to ₹12 Lakh (MIG-I)", value: "mig1" },
        { label: "₹12 Lakh to ₹18 Lakh (MIG-II)", value: "mig2" },
        { label: "Above ₹18 Lakh", value: "above", isExcluding: true }
      ]
    },
    {
      id: "female",
      q: "For EWS/LIG families, will there be a female owner or co-owner for the house?",
      options: [
        { label: "Yes, female owner/co-owner is planned", value: "yes" },
        { label: "No, it will be registered only to a male member", value: "no" }
      ]
    }
  ]
};

// Fallback general questionnaire
const GENERAL_QUESTIONS: Question[] = [
  {
    id: "citizen",
    q: "Are you an Indian citizen?",
    options: [
      { label: "Yes, I am an Indian citizen", value: "yes" },
      { label: "No, I am not", value: "no", isExcluding: true }
    ]
  },
  {
    id: "age",
    q: "Are you 18 years of age or older?",
    options: [
      { label: "Yes, I am 18 or above", value: "yes" },
      { label: "No, I am under 18", value: "no" }
    ]
  }
];

export default function SchemeDetail({ id }: { id: string }) {
  const schemeId = parseInt(id, 10);
  const { data: scheme, isLoading } = useGetScheme(schemeId, { query: { enabled: !!schemeId } as any });
  const createBookmark = useCreateBookmark();
  const qc = useQueryClient();

  // Eligibility Checker States
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checkerStarted, setCheckerStarted] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<"eligible" | "ineligible" | "partial" | null>(null);
  const [resultReason, setResultReason] = useState("");

  function handleBookmark() {
    if (!scheme) return;
    createBookmark.mutate({ data: { contentType: "scheme", contentId: scheme.id, contentTitle: scheme.title } }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListBookmarksQueryKey() }),
    });
  }

  // Parse application steps
  function parseApplicationSteps(processText: string): string[] {
    const regex = /\d+\.\s+([^\d]+)(?=\d+\.\s+|$)/g;
    const steps: string[] = [];
    let match;
    while ((match = regex.exec(processText)) !== null) {
      steps.push(match[1].trim());
    }
    if (steps.length === 0) {
      return processText.split("\n").map(s => s.trim()).filter(Boolean);
    }
    return steps;
  }

  // Evaluate answers for eligibility
  function evaluateEligibility(currentAnswers: Record<string, string>) {
    const questions = SCHEME_QUESTIONS[schemeId] ?? GENERAL_QUESTIONS;
    
    // Check if any answer was excluding
    let hasExcluding = false;
    for (const q of questions) {
      const selectedVal = currentAnswers[q.id];
      const opt = q.options.find(o => o.value === selectedVal);
      if (opt?.isExcluding) {
        hasExcluding = true;
        break;
      }
    }

    if (schemeId === 1) { // Ayushman Bharat
      const isSenior = currentAnswers["senior"] === "yes";
      const isGovJob = currentAnswers["gov_job"] === "yes";
      const hasSECC = currentAnswers["secc"] === "yes";

      if (isSenior) {
        setEligibilityResult("eligible");
        setResultReason("As a senior citizen aged 70 or above, you are automatically eligible for the PM-JAY scheme regardless of household income.");
      } else if (isGovJob) {
        setEligibilityResult("ineligible");
        setResultReason("Regular government employee households are generally excluded from standard PM-JAY coverage.");
      } else if (hasSECC) {
        setEligibilityResult("eligible");
        setResultReason("Having BPL/Ration cards or listing in SECC-2011 qualifies you for free cashless coverage under PM-JAY.");
      } else {
        setEligibilityResult("partial");
        setResultReason("You might need to check with your local government representative to see if your family is listed in the SECC-2011 registry.");
      }
    } else if (schemeId === 2) { // PM-KISAN
      if (hasExcluding) {
        setEligibilityResult("ineligible");
        setResultReason("To qualify for PM-KISAN, you must own cultivable land and must not pay income tax or hold a government job/professional post.");
      } else if (currentAnswers["land"] === "yes") {
        setEligibilityResult("eligible");
        setResultReason("You qualify! You own cultivable land and meet the tax-exempt criteria for direct income support.");
      } else {
        setEligibilityResult("partial");
        setResultReason("Please check official records to verify land registration details in your name.");
      }
    } else if (schemeId === 3) { // PMAY
      const hasHouse = currentAnswers["house"] === "yes";
      const income = currentAnswers["income"];
      const isFemaleCoOwner = currentAnswers["female"] === "yes";

      if (hasHouse || income === "above") {
        setEligibilityResult("ineligible");
        setResultReason("PMAY requires that beneficiaries do not own any pucca house in India and their annual income must be below ₹18 Lakh.");
      } else if (income === "ews" || income === "lig") {
        if (isFemaleCoOwner) {
          setEligibilityResult("eligible");
          setResultReason("You are eligible for the highest interest subsidy (6.5%) with female co-ownership in EWS/LIG category!");
        } else {
          setEligibilityResult("partial");
          setResultReason("You qualify under income limit, but note that female ownership/co-ownership is mandatory for EWS/LIG home buyers under PMAY.");
        }
      } else {
        setEligibilityResult("eligible");
        setResultReason("You are eligible for the PMAY home loan interest subsidy under the MIG category.");
      }
    } else { // Fallback general evaluation
      if (hasExcluding) {
        setEligibilityResult("ineligible");
        setResultReason("This scheme is restricted to Indian citizens meeting specific guidelines.");
      } else if (currentAnswers["citizen"] === "yes" && currentAnswers["age"] === "yes") {
        setEligibilityResult("eligible");
        setResultReason("Based on age and citizenship criteria, you appear to qualify for general applications.");
      } else {
        setEligibilityResult("partial");
        setResultReason("Please consult official portals to check special eligibility provisions.");
      }
    }
  }

  const handleSelect = (qId: string, val: string) => {
    const nextAnswers = { ...answers, [qId]: val };
    setAnswers(nextAnswers);
    
    // Check if all questions are answered
    const activeQuestions = SCHEME_QUESTIONS[schemeId] ?? GENERAL_QUESTIONS;
    const allAnswered = activeQuestions.every(q => nextAnswers[q.id]);
    if (allAnswered) {
      evaluateEligibility(nextAnswers);
    }
  };

  const resetChecker = () => {
    setAnswers({});
    setEligibilityResult(null);
    setResultReason("");
    setCheckerStarted(false);
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full rounded-xl" /></div>;
  if (!scheme) return <div className="text-center py-20 text-muted-foreground"><p>Scheme not found</p></div>;

  const activeQuestions = SCHEME_QUESTIONS[schemeId] ?? GENERAL_QUESTIONS;

  return (
    <div className="space-y-6">
      <Link href="/schemes" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Schemes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Scheme info & application steps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <Badge variant="outline" className="mb-2 bg-primary/5 text-primary">{scheme.category}</Badge>
                <h1 className="text-2xl font-bold">{scheme.title}</h1>
              </div>
              <button onClick={handleBookmark} title="Bookmark" className="p-2 rounded-lg border hover:bg-muted transition-colors shrink-0 cursor-pointer">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{scheme.description}</p>
            {scheme.officialSource && (
              <a href={scheme.officialSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-xs text-primary font-semibold hover:underline">
                <ExternalLink className="w-4 h-4" /> Visit Official Scheme Source
              </a>
            )}
          </div>

          {/* Benefits */}
          {scheme.benefits && (
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-sm mb-3.5 flex items-center gap-2 text-primary border-b pb-2">
                <CheckCircle className="w-4.5 h-4.5" /> Benefits Provided
              </h2>
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                {scheme.benefits}
              </div>
            </div>
          )}

          {/* Documents */}
          {scheme.documents && (
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-sm mb-3.5 flex items-center gap-2 text-primary border-b pb-2">
                <FileText className="w-4.5 h-4.5" /> Required Documents
              </h2>
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                {scheme.documents}
              </div>
            </div>
          )}

          {/* Application Steps visual layout */}
          {scheme.applicationProcess && (
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2 text-primary border-b pb-2">
                <Info className="w-4.5 h-4.5" /> Step-by-Step Application Process
              </h2>
              <div className="space-y-4 mt-2">
                {parseApplicationSteps(scheme.applicationProcess).map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-3.5 border border-slate-150 rounded-xl bg-card shadow-xs">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium mt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Eligibility Checker */}
        <div>
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-5 sticky top-24">
            <div className="border-b pb-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <HelpCircle className="w-4.5 h-4.5 text-primary" /> Eligibility Checker
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">Verify if you qualify under the official scheme rules</p>
            </div>

            {!checkerStarted ? (
              <div className="text-center py-4 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Answer a few questions about your income, household, or land details to run a quick eligibility check.
                </p>
                <button
                  onClick={() => setCheckerStarted(true)}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  Start Check
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Questions render */}
                {!eligibilityResult ? (
                  <div className="space-y-4">
                    {activeQuestions.map((q) => {
                      const selectedValue = answers[q.id];
                      return (
                        <div key={q.id} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                          <p className="text-xs font-bold text-slate-800 leading-normal">{q.q}</p>
                          <div className="grid grid-cols-1 gap-2">
                            {q.options.map((opt) => {
                              const active = selectedValue === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => handleSelect(q.id, opt.value)}
                                  className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${active ? "bg-primary/5 border-primary text-primary" : "bg-card hover:bg-muted/15 border-slate-200 text-muted-foreground"}`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Result Screen */
                  <div className="space-y-4 text-center py-2">
                    <div className="flex justify-center">
                      <span className={`w-14 h-14 rounded-full flex items-center justify-center shadow ${eligibilityResult === "eligible" ? "bg-green-100 text-green-700" : eligibilityResult === "ineligible" ? "bg-red-105 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {eligibilityResult === "eligible" ? <Check className="w-8 h-8 font-bold" /> : eligibilityResult === "ineligible" ? <X className="w-8 h-8 font-bold" /> : <Info className="w-8 h-8" />}
                      </span>
                    </div>

                    <h4 className={`font-bold text-sm uppercase tracking-wider ${eligibilityResult === "eligible" ? "text-green-700" : eligibilityResult === "ineligible" ? "text-red-700" : "text-yellow-700"}`}>
                      {eligibilityResult === "eligible" ? "Probably Eligible" : eligibilityResult === "ineligible" ? "Likely Ineligible" : "Details Required"}
                    </h4>

                    <p className="text-xs text-muted-foreground leading-relaxed bg-slate-50 p-3 rounded-lg border">
                      {resultReason}
                    </p>

                    <div className="pt-2 flex gap-2.5">
                      <button
                        onClick={resetChecker}
                        className="flex-1 border border-slate-200 hover:bg-slate-50 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reset Check
                      </button>
                      {eligibilityResult === "eligible" && scheme.officialSource && (
                        <a
                          href={scheme.officialSource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Apply Now <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1.5 mt-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              This evaluation is based on standard rules and does not guarantee acceptance. The final decision rests with the verifying officials.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
