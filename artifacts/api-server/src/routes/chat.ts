import { Router, type IRouter } from "express";
import { db, chatMessagesTable, suggestedQuestionsTable } from "@workspace/db";
import {
  ListChatMessagesResponse,
  SendChatMessageBody,
  ListSuggestedQuestionsResponse,
} from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

// ─── Comprehensive AI response engine ────────────────────────────────────────
const RESPONSES: { keywords: string[]; en: string; ta: string }[] = [
  {
    keywords: ["rti", "right to information", "information act", "public information", "government file", "government record", "transparency"],
    en: "📋 Right to Information Act, 2005 — Your Right to Know\n\nEvery Indian citizen can request information from any government department, ministry, PSU, or local body.\n\n✅ How to file RTI:\n• Online: rtionline.gov.in (Central Govt) or your state RTI portal\n• Pay Rs. 10 fee (BPL holders: FREE)\n• Get a response within 30 days\n\n⚡ If no reply in 30 days:\n1. File First Appeal to Appellate Authority (same department)\n2. File Second Appeal to Central/State Information Commission\n3. PIO can be fined Rs. 250/day (max Rs. 25,000)\n\n📞 RTI Helpline: 011-24624376",
    ta: "📋 தகவல் அறியும் உரிமைச் சட்டம் 2005 — உங்கள் அறியும் உரிமை\n\nஒவ்வொரு இந்திய குடிமகனும் எந்த அரசு திணைக்களத்திலிருந்தும் தகவல் கேட்கலாம்.\n\n✅ RTI விண்ணப்பம் எப்படி:\n• ஆன்லைனில்: rtionline.gov.in\n• ரூ.10 கட்டணம் (BPL: இலவசம்)\n• 30 நாட்களில் பதில் கிடைக்கும்\n\n📞 RTI ஹெல்ப்லைன்: 011-24624376"
  },
  {
    keywords: ["consumer", "complaint", "defective product", "refund", "warranty", "deficiency", "service complaint", "cheated", "overcharged", "unfair"],
    en: "🛒 Consumer Rights — Consumer Protection Act 2019\n\nYou have 6 fundamental rights as a consumer in India.\n\n✅ How to file a complaint:\n1. First: Contact company's Grievance Officer (mandatory under law)\n2. National Consumer Helpline: 1915 (free, 24x7)\n3. File online at: consumerhelpline.gov.in\n4. Formal complaint: edaakhil.nic.in (online, from home)\n\n💰 Filing fee:\n• Up to Rs. 5 lakh: FREE\n• Rs. 5–10 lakh: Rs. 200\n\n⏰ File within 2 years of the incident\n\n📞 National Consumer Helpline: 1915",
    ta: "🛒 நுகர்வோர் உரிமைகள் — நுகர்வோர் பாதுகாப்பு சட்டம் 2019\n\n✅ புகார் செய்யும் முறை:\n1. முதலில்: நிறுவனத்தின் குறை தீர்ப்பு அலுவலரிடம் தெரிவிக்கவும்\n2. தேசிய நுகர்வோர் உதவி: 1915\n3. ஆன்லைன்: edaakhil.nic.in\n\n📞 நுகர்வோர் ஹெல்ப்லைன்: 1915"
  },
  {
    keywords: ["cyber fraud", "upi fraud", "online fraud", "bank fraud", "otp fraud", "phishing", "scam", "money stolen", "account hacked", "sim swap", "cyber crime", "internet fraud"],
    en: "🚨 Cyber Fraud — Act IMMEDIATELY!\n\nEvery minute matters. Call 1930 FIRST to block fraudulent transactions.\n\n⚡ Immediate steps:\n1. 📞 Call 1930 (Cyber Crime Helpline) — report transaction details NOW\n2. 🔒 Call your bank helpline — block card/freeze account\n3. 📱 Change all passwords and PINs\n4. 📸 Screenshot all evidence — SMS, call logs, chat messages\n\n✅ File complaint:\n• Online: cybercrime.gov.in\n• Visit nearest police station (any station, not just cyber cell)\n\n⚖️ RBI Rule: If reported within 3 days = ZERO liability to you!\n\n📞 Cyber Crime Helpline: 1930",
    ta: "🚨 இணைய மோசடி — உடனே நடவடிக்கை எடுங்கள்!\n\n⚡ உடனடி நடவடிக்கைகள்:\n1. 📞 1930 அழைக்கவும் (இணைய குற்றங்கள் உதவி)\n2. 🔒 வங்கி அட்டையை block செய்யவும்\n3. 📸 அனைத்து ஆதாரங்களையும் screenshot எடுக்கவும்\n\n✅ புகார் செய்க:\n• cybercrime.gov.in\n• அருகில் உள்ள காவல் நிலையம்\n\n📞 இணைய குற்ற ஹெல்ப்லைன்: 1930"
  },
  {
    keywords: ["domestic violence", "husband hitting", "wife abuse", "marital abuse", "physical abuse", "pwdva", "protection order", "in-laws harassment", "matrimonial violence"],
    en: "🔴 Domestic Violence — Immediate Help Available\n\nThe Protection of Women from Domestic Violence Act 2005 covers physical, sexual, emotional, verbal, and economic abuse.\n\n✅ What you can get:\n• Protection Order (restraint on abuser)\n• Residence Order (right to stay in home)\n• Maintenance & compensation\n• Temporary custody of children\n\n⚡ How to get help:\n1. Call 181 (Women Helpline, 24x7, FREE)\n2. Visit Protection Officer at SDM/DM office\n3. Approach Magistrate directly\n4. Visit One Stop Centre (Sakhi) for shelter + legal + medical support\n\n📞 Women Helpline: 181 | Emergency: 112",
    ta: "🔴 குடும்ப வன்முறை — உடனடி உதவி கிடைக்கும்\n\nPWDVA 2005 சட்டம் உடல், பாலியல், உணர்ச்சி, மற்றும் பொருளாதார வன்முறையை உள்ளடக்கும்.\n\n✅ எப்படி உதவி பெறலாம்:\n1. 181 (பெண்கள் உதவி, 24x7, இலவசம்)\n2. SDM அலுவலகத்தில் Protection Officer ஐ சந்திக்கவும்\n3. One Stop Centre (Sakhi) செல்லவும்\n\n📞 பெண்கள் ஹெல்ப்லைன்: 181 | அவசரம்: 112"
  },
  {
    keywords: ["sexual harassment", "workplace harassment", "posh", "icc", "internal complaints", "office harassment", "colleague misbehavior"],
    en: "🏢 Workplace Sexual Harassment — POSH Act 2013\n\nEvery workplace with 10+ employees must have an Internal Complaints Committee (ICC).\n\n✅ Your rights:\n• File complaint with ICC within 3 months of incident\n• Confidentiality is mandatory (identity protected)\n• Interim relief during inquiry (transfer/leave)\n• Inquiry must complete in 60 days\n\n⚡ Where to complain if no ICC:\n• District Local Complaints Committee (LCC)\n• Government employees: SHe-Box portal (shebox.nic.in)\n• National Commission for Women: 011-26942369\n\n📞 Women Helpline: 181 | NCW: 011-26942369",
    ta: "🏢 பணியிட பாலியல் துன்புறுத்தல் — POSH சட்டம் 2013\n\n10+ பணியாளர்கள் உள்ள ஒவ்வொரு பணியிடமும் ICC வைத்திருக்க வேண்டும்.\n\n✅ புகாரை 3 மாதங்களுக்குள் ICC-யிடம் தெரிவிக்கவும்\n• அரசு ஊழியர்கள்: shebox.nic.in\n• NCW: 011-26942369\n\n📞 பெண்கள் ஹெல்ப்லைன்: 181"
  },
  {
    keywords: ["epf", "pf", "provident fund", "uan", "pf withdrawal", "employer not depositing pf", "employee provident fund"],
    en: "💰 EPF / PF Rights — Employees Provident Fund\n\nBoth you and your employer each contribute 12% of basic salary to PF.\n\n✅ Your rights:\n• Check PF balance: unified.epfindia.gov.in (UAN login)\n• Employer must deposit PF by 15th of every month\n• Withdraw after 2 months of leaving job\n• Transfer PF when changing jobs (same UAN)\n\n⚡ Employer not depositing PF?\n1. File complaint at epfigms.gov.in\n2. Call EPFO Helpline: 1800-118-005 (free)\n3. Employer faces criminal prosecution for default\n\n📞 EPFO Helpline: 1800-118-005",
    ta: "💰 EPF / PF உரிமைகள்\n\nநீங்களும் உங்கள் முதலாளியும் basic salary-ல் 12% வீதம் PF செலுத்துகிறீர்கள்.\n\n✅ PF balance: unified.epfindia.gov.in\n• 2 மாதம் வேலை இல்லாத பிறகு திரும்பப் பெறலாம்\n• புகார்: epfigms.gov.in\n\n📞 EPFO: 1800-118-005"
  },
  {
    keywords: ["minimum wage", "salary not paid", "wage theft", "below minimum", "no salary", "wage complaint", "labour complaint", "employer cheating"],
    en: "👷 Minimum Wages & Wage Theft\n\nEvery state government fixes minimum wages for different categories. Paying below minimum wage is a criminal offence.\n\n✅ Your rights:\n• Get at least state minimum wage\n• Overtime at double rate\n• Wages by 7th of following month\n• Salary slip is your right\n\n⚡ How to complain:\n1. File with Labour Inspector / Asst Labour Commissioner\n2. Online: shramsuvidha.gov.in\n3. EPFO for PF issues: epfigms.gov.in\n4. For wrongful termination: Labour Court\n\n📞 Labour Helpline: 14434",
    ta: "👷 குறைந்தபட்ச ஊதியம் & ஊதிய பிரச்னை\n\n✅ குறைந்தபட்ச ஊதியத்தை விட குறைவாக கொடுப்பது குற்றம்\n• overtime: இரட்டை rate\n• புகார்: shramsuvidha.gov.in\n\n📞 தொழிலாளர் ஹெல்ப்லைன்: 14434"
  },
  {
    keywords: ["passport", "apply passport", "renew passport", "psk", "passport seva kendra", "tatkal", "passport status"],
    en: "✈️ Passport Application — Step by Step\n\n✅ Complete process:\n1. Register at passportindia.gov.in\n2. Fill online application form\n3. Pay fee: Rs. 1,500 (Normal) / Rs. 3,500 (Tatkal)\n4. Book appointment at nearest PSK/POPSK\n5. Visit with ORIGINAL documents:\n   • Date of birth proof (Aadhaar/birth cert/10th cert)\n   • Address proof (Aadhaar/voter ID/utility bill)\n6. Biometrics captured at PSK\n7. Police verification (30–45 days for Normal)\n8. Passport dispatched by Speed Post\n\n⚡ Tatkal: Urgent travel — Rs. 2,000 extra, 3–7 days\n\n📞 Passport Helpline: 1800-258-1800",
    ta: "✈️ பாஸ்போர்ட் விண்ணப்பம்\n\n✅ படிகள்:\n1. passportindia.gov.in-ல் பதிவு செய்யவும்\n2. கட்டணம்: ரூ.1,500 (Normal) / ரூ.3,500 (Tatkal)\n3. PSK-ல் appointment முன்பதிவு செய்யவும்\n4. அசல் ஆவணங்களுடன் சென்று biometrics கொடுக்கவும்\n5. 30-45 நாட்களில் பாஸ்போர்ட் வரும்\n\n📞 Passport Helpline: 1800-258-1800"
  },
  {
    keywords: ["driving licence", "driving license", "dl", "learner licence", "rto", "vehicle registration", "licence renewal"],
    en: "🚗 Driving Licence — How to Get / Renew\n\n✅ Step by step:\n1. Apply for Learner's Licence at sarathi.parivahan.gov.in\n2. Take online theory test (traffic rules, signs)\n3. Hold Learner's Licence for minimum 30 days (display 'L' board)\n4. Apply for Permanent DL after 30 days\n5. Book driving test at RTO\n6. Pass practical test → DL issued in 7–30 days\n\n💰 Fees:\n• Learner's Licence: Rs. 150–200\n• Permanent DL: Rs. 200–300 per vehicle class\n• Renewal: Rs. 200–300\n\n⚡ Traffic Penalties (post 2019):\n• No licence: Rs. 5,000\n• Drunk driving: Rs. 10,000 + 6 months jail\n• No helmet: Rs. 1,000 + 3 months suspension\n\n📞 RTO: sarathi.parivahan.gov.in",
    ta: "🚗 ஓட்டுநர் உரிமம்\n\n✅ படிகள்: sarathi.parivahan.gov.in-ல் விண்ணப்பிக்கவும்\n• Learner's Licence → 30 நாட்கள் → Permanent DL\n• கட்டணம்: ரூ.150-300\n\nதண்டங்கள்:\n• உரிமம் இல்லாமல்: ரூ.5,000\n• குடி ஓட்டுதல்: ரூ.10,000 + 6 மாத சிறை"
  },
  {
    keywords: ["aadhaar", "aadhar", "uid", "uidai", "aadhaar update", "aadhaar correction", "aadhaar enrollment", "biometric"],
    en: "🆔 Aadhaar Card — Get / Update\n\n✅ Get new Aadhaar:\n1. Visit uidai.gov.in → find nearest enrollment centre\n2. Carry: any 1 identity proof + any 1 address proof\n3. Biometric capture (fingerprint + iris + photo)\n4. Acknowledgement receipt given\n5. Aadhaar generated within 90 days (usually 3–10 days)\n6. Download e-Aadhaar FREE at uidai.gov.in\n\n✅ Instant e-Aadhaar (if already enrolled):\n• Download anytime at uidai.gov.in → Download Aadhaar\n• Password: first 4 letters of name (CAPS) + birth year\n\n✅ Update address online: uidai.gov.in (FREE)\n✅ Update at ASK/CSC: Rs. 50\n\n📞 UIDAI Helpline: 1947 (free)",
    ta: "🆔 ஆதார் அட்டை\n\n✅ புதிய Aadhaar:\n• uidai.gov.in-ல் enrollment centre கண்டறியவும்\n• இலவசமாக பதிவு செய்யலாம்\n• e-Aadhaar download: uidai.gov.in (இலவசம்)\n\n📞 UIDAI Helpline: 1947"
  },
  {
    keywords: ["pan card", "permanent account number", "pan apply", "pan correction", "pan link aadhaar", "income tax pan"],
    en: "💳 PAN Card — Get / Correct\n\n✅ Fastest way — Instant e-PAN (FREE):\n1. Visit incometax.gov.in → 'Instant e-PAN'\n2. Enter Aadhaar number\n3. OTP verification\n4. PAN allotted instantly! Download PDF\n\n✅ Physical PAN Card (Rs. 107):\n• Apply at onlineservices.nsdl.com or utiitsl.com\n• Physical card delivered in 15–20 days\n\n⚠️ PAN-Aadhaar linking is mandatory:\n• Link at incometax.gov.in → 'Link Aadhaar'\n• Unlinked PAN becomes inoperative\n\n📞 Income Tax: 1800-103-0025",
    ta: "💳 PAN அட்டை\n\n✅ Instant e-PAN (இலவசம்):\n• incometax.gov.in → 'Instant e-PAN'\n• Aadhaar எண் கொடுக்கவும், OTP verify செய்யவும்\n• உடனே PAN கிடைக்கும்!\n\n📞 Income Tax: 1800-103-0025"
  },
  {
    keywords: ["voter id", "voter card", "epic", "voter registration", "voting", "electoral roll", "election card", "vote"],
    en: "🗳️ Voter ID (EPIC) — Register / Update\n\n✅ Check if already registered:\n• electoralsearch.eci.gov.in\n• Search by name/EPIC number\n\n✅ New registration:\n1. Visit voterportal.eci.gov.in\n2. Click 'New Registration' (Form 6)\n3. Enter Aadhaar, upload age + address proof\n4. BLO verifies, name added to roll\n5. Download digital EPIC or get physical card\n\n✅ You can now register 4 times a year:\n• 18th birthday: January 1, April 1, July 1, or October 1\n\n✅ Transfer to new area: Form 8 at voterportal.eci.gov.in\n\n📞 Voter Helpline: 1950",
    ta: "🗳️ வாக்காளர் அடையாள அட்டை\n\n✅ புதிய பதிவு:\n• voterportal.eci.gov.in → New Registration (Form 6)\n• Aadhaar, வயது, முகவரி சான்று கொடுக்கவும்\n\n📞 வாக்காளர் ஹெல்ப்லைன்: 1950"
  },
  {
    keywords: ["ayushman", "pmjay", "health insurance", "health cover", "free hospital", "health card", "jan arogya", "free treatment"],
    en: "🏥 Ayushman Bharat PM-JAY — Free Health Coverage\n\n✅ Coverage:\n• Rs. 5 lakh per family per year\n• 1,929 procedures covered (cancer, heart, dialysis, knee replacement, delivery...)\n• Cashless at any empanelled hospital (govt or private)\n• Pre-existing diseases covered from Day 1\n\n✅ Check eligibility:\n1. Visit pmjay.gov.in → 'Am I Eligible'\n2. Or call 14555 (toll-free)\n\n✅ Get Ayushman Card:\n• Visit CSC, govt hospital, or empanelled private hospital\n• Aadhaar-based e-KYC\n• Card issued instantly\n\n✅ Senior citizens above 70: Additional Rs. 5 lakh (new 2024)\n\n📞 PM-JAY Helpline: 14555",
    ta: "🏥 ஆயுஷ்மான் பாரத் PM-JAY — இலவச சுகாதார காப்பு\n\n✅ குடும்பத்திற்கு ஆண்டுக்கு ரூ.5 லட்சம் காப்பு\n• 1,929 சிகிச்சைகள் உள்ளடக்கம்\n• அட்டை வாங்க: pmjay.gov.in அல்லது CSC செல்லவும்\n\n📞 PM-JAY: 14555"
  },
  {
    keywords: ["pm kisan", "farmer scheme", "kisan samman", "agricultural scheme", "farmer money", "kisan installment"],
    en: "🌾 PM-KISAN — Farmer Income Support\n\n✅ Benefit: Rs. 6,000/year in 3 installments of Rs. 2,000 each (directly to bank account)\n\n✅ Who qualifies: Any landholding farmer family who does NOT have:\n• Income tax payer in family\n• Government employee\n• Professional (doctor, lawyer, CA)\n\n✅ Check eligibility & status:\n• pmkisan.gov.in → Farmers Corner → Beneficiary Status\n• Enter Aadhaar or mobile number\n\n✅ Register:\n• pmkisan.gov.in → New Farmer Registration\n• OR visit nearest CSC with Aadhaar + land records + bank passbook\n\n✅ Not receiving installment? Likely reasons:\n• Aadhaar-bank account mismatch → link Aadhaar to bank\n• Wrong IFSC code → update via CSC\n\n📞 PM-KISAN Helpline: 155261",
    ta: "🌾 PM-KISAN — விவசாயி வருமான ஆதரவு\n\n✅ ஆண்டுக்கு ரூ.6,000 (3 தவணைகளில்) நேரடியாக வங்கி கணக்கில்\n• pmkisan.gov.in → New Farmer Registration\n• CSC-யில் Aadhaar + நில ஆவணங்களுடன் பதிவு செய்யவும்\n\n📞 PM-KISAN: 155261"
  },
  {
    keywords: ["housing scheme", "pm awas", "house loan", "affordable house", "home subsidy", "credit linked subsidy", "clss", "pmay"],
    en: "🏠 PM Awas Yojana — Housing for All\n\n✅ Credit Linked Subsidy Scheme (CLSS — most popular):\n• EWS (income up to Rs. 3 lakh): 6.5% interest subsidy → save Rs. 2.67 lakh\n• LIG (Rs. 3–6 lakh): Same 6.5% subsidy\n• MIG-I (Rs. 6–12 lakh): 4% subsidy → save Rs. 2.35 lakh\n• MIG-II (Rs. 12–18 lakh): 3% subsidy\n\n✅ Who qualifies:\n• First-time homebuyer (no pucca house anywhere)\n• Within income limit\n• Women applicant/co-applicant (EWS/LIG — mandatory)\n\n✅ How to apply:\n1. Apply for home loan at any bank/HFC\n2. Tell them you want PMAY-CLSS subsidy\n3. Bank claims subsidy — credited to loan account\n\n📞 PMAY Helpline: 1800-11-3388",
    ta: "🏠 PM Awas Yojana — வீட்டு திட்டம்\n\n✅ CLSS subsidy:\n• EWS/LIG: 6.5% வட்டி சலுகை (ரூ.2.67 லட்சம் வரை சேமிப்பு)\n• எந்த வங்கியிலும் home loan எடுக்கும்போது PMAY-CLSS என்று சொல்லவும்\n\n📞 PMAY: 1800-11-3388"
  },
  {
    keywords: ["nrega", "mgnrega", "100 days work", "job card", "rural employment", "government work", "manual work scheme"],
    en: "⛏️ MGNREGA — 100 Days Guaranteed Employment\n\n✅ Your rights:\n• 100 days of employment per year (per household)\n• Work within 5 km of home\n• Work within 15 days of applying OR receive unemployment allowance\n• Wage paid within 15 days via bank/post office\n\n✅ How to start:\n1. Get Job Card from Gram Panchayat (FREE, your right)\n2. Apply in writing to GP for work\n3. GP must start work within 15 days\n4. Check attendance & payment at nrega.nic.in\n\n⚡ Report corruption:\n• Fake muster rolls, ghost workers → Social Audit\n• Online complaint: nrega.nic.in\n• Helpline: 1800-111-249\n\n📞 NREGA Helpline: 1800-111-249",
    ta: "⛏️ MGNREGA — 100 நாள் வேலை உத்தரவாதம்\n\n✅ குடும்பத்திற்கு 100 நாட்கள் வேலை\n• ஊர் பஞ்சாயத்தில் Job Card (இலவசம்) பெறவும்\n• 15 நாட்களில் வேலை வழங்கப்பட வேண்டும்\n\n📞 NREGA: 1800-111-249"
  },
  {
    keywords: ["scholarship", "student benefit", "nsp", "national scholarship", "education loan", "free education", "school fee"],
    en: "📚 Scholarships & Education Benefits\n\n✅ National Scholarship Portal (NSP):\n• scholarships.gov.in — 120+ scholarships in one place\n• SC/ST/OBC/Minority/Disabled/Merit scholarships available\n• Apply annually (deadline usually October–November)\n\n✅ Key scholarships:\n• Post-Matric SC scholarship: Full tuition + Rs. 1,200–2,000/month\n• PM YASASVI (OBC/EBC): Rs. 75,000–1,25,000/year\n• Central Sector Merit: Rs. 10,000/year for top students\n• Minority scholarship: Rs. 500–1,000/month + tuition\n\n✅ Steps:\n1. Register at scholarships.gov.in\n2. Upload: caste cert, income cert, marksheet, Aadhaar\n3. Institute verifies → State approves → DBT to bank\n\n📞 NSP Helpline: 0120-6619540",
    ta: "📚 கல்வி உதவித்தொகை\n\n✅ scholarships.gov.in-ல் 120+ உதவித்தொகைகள்\n• SC/ST/OBC/சிறுபான்மை மாணவர்களுக்கு\n• Aadhaar + சாதி/வருமான சான்று + மதிப்பெண் பட்டியல் கொண்டு விண்ணப்பிக்கவும்\n\n📞 NSP: 0120-6619540"
  },
  {
    keywords: ["rera", "builder", "flat", "apartment", "possession delay", "builder fraud", "real estate complaint", "home buyer"],
    en: "🏗️ RERA — Protection for Home Buyers\n\n✅ Your rights under RERA:\n• Builder must deliver on time or pay interest (SBI MCLR + 2%)\n• Sell only on carpet area (no super built-up inflation)\n• 5-year structural defect warranty\n• Full refund + interest if you want to withdraw from a delayed project\n• All approvals/plans must be uploaded on RERA portal\n\n✅ How to file RERA complaint:\n1. Tamil Nadu: tnrera.in → Register → File Complaint\n2. Fee: approximately Rs. 5,000–10,000\n3. RERA must decide within 60 days\n\n⚡ Before buying:\n• Verify RERA registration at tnrera.in\n• Never pay without RERA number on agreement\n\n📞 Tamil Nadu RERA: 044-28592991",
    ta: "🏗️ RERA — வீட்டு வாங்குபவர்களுக்கு பாதுகாப்பு\n\n✅ Builder தாமதப்படுத்தினால்:\n• வட்டியுடன் பணம் திரும்பப் பெறலாம்\n• புகார்: tnrera.in\n• கட்டணம்: சுமார் ரூ.5,000\n\n📞 TN RERA: 044-28592991"
  },
  {
    keywords: ["sc st atrocity", "caste discrimination", "untouchability", "dalit harassment", "sc st complaint", "atrocity act", "caste abuse"],
    en: "⚖️ SC/ST Atrocities Act — Protection for Scheduled Communities\n\nThe SC/ST (Prevention of Atrocities) Act 1989 provides strict punishment for caste-based crimes.\n\n✅ Your rights:\n• Police MUST register FIR within 24 hours — no refusal allowed\n• Immediate interim relief: travel, food, clothing, Rs. 2–8.25 lakh compensation\n• Special courts for speedy trial\n• 25% of full compensation paid as interim before trial\n\n✅ What to do:\n1. Complain to police — they cannot refuse\n2. If refused: approach DSP/SP or send to Magistrate (Section 156(3))\n3. Contact SC/ST Welfare Officer at District Collectorate\n4. National Commission for SCs: ncsc.nic.in | 011-23378608\n\n📞 NHRC: 14433 | SC Commission: 011-23378608",
    ta: "⚖️ SC/ST அக்கிரம தடுப்புச் சட்டம் 1989\n\n✅ FIR 24 மணி நேரத்தில் பதிவு செய்யப்பட வேண்டும்\n• DSP/SP-யிடம் நேரடியாக புகார் செய்யலாம்\n• நேர் நிவாரணம்: பயண பத்தி, உணவு, மருத்துவம்\n\n📞 NHRC: 14433"
  },
  {
    keywords: ["income tax", "tax return", "itr", "tax filing", "tax refund", "tax deduction", "80c", "tds", "tax saving"],
    en: "💼 Income Tax — Filing & Saving Tax\n\n✅ File ITR at incometax.gov.in\n• Deadline: July 31 each year\n• Form 26AS / AIS shows all your income & TDS\n• Use ITR-1 (Sahaj) for salaried income\n\n✅ Major tax deductions:\n• 80C: Up to Rs. 1.5 lakh (EPF, PPF, ELSS, NSC, LIC, home loan principal)\n• 80D: Up to Rs. 25,000 health insurance\n• 24B: Home loan interest up to Rs. 2 lakh\n• Standard deduction: Rs. 50,000 (old) / Rs. 75,000 (new regime)\n\n✅ New vs Old regime:\n• New regime: Better if deductions are less than Rs. 3.5 lakh\n• Old regime: Better with more deductions\n\n✅ Late filing penalty: Rs. 1,000–5,000\n\n📞 Income Tax Helpline: 1800-103-0025",
    ta: "💼 வருமான வரி\n\n✅ incometax.gov.in-ல் ITR பதிவு செய்யவும்\n• Due date: July 31\n• 80C: ரூ.1.5 லட்சம் வரை சேமிப்பு\n• புதிய regime vs பழைய regime calculator-ல் ஒப்பிடவும்\n\n📞 Income Tax: 1800-103-0025"
  },
  {
    keywords: ["fir", "police complaint", "complaint to police", "police refuses", "file complaint", "police station", "register case", "first information report"],
    en: "🚔 Police Complaint / Filing FIR\n\n✅ Your rights:\n• Police CANNOT refuse to register FIR for cognizable offences (robbery, assault, fraud, SC/ST atrocities, rape, etc.)\n• You get FREE copy of FIR immediately\n• If police refuse:\n  1. Send written complaint to SP by Registered Post\n  2. File Section 156(3) complaint before Judicial Magistrate\n  3. Approach NHRC/State Human Rights Commission\n\n✅ Online FIR (Tamil Nadu):\n• eservices.tn.gov.in or TN Police App\n• For cyber crime: cybercrime.gov.in\n\n✅ After FIR:\n• Police must investigate and file chargesheet within 60/90 days\n• Track case status with FIR number\n\n📞 Police Emergency: 112 | Complaint against police: 1800-200-1232",
    ta: "🚔 காவல் நிலைய புகார் / FIR\n\n✅ FIR-ஐ காவல் நிலையம் மறுக்க முடியாது\n• மறுத்தால்: SP-யிடம் பதிவு கடிதம் அனுப்பவும்\n• அல்லது நீதிபதியிடம் Section 156(3) கீழ் புகார் செய்யவும்\n\n📞 காவல் அவசரம்: 112"
  },
  {
    keywords: ["dowry", "dowry harassment", "498a", "streedhan", "dowry complaint", "dowry demand"],
    en: "⚖️ Dowry — Your Rights\n\nDowry Prohibition Act 1961 makes giving or taking dowry a criminal offence.\n\n✅ Sections you can use:\n• Section 498A IPC/BNS: Cruelty by husband and relatives (3 years imprisonment)\n• Dowry Prohibition Act: 5 years imprisonment + Rs. 15,000 fine\n• PWDVA 2005: Protection Order + residence + maintenance\n\n✅ What to do:\n1. Call Women Helpline: 181\n2. File FIR at police station\n3. Approach Protection Officer (PWDVA)\n4. File complaint with NCW: ncw.nic.in\n\n✅ Streedhan (gifts to bride) belongs to the wife — husband/in-laws taking it = Section 406 IPC (criminal breach of trust)\n\n📞 Women Helpline: 181 | NCW: 011-26942369",
    ta: "⚖️ வரதட்சணை — உங்கள் உரிமைகள்\n\n✅ வரதட்சணை கேட்பது/கொடுப்பது குற்றம்\n• 498A IPC: கணவன் / உறவினர் கொடுமை — 3 ஆண்டு சிறை\n• Women Helpline: 181\n• NCW: 011-26942369"
  },
  {
    keywords: ["ration card", "pds", "ration shop", "food security", "pds complaint", "ration grain", "public distribution"],
    en: "🛒 Ration Card / PDS — Rights and Complaints\n\n✅ Your entitlements under NFSA:\n• AAY families: 35 kg of grain per month at Rs. 1–3/kg\n• Priority Household: 5 kg per person per month at Rs. 1–3/kg\n• PM Garib Kalyan: Free grain scheme (check current status)\n\n✅ Apply for Ration Card:\n• Tamil Nadu: tnpds.gov.in\n• Documents: Aadhaar of all family members, address proof, family photo\n\n✅ Report PDS corruption (short weight, black market, denial of grain):\n1. Complaint to District Supply Officer\n2. Call PDS helpline: 1967 (TNPDS)\n3. File on pgportal.gov.in\n\n📞 TNPDS Helpline: 1967",
    ta: "🛒 பொது விநியோக முறை (PDS)\n\n✅ உங்கள் பங்கு:\n• AAY குடும்பம்: மாதம் 35 கிலோ தானியம்\n• Priority குடும்பம்: ஒருவருக்கு 5 கிலோ\n• tnpds.gov.in-ல் ration card விண்ணப்பிக்கவும்\n\n📞 TNPDS: 1967"
  },
  {
    keywords: ["legal aid", "free lawyer", "dlsa", "legal services", "cannot afford lawyer", "free legal help"],
    en: "⚖️ Free Legal Aid — Your Right\n\nArticle 39A of the Constitution guarantees free legal aid. It's available through Legal Services Authorities.\n\n✅ Who is eligible:\n• Income below Rs. 1 lakh per year\n• Women in any case\n• SC/ST members\n• Victims of disaster, violence, trafficking\n• Children\n• Persons in custody\n• Persons with disability\n\n✅ How to get help:\n1. Call NALSA: 15100 (free, 24x7)\n2. Visit District Legal Services Authority (DLSA) — present in every district court\n3. Lok Adalat: Free settlement forum (no appeal needed, court fee refunded)\n\n📞 Legal Aid Helpline: 15100 | NALSA: nalsa.gov.in",
    ta: "⚖️ இலவச சட்ட உதவி\n\n✅ தகுதி: வருடாந்தர வருமானம் ரூ.1 லட்சம் கீழ், பெண்கள், SC/ST, குழந்தைகள்\n• DLSA-வை (District Legal Services Authority) தொடர்பு கொள்ளவும்\n\n📞 NALSA: 15100"
  },
  {
    keywords: ["mental health", "depression", "anxiety", "suicide", "counselling", "psychology", "helpline", "mental illness"],
    en: "💙 Mental Health — Help is Available\n\n✅ Important: Attempting suicide is NOT a crime in India (Mental Healthcare Act 2017)\n\n✅ Immediate help:\n• iCall (TISS): 9152987821 — Mon–Sat, 8am–10pm\n• Vandrevala Foundation: 1860-2662-345 (24x7)\n• Snehi: 044-24640050 (Tamil Nadu)\n• NIMHANS: 080-46110007\n\n✅ Your rights under Mental Healthcare Act 2017:\n• Right to free mental healthcare at government hospitals\n• Right to confidentiality\n• Right to advance directive\n• Protection from physical restraint and inhuman treatment\n\n✅ Government hospitals with free psychiatry OPD:\n• All district government hospitals in Tamil Nadu\n• NIMHANS, Bengaluru (national referral centre)\n\n📞 iCall: 9152987821 | Emergency: 112",
    ta: "💙 மனநல ஆரோக்கியம்\n\n✅ தற்கொலை முயற்சி இப்போது குற்றம் இல்லை (2017 சட்டம்)\n\n✅ உதவி:\n• iCall: 9152987821\n• Snehi (TN): 044-24640050\n• Vandrevala: 1860-2662-345"
  },
  {
    keywords: ["environment", "pollution", "noise pollution", "factory pollution", "water pollution", "air pollution", "dumping garbage", "ngt"],
    en: "🌿 Environmental Complaints\n\n✅ Where to complain:\n1. Tamil Nadu Pollution Control Board (TNPCB): tnpcb.gov.in\n2. National Green Tribunal: ngt.gov.in (no court fee for individuals!)\n3. District Collector's office for land/noise issues\n4. CPCB Helpline: 1800-11-4000\n\n✅ What you can report:\n• Factory releasing smoke or untreated effluents\n• Noise above permissible limits (55 dB residential day)\n• Illegal dumping of waste\n• Cutting of trees without permission\n• Open burning of garbage\n\n✅ File PIL:\n• No fee for environmental PIL in High Court or Supreme Court\n• NGT: more accessible, specialized, faster than courts\n\n📞 CPCB: 1800-11-4000 | TNPCB: tnpcb.gov.in",
    ta: "🌿 சுற்றுச்சூழல் புகார்\n\n✅ புகார் செய்யும் இடங்கள்:\n• TNPCB: tnpcb.gov.in\n• NGT: ngt.gov.in (தனி நபர்களுக்கு கட்டணம் இல்லை!)\n\n📞 CPCB: 1800-11-4000"
  },
  {
    keywords: ["pm jan dhan", "bank account", "zero balance", "jan dhan", "banking", "no bank account"],
    en: "🏦 PM Jan Dhan Yojana — Free Bank Account\n\n✅ Benefits:\n• Zero balance savings account at any bank\n• Free RuPay debit card\n• Rs. 2 lakh accident insurance (FREE)\n• Rs. 30,000 life insurance\n• Overdraft up to Rs. 10,000 (after 6 months)\n\n✅ How to open:\n• Visit any bank branch with Aadhaar\n• Aadhaar alone is sufficient for basic account\n• No minimum balance required\n\n📞 PMJDY Helpline: 1800-11-0001",
    ta: "🏦 PM Jan Dhan Yojana — இலவச வங்கி கணக்கு\n\n✅ zero balance கணக்கு, RuPay card, ரூ.2 லட்சம் விபத்து காப்பீடு\n• Aadhaar மட்டும் போதும், எந்த வங்கியிலும் திறக்கலாம்"
  },
];

function getAIResponse(message: string, language: "en" | "ta"): string {
  const lower = message.toLowerCase().trim();
  for (const entry of RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return language === "ta" ? entry.ta : entry.en;
    }
  }
  // Tamil greetings
  if (language === "ta" && (lower.includes("வணக்கம்") || lower.includes("நன்றி") || lower.includes("help") || lower.includes("உதவி"))) {
    return "வணக்கம்! CitizenHub-ல் உங்களை வரவேற்கிறோம். இந்த இயங்குதளம் இந்திய குடிமக்களுக்கு சட்டங்கள், திட்டங்கள், சேவைகள் பற்றி தெளிவான தகவல்களை வழங்குகிறது.\n\nநீங்கள் கேட்கலாம்:\n• ஆதார், PAN, பாஸ்போர்ட் விண்ணப்பம்\n• அயுஷ்மான் பாரத், PM-KISAN போன்ற திட்டங்கள்\n• நுகர்வோர் புகார், RTI, RERA\n• பெண்கள் உரிமைகள், தொழிலாளர் உரிமைகள்\n\nதொடர்ந்து கேட்கவும்! 🙏";
  }
  // English fallback
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("help") || lower.includes("good")) {
    return "Hello! Welcome to CitizenHub — India's civic information platform.\n\nI can help you with:\n• 📋 RTI (Right to Information) — how to file\n• 🏥 Government schemes (Ayushman Bharat, PM-KISAN, housing)\n• 🛒 Consumer complaints & rights\n• 🚨 Cyber fraud — immediate steps\n• ⚖️ Legal rights (labour, women, SC/ST, property)\n• 🆔 Documents (Aadhaar, PAN, Passport, Voter ID)\n\nAsk me anything about your rights or government services!";
  }
  return language === "ta"
    ? "நன்றி உங்கள் கேள்விக்கு. இந்த தலைப்பில் சரியான தகவல் வழங்க, கொஞ்சம் விரிவாக கேட்டால் உதவியாக இருக்கும். உதாரணமாக: 'ஆதார் திருத்தம் செய்வது எப்படி', 'நுகர்வோர் புகார் எப்படி போடுவது', 'PM-KISAN பதிவு செய்வது எப்படி' என்று கேளுங்கள்.\n\n📞 நேரடி உதவிக்கு:\n• பெண்கள் உதவி: 181\n• இணைய குற்றம்: 1930\n• நுகர்வோர்: 1915\n• சட்ட உதவி: 15100\n• அவசரநிலை: 112"
    : "Thank you for your question! I can provide detailed help on:\n\n• 📋 RTI — file information requests from government\n• 🏥 Ayushman Bharat, PM-KISAN, PMAY and all major schemes\n• 🛒 Consumer complaints — how to file and get refund\n• 🚨 Cyber fraud — call 1930 immediately\n• ⚖️ Legal rights — labour, women, SC/ST, property, RERA\n• 🆔 Aadhaar, PAN, Passport, Voter ID procedures\n\nTry asking something specific like:\n• 'How to apply for Ayushman Bharat card?'\n• 'My builder is delaying possession — what can I do?'\n• 'Employer not paying PF — how to complain?'\n\n📞 Key helplines: Women: 181 | Cyber Crime: 1930 | Consumer: 1915 | Legal Aid: 15100 | Emergency: 112";
}

function toIsoString(val: any): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') return new Date(val).toISOString();
  return new Date(val).toISOString();
}

router.get("/chat/messages", async (_req, res): Promise<void> => {
  const rows = await db.select().from(chatMessagesTable).orderBy(desc(chatMessagesTable.createdAt)).limit(50);
  res.json(ListChatMessagesResponse.parse(rows.map((r) => ({ ...r, createdAt: toIsoString(r.createdAt) }))));
});

router.post("/chat/messages", async (req, res): Promise<void> => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.insert(chatMessagesTable).values({
    role: "user",
    content: parsed.data.content,
    language: parsed.data.language ?? "en",
  });

  const lang = (parsed.data.language ?? "en") as "en" | "ta";
  const aiContent = getAIResponse(parsed.data.content, lang);
  const [aiMsg] = await db.insert(chatMessagesTable).values({
    role: "assistant",
    content: aiContent,
    language: lang,
  }).returning();

  res.status(201).json({ ...aiMsg, createdAt: toIsoString(aiMsg.createdAt) });
});

router.get("/chat/suggested-questions", async (_req, res): Promise<void> => {
  const rows = await db.select().from(suggestedQuestionsTable).limit(8);
  res.json(ListSuggestedQuestionsResponse.parse(rows.map((r) => ({ ...r }))));
});

export default router;
