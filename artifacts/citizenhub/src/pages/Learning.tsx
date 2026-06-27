import { useState, useEffect } from "react";
import { BookOpen, Star, Trophy, ChevronRight, X, CheckCircle, XCircle, ArrowRight, Award, RotateCcw, Clock, Play, Lock, Shield } from "lucide-react";
import { useListCourses, useListQuizzes } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

// ─── Lesson content by course category ──────────────────────────────────────
const COURSE_LESSONS: Record<string, { title: string; content: string }[]> = {
  "Constitutional Rights": [
    { title: "What are Fundamental Rights?", content: "The Constitution of India guarantees six Fundamental Rights to every citizen: Right to Equality (Articles 14–18), Right to Freedom (Articles 19–22), Right against Exploitation (Articles 23–24), Right to Freedom of Religion (Articles 25–28), Cultural and Educational Rights (Articles 29–30), and Right to Constitutional Remedies (Article 32).\n\nThese rights are justiciable — you can approach the Supreme Court or High Court directly if they are violated." },
    { title: "Right to Equality (Articles 14–18)", content: "Article 14 guarantees equality before law and equal protection of laws. Article 15 prohibits discrimination on grounds of religion, race, caste, sex, or place of birth. Article 16 ensures equal opportunity in public employment. Article 17 abolishes untouchability — practising it is a criminal offence under the Protection of Civil Rights Act 1955. Article 18 abolishes titles except military and academic distinctions." },
    { title: "Right to Freedom (Articles 19–22)", content: "Article 19 provides six freedoms: speech & expression, peaceful assembly, forming associations, free movement throughout India, residing anywhere in India, and practising any profession. Article 20 protects against arbitrary conviction. Article 21 protects life and personal liberty — this is the broadest right and includes right to privacy, dignity, health, and clean environment. Article 22 protects against arbitrary arrest." },
    { title: "How to enforce Fundamental Rights", content: "If any of your fundamental rights are violated, you can file a Writ Petition directly in the High Court (Article 226) or Supreme Court (Article 32) without going through lower courts. The court can issue writs: Habeas Corpus (produce the detained person), Mandamus (direct government to perform its duty), Prohibition, Certiorari, and Quo Warranto. Free legal aid is available from District Legal Services Authority (call 15100)." },
    { title: "Directive Principles & Fundamental Duties", content: "Part IV of the Constitution contains Directive Principles of State Policy — guidelines for the government to create a social order. These include right to work, education, equal pay, living wage, and public health. Part IVA contains Fundamental Duties — 11 duties every citizen must follow including respecting the Constitution, protecting the environment, promoting scientific temper, and defending the nation." },
  ],
  "RTI": [
    { title: "What is the Right to Information?", content: "The Right to Information Act 2005 gives every citizen the right to access information held by any public authority — central, state, or local government. This includes ministries, departments, courts, parliaments, PSUs, and government-funded NGOs. You can request documents, inspection of records, certified copies, and samples of material." },
    { title: "How to file an RTI application", content: "Write your application in plain paper addressed to 'The Public Information Officer' of the relevant department. Mention specific information you need. Pay Rs. 10 fee (postal order / cash / online). BPL card holders are exempt. File online at rtionline.gov.in for Central Government departments, or state RTI portal for state departments. You will get an acknowledgement with a registration number." },
    { title: "Timelines and first appeal", content: "The PIO must respond within 30 days. If the information concerns life or liberty of a person, they must respond within 48 hours. If no response in 30 days — this is deemed refusal. File a First Appeal to the First Appellate Authority (senior officer in the same department) within 30 days of the deadline or refusal. FAA must decide within 30–45 days." },
    { title: "Second appeal to Information Commission", content: "If the FAA's response is unsatisfactory or there is no response, file a Second Appeal or Complaint to the Central Information Commission (cic.gov.in) for central departments, or State Information Commission for state departments. The Information Commissioner can impose a penalty of Rs. 250 per day (up to Rs. 25,000) on the PIO and recommend disciplinary action." },
    { title: "What can be refused under RTI?", content: "Section 8 lists exemptions: national security, intelligence, cabinet deliberations, trade secrets, personal information that has no public interest, information received in confidence from foreign governments, information that would endanger life of informers. However, most day-to-day government information — files, schemes, expenditure, appointment orders, contracts — is fully accessible. The burden to prove exemption is on the PIO." },
  ],
  "Consumer Rights": [
    { title: "The 6 Consumer Rights", content: "Under the Consumer Protection Act 2019, every consumer has 6 fundamental rights:\n1. Right to Safety — protection from hazardous goods\n2. Right to Information — about quality, quantity, price\n3. Right to Choose — access to competitive market\n4. Right to be Heard — grievances must be considered\n5. Right to Redressal — compensation for unfair practices\n6. Right to Consumer Education — to be an informed consumer" },
    { title: "Who is a consumer?", content: "A consumer is any person who buys goods or hires services for personal use — not for commercial resale. This includes online purchases (Amazon, Flipkart), services (banking, telecom, insurance, hospitals, builders, airlines), and offline retail. A business buyer purchasing goods for resale is NOT a consumer under this Act. However, businesses buying goods for use in their business ARE consumers." },
    { title: "Filing a consumer complaint", content: "Try to resolve directly with the seller first. Then file at the National Consumer Helpline: 1915 or consumerhelpline.gov.in. For formal complaint, file at the District Consumer Commission — now available online at edaakhil.nic.in from anywhere in India. Jurisdiction by claim amount: District (up to Rs. 50 lakh), State (Rs. 50 lakh to Rs. 2 crore), National (above Rs. 2 crore). Filing is free for claims up to Rs. 5 lakh." },
    { title: "Unfair trade practices", content: "Unfair trade practices include: false advertising, misleading labels, bait and switch selling, charging above MRP, refusing to give bill or receipt, selling expired goods, not honouring warranty, and withholding promised service. The new Central Consumer Protection Authority (CCPA) can take suo-motu action against companies, impose fines up to Rs. 10 lakh, and recall products." },
    { title: "Product liability & e-commerce", content: "Under Section 82-87, manufacturers, product sellers, and service providers can be held strictly liable for defective products causing harm — even without proving negligence. For e-commerce, new rules (2020) mandate that platforms must list seller details, ensure return policies, and not use dark patterns. If delivery is wrong or product is defective, e-commerce platform is also responsible as a service provider." },
  ],
  "Women's Rights": [
    { title: "Constitutional guarantees for women", content: "The Constitution prohibits sex-based discrimination (Article 15), ensures equal opportunity (Article 16), allows special provisions for women as an exception to equality (Article 15(3)), and provides equal pay for equal work (Directive Principle). The Supreme Court has recognized reproductive autonomy as part of the right to life under Article 21." },
    { title: "Domestic Violence Act 2005", content: "The Protection of Women from Domestic Violence Act 2005 covers physical, sexual, verbal, emotional, and economic violence within domestic relationships — not just marriage. Contact Protection Officer at DM/SDM office or call 181. The Magistrate can issue protection orders, residence orders, maintenance orders, and compensation — all within 3 days of filing. Violation of protection order: 1 year imprisonment." },
    { title: "POSH Act — Workplace Safety", content: "The Sexual Harassment of Women at Workplace Act 2013 makes it mandatory for all workplaces with 10+ employees to have an Internal Complaints Committee (ICC). File complaint with ICC within 3 months of incident. If your workplace has no ICC, file with District Local Complaints Committee. Government employees can file at SHe-Box: shebox.nic.in. Inquiry must be completed within 60 days." },
    { title: "Property and inheritance rights", content: "Since the Hindu Succession (Amendment) Act 2005, daughters have equal coparcenary rights as sons in ancestral/joint family property. A wife has equal right in matrimonial property. A widow cannot be evicted from matrimonial home. Women can hold property exclusively in their name under the Married Women's Property Act 1874. Women can also inherit from parents, spouse, and children equally." },
    { title: "Rights during pregnancy and maternity", content: "The Maternity Benefit Act 1961 (amended 2017) provides 26 weeks paid maternity leave for the first 2 children; 12 weeks for third child onwards; 12 weeks for adoptive mothers adopting a child below 3 months. Employer cannot dismiss or discharge a woman during maternity leave. Medical bonus of Rs. 3,500 if no prenatal/postnatal care from employer. Crèche facility mandatory if 50+ employees." },
    { title: "How to get help — key helplines", content: "• Women Helpline: 181 (24x7, free, multilingual)\n• One Stop Centre (Sakhi): 181 — provides shelter, legal, medical, police help\n• iCall (counselling): 9152987821\n• NCW: ncw.nic.in | 011-26942369\n• Legal aid: DLSA — 15100\n• Cyber crime against women: cybercrime.gov.in | 1930\n• Anti-trafficking: 1098 (Childline for children)" },
  ],
  "Labour": [
    { title: "Key labour laws you must know", content: "India's labour laws were recently consolidated into 4 Labour Codes:\n1. Code on Wages 2019 — covers minimum wage, payment of wages, bonus\n2. Code on Social Security 2020 — covers EPF, ESIC, gratuity, maternity\n3. Industrial Relations Code 2020 — covers trade unions, retrenchment, strikes\n4. Occupational Safety Code 2020 — covers safety at workplace\nThese codes replace 29 older laws. State implementation timelines vary." },
    { title: "Provident Fund (EPF) rights", content: "Under the EPF Act 1952, any establishment with 20+ employees must provide PF. Both employer and employee contribute 12% of basic salary. Total PF = 24% of basic salary every month. You can check PF balance at unified.epfindia.gov.in using your UAN. Employer must deposit PF by the 15th of every month. Employer not depositing PF can face criminal prosecution. You can withdraw PF after 2 months of leaving job." },
    { title: "Minimum wages and overtime", content: "Every state government fixes minimum wages for different categories of workers. You can check your state's minimum wage at the Labour Department website. Overtime work must be paid at double the ordinary rate. Payment must be made on time — Payment of Wages Act requires payment by 7th of the following month for wages below Rs. 24,000/month. Non-payment is a criminal offence." },
    { title: "Gratuity rights", content: "The Payment of Gratuity Act 1972 entitles every employee who has completed 5 years of continuous service to gratuity. Formula: (Last drawn basic salary × 15 × years of service) / 26. Maximum gratuity is Rs. 20 lakh (exempt from income tax). Employer must pay within 30 days of leaving. If not paid, apply to Controlling Authority (Assistant Labour Commissioner). Gratuity is also payable in case of death/disability even before 5 years." },
    { title: "How to file a labour complaint", content: "Step 1: Send written complaint to employer HR department. Step 2: File complaint with Labour Inspector / Assistant Labour Commissioner in your area — visit Labour Department office with your employment proof and evidence. Step 3: For EPF issues: epfigms.gov.in | helpline 1800-118-005. Step 4: For wrongful termination: conciliation before Industrial Conciliation Officer, then Labour Court. Labour Helpline: 14434. Online: shramsuvidha.gov.in" },
  ],
  "Tax": [
    { title: "Who must pay income tax?", content: "In India, income above the basic exemption limit is taxable. For FY 2024-25, the basic exemption limit is:\n• Below 60 years: Rs. 2.5 lakh (old regime) / Rs. 3 lakh (new regime)\n• 60–80 years: Rs. 3 lakh (old) / Rs. 3 lakh (new)\n• Above 80 years: Rs. 5 lakh (old) / Rs. 3 lakh (new)\nBut you should file ITR even if your income is below the limit if TDS was deducted or you want to claim refund." },
    { title: "Old vs New tax regime", content: "OLD REGIME: Lower tax rates with many deductions (80C, 80D, HRA, home loan interest, standard deduction Rs. 50,000). Better if deductions exceed Rs. 3.5 lakh.\n\nNEW REGIME (default from FY 2023-24): Slightly higher starting rates but simpler. Standard deduction Rs. 75,000. No 80C/80D/HRA etc. Tax rebate makes income up to Rs. 7 lakh effectively tax-free. Better if you have minimal deductions.\n\nUse the tax calculator at incometax.gov.in to decide." },
    { title: "How to save tax — key deductions", content: "• Section 80C: Up to Rs. 1.5 lakh — EPF/PPF, ELSS mutual funds, NSC, LIC premium, home loan principal, children's tuition fees, Sukanya Samriddhi\n• Section 80D: Up to Rs. 25,000 health insurance premium (Rs. 50,000 for senior citizens)\n• Section 24B: Home loan interest up to Rs. 2 lakh (self-occupied property)\n• Section 80E: Education loan interest — no limit, for 8 years\n• Section 80G: Charitable donations — 50–100% deduction\n• HRA: House Rent Allowance — partially exempt based on formula" },
    { title: "Filing ITR — step by step", content: "1. Collect Form 16 from employer (TDS certificate)\n2. Download Form 26AS / AIS from incometax.gov.in (shows all TDS, income, transactions)\n3. Login to incometax.gov.in with PAN\n4. Select appropriate ITR form: ITR-1 for salaried with income below Rs. 50 lakh\n5. Pre-fill will auto-populate most data from Form 26AS\n6. Verify all income: salary, interest, capital gains, rental income\n7. Claim eligible deductions\n8. Pay any remaining tax liability\n9. File and e-verify (Aadhaar OTP, net banking, or DSC)\n10. Deadline: July 31 of the assessment year" },
    { title: "GST — basics every citizen needs to know", content: "GST has 4 main rates: 5% (food items, essential goods), 12% (processed food, textiles), 18% (electronics, most services), 28% (luxury goods). You always have the right to demand a GST invoice — the supplier is legally required to give one. If overcharged GST, complain to GST Anti-Profiteering Authority. If supplier refuses invoice, report at gst.gov.in. Businesses with turnover above Rs. 40 lakh must register for GST." },
  ],
  "Property": [
    { title: "Checking property title", content: "Before buying any property, verify: (1) Title deed — seller must have clear, unencumbered title (2) Encumbrance certificate from Sub-Registrar — shows if property is mortgaged (3) Property tax receipts — must be current (4) Building plan approval from local authority (5) Occupancy certificate (6) RERA registration for new projects. In Tamil Nadu, you can check titles at tnreginet.gov.in." },
    { title: "RERA protections for buyers", content: "All residential projects above 500 sq.m. or 8 units must register with RERA. Check RERA registration at tnrera.in (Tamil Nadu). The builder must upload quarterly progress reports and all approvals. If possession is delayed, you are entitled to interest at SBI MCLR+2% for every month. You can withdraw and get full refund with interest. Structural defects for 5 years after possession are builder's liability. File complaints at tnrera.in." },
    { title: "Stamp duty and registration", content: "Property must be registered at the Sub-Registrar's office to have legal validity. Documents required: sale deed, identity proof of both parties, property card, encumbrance certificate. Stamp duty in Tamil Nadu: 7% of guidance value or sale consideration (whichever is higher). Registration fee: 4% of guidance value. Sub-registrar offices are now appointment-based — book at tnreginet.gov.in." },
    { title: "Land acquisition rights", content: "If the government acquires your land, you are entitled to: 4x market value for rural land, 2x for urban land, plus 100% solatium (compassion payment). The Collector must give 6 months notice. A Social Impact Assessment must be done for large acquisitions. You have the right to object and be heard. If you disagree with compensation, apply to Land Acquisition Collector, then High Court." },
    { title: "Tenant and landlord rights", content: "A rental agreement for more than 11 months must be registered. Tenant has right to receipt for every rent payment. Landlord cannot cut electricity, water, or forcibly evict without court order. Tenant can withhold rent only if there is genuine uninhabitability. Security deposit must be returned within 30 days of vacating. For disputes: District Court (civil) or Rent Court if your state has a Rent Control Act." },
  ],
  "Senior Citizens": [
    { title: "Maintenance rights for senior citizens", content: "Under the Maintenance and Welfare of Parents and Senior Citizens Act 2007, children and heirs are legally required to maintain parents. File application (no advocate needed, no court fee) at the Maintenance Tribunal — usually the Sub-Divisional Magistrate. Tribunal must decide within 90 days. Maximum maintenance ordered: Rs. 10,000/month (state-specific amounts vary). Violation of tribunal order: imprisonment up to 1 month." },
    { title: "Financial schemes for senior citizens", content: "• Senior Citizens Savings Scheme (SCSS): 8.2% interest, maximum investment Rs. 30 lakh, 5-year term\n• PM Vaya Vandana Yojana (PMVVY): 7.4% guaranteed pension from LIC, max Rs. 15 lakh\n• Senior Citizen Fixed Deposits: Banks offer 0.25–0.75% extra interest\n• Indira Gandhi National Old Age Pension: Rs. 200–500/month for BPL seniors above 60\n• Income tax: No tax on income up to Rs. 3 lakh (60–80 years) and Rs. 5 lakh (above 80 years)" },
    { title: "Healthcare and priority rights", content: "Senior citizens above 60 years have right to priority in all queues at government offices, banks, hospitals, and post offices. Senior citizens above 80 years get priority even within the senior citizen queue. National Health Policy mandates free healthcare at government hospitals. Ayushman Bharat now covers all seniors above 70 years with additional Rs. 5 lakh cover regardless of income. Rashtriya Vayoshri Yojana provides free assistive devices." },
    { title: "Protection from abuse and abandonment", content: "Abandoning a senior citizen is a criminal offence — imprisonment up to 3 months. Any offence under IPC against a senior citizen attracts 50% enhanced punishment. If a child received property from parent but is not maintaining them, the Tribunal can cancel the property transfer. Senior citizens can revoke any gift deed made to children if children fail their duty. State governments must set up Old Age Homes in every district." },
  ],
  "Environment": [
    { title: "Your right to a clean environment", content: "The Supreme Court has interpreted Article 21 (Right to Life) to include the right to a clean and healthy environment. Any citizen can file a Public Interest Litigation (PIL) before the High Court or Supreme Court against environmental violations. The National Green Tribunal (NGT) at ngt.gov.in is a specialized environmental court — you can file complaints there without a lawyer. No court fee for environmental PILs." },
    { title: "Air and water pollution laws", content: "The Air (Prevention and Control of Pollution) Act 1981 and Water (Prevention and Control of Pollution) Act 1974 empower State Pollution Control Boards (SPCB) to regulate industrial emissions and effluents. Industries must obtain Consent to Establish and Consent to Operate from SPCB. You can file complaint with SPCB if a factory is releasing untreated sewage or smoke. SPCB can close down polluting units and impose penalties." },
    { title: "How to report environmental violations", content: "Step 1: Document the violation — photographs, videos, location (GPS), dates, frequency.\nStep 2: Complaint to State Pollution Control Board (Tamil Nadu: tnpcb.gov.in)\nStep 3: Complaint to District Collector's office for land/noise violations\nStep 4: File complaint at National Green Tribunal: ngt.gov.in — no court fee for individuals\nStep 5: For forest violations: Range Forest Officer or District Forest Officer\nStep 6: Environment Protection Helpline: 1800-11-4000 (CPCB)" },
    { title: "Noise pollution and your rights", content: "The Noise Pollution (Regulation and Control) Rules 2000 set limits: 55 dB (day)/45 dB (night) for residential areas, 65 dB (day)/55 dB (night) for commercial areas, 75 dB (day)/70 dB (night) for industrial areas. Silence zones (hospitals, schools, courts) have stricter limits. You can complain to police or District Magistrate for violations. DJ and loudspeaker permits can be cancelled by DM for noise violations." },
    { title: "E-waste and plastic pollution rights", content: "E-Waste (Management) Rules 2022 make manufacturers responsible for collecting and recycling their products. You can return old electronics to dealers under extended producer responsibility. Single-use plastics (below 75 microns) are banned since 2022. Manufacturing, selling, or using banned single-use plastic: fine up to Rs. 1 lakh and/or imprisonment. File complaint with SPCB or local municipal body." },
  ],
  default: [
    { title: "Understanding Indian Legal System", content: "India follows a common law system inherited from British rule. The hierarchy of courts: Supreme Court (top) → High Courts (state level) → District Courts → Subordinate Courts. Civil cases: disputes about property, contracts, family. Criminal cases: offences against state — theft, murder, fraud. For most citizens, cases begin at District Court level. Free legal aid is available from DLSA for those who cannot afford lawyers." },
    { title: "How to approach courts without a lawyer", content: "You can represent yourself in court as a 'party in person'. District Consumer Forums, Labour Courts, Maintenance Tribunals, and Motor Accidents Claims Tribunals are designed to be accessible without lawyers. File complaint in simple language describing facts, relief sought, and annexing evidence. Small Causes Courts and Fast Track Courts handle specific types of cases quickly. Legal Services Authorities provide free lawyers to eligible persons." },
    { title: "Alternate Dispute Resolution (ADR)", content: "Instead of courts, you can resolve disputes through: Mediation (neutral mediator helps parties agree), Arbitration (private arbitrator decides — binding), Lok Adalat (Peoples' Court — free, no appeal needed, settlement is final decree). Lok Adalats handle motor accident claims, matrimonial cases, labour disputes, and minor criminal cases. No court fee if settled at Lok Adalat — paid fee is refunded. Call 15100 for DLSA ADR services." },
    { title: "Important citizen helplines", content: "• Police Emergency: 112\n• Ambulance: 108\n• Women Helpline: 181\n• Cyber Crime: 1930\n• Child Helpline: 1098\n• Senior Citizen: 14567\n• Consumer: 1915\n• Labour: 14434\n• Anti-corruption: 1031 (CBI)\n• RTI: 011-24624376\n• Legal Aid: 15100\n• Income Tax: 1800-103-0025\n• EPFO: 1800-118-005\n• UIDAI (Aadhaar): 1947" },
    { title: "Useful government portals", content: "• umang.gov.in — Single app for 1,200+ government services\n• digilocker.gov.in — Digital document storage\n• edigitalgov.in / mygov.in — Citizen engagement\n• rtionline.gov.in — RTI for central departments\n• pgportal.gov.in — Public grievance portal\n• scholarships.gov.in — All scholarships\n• nrega.nic.in — MGNREGS employment\n• pmjay.gov.in — Ayushman Bharat\n• incometax.gov.in — Tax filing\n• passportindia.gov.in — Passport services" },
  ],
};

// ─── Quiz questions by category ─────────────────────────────────────────────
const QUIZ_QUESTIONS: Record<string, { q: string; options: string[]; correct: number; explanation: string }[]> = {
  "Constitutional Rights": [
    { q: "Which Article of the Indian Constitution abolishes untouchability?", options: ["Article 14", "Article 15", "Article 17", "Article 21"], correct: 2, explanation: "Article 17 abolishes untouchability. Practising it in any form is an offence punishable under the Protection of Civil Rights Act 1955." },
    { q: "The Right to Education is guaranteed under which constitutional provision?", options: ["Article 19", "Article 21A", "Article 21", "Article 46"], correct: 1, explanation: "Article 21A (inserted by the 86th Amendment 2002) makes free and compulsory education for children aged 6–14 a fundamental right." },
    { q: "Which writ is used to challenge illegal detention?", options: ["Mandamus", "Certiorari", "Habeas Corpus", "Quo Warranto"], correct: 2, explanation: "Habeas Corpus ('you shall have the body') directs the authority to produce the detained person before court to examine whether detention is legal." },
    { q: "Fundamental Rights are enforceable against:", options: ["Private individuals only", "State and government only", "No one", "Both state and private parties"], correct: 1, explanation: "Fundamental Rights are primarily enforceable against the State (government). However, some rights like Articles 17 and 23 are available against private parties too." },
    { q: "Which Article is called the 'Heart and Soul' of the Constitution?", options: ["Article 14", "Article 21", "Article 32", "Article 368"], correct: 2, explanation: "Article 32 (Right to Constitutional Remedies) was called the 'Heart and Soul' by Dr. B.R. Ambedkar because it allows citizens to directly approach the Supreme Court for enforcement of Fundamental Rights." },
    { q: "Freedom of speech in India is guaranteed by:", options: ["Article 14", "Article 19(1)(a)", "Article 21", "Article 25"], correct: 1, explanation: "Article 19(1)(a) guarantees freedom of speech and expression. However, reasonable restrictions can be imposed under Article 19(2) for national security, public order, decency, etc." },
    { q: "Right to privacy was declared a Fundamental Right in which year?", options: ["2012", "2015", "2017", "2019"], correct: 2, explanation: "In Justice K.S. Puttaswamy v. Union of India (2017), a 9-judge bench unanimously declared Right to Privacy as a Fundamental Right under Article 21." },
    { q: "The Preamble to the Constitution describes India as:", options: ["Sovereign Democratic Republic", "Sovereign Socialist Secular Democratic Republic", "Secular Democratic Republic", "Federal Democratic Republic"], correct: 1, explanation: "The Preamble (as amended by the 42nd Amendment 1976) describes India as a Sovereign, Socialist, Secular, Democratic Republic." },
  ],
  // ── Consumer Rights Quiz (10 questions) ──────────────────────────────────
  "Consumer": [
    { q: "Under the Consumer Protection Act 2019, what is the maximum claim amount at District Consumer Commission?", options: ["Rs. 20 lakh", "Rs. 1 crore", "Rs. 50 lakh", "Rs. 2 crore"], correct: 2, explanation: "The District Consumer Disputes Redressal Commission handles claims up to Rs. 50 lakh. State Commission handles Rs. 50 lakh–2 crore; National Commission handles above Rs. 2 crore." },
    { q: "What is the National Consumer Helpline number?", options: ["1930", "1915", "14434", "181"], correct: 1, explanation: "1915 is the National Consumer Helpline (toll-free, 24x7). For financial/cyber fraud specifically, call 1930." },
    { q: "A consumer complaint must be filed within how many years of the cause of action?", options: ["1 year", "2 years", "3 years", "5 years"], correct: 1, explanation: "Under the Consumer Protection Act 2019, a complaint must be filed within 2 years from the date the cause of action arose." },
    { q: "Which portal allows online filing of consumer complaints from home?", options: ["pgportal.gov.in", "edaakhil.nic.in", "consumerhelpline.gov.in", "rtionline.gov.in"], correct: 1, explanation: "e-Daakhil (edaakhil.nic.in) allows consumers to file complaints, pay fees, and attend hearings via video conferencing — all online without visiting any office." },
    { q: "Product liability under Consumer Protection Act 2019 means:", options: ["Only manufacturer is liable", "Consumer is always liable", "Manufacturer, seller and service provider can all be liable for defective products", "Government is liable"], correct: 2, explanation: "Sections 82–87 make manufacturers, product sellers, and service providers strictly liable for harm caused by defective products — even without proving negligence." },
    { q: "The Central Consumer Protection Authority (CCPA) maximum penalty for misleading advertisements is:", options: ["Rs. 1 lakh", "Rs. 10 lakh", "Rs. 50 lakh", "Rs. 1 crore"], correct: 1, explanation: "CCPA can impose a penalty of up to Rs. 10 lakh for first misleading advertisement offence and Rs. 50 lakh for repeat offences." },
    { q: "Which of the following is NOT a consumer under the Consumer Protection Act?", options: ["A person buying a TV for home use", "A shopkeeper buying goods for resale", "A farmer buying pesticides for farming", "A student buying a laptop for study"], correct: 1, explanation: "A shopkeeper buying goods commercially for resale is NOT a consumer. The Act covers goods/services bought for personal end-use only." },
    { q: "Filing fee at District Consumer Commission for a claim of Rs. 4 lakh is:", options: ["Rs. 500", "Rs. 200", "Free", "Rs. 1,000"], correct: 2, explanation: "Filing a consumer complaint for claims up to Rs. 5 lakh at the District Consumer Commission is completely FREE." },
    { q: "Which of the following is an unfair trade practice under the Consumer Protection Act?", options: ["Offering a discount", "Charging above Maximum Retail Price (MRP)", "Issuing a proper bill", "Providing warranty"], correct: 1, explanation: "Charging above the MRP printed on the product is an unfair trade practice. The seller is bound by the MRP under the Legal Metrology Act." },
    { q: "Under e-commerce rules, an online platform must display which of the following?", options: ["Only product price", "Only return policy", "Seller details, return policy, and grievance officer contact", "Only company's address"], correct: 2, explanation: "Under E-Commerce Rules 2020, every platform must clearly display seller details (name, address, GSTIN), return/refund policy, and a grievance officer with contact details." },
  ],
  // ── Cyber Safety Quiz (8 questions) ──────────────────────────────────────
  "Cyber": [
    { q: "What is the first thing you should do if you fall victim to UPI/online fraud?", options: ["File a court case", "Call 1930 immediately and report to your bank", "Wait 24 hours before reporting", "Post on social media"], correct: 1, explanation: "Call 1930 (National Cyber Crime Helpline) and your bank immediately — the sooner you report, the higher the chance of blocking the transaction. RBI rules: zero liability if reported within 3 days." },
    { q: "The national portal to file cyber crime complaints is:", options: ["pgportal.gov.in", "cybercrime.gov.in", "consumerhelpline.gov.in", "rtionline.gov.in"], correct: 1, explanation: "cybercrime.gov.in is the official portal for filing all types of cyber crime complaints including financial fraud, objectionable content, and cyber bullying." },
    { q: "Under Information Technology Act 2000, hacking someone's computer carries a penalty of:", options: ["Rs. 1 lakh only", "3 years imprisonment and/or Rs. 5 lakh fine", "6 months imprisonment", "Only civil suit"], correct: 1, explanation: "Section 43 and 66 of the IT Act make unauthorized access (hacking) punishable with up to 3 years imprisonment and/or a fine of Rs. 5 lakh." },
    { q: "SIM swapping fraud means:", options: ["Exchanging SIM cards between friends", "Criminal fraudulently obtains a duplicate SIM to access your OTPs and bank accounts", "Buying a new SIM card", "Roaming on a foreign network"], correct: 1, explanation: "SIM swap fraud is when criminals convince telecom companies to issue a duplicate SIM by impersonating you, then intercept OTPs to drain your bank accounts." },
    { q: "Which of the following best protects you from phishing attacks?", options: ["Using simple passwords", "Clicking all links in emails", "Never sharing OTP or password with anyone, even 'bank officials'", "Keeping phone on loud"], correct: 2, explanation: "Phishing exploits trust. No legitimate bank, government authority, or company ever asks for OTP, CVV, or password. Never share these — even with people claiming to be from your bank." },
    { q: "Under IT Act 2000, sending obscene/offensive messages electronically is punishable under Section:", options: ["Section 43", "Section 66A (struck down) / Section 66E", "Section 67", "Section 69"], correct: 2, explanation: "Section 67 punishes publishing/transmitting obscene material electronically with up to 3 years imprisonment. Section 66E punishes capturing/transmitting private images without consent." },
    { q: "If a social media platform refuses to remove content that violates your privacy, you can complain to:", options: ["Supreme Court only", "Internet Service Provider only", "Grievance Appellate Committee (GAC) under IT Rules 2021", "TRAI"], correct: 2, explanation: "Under IT Rules 2021, platforms must appoint a Grievance Officer. If unsatisfied, escalate to the Grievance Appellate Committee (GAC) set up by the Government." },
    { q: "Cyber bullying of a child under 18 falls under which additional law?", options: ["Consumer Protection Act", "POCSO Act 2012 and IT Act 2000", "RTI Act", "IPC only"], correct: 1, explanation: "Online sexual harassment/bullying of children under 18 is covered under POCSO Act 2012 (Protection of Children from Sexual Offences) in addition to IT Act 2000 — attracting much stricter penalties." },
  ],
  // ── RTI Act Quiz (6 questions) ────────────────────────────────────────────
  "RTI": [
    { q: "What is the RTI application fee for Central Government departments?", options: ["Free", "Rs. 10", "Rs. 50", "Rs. 100"], correct: 1, explanation: "The RTI application fee is Rs. 10 (by postal order, cash, or demand draft). BPL (Below Poverty Line) cardholders are fully exempt from all RTI fees." },
    { q: "Within how many days must a Public Information Officer (PIO) respond to an RTI application?", options: ["7 days", "15 days", "30 days", "60 days"], correct: 2, explanation: "Under RTI Act Section 7, the PIO must provide information within 30 days. For matters concerning life or liberty, the response must come within 48 hours." },
    { q: "Where is the RTI First Appeal filed?", options: ["Central Information Commission", "High Court", "First Appellate Authority within the same department", "State Government"], correct: 2, explanation: "The First Appeal is filed with the First Appellate Authority (FAA) — a senior officer in the same public authority. It must be filed within 30 days of the PIO's refusal or non-response." },
    { q: "Which of the following information CANNOT be denied under RTI?", options: ["Cabinet meeting notes", "Defence secrets", "Government expenditure on public welfare schemes", "Intelligence Bureau operations"], correct: 2, explanation: "Information about government expenditure, welfare schemes, beneficiaries, and contracts is public information and cannot be denied. Sections 8 and 9 list exhaustive exemptions." },
    { q: "The maximum penalty a PIO can be fined by the Information Commission is:", options: ["Rs. 5,000", "Rs. 10,000", "Rs. 25,000", "Rs. 1 lakh"], correct: 2, explanation: "The Central/State Information Commission can impose a penalty of Rs. 250 per day on the PIO for delay or wrongful denial, with a maximum of Rs. 25,000 per complaint." },
    { q: "The online portal to file RTI for Central Government departments is:", options: ["pgportal.gov.in", "rtionline.gov.in", "mygov.in", "umang.gov.in"], correct: 1, explanation: "rtionline.gov.in is the official portal for filing RTI applications online to all central government ministries, departments, and public authorities — payment of Rs. 10 can be made online." },
  ],
  // ── Labour Law Quiz (10 questions) ───────────────────────────────────────
  "Labour": [
    { q: "After how many years of continuous service is an employee entitled to gratuity?", options: ["3 years", "5 years", "7 years", "10 years"], correct: 1, explanation: "The Payment of Gratuity Act 1972 requires 5 years of continuous service. Exception: gratuity is payable on death or disability even before 5 years." },
    { q: "What percentage does each of employer and employee contribute to EPF?", options: ["8%", "10%", "12%", "15%"], correct: 2, explanation: "Both employer and employee each contribute 12% of basic salary. Employer's 12% is split — 3.67% to EPF account and 8.33% to EPS (Employee Pension Scheme)." },
    { q: "The EPFO online grievance portal is:", options: ["epfigms.gov.in", "epfo.gov.in", "pfindia.gov.in", "shramsuvidha.gov.in"], correct: 0, explanation: "epfigms.gov.in is EPFO's official grievance portal. Alternatively call 1800-118-005 (toll-free). Employer not depositing PF is a criminal offence." },
    { q: "Overtime work must be paid at what rate?", options: ["Same rate as regular hours", "1.5 times the ordinary rate", "Double (2 times) the ordinary rate", "Triple (3 times) the ordinary rate"], correct: 2, explanation: "Under the Code on Wages 2019 and Minimum Wages Act, overtime must be paid at double the ordinary wage rate." },
    { q: "Which Labour Code consolidates minimum wages, payment of wages, and bonus?", options: ["Industrial Relations Code 2020", "Code on Wages 2019", "Occupational Safety Code 2020", "Code on Social Security 2020"], correct: 1, explanation: "The Code on Wages 2019 consolidates four laws: Payment of Wages Act, Minimum Wages Act, Payment of Bonus Act, and Equal Remuneration Act." },
    { q: "Maternity leave for the first two children under the Maternity Benefit Act 2017 is:", options: ["12 weeks", "18 weeks", "26 weeks", "20 weeks"], correct: 2, explanation: "The Maternity Benefit Act (amended 2017) entitles women to 26 weeks paid maternity leave for the first two children. 12 weeks for the third child." },
    { q: "The National Labour Helpline number is:", options: ["1800", "14434", "1930", "181"], correct: 1, explanation: "14434 is the National Labour Helpline for reporting wage theft, non-payment, unsafe working conditions, and other labour violations. Online: shramsuvidha.gov.in." },
    { q: "Under MGNREGA, a job card holder is entitled to work within how many days?", options: ["7 days", "15 days", "30 days", "45 days"], correct: 1, explanation: "Under MGNREGA, work must start within 15 days of written demand. If not provided, the worker is entitled to an unemployment allowance from the state government." },
    { q: "Maximum gratuity payable under the Payment of Gratuity Act is:", options: ["Rs. 5 lakh", "Rs. 10 lakh", "Rs. 20 lakh", "No upper limit"], correct: 2, explanation: "The maximum gratuity payable is Rs. 20 lakh (exempted from income tax). The formula is: Last drawn basic salary × 15/26 × number of years of service." },
    { q: "An establishment with how many employees must mandatorily provide EPF coverage?", options: ["5 or more", "10 or more", "20 or more", "50 or more"], correct: 2, explanation: "Under the EPF Act 1952, EPF is mandatory for establishments employing 20 or more persons. Smaller establishments can voluntarily register. Once covered, coverage continues even if headcount drops below 20." },
  ],
  // ── Property Rights Quiz (8 questions) ───────────────────────────────────
  "Property": [
    { q: "RERA registration is compulsory for residential projects with plot area above:", options: ["200 sq.m.", "500 sq.m.", "1,000 sq.m.", "2,000 sq.m."], correct: 1, explanation: "Under RERA 2016, registration is mandatory for projects with plot area above 500 sq.m. or more than 8 apartments. Builders must register before advertising or selling." },
    { q: "For how many years is a builder liable for structural defects after possession?", options: ["1 year", "2 years", "5 years", "10 years"], correct: 2, explanation: "Under RERA 2016, the builder is liable for structural defects and poor workmanship for 5 years from the date of handing over possession. Defects must be rectified within 30 days." },
    { q: "Stamp duty in Tamil Nadu on property purchase is approximately:", options: ["4%", "5%", "7%", "10%"], correct: 2, explanation: "In Tamil Nadu, stamp duty is 7% of guideline value or actual consideration (whichever is higher). Registration fee is an additional 4%." },
    { q: "RERA complaints in Tamil Nadu are filed at:", options: ["tnrera.in", "tnpds.gov.in", "tnreg.gov.in", "tnedistrict.tn.gov.in"], correct: 0, explanation: "Tamil Nadu RERA is at tnrera.in. Complaints can be filed online. Adjudication must be completed within 60 days." },
    { q: "Land acquisition compensation for rural land under the 2013 Act is:", options: ["1× market value", "2× market value", "3× market value", "4× market value + 100% solatium"], correct: 3, explanation: "Under the Right to Fair Compensation Act 2013, rural land acquisition compensation is 4× market value plus 100% solatium. For urban land: 2× market value plus 100% solatium." },
    { q: "A rental lease deed for more than 11 months must be:", options: ["Notarised only", "Registered at Sub-Registrar's office", "Filed with municipality", "Submitted to police station"], correct: 1, explanation: "A lease deed exceeding 11 months is a compulsorily registrable document under Registration Act 1908 and must be registered at the Sub-Registrar office." },
    { q: "Which document proves a property has no mortgage or outstanding loan?", options: ["Title deed", "Property tax receipt", "Encumbrance Certificate (EC)", "Patta"], correct: 2, explanation: "An Encumbrance Certificate from the Sub-Registrar shows all registered transactions against a property — mortgages, sales, claims. Essential before purchasing any property." },
    { q: "Tamil Nadu property registration records can be checked at:", options: ["tnreginet.gov.in", "tnpds.gov.in", "tnedistrict.tn.gov.in", "tndistricts.tn.gov.in"], correct: 0, explanation: "tnreginet.gov.in is Tamil Nadu's official property registration portal for checking documents, encumbrance certificates, and guideline values online." },
  ],
  // ── Tax Basics Quiz (8 questions) ────────────────────────────────────────
  "Tax": [
    { q: "The deadline to file ITR for salaried individuals (non-audit) is:", options: ["March 31", "July 31", "September 30", "December 31"], correct: 1, explanation: "The due date for ITR filing for non-audit cases (salaried individuals, HUFs) is July 31 of the assessment year." },
    { q: "Maximum deduction allowed under Section 80C is:", options: ["Rs. 50,000", "Rs. 1 lakh", "Rs. 1.5 lakh", "Rs. 2 lakh"], correct: 2, explanation: "Section 80C allows up to Rs. 1.5 lakh deduction for EPF, PPF, ELSS, NSC, LIC premium, home loan principal, and children's tuition fees." },
    { q: "Standard deduction for salaried employees under the new tax regime (FY 2024-25) is:", options: ["Rs. 40,000", "Rs. 50,000", "Rs. 75,000", "Rs. 1,00,000"], correct: 2, explanation: "Budget 2024 increased standard deduction to Rs. 75,000 under the new tax regime. Under the old regime it remains Rs. 50,000." },
    { q: "Agricultural income in India is:", options: ["Fully taxable", "Exempt from income tax under Section 10(1)", "Taxable above Rs. 5 lakh", "Taxable above Rs. 2.5 lakh"], correct: 1, explanation: "Agricultural income is fully exempt under Section 10(1). However, it is considered for calculating tax on non-agricultural income (partial integration method)." },
    { q: "Form 26AS / AIS is used to:", options: ["Apply for PAN card", "See all TDS deductions and income reported on your PAN", "File GST returns", "Claim insurance"], correct: 1, explanation: "Form 26AS (now AIS — Annual Information Statement) shows all TDS deducted on your PAN, advance tax paid, bank interest income, and major financial transactions." },
    { q: "GST rate on most consumer electronics (smartphones, laptops) is:", options: ["5%", "12%", "18%", "28%"], correct: 2, explanation: "Most consumer electronics attract 18% GST. Essential food items attract 0–5%; luxury goods and sin goods attract 28%." },
    { q: "Section 80D deduction is available for:", options: ["Home loan interest", "Health insurance premium", "Education loan interest", "Charitable donations"], correct: 1, explanation: "Section 80D allows up to Rs. 25,000 deduction for health insurance premium for self, spouse, and children. Up to Rs. 50,000 for senior citizen parents' insurance." },
    { q: "Late fee for filing ITR after due date when income exceeds Rs. 5 lakh is:", options: ["Rs. 1,000", "Rs. 3,000", "Rs. 5,000", "Rs. 10,000"], correct: 2, explanation: "Late filing fee is Rs. 5,000 if income exceeds Rs. 5 lakh. If income is below Rs. 5 lakh, the late fee is capped at Rs. 1,000." },
  ],
  // ── Women's Rights Quiz (10 questions) ───────────────────────────────────
  "Women's Rights": [
    { q: "The POSH Act 2013 requires workplaces with how many employees to form an Internal Complaints Committee?", options: ["5+", "10+", "20+", "50+"], correct: 1, explanation: "Every workplace with 10 or more employees must constitute an ICC. Workplaces with fewer than 10 employees must approach the District Local Complaints Committee (LCC)." },
    { q: "What is the Women's Helpline number in India?", options: ["1091", "181", "112", "1098"], correct: 1, explanation: "181 is the national Women's Helpline — toll-free, 24x7, multilingual. It connects directly to One Stop Centres (Sakhi) and police." },
    { q: "Maternity leave for the first two children under the amended Maternity Benefit Act 2017 is:", options: ["12 weeks", "18 weeks", "26 weeks", "24 weeks"], correct: 2, explanation: "The Maternity Benefit Amendment Act 2017 increased paid maternity leave to 26 weeks for the first two children." },
    { q: "Since the Hindu Succession Amendment 2005, daughters have equal rights in ancestral property:", options: ["Only if born after 2005", "Regardless of when they were born", "Only if father died after 2005", "Only for unmarried daughters"], correct: 1, explanation: "The Supreme Court in Vineeta Sharma v. Rakesh Sharma (2020) clarified that daughters have equal coparcenary rights regardless of when they were born — even before 2005." },
    { q: "SHe-Box portal (shebox.nic.in) is specifically for:", options: ["Scholarship applications for women", "Filing sexual harassment complaints by government employees", "Women's health schemes", "Women entrepreneurship loans"], correct: 1, explanation: "SHe-Box (Sexual Harassment electronic Box) is for central government employees and staff of centrally funded organisations to file POSH Act complaints online." },
    { q: "One Stop Centres (Sakhi) provide which of the following services?", options: ["Only legal help", "Only shelter", "Medical, legal, police, psychological support and shelter — all at one place", "Only counselling"], correct: 2, explanation: "One Stop Centres under the Ministry of Women & Child Development provide integrated support: medical, legal, police, psychological counselling, and temporary shelter — all at one location, 24x7." },
    { q: "After receiving a PWDVA complaint, a Magistrate must fix the first hearing within:", options: ["7 days", "15 days", "3 days", "30 days"], correct: 2, explanation: "Under PWDVA 2005, the Magistrate must schedule the first hearing within 3 days of receiving an application for a protection order." },
    { q: "Violating a Protection Order under PWDVA is punishable with:", options: ["Warning only", "Fine only", "Up to 1 year imprisonment and/or Rs. 20,000 fine", "Up to 5 years imprisonment"], correct: 2, explanation: "Under Section 31 PWDVA, violation of a protection order or interim protection order is punishable with imprisonment up to 1 year and/or a fine of Rs. 20,000." },
    { q: "Under the Dowry Prohibition Act 1961, giving or taking dowry is punishable with minimum imprisonment of:", options: ["6 months", "1 year", "3 years", "5 years"], correct: 3, explanation: "Under the Dowry Prohibition Act 1961, giving or taking dowry is punishable with a minimum of 5 years imprisonment and a minimum fine of Rs. 15,000 or the value of the dowry — whichever is higher." },
    { q: "A woman's Streedhan (gifts given at marriage) legally belongs to:", options: ["Husband's family", "The wife exclusively", "Both husband and wife jointly", "The father-in-law"], correct: 1, explanation: "Streedhan belongs exclusively to the wife. If the husband or in-laws take it without her consent, it amounts to criminal breach of trust under Section 406 IPC/BNS — a criminal offence." },
  ],
  // ── Senior Citizens Benefits Quiz (7 questions) ───────────────────────────
  "Senior Citizens": [
    { q: "The Maintenance Tribunal for senior citizens is typically:", options: ["District Court", "High Court", "Sub-Divisional Magistrate (SDM)", "Consumer Forum"], correct: 2, explanation: "Under the Maintenance and Welfare of Parents and Senior Citizens Act 2007, the Maintenance Tribunal is the SDM. No advocate is required and there is no court fee." },
    { q: "Maximum monthly maintenance a Tribunal can order for a senior citizen is:", options: ["Rs. 5,000", "Rs. 10,000", "Rs. 25,000", "No limit"], correct: 1, explanation: "The Act caps maintenance at Rs. 10,000 per month at the national level. Several states have raised this — Maharashtra allows up to Rs. 1 lakh per month." },
    { q: "Abandoning a senior citizen is punishable with imprisonment of up to:", options: ["1 month", "3 months", "6 months", "1 year"], correct: 1, explanation: "Under the Maintenance Act 2007, abandonment of a senior citizen is punishable with up to 3 months imprisonment and/or a fine." },
    { q: "Current interest rate on Senior Citizens Savings Scheme (SCSS) is:", options: ["6.5% p.a.", "7.2% p.a.", "8.2% p.a.", "9% p.a."], correct: 2, explanation: "SCSS offers 8.2% per annum (as of 2024), making it one of the highest guaranteed returns available to senior citizens, with investment up to Rs. 30 lakh." },
    { q: "Ayushman Bharat additional health cover for senior citizens above 70 years is:", options: ["Rs. 2 lakh", "Rs. 5 lakh extra over family limit", "Same as family limit", "Rs. 1 lakh"], correct: 1, explanation: "Since 2024, all senior citizens above 70 years get an additional Rs. 5 lakh top-up cover under Ayushman Bharat — separate from and in addition to the family's existing Rs. 5 lakh limit." },
    { q: "Senior citizens have the right to priority queues at:", options: ["Only banks", "Only hospitals", "Only government offices", "Government offices, banks, hospitals, and post offices"], correct: 3, explanation: "Senior citizens (60+) have statutory right to priority seating and service at all government offices, banks, hospitals, and post offices. Super-seniors (80+) get priority even among senior citizens." },
    { q: "PM Vaya Vandana Yojana (PMVVY) pension scheme is managed by:", options: ["SBI", "Post Office", "LIC of India", "NABARD"], correct: 2, explanation: "PMVVY is administered by LIC of India. It offers a guaranteed 7.4% pension rate for 10 years for senior citizens above 60, with a maximum investment of Rs. 15 lakh." },
  ],
};

function getLessons(course: { category?: string | null; title: string }) {
  const title = course.title.toLowerCase();
  if (title.includes("constitutional")) return COURSE_LESSONS["Constitutional Rights"];
  if (title.includes("rti") || title.includes("information")) return COURSE_LESSONS["RTI"];
  if (title.includes("consumer")) return COURSE_LESSONS["Consumer Rights"];
  if (title.includes("women")) return COURSE_LESSONS["Women's Rights"];
  if (title.includes("labour")) return COURSE_LESSONS["Labour"];
  if (title.includes("tax")) return COURSE_LESSONS["Tax"];
  if (title.includes("property")) return COURSE_LESSONS["Property"];
  if (title.includes("senior")) return COURSE_LESSONS["Senior Citizens"];
  if (title.includes("environment")) return COURSE_LESSONS["Environment"];
  
  const cat = course.category ?? "";
  return COURSE_LESSONS[cat] ?? COURSE_LESSONS["default"];
}

function getQuizQuestions(quiz: { category?: string | null; title: string; questions: number }) {
  const title = quiz.title.toLowerCase();
  let pool = QUIZ_QUESTIONS["Constitutional Rights"]; // default pool
  
  if (title.includes("constitutional")) pool = QUIZ_QUESTIONS["Constitutional Rights"];
  else if (title.includes("rti") || title.includes("information")) pool = QUIZ_QUESTIONS["RTI"];
  else if (title.includes("consumer")) pool = QUIZ_QUESTIONS["Consumer"];
  else if (title.includes("women")) pool = QUIZ_QUESTIONS["Women's Rights"];
  else if (title.includes("labour") || title.includes("workplace")) pool = QUIZ_QUESTIONS["Labour"];
  else if (title.includes("tax")) pool = QUIZ_QUESTIONS["Tax"];
  else if (title.includes("property")) pool = QUIZ_QUESTIONS["Property"];
  else if (title.includes("senior")) pool = QUIZ_QUESTIONS["Senior Citizens"];
  else if (title.includes("cyber")) pool = QUIZ_QUESTIONS["Cyber"];
  
  return pool.slice(0, quiz.questions);
}

// ─── CourseModal ─────────────────────────────────────────────────────────────
function CourseModal({ course, onClose, onComplete }: {
  course: { id: number; title: string; description: string; lessons: number; xpReward: number; category?: string | null };
  onClose: () => void;
  onComplete: (xp: number) => void;
}) {
  const lessons = getLessons(course);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  function markComplete(idx: number) {
    const next = new Set(completed);
    next.add(idx);
    setCompleted(next);
    if (next.size === lessons.length) setDone(true);
    else if (idx < lessons.length - 1) setCurrentLesson(idx + 1);
  }

  function finishCourse() {
    onComplete(course.xpReward);
    onClose();
  }

  const lesson = lessons[currentLesson];
  const progress = Math.round((completed.size / lessons.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-modal-enter">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-5 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="text-xs mb-2 bg-white/20 text-white border-white/30">{course.category}</Badge>
              <h2 className="text-lg font-bold leading-tight">{course.title}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-primary-foreground/80">
                <span>{lessons.length} lessons</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {course.xpReward} XP</span>
              </div>
            </div>
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-primary-foreground/70 mb-1">
              <span>{completed.size} of {lessons.length} completed</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/20" />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Lesson list sidebar */}
          <div className="w-52 border-r bg-muted/30 overflow-y-auto shrink-0 py-2">
            {lessons.map((l, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentLesson(idx)}
                className={`w-full text-left px-3 py-3 text-xs transition-colors flex items-start gap-2 border-l-2 ${currentLesson === idx ? "border-primary bg-primary/5 text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                <span className="shrink-0 mt-0.5">
                  {completed.has(idx)
                    ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    : <span className="w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center text-[8px] font-bold">{idx + 1}</span>}
                </span>
                <span className="leading-tight">{l.title}</span>
              </button>
            ))}
          </div>

          {/* Lesson content */}
          <div className="flex-1 overflow-y-auto p-5">
            {done ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Award className="w-16 h-16 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Course Complete!</h3>
                <p className="text-muted-foreground mb-1">You've completed all {lessons.length} lessons</p>
                <p className="text-secondary font-semibold text-lg mb-6">+{course.xpReward} XP earned!</p>
                <button onClick={finishCourse} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Claim XP & Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Lesson {currentLesson + 1} of {lessons.length}</span>
                </div>
                <h3 className="text-lg font-bold mb-4 text-foreground">{lesson.title}</h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-6">{lesson.content}</div>
                <button
                  onClick={() => markComplete(currentLesson)}
                  disabled={completed.has(currentLesson)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${completed.has(currentLesson) ? "bg-green-100 text-green-700 cursor-default" : "bg-primary text-primary-foreground hover:opacity-90"}`}
                >
                  {completed.has(currentLesson) ? <><CheckCircle className="w-4 h-4" /> Completed</> : <><ArrowRight className="w-4 h-4" /> Mark Complete & Continue</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QuizModal ───────────────────────────────────────────────────────────────
function QuizModal({ quiz, onClose, onComplete }: {
  quiz: { id: number; title: string; questions: number; xpReward: number; category?: string | null };
  onClose: () => void;
  onComplete: (xp: number, isPerfect: boolean) => void;
}) {
  const questions = getQuizQuestions(quiz);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [wrongIdxs, setWrongIdxs] = useState<number[]>([]);

  function handleSelect(optIdx: number) {
    if (answered) return;
    setSelected(optIdx);
    setAnswered(true);
    if (optIdx === questions[current].correct) {
      setScore((s) => s + 1);
    } else {
      setWrongIdxs((w) => [...w, current]);
    }
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
    }
  }

  function handleFinish() {
    const earned = Math.round((score / questions.length) * quiz.xpReward);
    onComplete(earned, score === questions.length);
    onClose();
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setDone(false);
    setWrongIdxs([]);
  }

  const q = questions[current];
  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[90vh] animate-modal-enter">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-5 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              {quiz.category && <Badge variant="secondary" className="text-xs mb-1 bg-white/20 text-white border-white/30">{quiz.category}</Badge>}
              <h2 className="text-base font-bold">{quiz.title}</h2>
            </div>
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          {!done && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-primary-foreground/70 mb-1">
                <span>Question {current + 1} of {questions.length}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {quiz.xpReward} XP</span>
              </div>
              <Progress value={((current + (answered ? 1 : 0)) / questions.length) * 100} className="h-1.5 bg-white/20" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {done ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${pct >= 75 ? "bg-green-100" : pct >= 50 ? "bg-yellow-100" : "bg-red-100"}`}>
                <span className={`text-2xl font-bold ${pct >= 75 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600"}`}>{pct}%</span>
              </div>
              <h3 className="text-xl font-bold mb-1">{pct >= 75 ? "Excellent!" : pct >= 50 ? "Good effort!" : "Keep learning!"}</h3>
              <p className="text-muted-foreground mb-1">{score} out of {questions.length} correct</p>
              <p className="text-secondary font-semibold mb-4">+{Math.round((score / questions.length) * quiz.xpReward)} XP earned</p>

              {pct === 100 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-left text-amber-800 flex items-start gap-2.5 max-w-sm">
                  <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs">Certificate Unlocked!</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Perfect score! You can download your digital completion certificate in your Profile.</p>
                  </div>
                </div>
              )}

              {wrongIdxs.length > 0 && (
                <div className="w-full text-left mb-6">
                  <p className="text-sm font-semibold mb-3 text-foreground">Review incorrect answers:</p>
                  <div className="space-y-3">
                    {wrongIdxs.map((wi) => (
                      <div key={wi} className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs">
                        <p className="font-medium text-foreground mb-1">{questions[wi].q}</p>
                        <p className="text-green-700">✓ {questions[wi].options[questions[wi].correct]}</p>
                        <p className="text-muted-foreground mt-1">{questions[wi].explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={restart} className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors">
                  <RotateCcw className="w-4 h-4" /> Retry
                </button>
                <button onClick={handleFinish} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Claim XP <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-foreground leading-relaxed mb-5">{q.q}</p>
              <div className="space-y-2.5 mb-4">
                {q.options.map((opt, i) => {
                  let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
                  if (!answered) {
                    cls += "hover:border-primary/40 hover:bg-primary/5 text-foreground";
                  } else if (i === q.correct) {
                    cls += "border-green-400 bg-green-50 text-green-800";
                  } else if (i === selected && i !== q.correct) {
                    cls += "border-red-400 bg-red-50 text-red-800";
                  } else {
                    cls += "opacity-50 text-muted-foreground";
                  }
                  return (
                    <button key={i} onClick={() => handleSelect(i)} className={cls}>
                      <span className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${answered && i === q.correct ? "border-green-500 bg-green-500 text-white" : answered && i === selected ? "border-red-400 bg-red-400 text-white" : "border-current"}`}>
                          {answered && i === q.correct ? <CheckCircle className="w-3.5 h-3.5" /> : answered && i === selected ? <XCircle className="w-3.5 h-3.5" /> : String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`rounded-xl p-3 mb-4 text-xs ${selected === q.correct ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
                  <p className="font-semibold mb-0.5">{selected === q.correct ? "✓ Correct!" : "✗ Incorrect"}</p>
                  <p className="leading-relaxed text-muted-foreground">{q.explanation}</p>
                </div>
              )}
              {answered && (
                <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  {current < questions.length - 1 ? <><ArrowRight className="w-4 h-4" /> Next Question</> : <><CheckCircle className="w-4 h-4" /> See Results</>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type CourseItem = { id: number; title: string; description: string; lessons: number; xpReward: number; category?: string | null; icon?: string | null };
type QuizItem = { id: number; title: string; questions: number; xpReward: number; category?: string | null };

const BADGES = [
  { id: "constitution", name: "Constitution Guardian", icon: Shield, quizId: 1 },
  { id: "consumer", name: "Consumer Advocate", icon: Trophy, quizId: 2 },
  { id: "rti", name: "RTI Champion", icon: Award, quizId: 3 },
  { id: "labour", name: "Labour Protector", icon: Shield, quizId: 4 }
];

// ─── Main Learning Page ───────────────────────────────────────────────────────
export default function Learning() {
  const { data: courses, isLoading: loadingCourses } = useListCourses();
  const { data: quizzes, isLoading: loadingQuizzes } = useListQuizzes();

  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [xp, setXp] = useState<number>(() => {
    try { return parseInt(localStorage.getItem("citizenhub_xp") ?? "0") || 0; } catch { return 0; }
  });
  const [completedCourses, setCompletedCourses] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("citizenhub_completed_courses") ?? "[]")); } catch { return new Set(); }
  });
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("citizenhub_completed_quizzes") ?? "[]")); } catch { return new Set(); }
  });

  function earnXp(amount: number, id: number, type: "course" | "quiz") {
    const newXp = xp + amount;
    setXp(newXp);
    try { localStorage.setItem("citizenhub_xp", String(newXp)); } catch { /* ignore */ }
    if (type === "course") {
      const next = new Set(completedCourses); next.add(id); setCompletedCourses(next);
      try { localStorage.setItem("citizenhub_completed_courses", JSON.stringify([...next])); } catch { /* ignore */ }
    } else {
      const next = new Set(completedQuizzes); next.add(id); setCompletedQuizzes(next);
      try { localStorage.setItem("citizenhub_completed_quizzes", JSON.stringify([...next])); } catch { /* ignore */ }
    }
  }

  const getLeaderboard = () => {
    let userName = "You";
    try {
      const storedUser = localStorage.getItem("citizenhub_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.name) userName = u.name;
      }
    } catch {}

    const userLevel = xp < 100 ? "Beginner" : xp < 300 ? "Learner" : xp < 600 ? "Citizen" : xp < 1000 ? "Expert" : "Champion";

    const peers = [
      { name: "Arjun Patel", xp: 1150, avatar: "AP", badge: "Champion", isUser: false },
      { name: "Priya Sharma", xp: 750, avatar: "PS", badge: "Expert", isUser: false },
      { name: "Rajesh Kumar", xp: 480, avatar: "RK", badge: "Citizen", isUser: false },
      { name: "Deepa Mani", xp: 260, avatar: "DM", badge: "Learner", isUser: false },
      { name: "Karthik Raja", xp: 90, avatar: "KR", badge: "Beginner", isUser: false }
    ];

    peers.push({
      name: userName,
      xp: xp,
      avatar: userName.substring(0, 2).toUpperCase(),
      badge: userLevel,
      isUser: true
    });

    return peers.sort((a, b) => b.xp - a.xp);
  };

  const totalPossibleXp = [...(courses ?? []), ...(quizzes ?? [])].reduce((sum, item) => sum + (item.xpReward ?? 0), 0);
  const progressPct = totalPossibleXp > 0 ? Math.min(100, Math.round((xp / totalPossibleXp) * 100)) : 0;

  const level = xp < 100 ? { name: "Beginner", next: 100 } : xp < 300 ? { name: "Learner", next: 300 } : xp < 600 ? { name: "Citizen", next: 600 } : xp < 1000 ? { name: "Expert", next: 1000 } : { name: "Champion", next: xp };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> Learning Center</h1>
          <p className="text-muted-foreground mt-1">Learn your rights, take quizzes, and earn XP badges</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Courses & Quizzes */}
          <div className="lg:col-span-2 space-y-8">
            {/* XP Banner */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="bg-white/10 rounded-xl p-4 shrink-0">
                  <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm opacity-75">Your Progress</p>
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">{level.name}</Badge>
                  </div>
                  <p className="text-2xl font-bold">{xp} XP earned</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={progressPct} className="h-1.5 flex-1 bg-white/20" />
                    <span className="text-xs opacity-70 shrink-0">{progressPct}% complete</span>
                  </div>
                  <p className="text-xs opacity-60 mt-1">{completedCourses.size} courses • {completedQuizzes.size} quizzes completed</p>
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Courses</h2>
                <p className="text-sm text-muted-foreground">Click any course to start learning with structured lessons</p>
              </div>
              {loadingCourses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-36 rounded-xl" />)}</div>
              ) : !courses?.length ? (
                <p className="text-muted-foreground text-sm">No courses available yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((c) => {
                    const done = completedCourses.has(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveCourse(c)}
                        className={`text-left bg-card border rounded-xl p-5 hover-lift hover-glow group relative overflow-hidden ${done ? "border-green-200 bg-green-50/50" : ""}`}
                      >
                        {done && <div className="absolute top-3 right-3"><CheckCircle className="w-5 h-5 text-green-500" /></div>}
                        {c.category && <Badge variant="outline" className="text-xs mb-3">{c.category}</Badge>}
                        <h3 className="font-semibold mb-2 pr-8 group-hover:text-primary transition-colors">{c.title}</h3>
                        <p className="text-muted-foreground text-xs mb-4 line-clamp-2">{c.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3 h-3" /> {c.lessons} lessons
                          </span>
                          <span className="flex items-center gap-1 text-secondary font-semibold">
                            <Star className="w-3 h-3 fill-secondary" /> {c.xpReward} XP
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-3 h-3" /> {done ? "Review Course" : "Start Course"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quizzes */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Quizzes</h2>
                <p className="text-sm text-muted-foreground">Test your knowledge and earn XP rewards</p>
              </div>
              {loadingQuizzes ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1,2,3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
              ) : !quizzes?.length ? (
                <p className="text-muted-foreground text-sm">No quizzes available yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quizzes.map((q) => {
                    const done = completedQuizzes.has(q.id);
                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuiz(q)}
                        className={`text-left bg-card border rounded-xl p-4 hover-lift hover-glow group relative ${done ? "border-green-200 bg-green-50/50" : ""}`}
                      >
                        {done && <div className="absolute top-3 right-3"><CheckCircle className="w-4 h-4 text-green-500" /></div>}
                        {q.category && <Badge variant="outline" className="text-xs mb-2">{q.category}</Badge>}
                        <h3 className="font-semibold text-sm mb-2 pr-6 group-hover:text-primary transition-colors">{q.title}</h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{q.questions} questions</span>
                          <span className="flex items-center gap-1 text-secondary font-medium"><Star className="w-3 h-3 fill-secondary" /> {q.xpReward} XP</span>
                        </div>
                        <p className="text-xs text-primary font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <Play className="w-3 h-3" /> {done ? "Retake Quiz" : "Start Quiz"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Leaderboard & Badges */}
          <div className="space-y-6">
            {/* Leaderboard Card */}
            <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Trophy className="w-4.5 h-4.5 text-yellow-500 animate-bounce" /> Peer Leaderboard
                </h3>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Weekly Rank</span>
              </div>
              <div className="space-y-3">
                {getLeaderboard().map((u, i) => {
                  const isUser = u.isUser;
                  return (
                    <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${isUser ? "bg-primary/5 border-primary/20 shadow-sm" : "border-transparent hover:bg-muted/30"}`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-slate-100 text-slate-700" : i === 2 ? "bg-amber-100 text-amber-700" : "text-muted-foreground"}`}>
                          {i + 1}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isUser ? "bg-secondary text-white" : "bg-primary/10 text-primary"}`}>
                          {u.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isUser ? "text-primary font-bold" : "text-foreground"}`}>{u.name}</p>
                          <p className="text-[9px] text-muted-foreground">{u.badge}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-foreground shrink-0">{u.xp} XP</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges Card */}
            <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-primary" /> Unlockable Badges
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((b) => {
                  const isUnlocked = completedQuizzes.has(b.quizId);
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.id}
                      className={`text-center p-3 border rounded-xl flex flex-col items-center justify-between shadow-xs relative group transition-all duration-300 hover:scale-105 hover:shadow-sm ${isUnlocked ? "bg-amber-50/20 border-amber-200" : "bg-muted/10 opacity-55 border-slate-100"}`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2 text-muted-foreground/60"><Lock className="w-3 h-3" /></div>
                      )}
                      <div className={`p-2.5 rounded-full mb-2 transition-transform duration-300 group-hover:rotate-12 ${isUnlocked ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-slate-200 text-slate-400"}`}>
                        <Icon className="w-4 h-4 fill-current" />
                      </div>
                      <span className="font-bold text-[10px] leading-tight text-foreground">{b.name}</span>
                      <span className="text-[8px] text-muted-foreground mt-0.5 leading-snug">{isUnlocked ? "Unlocked" : "Locked"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeCourse && (
        <CourseModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          onComplete={(xpAmt) => earnXp(xpAmt, activeCourse.id, "course")}
        />
      )}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onComplete={(xpAmt, isPerfect) => {
            earnXp(xpAmt, activeQuiz.id, "quiz");
            if (isPerfect) {
              const courseIdMap: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 4 };
              const courseId = courseIdMap[activeQuiz.id];
              if (courseId) {
                const next = new Set(completedCourses);
                next.add(courseId);
                setCompletedCourses(next);
                try { localStorage.setItem("citizenhub_completed_courses", JSON.stringify([...next])); } catch {}
              }
            }
          }}
        />
      )}
    </>
  );
}
