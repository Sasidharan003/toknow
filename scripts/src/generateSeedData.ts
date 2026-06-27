import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_TS_PATH = path.resolve(__dirname, "../../lib/db/src/seedData.ts");
const DB_JSON_PATH = path.resolve(__dirname, "../../db.json");

// 1. Existing 5 Services + 9 New Services = 14 Services
const SERVICES = [
  {
    id: 1,
    title: "Aadhaar Card",
    category: "Identity",
    overview: "Aadhaar is a 12-digit unique identification number issued by the Unique Identification Authority of India (UIDAI). It serves as proof of identity and address across India.",
    eligibility: "Any resident of India (including infants).",
    requiredDocuments: "• Proof of Identity (Passport, PAN Card, Voter ID)\n• Proof of Address (Ration Card, Utility Bill, Bank statement)",
    fees: "• New Enrollment: FREE\n• Demographic Update (Name/Address): Rs. 50\n• Biometric Update: Rs. 100",
    processingTime: "New enrollment: Up to 90 days (usually much faster - 3-10 days) Address update: 30 days Biometric update: 30 days e-Aadhaar download: Available as soon as generation is complete",
    applicationProcess: "1. Locate nearest Aadhaar Seva Kendra at uidai.gov.in.\n2. Book an online appointment or walk in.\n3. Submit identity and address proofs.\n4. Provide biometric details (fingerprints, iris scan, photo).\n5. Keep the acknowledgement receipt with the Enrollment ID to download e-Aadhaar.",
    officialUrl: "https://uidai.gov.in",
    icon: "User"
  },
  {
    id: 2,
    title: "Passport",
    category: "Travel",
    overview: "An Indian Passport is the most powerful travel document issued by the Ministry of External Affairs for travel, business, or education abroad via Passport Seva Kendras (PSK).",
    eligibility: "Indian Citizens.",
    requiredDocuments: "• Birth Proof (Birth Certificate, Aadhaar, 10th marksheet)\n• Address Proof (Aadhaar, Voter ID, Bank passbook, Gas bill)",
    fees: "• Normal Application (36 pages): Rs. 1,500\n• Tatkal Application (Urgent): Rs. 3,500",
    processingTime: "NORMAL: 30-45 working days (including police verification) TATKAL: 3-7 working days if pre-verification submitted; police verification post-issuance Once dispatched: 2-5 days via Speed Post delivery",
    applicationProcess: "1. Register on passportindia.gov.in.\n2. Fill out the application form online.\n3. Pay the fee and schedule an appointment at the nearest PSK.\n4. Visit the PSK with original documents for verification and biometric capture.\n5. Complete police verification when visited by the local officer.\n6. The passport is delivered via Speed Post.",
    officialUrl: "https://passportindia.gov.in",
    icon: "Landmark"
  },
  {
    id: 3,
    title: "PAN Card",
    category: "Tax",
    overview: "Permanent Account Number (PAN) is a 10-character alphanumeric identifier issued by the Income Tax Department to track financial transactions, mandatory for tax filing, opening bank accounts, and high-value transactions.",
    eligibility: "Any Indian citizen, non-resident Indian (NRI), or corporate entity.",
    requiredDocuments: "• Proof of Identity (Aadhaar Card, Voter ID, Passport)\n• Proof of Address (Aadhaar Card, Utility Bills, Bank passbook)\n• Proof of Date of Birth (Aadhaar Card, Matriculation certificate)",
    fees: "• Physical PAN Card (delivered inside India): Rs. 110\n• e-PAN Card (digital-only copy): FREE",
    processingTime: "e-PAN (instant): Within minutes to a few hours Physical PAN card: 15-20 working days after document verification",
    applicationProcess: "1. For instant e-PAN, visit the Income Tax e-filing portal (incometax.gov.in) and click 'Instant e-PAN'.\n2. Enter your Aadhaar number and verify with the Aadhaar-linked OTP.\n3. The system pulls your details and photo from UIDAI and generates the digital e-PAN instantly.\n4. For physical cards, apply via NSDL (tin-nsdl.com) or UTITSL portals, fill Form 49A, pay the fee, and upload documents.",
    officialUrl: "https://www.incometax.gov.in",
    icon: "FileText"
  },
  {
    id: 4,
    title: "Voter ID (EPIC Card)",
    category: "Civil",
    overview: "Electoral Photo Identity Card (EPIC) issued by the Election Commission of India (ECI) to eligible citizens, serving as official proof of identity and enabling voting in democratic elections.",
    eligibility: "Indian citizens who are 18 years or older as of January 1st of the qualifying year.",
    requiredDocuments: "• Proof of Age (Birth Certificate, Aadhaar Card, 10th marksheet)\n• Proof of Address (Ration card, utility bill, rent agreement, bank passbook)\n• Two passport-sized color photographs",
    fees: "Free of cost (for new enrollment, corrections, and digital voter ID downloads).",
    processingTime: "Processing: 15-30 days. e-EPIC can be downloaded instantly once approved.",
    applicationProcess: "1. Visit the voters' service portal (voters.eci.gov.in) or download the Voter Helpline App.\n2. Click 'Register as a New Elector' (Form 6).\n3. Upload age and address proofs along with a passport-sized photograph.\n4. A Booth Level Officer (BLO) will visit your address for verification.\n5. Once verified, the voter card is issued, and the physical card is sent via post. e-EPIC can be downloaded online.",
    officialUrl: "https://voters.eci.gov.in",
    icon: "User"
  },
  {
    id: 5,
    title: "Driving Licence",
    category: "Transport",
    overview: "A Driving Licence (DL) is an official document issued by regional transport offices (RTO) authorizing citizens to drive motor vehicles on public roads in India.",
    eligibility: "Min 16 years (for gearless motorcycles up to 50cc) or 18 years (for geared motorcycles and light motor vehicles).",
    requiredDocuments: "• Age Proof (Aadhaar Card, Birth Certificate, School certificate)\n• Address Proof (Aadhaar Card, Ration card, passport, bank passbook)\n• Learner's Licence (for permanent DL application)\n• Medical Certificate Form 1A (mandatory for candidates above 40 years)",
    fees: "• Learner's Licence test: Rs. 150\n• Permanent Driving Licence test: Rs. 300\n• DL Card issuing charges: Rs. 200",
    processingTime: "Learner's Licence: Same day (if test cleared) Permanent DL: 7-30 working days after driving test Renewal: 7-14 working days Duplicate: 7-14 working days",
    applicationProcess: "1. Visit the Sarathi Parivahan portal (sarathi.parivahan.gov.in) and select your state.\n2. Click 'Apply for Learner Licence', fill details, upload documents, and book a slot for the online computer test.\n3. Clear the test on traffic rules to get the Learner's Licence.\n4. After 30 days (and within 6 months), apply for 'Permanent Driving Licence', book a slot for the practical driving test at the RTO.\n5. Pass the practical driving test to receive the physical DL.",
    officialUrl: "https://sarathi.parivahan.gov.in",
    icon: "Landmark"
  },
  {
    id: 6,
    title: "Arms Licence",
    category: "Legal",
    overview: "Licence to possess and carry firearms, issued by District Collector based on threat perception and valid reason.",
    eligibility: "Indian citizen, minimum 21 years of age, clean criminal record, sound mind, and proven threat perception.",
    requiredDocuments: "• Address Proof (Aadhaar, utility bills)\n• Identity Proof (Voter ID, PAN)\n• Medical Fitness Certificate (Physical & Mental Fitness)\n• Proof of Threat Perception (e.g. business size, police reports)\n• Safe Storage Declaration",
    fees: "Rs. 1,000 - Rs. 5,000 depending on weapon class",
    processingTime: "6 months to 1 year (police verification mandatory)",
    applicationProcess: "1. Apply online via NDAL-ALIS portal or submit form at District Collector's office.\n2. Upload/submit identity, address, and medical fitness certificates.\n3. Police conduct a detailed background check, interviewing neighbors and checking criminal records.\n4. Collector reviews report, conducts personal interview, and issues the licence.",
    officialUrl: "https://ndal-alis.gov.in",
    icon: "Shield"
  },
  {
    id: 7,
    title: "Birth Certificate",
    category: "Civil",
    overview: "Official document certifying birth, issued by municipal corporation or panchayat, required for school admission, passport, and other government services.",
    eligibility: "Any child born in India (application must be filed within 21 days of birth by parents or hospital representative).",
    requiredDocuments: "• Discharge certificate from hospital\n• Aadhaar Cards of parents\n• Address Proof of birth place",
    fees: "FREE if registered within 21 days; nominal late fee after 21 days",
    processingTime: "7-14 days",
    applicationProcess: "1. Obtain birth registration form from hospital or download from State Civil Registration portal.\n2. Submit details to local Registrar of Births and Deaths (Panchayat/Municipality).\n3. Registrar verifies records against hospital data.\n4. Certificate is generated and sent via email/download or physical pickup.",
    officialUrl: "https://crsorgi.gov.in",
    icon: "FileText"
  },
  {
    id: 8,
    title: "Caste Certificate",
    category: "Civil",
    overview: "Official certificate recognizing SC/ST/OBC status, required for reservations in education and government jobs.",
    eligibility: "Indian citizens belonging to Scheduled Castes, Scheduled Tribes, or Other Backward Classes.",
    requiredDocuments: "• Identity Proof (Aadhaar, Voter ID)\n• Address Proof (Aadhaar, Land deeds)\n• Father's Caste Certificate or Community Certificate of relative\n• Affidavit declaring caste status",
    fees: "Nominal fee of Rs. 15 - Rs. 60 through e-Sevai / CSC",
    processingTime: "15-30 days",
    applicationProcess: "1. Apply online on State e-District portal or visit nearest Common Service Centre (CSC).\n2. Upload identity, address, and father's community certificate.\n3. Village Administrative Officer (VAO) and Revenue Inspector (RI) conduct physical verification.\n4. Tahsildar issues the community certificate upon approval.",
    officialUrl: "https://tn.gov.in",
    icon: "User"
  },
  {
    id: 9,
    title: "Death Certificate",
    category: "Civil",
    overview: "Official record of a person's death, required for property transfer, insurance claim, pension, and other legal matters.",
    eligibility: "Relative or representative of the deceased (must register within 21 days of death).",
    requiredDocuments: "• Hospital Death Report or doctor's certificate\n• Aadhaar Card of deceased and applicant\n• Cremation/Burial ground receipt",
    fees: "FREE if registered within 21 days; nominal late fee after 21 days",
    processingTime: "7-14 days",
    applicationProcess: "1. Obtain death report from hospital or registrar office.\n2. Submit the report along with deceased's ID proof to Registrar of Births and Deaths.\n3. Registrar records the entry in the national/state registry.\n4. Certificate is issued and can be downloaded online.",
    officialUrl: "https://crsorgi.gov.in",
    icon: "FileText"
  },
  {
    id: 10,
    title: "GST Registration",
    category: "Business",
    overview: "Mandatory tax registration for businesses with turnover above Rs. 40 lakh (Rs. 20 lakh for services and special category states).",
    eligibility: "Sole proprietors, partnerships, and companies meeting turnover thresholds or performing inter-state transactions.",
    requiredDocuments: "• PAN Card of business and owner\n• Aadhaar Card\n• Proof of business address (Electricity bill, Rent agreement)\n• Bank account statement / cancelled cheque\n• Partnership deed/Certificate of incorporation",
    fees: "FREE (no government fee)",
    processingTime: "3-7 working days",
    applicationProcess: "1. Go to GST Portal (gst.gov.in) and register as a new taxpayer.\n2. Enter PAN, mobile, and email to get a Temporary Reference Number (TRN).\n3. Log in with TRN and fill out business details, upload documents.\n4. Submit via Aadhaar OTP verification. Tax officer reviews and approves GSTIN.",
    officialUrl: "https://www.gst.gov.in",
    icon: "Briefcase"
  },
  {
    id: 11,
    title: "Income Certificate",
    category: "Civil",
    overview: "Certifies annual family income, required for scholarships, government schemes, and various civil concessions.",
    eligibility: "Any resident individual earning income.",
    requiredDocuments: "• Salary Slip / Form 16 (for employed)\n• Income declaration affidavit\n• Land ownership details or bank statements\n• Aadhaar Card and Address Proof",
    fees: "Rs. 60 via Common Service Centres (CSC)",
    processingTime: "7-15 days",
    applicationProcess: "1. Apply online via e-District portal or go to nearest CSC.\n2. Fill out family income details and upload supporting documents.\n3. Revenue officials conduct a local inquiry to verify income sources.\n4. Tahsildar signs and issues the digital Income Certificate.",
    officialUrl: "https://tn.gov.in",
    icon: "TrendingUp"
  },
  {
    id: 12,
    title: "Marriage Certificate",
    category: "Civil",
    overview: "Legal proof of marriage, required for visa applications, name change, insurance, and other marital legal rights.",
    eligibility: "Groom minimum 21 years old, Bride minimum 18 years old, marriage already performed or proposed under Special Marriage Act.",
    requiredDocuments: "• Age Proof of both (Birth certificate/Aadhaar/10th marksheet)\n• Address Proof of both\n• Marriage invitation card or temple receipt\n• Wedding photographs\n• 3 witnesses with identity proofs",
    fees: "Rs. 100 - Rs. 150 depending on marriage act",
    processingTime: "15-30 days",
    applicationProcess: "1. Register marriage details on State Sub-Registrar portal.\n2. Book an appointment slot at the Sub-Registrar Office.\n3. Visit the office with spouse and 3 witnesses along with original documents.\n4. Sub-Registrar verifies details and registers the marriage, issuing the certificate.",
    officialUrl: "https://tnreginet.gov.in",
    icon: "Heart"
  },
  {
    id: 13,
    title: "Ration Card",
    category: "Civil",
    overview: "Document identifying family as entitled to subsidized food grains through Public Distribution System (PDS) from ration shops.",
    eligibility: "Families living in the state, categorized by income (AAY, PHH, NPHH).",
    requiredDocuments: "• Aadhaar Cards of all family members\n• Address Proof (Rent agreement, utility bill)\n• Bank passbook of head of family (usually female)\n• Income certificate",
    fees: "Nominal fee of Rs. 10 - Rs. 50",
    processingTime: "30-60 days",
    applicationProcess: "1. Apply on State PDS portal (e.g. tnpds.gov.in for Tamil Nadu).\n2. Add family member details and link their Aadhaar cards.\n3. Revenue inspector visits the house for verification.\n4. Ration card is approved and can be downloaded or collected from the ration shop.",
    officialUrl: "https://www.tnpds.gov.in",
    icon: "ShoppingCart"
  },
  {
    id: 14,
    title: "Trade Licence",
    category: "Business",
    overview: "Permission granted by local municipal corporation to carry out specific commercial activities or business operations at a premises.",
    eligibility: "Business owners, shops, and commercial establishments operating within municipality limits.",
    requiredDocuments: "• Business establishment proof\n• Property tax receipt or rental agreement\n• NOC from Fire and Pollution departments (if applicable)\n• Identity and Address Proof of owner",
    fees: "Varies from Rs. 500 to Rs. 20,000 depending on trade category and business size",
    processingTime: "10-15 working days",
    applicationProcess: "1. Apply online on municipal portal or visit municipal office.\n2. Submit business details, trade category, and upload documents.\n3. Municipal health inspector conducts site inspection to ensure safety/hygiene.\n4. License is approved and issued upon payment of fees.",
    officialUrl: "https://tn.gov.in",
    icon: "Briefcase"
  }
];

// 2. Generating exactly 32 Laws with categories and matching counts from screenshots
const LAWS = [
  // Constitutional Rights (5)
  {
    id: 1,
    title: "Right to Information (RTI) Act, 2005",
    category: "Constitutional Rights",
    summary: "Empowers citizens to request information from public authorities, promoting transparency and accountability.",
    purpose: "To secure access to information under the control of public authorities, in order to promote transparency.",
    rights: "• Ask questions to public authorities.\n• Take copies of government documents.\n• Inspect government works and records.",
    responsibilities: "• State clearly what information is needed.\n• Pay the nominal Rs. 10 application fee.",
    penalties: "PIOs can be fined Rs. 250 per day up to a maximum of Rs. 25,000 for refusing to accept applications.",
    examples: "A citizen files an RTI to check the funds spent on road maintenance, exposing local expenditure.",
    faq: "Q: Who can ask for info?\nA: Any Indian citizen.\nQ: What is the reply timeline?\nA: 30 days.",
    references: "rtionline.gov.in",
    isFeatured: true,
    viewCount: 150
  },
  {
    id: 2,
    title: "Right to Education (RTE) Act, 2009",
    category: "Constitutional Rights",
    summary: "Guarantees free and compulsory education for all children aged 6 to 14 years in neighborhood schools.",
    purpose: "To provide for free and compulsory education to all children of the age of six to fourteen years.",
    rights: "• Free education in neighborhood schools.\n• 25% EWS reservation in private schools.",
    responsibilities: "• Parents must ensure attendance of children.\n• Authorities must identify dropouts.",
    penalties: "Schools screening children face a fine up to Rs. 25,000.",
    examples: "An EWS family secures a private school seat for their child with waived tuition.",
    faq: "Q: Is RTE free?\nA: Yes, covers tuition, books, and uniforms in government schools.",
    references: "dsel.education.gov.in",
    isFeatured: true,
    viewCount: 180
  },
  {
    id: 3,
    title: "Protection of Human Rights Act, 1993",
    category: "Constitutional Rights",
    summary: "Establishes the National Human Rights Commission (NHRC) and State level commissions to investigate abuses.",
    purpose: "To provide for the constitution of a NHRC, SHRCs, and Human Rights Courts.",
    rights: "• Right to life, liberty, equality, and dignity.\n• Direct petitioning to NHRC.",
    responsibilities: "• Respect others' human rights.\n• Report active human rights violations.",
    penalties: "Courts can order prosecution, award monetary relief, and recommend disciplinary action.",
    examples: "A citizen files a complaint of illegal police custody. NHRC orders Rs. 1 Lakh compensation.",
    faq: "Q: Can NHRC act on its own?\nA: Yes, via suo motu cognizance.",
    references: "nhrc.nic.in",
    isFeatured: true,
    viewCount: 155
  },
  {
    id: 4,
    title: "Freedom of Speech and Expression (Article 19)",
    category: "Constitutional Rights",
    summary: "Guarantees the right to express views and opinions freely, subject to reasonable restrictions.",
    purpose: "To protect individual liberty and democratic participation of citizens.",
    rights: "• Right to speak, write, and broadcast.\n• Freedom of press.",
    responsibilities: "• Avoid defamation or hate speech.\n• Maintain public order and decency.",
    penalties: "Defamation can lead to civil compensation or up to 2 years imprisonment under criminal codes.",
    examples: "A journalist publishes an investigative report criticizing a policy, protected under Article 19.",
    faq: "Q: Are there limits?\nA: Yes, national security, public order, and decency are reasonable restrictions.",
    references: "constitutionofindia.net",
    isFeatured: false,
    viewCount: 95
  },
  {
    id: 5,
    title: "Right to Equality (Article 14-18)",
    category: "Constitutional Rights",
    summary: "Ensures equality before the law and prohibits discrimination based on religion, race, caste, sex, or birth.",
    purpose: "To establish social justice and equal opportunity for all citizens.",
    rights: "• Equal protection of laws.\n• Prohibition of discrimination in public employment.\n• Abolition of untouchability.",
    responsibilities: "• Treat all citizens with equal respect.\n• Do not engage in discriminatory practices.",
    penalties: "Untouchability practice is a punishable offence under civil rights protection laws.",
    examples: "A public job posting welcomes all candidates without discriminating on religion or gender.",
    faq: "Q: Does it allow reservations?\nA: Yes, special provisions for backward classes and women are allowed under Article 15/16.",
    references: "lawmin.gov.in",
    isFeatured: false,
    viewCount: 88
  },
  // Consumer Rights (2)
  {
    id: 6,
    title: "Consumer Protection Act, 2019",
    category: "Consumer Rights",
    summary: "Guarantees six consumer rights, establishing consumer commissions to resolve complaints regarding products and services.",
    purpose: "To protect the interests of consumers by establishing effective settlement procedures.",
    rights: "• Right to Safety, Information, Choice, and to be Heard.\n• Seek Redressal against unfair trade.",
    responsibilities: "• Demand a bill/receipt.\n• File complaints only for genuine issues.",
    penalties: "Fines up to Rs. 10 Lakh for misleading advertisements.",
    examples: "A customer buys a defective phone, files on e-Daakhil, and gets a full refund.",
    faq: "Q: Is there a filing fee?\nA: Free up to Rs. 5 Lakh.",
    references: "edaakhil.nic.in",
    isFeatured: true,
    viewCount: 120
  },
  {
    id: 7,
    title: "Bureau of Indian Standards (BIS) Act, 2016",
    category: "Consumer Rights",
    summary: "Governs product quality certification, standards, and hallmark certification of gold/silver.",
    purpose: "To formulate standards and operate product quality certification schemes.",
    rights: "• Purchase certified quality products with ISI mark.\n• Right to compensation for substandard certified goods.",
    responsibilities: "• Look for ISI marks and gold hallmarks.\n• Report fake certification marks.",
    penalties: "Unlawful use of BIS standard mark leads to up to 2 years imprisonment or fine up to Rs. 2 Lakh.",
    examples: "A consumer reports an electrical store selling appliances with fake ISI mark, prompting a raid.",
    faq: "Q: What is gold hallmarking?\nA: Mandatory purity certification for gold jewelry.",
    references: "bis.gov.in",
    isFeatured: false,
    viewCount: 78
  },
  // Criminal Law (3)
  {
    id: 8,
    title: "Right to Bail & Arrest Rules (BNSS / CrPC)",
    category: "Criminal Law",
    summary: "Secures basic rights of arrested persons, including right to be informed of grounds and produced in court in 24 hours.",
    purpose: "To prevent arbitrary detention and safeguard personal liberty.",
    rights: "• Informed of arrest grounds and bail eligibility.\n• Consult a lawyer of choice.\n• Produced before a Magistrate within 24 hours.",
    responsibilities: "• Cooperate during arrest without violent resistance.\n• Disclose true name and address.",
    penalties: "Police officers failing to follow guidelines face disciplinary action and contempt of court.",
    examples: "An arrested citizen demands to see the warrant and informs their lawyer immediately.",
    faq: "Q: What is a bailable offence?\nA: An offence where bail is a matter of right (e.g. minor theft).",
    references: "mha.gov.in",
    isFeatured: false,
    viewCount: 110
  },
  {
    id: 9,
    title: "Right of Accused & Fair Trial (BNS / IPC)",
    category: "Criminal Law",
    summary: "Ensures the presumption of innocence, right against self-incrimination, and protection against double jeopardy.",
    purpose: "To maintain justice and protect individual rights in the criminal justice system.",
    rights: "• Presumed innocent until proven guilty.\n• Silence under interrogation (no self-incrimination).\n• No double prosecution for the same offence.",
    responsibilities: "• Attend court hearings as summoned.\n• Provide truthful evidence if testifying.",
    penalties: "Forced confessions are inadmissible in court.",
    examples: "A suspect refuses to sign a confession, which cannot be used as sole proof of guilt.",
    faq: "Q: What is double jeopardy?\nA: No person can be prosecuted and punished for the same offence twice.",
    references: "mha.gov.in",
    isFeatured: false,
    viewCount: 102
  },
  {
    id: 10,
    title: "Arms Act, 1959 (Weapon Licensing)",
    category: "Criminal Law",
    summary: "Regulates the acquisition, possession, manufacture, sale, and transport of arms and ammunition.",
    purpose: "To curb illegal weapons and regulate lawful possession of arms.",
    rights: "• Apply for weapon licence with proven threat perception.\n• Appeal against license refusal.",
    responsibilities: "• Safe storage of weapons.\n• Renew licence before expiry.",
    penalties: "Possessing unlicensed weapons leads to 7 to 14 years imprisonment.",
    examples: "A shopkeeper gets an arms licence for protection and registers the weapon with local RTO.",
    faq: "Q: Can anyone get a gun?\nA: No, require strict verification, threat proof, and mental health check.",
    references: "ndal-alis.gov.in",
    isFeatured: false,
    viewCount: 75
  },
  // Cyber Laws (2)
  {
    id: 11,
    title: "Information Technology (IT) Act, 2000",
    category: "Cyber Laws",
    summary: "Establishes the legal framework for cyber security, electronic transactions, and penalizes computer crimes.",
    purpose: "To provide legal recognition for electronic transactions and prevent cyber crimes.",
    rights: "• Protect digital data from corporate breach.\n• Report stalkers, hackers, and online frauds.",
    responsibilities: "• Practice cyber hygiene (protect OTPs, PINs).\n• Avoid posting offensive material.",
    penalties: "Cyber theft and fraud attract 3 to 7 years imprisonment.",
    examples: "A victim of UPI fraud reports on cybercrime.gov.in, freezing the scammer's wallet.",
    faq: "Q: What is the cyber helpline?\nA: Call 1930 immediately.",
    references: "cybercrime.gov.in",
    isFeatured: false,
    viewCount: 145
  },
  {
    id: 12,
    title: "Digital Personal Data Protection (DPDP) Act, 2023",
    category: "Cyber Laws",
    summary: "Regulates the processing of digital personal data, guaranteeing citizen privacy and consent rights.",
    purpose: "To protect individual privacy and set accountability guidelines for data processors.",
    rights: "• Access, correct, or erase personal data.\n• Withdraw consent at any time.\n• File complaints with Data Protection Board.",
    responsibilities: "• Provide authentic information.\n• Do not file false complaints.",
    penalties: "Fines up to Rs. 250 Crore on companies for failing to protect user data.",
    examples: "A user requests a food delivery app to delete their account and personal location history.",
    faq: "Q: What is a data principal?\nA: The individual whose data is collected (i.e. you).",
    references: "meity.gov.in",
    isFeatured: true,
    viewCount: 135
  },
  // Environmental Law (1)
  {
    id: 13,
    title: "National Green Tribunal (NGT) Act, 2010",
    category: "Environmental Law",
    summary: "Establishes NGT as a specialized environmental court for speedy disposal of cases relating to environmental protection.",
    purpose: "To provide effective disposal of cases relating to environment and forest conservation.",
    rights: "• Right to a clean environment (Article 21).\n• File environmental petitions with zero court fee.",
    responsibilities: "• Report active pollution (garbage burning, factory discharge).\n• Minimize plastic waste.",
    penalties: "NGT can order operational shutdowns and levy huge environmental cleanup fines.",
    examples: "Residents petition NGT against a factory dumping chemical waste into a local lake, leading to closure.",
    faq: "Q: Do I need a lawyer for NGT?\nA: No, you can represent yourself.",
    references: "ngt.gov.in",
    isFeatured: false,
    viewCount: 80
  },
  // Family Law (1)
  {
    id: 14,
    title: "Hindu & Special Marriage Acts (Marital Rights)",
    category: "Family Law",
    summary: "Governs marriage registration, divorce, alimony, and child custody rules for couples.",
    purpose: "To codify personal laws and provide legal protections for spouses.",
    rights: "• Right to register marriage and claim legal status.\n• Claim maintenance and alimony during separation.\n• Equal rights to child custody.",
    responsibilities: "• Register marriage within local limits.\n• Provide mutual support and child welfare.",
    penalties: "Failing to pay court-ordered alimony can lead to arrest and asset attachment.",
    examples: "A separated spouse files for monthly maintenance for child education, granted by family court.",
    faq: "Q: Can marriages be registered online?\nA: Online application is filled first, followed by a visit to the sub-registrar office.",
    references: "tnreginet.gov.in",
    isFeatured: false,
    viewCount: 90
  },
  // Health Law (1)
  {
    id: 15,
    title: "Mental Healthcare Act, 2017",
    category: "Health Law",
    summary: "Guarantees free mental healthcare at government hospitals and decriminalizes suicide attempts.",
    purpose: "To provide for mental healthcare services and protect rights of persons with mental illness.",
    rights: "• Free access to mental health services at government centers.\n• Protection from cruel or inhuman treatment.\n• Complete confidentiality of treatment.",
    responsibilities: "• Support family members facing mental health issues.\n• Avoid stigmatizing mental illnesses.",
    penalties: "Inhuman treatment at psychiatric facilities is punishable with up to 2 years imprisonment.",
    examples: "A student suffering from severe anxiety receives free psychiatric consultation at a district hospital.",
    faq: "Q: Is suicide a crime?\nA: No, the Act presumes severe stress and decriminalizes suicide attempts.",
    references: "main.mohfw.gov.in",
    isFeatured: false,
    viewCount: 85
  },
  // Labour Law (3)
  {
    id: 16,
    title: "Minimum Wages Act, 1948",
    category: "Labour Law",
    summary: "Empowers state governments to fix minimum wages for workers, making payments below the floor rate a crime.",
    purpose: "To prevent exploitation of labor by ensuring basic minimum wages.",
    rights: "• Receive at least state-notified minimum wages.\n• Double wage rate for overtime hours.\n• Regular weekly day off.",
    responsibilities: "• Maintain work logs.\n• Report employers paying below minimum rates.",
    penalties: "Paying below minimum wage attracts up to 6 months imprisonment or Rs. 500 fine.",
    examples: "Construction workers strike and file a labour commissioner complaint, winning fair daily wages.",
    faq: "Q: Who fixes these rates?\nA: The state government updates rates twice a year based on inflation.",
    references: "labour.gov.in",
    isFeatured: false,
    viewCount: 98
  },
  {
    id: 17,
    title: "Payment of Wages Act, 1936",
    category: "Labour Law",
    summary: "Regulates timely payment of wages and prohibits unauthorized deductions from workers' salaries.",
    purpose: "To ensure workers receive wages on time without arbitrary fines.",
    rights: "• Wages paid by the 7th day of the month (for firms < 1000 employees).\n• No wage deductions except those authorized by law.\n• Receive wages in cash, check, or direct bank transfer.",
    responsibilities: "• Submit wage claims on time.\n• Keep records of salary slips.",
    penalties: "Employers delaying payment are liable to pay interest and fines up to Rs. 3,000.",
    examples: "An office assistant files a complaint after wages are delayed by 20 days, resulting in immediate release.",
    faq: "Q: Can employers deduct salary for minor mistakes?\nA: Only strictly defined deductions (like damage to property) are allowed after showing cause.",
    references: "labour.gov.in",
    isFeatured: false,
    viewCount: 91
  },
  {
    id: 18,
    title: "Factories Act, 1948 (Safety & Work Hours)",
    category: "Labour Law",
    summary: "Regulates safety, health, welfare, and working hours of workers in registered manufacturing factories.",
    purpose: "To secure clean working conditions and prevent health hazards at factories.",
    rights: "• Maximum 48 hours work week (9 hours per day).\n• Clean drinking water, ventilation, and crèche facilities.\n• Adequate safety guards on machinery.",
    responsibilities: "• Follow factory safety guidelines.\n• Do not damage safety equipment.",
    penalties: "Factory owners face up to 2 years imprisonment for safety violations causing accidents.",
    examples: "A factory worker reports lack of safety goggles, leading to an inspection by the local inspector.",
    faq: "Q: What is the minimum age to work?\nA: Child labor under 14 is completely prohibited; adolescents (14-18) face strict hours.",
    references: "shramsuvidha.gov.in",
    isFeatured: false,
    viewCount: 104
  },
  // Property Law (4)
  {
    id: 19,
    title: "Real Estate Regulation Act (RERA), 2016",
    category: "Property Law",
    summary: "Protects home buyers from developer delays and specifies quality standards for residential projects.",
    purpose: "To establish transparency and efficiency in the real estate sector.",
    rights: "• Refund with interest if possession is delayed.\n• 5-year structural defect warranty.\n• View all project approvals on RERA portal.",
    responsibilities: "• Pay installments on time.\n• Verify developer registration.",
    penalties: "Developers face fines up to 10% of project cost or imprisonment for fraud.",
    examples: "A buyer receives a full refund plus 9% interest after a builder delays construction by 2 years.",
    faq: "Q: Does RERA apply to all projects?\nA: Yes, projects above 500 sq. meters or 8 apartments must register.",
    references: "tnrera.in",
    isFeatured: true,
    viewCount: 160
  },
  {
    id: 20,
    title: "Transfer of Property Act, 1882",
    category: "Property Law",
    summary: "Regulates the transfer of land, houses, and gifts, making written registration mandatory for sales.",
    purpose: "To provide clear legal rules for buying, selling, renting, and gifting property.",
    rights: "• Right to clear title upon registration.\n• Lease protection rights for tenants.\n• Gift revocation rights under specific fraud conditions.",
    responsibilities: "• Pay applicable stamp duty and registration fee.\n• Verify previous ownership chain (Encumbrance Certificate).",
    penalties: "Unregistered property sales have no legal standing in courts.",
    examples: "A buyer checks the parent document and registers the sale deed at the sub-registrar office.",
    faq: "Q: Is oral sale valid?\nA: No, transfers of immovable property worth over Rs. 100 require registered deeds.",
    references: "tnreginet.gov.in",
    isFeatured: false,
    viewCount: 115
  },
  {
    id: 21,
    title: "Right to Fair Compensation in Land Acquisition Act, 2013",
    category: "Property Law",
    summary: "Guarantees fair market compensation and rehabilitation for landowners during government acquisitions.",
    purpose: "To establish humane, transparent, and fair land acquisition rules.",
    rights: "• Compensation up to 4x market value in rural areas, 2x in urban areas.\n• Mandatory Social Impact Assessment (SIA).\n• Resettlement and Rehabilitation (R&R) benefits.",
    responsibilities: "• Submit land title proofs to collector.\n• File objections within 60 days of notification.",
    penalties: "Acquisition is deemed void if compensation is not paid within specified timelines.",
    examples: "A farmer receives Rs. 20 Lakh (4x value) for land acquired for a national highway, plus a resettlement plot.",
    faq: "Q: Is consent mandatory?\nA: Yes, requires consent of 70% landowners for PPP and 80% for private projects.",
    references: "dolr.gov.in",
    isFeatured: false,
    viewCount: 94
  },
  {
    id: 22,
    title: "Indian Succession & Wills Act, 1925",
    category: "Property Law",
    summary: "Governs inheritance, drafting of wills, and partition of property among legal heirs.",
    purpose: "To regulate succession of property of deceased individuals.",
    rights: "• Draft a will disposing of self-acquired property.\n• Equal share for daughters in ancestral property.\n• Get succession certificates from civil courts.",
    responsibilities: "• Wills must be signed by two witnesses.\n• Pay applicable court fees for probate.",
    penalties: "Forging wills or coercion during drafting voids the succession rights and attracts jail.",
    examples: "An individual drafts a registered will, avoiding disputes among children regarding house ownership.",
    faq: "Q: Is registering a will mandatory?\nA: No, but highly recommended for legal safety.",
    references: "districts.ecourts.gov.in",
    isFeatured: false,
    viewCount: 108
  },
  // SC/ST Rights (1)
  {
    id: 23,
    title: "SC/ST Prevention of Atrocities Act, 1989",
    category: "SC/ST Rights",
    summary: "Protects marginalized communities from caste-based abuse, discrimination, and violence, setting up fast courts.",
    purpose: "To prevent atrocities against members of Scheduled Castes and Scheduled Tribes.",
    rights: "• Police must register FIR within 24 hours.\n• Immediate cash compensation and medical aid.\n• Special public prosecutors for cases.",
    responsibilities: "• Act truthfully when filing complaints.\n• Cooperate with DSP level officers.",
    penalties: "Public servants neglecting duties face up to 1 year imprisonment. Accused faces up to 5 years jail.",
    examples: "A citizen reports caste-based slurs to the police, leading to an immediate FIR under the Act.",
    faq: "Q: Can the accused get anticipatory bail?\nA: No, anticipatory bail is generally barred under Section 18 of the Act.",
    references: "socialjustice.gov.in",
    isFeatured: true,
    viewCount: 140
  },
  // Senior Citizen Rights (1)
  {
    id: 24,
    title: "Maintenance & Welfare of Parents Act, 2007",
    category: "Senior Citizen Rights",
    summary: "Legally obligates children and heirs to provide maintenance and care to senior citizens and parents.",
    purpose: "To ensure welfare and security of senior citizens and elderly parents.",
    rights: "• Claim monthly allowance (up to Rs. 10,000) from children.\n• Revoke property transfers if children refuse care.\n• Simple fast hearings in tribunals within 90 days.",
    responsibilities: "• Children must look after basic physical and medical needs of parents.\n• Heirs inheriting property must maintain the owner.",
    penalties: "Abandoning parents leads to up to 3 months jail or Rs. 5,000 fine.",
    examples: "A senior citizen revokes a property gift deed to his son after the son refuses to pay medical bills.",
    faq: "Q: Are lawyers allowed in tribunals?\nA: No, representation is simple to keep processes fast and cheap.",
    references: "socialjustice.gov.in",
    isFeatured: false,
    viewCount: 130
  },
  // Tax Law (2)
  {
    id: 25,
    title: "Income Tax Act, 1961 (Taxpayer Rights)",
    category: "Tax Law",
    summary: "Governs personal income tax filing, exemptions, and outlines basic rights of taxpayers.",
    purpose: "To levy and regulate tax on individual and corporate incomes.",
    rights: "• Claim deductions under 80C, 80D (health cover), and home loans.\n• Receive refund of excess tax deducted within timelines.\n• Appeal against erroneous tax assessments.",
    responsibilities: "• File ITR by July 31st annually.\n• Disclose all sources of income (salary, bank interest).",
    penalties: "Late filing fee of Rs. 1,000 to Rs. 5,000 applies after deadline.",
    examples: "A salaried employee files online, claims standard deduction, and receives a refund of Rs. 8,000.",
    faq: "Q: Which regime is better?\nA: Compare using the income tax calculator; new regime is default, old regime allows deductions.",
    references: "incometax.gov.in",
    isFeatured: false,
    viewCount: 133
  },
  {
    id: 26,
    title: "GST & Tax Rights for Businesses",
    category: "Tax Law",
    summary: "Sets rules for indirect taxes on goods and services, giving businesses right to input tax credits.",
    purpose: "To streamline indirect taxation and eliminate cascading taxes.",
    rights: "• Input Tax Credit (ITC) to offset tax paid on inputs.\n• Threshold exemption up to Rs. 40 Lakh turnover.\n• Composition scheme (1% tax) for small traders.",
    responsibilities: "• Issue GST-compliant tax invoices.\n• File monthly/quarterly returns (GSTR-1, GSTR-3B) on time.",
    penalties: "Delay in filing attracts a late fee of Rs. 50 per day.",
    examples: "A shop owner claims ITC on raw materials purchased, lowering the net tax payable for the month.",
    faq: "Q: Is GST registration optional under Rs. 40 Lakh?\nA: Yes, except for inter-state online sellers.",
    references: "gst.gov.in",
    isFeatured: false,
    viewCount: 92
  },
  // Traffic Laws (1)
  {
    id: 27,
    title: "Motor Vehicles (Amendment) Act, 2019",
    category: "Traffic Laws",
    summary: "Outlines traffic rules, licenses, and prescribes hefty penalties for dangerous driving and driving without insurance.",
    purpose: "To improve road safety and standardize traffic fines in India.",
    rights: "• Right to digital license storage (DigiLocker is valid).\n• Claim third-party insurance compensation in accidents.\n• Right to friendly treatment by traffic police.",
    responsibilities: "• Carry DL, RC, insurance, and Pollution under Control (PUC).\n• Wear helmets/seatbelts and respect signals.",
    penalties: "Drunk driving fine is Rs. 10,000; driving without licence is Rs. 5,000.",
    examples: "A driver shows DL on DigiLocker to traffic police, avoiding a fine for physical document absence.",
    faq: "Q: Can police seize keys?\nA: No, traffic police are not legally allowed to seize vehicle keys or air from tires.",
    references: "sarathi.parivahan.gov.in",
    isFeatured: false,
    viewCount: 118
  },
  // Tribal Rights (1)
  {
    id: 28,
    title: "Forest Rights Act (FRA), 2006",
    category: "Tribal Rights",
    summary: "Recognizes the rights of forest dwelling scheduled tribes and traditional dwellers over forest land.",
    purpose: "To undo historical injustice and grant land rights to forest dwellers.",
    rights: "• Hold and live in forest land for habitation/cultivation.\n• Collect and sell minor forest produce (honey, bamboo).\n• Community rights over forest protection and biodiversity.",
    responsibilities: "• Protect and conserve wild animals and biodiversity.\n• Do not clear forests for commercial industries.",
    penalties: "Forced eviction of tribals without legal due process is a punishable offence.",
    examples: "A tribal group obtains community land titles, managing bamboo harvesting locally in Tamil Nadu.",
    faq: "Q: Who decides rights?\nA: The Gram Sabha initiates the process for determining forest rights.",
    references: "tribal.nic.in",
    isFeatured: false,
    viewCount: 82
  },
  // Women's Rights (4)
  {
    id: 29,
    title: "Workplace Sexual Harassment (POSH) Act, 2013",
    category: "Women's Rights",
    summary: "Mandates that workplaces with 10+ employees establish an Internal Complaints Committee (ICC) to resolve harassment.",
    purpose: "To provide protection against workplace sexual harassment and ensure safe work spaces.",
    rights: "• Safe working environment.\n• ICC inside the office for resolving complaints.\n• Complete confidentiality and protection from retaliation.",
    responsibilities: "• File complaint within 3 months of the incident.\n• Act honestly during inquiry.",
    penalties: "Employers failing to set up ICC face up to Rs. 50,000 fine and loss of license.",
    examples: "An employee reports inappropriate behaviour to ICC, which conducts a private inquiry and disciplines the manager.",
    faq: "Q: What if no ICC exists?\nA: File complaint with District LCC or online at shebox.nic.in.",
    references: "shebox.nic.in",
    isFeatured: false,
    viewCount: 105
  },
  {
    id: 30,
    title: "Maternity Benefit Act, 2017",
    category: "Women's Rights",
    summary: "Guarantees fully paid maternity leave benefits from 12 weeks to 26 weeks for female employees.",
    purpose: "To protect the employment of women before and after child-birth.",
    rights: "• 26 weeks fully paid leave.\n• Mandatory crèche access in firms with 50+ staff.\n• Work from home option if feasible.",
    responsibilities: "• Must have worked 80 days in the last 12 months preceding delivery.\n• Notify HR in writing.",
    penalties: "Employers denying maternity benefits face up to 3 months jail or Rs. 5,000 fine.",
    examples: "An employee takes 26 weeks paid leave, returning to work and utilizing the company's nursery.",
    faq: "Q: Does it cover adoption?\nA: Yes, adopting mothers get 12 weeks paid leave.",
    references: "labour.gov.in",
    isFeatured: false,
    viewCount: 112
  },
  {
    id: 31,
    title: "Protection of Women from Domestic Violence Act, 2005",
    category: "Women's Rights",
    summary: "Covers physical, emotional, sexual, and economic abuse of women in domestic relationships, granting quick remedies.",
    purpose: "To provide more effective protection of rights of women guaranteed under the Constitution who are victims of violence.",
    rights: "• Protection Orders (stop abuser from contacting/visiting).\n• Residence Orders (right to stay in matrimonial home).\n• Claim monetary maintenance and shelter.",
    responsibilities: "• Seek assistance from protection officers or police.\n• Disclose true facts of abuse.",
    penalties: "Breach of protection order by the respondent is a cognizable offence with 1 year jail.",
    examples: "A victim of marital abuse contacts a protection officer, receiving a protection order and home stay rights.",
    faq: "Q: Where to get immediate help?\nA: Call Women Helpline at 181.",
    references: "wcd.nic.in",
    isFeatured: true,
    viewCount: 130
  },
  {
    id: 32,
    title: "Dowry Prohibition Act, 1961",
    category: "Women's Rights",
    summary: "Makes giving, taking, or demanding dowry a criminal offence, penalizing offenders with strict jail.",
    purpose: "To eradicate the practice of dowry in marriages.",
    rights: "• File complaints against demands for cash/gifts.\n• Keep 'Streedhan' (gifts to bride) safely as sole owner.\n• Police arrest without warrant for active harassment.",
    responsibilities: "• Refuse to participate in dowry exchange.\n• Report active dowry harassment to helplines.",
    penalties: "Giving/taking dowry attracts minimum 5 years imprisonment and Rs. 15,000 fine.",
    examples: "A bride's family reports cash demands before the wedding, leading to police intervention.",
    faq: "Q: What is Streedhan?\nA: Gifts, jewelry, or cash given to the bride, which belong solely to her.",
    references: "wcd.nic.in",
    isFeatured: false,
    viewCount: 95
  }
];

// 3. Generating exactly 41 Government Schemes
const SCHEMES = [
  // Healthcare (6)
  {
    id: 1,
    title: "Ayushman Bharat (PM-JAY)",
    category: "Healthcare",
    description: "Provides free health insurance cover of up to Rs. 5 lakh per family per year for secondary and tertiary care hospitalization.",
    benefits: "• Free cashless health coverage of up to Rs. 5 lakh per family per year.\n• Cashless access to medical treatments at all empanelled hospitals.\n• Pre-existing diseases covered from Day 1.",
    eligibility: "• Families listed in the SECC database (mostly rural, poor, or low-income urban workers).\n• Senior citizens above 70 years get an additional Rs. 5 lakh cover (regardless of income).",
    documents: "• Aadhaar Card\n• Ration Card\n• Mobile Number linked to Aadhaar",
    applicationProcess: "1. Check eligibility at pmjay.gov.in or call 14555.\n2. Visit any empanelled hospital or CSC.\n3. Complete Aadhaar e-KYC.\n4. Get Ayushman Card printed.",
    officialSource: "https://pmjay.gov.in",
    stateApplicability: "All India",
    isFeatured: true,
    viewCount: 350
  },
  {
    id: 2,
    title: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    category: "Healthcare",
    description: "A government-backed accident insurance scheme in India providing insurance coverage against death or disability at a low premium.",
    benefits: "• Accidental death benefit of Rs. 2 lakh.\n• Total disability benefit of Rs. 2 lakh; partial disability Rs. 1 lakh.\n• Low premium of Rs. 20 annually debited from bank account.",
    eligibility: "• Savings bank account holders in the age group of 18 to 70 years who enroll.",
    documents: "• Bank Account details\n• Aadhaar Card (linked to bank account)",
    applicationProcess: "1. Visit the bank branch or log in to internet/mobile banking.\n2. Request PMSBY enrollment.\n3. Sign the auto-debit consent form.",
    officialSource: "https://jansuraksha.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 165
  },
  {
    id: 3,
    title: "PM Jan Aushadhi Yojana (PMJAY)",
    category: "Healthcare",
    description: "Provides quality generic medicines at affordable prices through dedicated generic drug stores across India.",
    benefits: "• Access to high quality medicines at 50% to 90% cheaper prices than branded ones.\n• Surgical items and food supplements also available at low cost.",
    eligibility: "• Open to all citizens.",
    documents: "• Doctor's prescription containing generic names.",
    applicationProcess: "1. Visit the nearest Jan Aushadhi Kendra (store locator at janaushadhi.gov.in).\n2. Present the prescription and purchase generic medicines.",
    officialSource: "http://janaushadhi.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 120
  },
  {
    id: 4,
    title: "National Health Mission (NHM)",
    category: "Healthcare",
    description: "Support scheme strengthening public healthcare systems, maternal health, and child immunization in rural and urban areas.",
    benefits: "• Free maternal deliveries and newborn care.\n• Free essential medicines and diagnostic tests in public health centers.\n• Mobile health clinics and ambulances (108 service).",
    eligibility: "• All citizens, especially rural poor, women, and children.",
    documents: "• Government ID (Aadhaar or Voter ID)\n• Mother-Child Protection Card (for maternal care)",
    applicationProcess: "1. Visit any government Primary Health Centre (PHC) or District Hospital.\n2. Avail services, vaccines, and free diagnostics.",
    officialSource: "https://nhm.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 110
  },
  {
    id: 5,
    title: "PM TB Mukt Bharat Abhiyaan",
    category: "Healthcare",
    description: "National initiative providing free diagnostics, medicines, and nutrition support of Rs. 500/month to TB patients.",
    benefits: "• Free TB diagnosis and treatment (DOTS regimen).\n• Rs. 500 per month nutritional support (Nikshay Poshan Yojana).\n• Community support option (Ni-kshay Mitra).",
    eligibility: "• All TB patients diagnosed and registered in national registry.",
    documents: "• TB diagnostic report\n• Aadhaar Card\n• Bank account details for DBT",
    applicationProcess: "1. Diagnostic check at any government hospital/health center.\n2. Registration on Nikshay portal by health staff.\n3. Automatic monthly DBT and medicine kit disbursement.",
    officialSource: "https://nikshay.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 95
  },
  {
    id: 6,
    title: "Integrated Child Development Services (ICDS)",
    category: "Healthcare",
    description: "Provides nutritional meals, pre-school education, primary healthcare, and immunization at Anganwadi centers.",
    benefits: "• Supplementary nutrition for children, pregnant women, and lactating mothers.\n• Free immunization, health check-ups, and referral services.",
    eligibility: "• Children under 6 years, pregnant and lactating mothers.",
    documents: "• Child's birth proof\n• Parents' Aadhaar Card",
    applicationProcess: "1. Visit the nearest local Anganwadi center.\n2. Register mother/child details in the entry log.\n3. Receive regular nutritional take-home rations and immunization updates.",
    officialSource: "https://wcd.nic.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 100
  },
  // Agriculture (5)
  {
    id: 7,
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    category: "Agriculture",
    description: "Direct income support of Rs. 6,000 per year paid in three equal installments to landholding farmer families across the country.",
    benefits: "• Income support of Rs. 6,000 per year.\n• Paid directly into the farmer's bank account in 3 installments of Rs. 2,000.",
    eligibility: "• Landholding farmer families with cultivable land in their name.\n• Excludes tax payers, government employees, and professionals.",
    documents: "• Aadhaar Card\n• Land ownership records (Patta / Chitta)\n• Bank Passbook",
    applicationProcess: "1. Go to pmkisan.gov.in.\n2. Under 'Farmers Corner', click 'New Farmer Registration'.\n3. Enter Aadhaar, state, and upload land details.\n4. Alternatively, visit the nearest CSC.",
    officialSource: "https://pmkisan.gov.in",
    stateApplicability: "All India",
    isFeatured: true,
    viewCount: 280
  },
  {
    id: 8,
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Agriculture",
    description: "Crop insurance scheme protecting farmers against crop loss due to natural calamities, pests, or diseases.",
    benefits: "• Insurance cover for kharif, rabi, and commercial crops.\n• Low premium paid by farmers (1.5% to 5%; rest paid by government).\n• Fast claim settlement directly to bank accounts.",
    eligibility: "• All landholding farmers growing notified crops in notified areas.",
    documents: "• Land Patta/Lease agreement\n• Crop Sowing Certificate\n• Bank Passbook\n• Aadhaar Card",
    applicationProcess: "1. Apply online via pmfby.gov.in or visit bank branch/CSC during sowing season.\n2. Pay the premium amount and submit documents.\n3. Claim forms are submitted online if crops are damaged.",
    officialSource: "https://pmfby.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 130
  },
  {
    id: 9,
    title: "Soil Health Card Scheme",
    category: "Agriculture",
    description: "Provides Soil Health Cards to farmers with nutrient status reports, recommending fertilizers and crop choices.",
    benefits: "• Free soil test and nutrition report card every 3 years.\n• Recommends correct dosage of fertilizers to lower costs and protect soil quality.",
    eligibility: "• All farmers owning land.",
    documents: "• Land ownership proof\n• Aadhaar Card",
    applicationProcess: "1. Soil samples are collected from the farmer's land by agriculture officials.\n2. Samples are tested in government labs.\n3. The Soil Health Card is issued and can be downloaded at soilhealth.dac.gov.in.",
    officialSource: "https://soilhealth.dac.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 95
  },
  {
    id: 10,
    title: "Kisan Credit Card (KCC) Scheme",
    category: "Agriculture",
    description: "Provides farmers with timely credit for cultivation, post-harvest expenses, and animal husbandry.",
    benefits: "• Low interest loans up to Rs. 3 Lakh (interest subvention reduces rate to 4%).\n• Easy ATM-enabled KCC card issued.\n• No collateral required for loans up to Rs. 1.6 Lakh.",
    eligibility: "• All farmers, tenant farmers, sharecroppers, and self-help groups.",
    documents: "• Land Patta / cultivation proofs\n• Identity and Address Proof\n• Bank statements",
    applicationProcess: "1. Visit nearest public bank branch.\n2. Submit the simplified KCC application form along with land documents.\n3. Bank issues the credit limit and the KCC card.",
    officialSource: "https://rbi.org.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 140
  },
  {
    id: 11,
    title: "PM Krishi Sinchayee Yojana (PMKSY)",
    category: "Agriculture",
    description: "Focuses on water conservation, micro-irrigation (drip/sprinkler), and expanding cultivable land irrigation.",
    benefits: "• Subsidy up to 55% for small farmers to install drip and sprinkler irrigation.\n• Assured water supply to farms, improving crop yield.",
    eligibility: "• All landowning farmers with access to water sources.",
    documents: "• Land ownership proof\n• Water availability proof\n• Aadhaar Card",
    applicationProcess: "1. Apply online via state portal or visit the district Horticulture/Agriculture officer.\n2. Submit application with quotation of drip equipment from approved supplier.\n3. Officer verifies field, installs system, and releases subsidy.",
    officialSource: "https://pmksy.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 115
  },
  // Digital India (3)
  {
    id: 12,
    title: "DigiLocker",
    category: "Digital India",
    description: "A secure cloud-based platform for storage, sharing, and verification of documents and certificates.",
    benefits: "• 1 GB free storage space to upload documents.\n• Access digitally signed documents (DL, Aadhaar, marksheet) directly from issuers.\n• Legally valid at par with physical certificates under IT Act.",
    eligibility: "• Any citizen having an Aadhaar card linked to a mobile number.",
    documents: "• Aadhaar Card\n• Mobile number linked to Aadhaar",
    applicationProcess: "1. Download DigiLocker app or visit digilocker.gov.in.\n2. Sign up with Aadhaar number and OTP.\n3. Search and download digital certificates from issuers.",
    officialSource: "https://digilocker.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 210
  },
  {
    id: 13,
    title: "PM-WANI (Wi-Fi Access Network Interface)",
    category: "Digital India",
    description: "Aims to deploy public Wi-Fi hotspots across public spaces via Public Data Offices (PDO) to boost digital connectivity.",
    benefits: "• Access high speed public Wi-Fi at cheap rates without contracts.\n• Local shops can earn income by setting up PDO Wi-Fi hotspots.",
    eligibility: "• Open to all citizens for internet access. Any local shopkeeper can register as a PDO.",
    documents: "• Mobile number for OTP validation (users)\n• Shop registration proof (for PDO providers)",
    applicationProcess: "1. Connect to any PM-WANI Wi-Fi network shown on your device.\n2. Authenticate using a registered app (e.g. WANI App) and buy small internet tokens.",
    officialSource: "https://sarathsanchar.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 110
  },
  {
    id: 14,
    title: "Digital India Land Records Modernization Program (DILRMP)",
    category: "Digital India",
    description: "Modernizes and digitizes land records, Patta, Chitta, cadastral maps, and automates mutations.",
    benefits: "• View and download Patta, land maps, and ownership documents online instantly.\n• Safe digital registry reduces property transaction fraud.",
    eligibility: "• All property owners in India.",
    documents: "• Previous sale deed\n• Survey number of land",
    applicationProcess: "1. Visit the state land records portal (e.g. eservices.tn.gov.in for Tamil Nadu).\n2. Enter District, Taluk, Village, and Survey/Patta number.\n3. View and download digitally signed records.",
    officialSource: "https://dilrmp.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 145
  },
  // Education (4)
  {
    id: 15,
    title: "National Scholarship Portal Scholarships",
    category: "Education",
    description: "A single unified portal offering hundreds of central, state, and UGC scholarships for school and college students.",
    benefits: "• Full tuition waiver and monthly stipend (up to Rs. 2,000/month) for SC/ST/OBC/Minority students.\n• Merit scholarships for top rankers in class 10th and 12th.\n• Cash transfers directly to student accounts via DBT.",
    eligibility: "• Students studying in registered schools/colleges with household income under specified caps (mostly < 2.5 - 8 Lakh/year).",
    documents: "• Marksheets of previous qualifying exam\n• Income Certificate\n• Caste/Community Certificate\n• Aadhaar Card\n• Bank Passbook details",
    applicationProcess: "1. Register at scholarships.gov.in.\n2. Complete profile and find eligible scholarships.\n3. Fill out application, upload marksheet and income certificate.\n4. Institute verifies details online, followed by state check, leading to direct bank credit.",
    officialSource: "https://scholarships.gov.in",
    stateApplicability: "All India",
    isFeatured: true,
    viewCount: 300
  },
  {
    id: 16,
    title: "PM Vidyalaxmi Scheme",
    category: "Education",
    description: "A single portal for students to apply for education loans and scholarships from multiple public and private banks.",
    benefits: "• Apply to multiple banks with a single Common Education Loan Application Form (CELAF).\n• Subsidized interest rates for students with family income under Rs. 4.5 Lakh.",
    eligibility: "• Indian students who have secured admission to higher education courses in India or abroad.",
    documents: "• Admission letter from college\n• Fee structure breakdown\n• Co-borrower (parents) income proofs\n• Aadhaar and PAN Cards",
    applicationProcess: "1. Register on vidyalaxmi.co.in.\n2. Fill out the CELAF form and upload required documents.\n3. Search and apply for education loan schemes offered by banks.\n4. Track loan status directly on the portal.",
    officialSource: "https://www.vidyalaxmi.co.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 145
  },
  {
    id: 17,
    title: "Samagra Shiksha Abhiyan",
    category: "Education",
    description: "An overarching school education program aiming to ensure inclusive, equitable, and quality education from pre-school to class 12.",
    benefits: "• Free schooling, textbooks, and uniforms in government schools.\n• Infrastructure grants to upgrade school labs, classrooms, and clean toilets.\n• Annual sports grants and digital education support.",
    eligibility: "• All school-age children (pre-school to class 12) enrolled in government/aided schools.",
    documents: "• Aadhaar Card (optional)\n• Transfer Certificate from previous school",
    applicationProcess: "1. Visit the local government school in your neighborhood.\n2. Submit admission form. Free education benefits, uniforms, and textbooks are provided automatically.",
    officialSource: "https://samagra.education.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 95
  },
  {
    id: 18,
    title: "PM YASASVI Scholarship",
    category: "Education",
    description: "Scholarship scheme for OBC, EBC, and DNT students studying in classes 9th to 12th in top-identified schools.",
    benefits: "• Scholarship up to Rs. 75,000/year for class 9-10 and Rs. 1,25,000/year for class 11-12.\n• Covers school tuition fees, hostel fees, and stipend.",
    eligibility: "• OBC/EBC/Nomadic tribes students studying in identified schools with family income < Rs. 2.5 Lakh/year.",
    documents: "• Marksheet of previous class\n• Income and Caste Certificates\n• Aadhaar Card\n• Bank details",
    applicationProcess: "1. Apply online via National Testing Agency (NTA) YASASVI portal or NSP.\n2. Complete registration and submit academic and income records.\n3. Selection is made based on merit list.",
    officialSource: "https://yet.nta.ac.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 130
  },
  // Employment (3)
  {
    id: 19,
    title: "MGNREGA Rural Employment",
    category: "Employment",
    description: "Guarantees 100 days of manual wage employment in a financial year to rural households willing to do unskilled manual work.",
    benefits: "• Guaranteed 100 days of manual work per year.\n• Work within 5 km of home; wage paid in 15 days directly to bank.\n• Unemployment allowance if work is not provided within 15 days.",
    eligibility: "• Adult members of rural households willing to do unskilled manual labor.",
    documents: "• Job Card (issued free by Gram Panchayat)\n• Aadhaar Card\n• Bank account details",
    applicationProcess: "1. Apply for a Job Card at the local Gram Panchayat office (FREE).\n2. Submit a written request for work at the GP office.\n3. GP allocates work within 15 days, updating the Job Card.",
    officialSource: "https://nrega.nic.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 195
  },
  {
    id: 20,
    title: "PM Kaushal Vikas Yojana (PMKVY)",
    category: "Employment",
    description: "Skill certification scheme enabling youth to take up industry-relevant skill training, helping them secure jobs.",
    benefits: "• Free skill training courses (e.g. IT, logistics, healthcare).\n• Government-recognized skill certification and assessments.\n• Job placement assistance and post-placement support.",
    eligibility: "• Indian youth aged 15 to 45 who are unemployed or school/college dropouts.",
    documents: "• Aadhaar Card\n• Education Marksheets (10th/12th)\n• Bank Passbook details",
    applicationProcess: "1. Register on Skill India portal (skillindia.gov.in) or visit nearest PMKVY Training Centre.\n2. Choose a training course and complete class hours.\n3. Pass the assessment test to receive certificate and job support.",
    officialSource: "https://www.pmkvyofficial.org",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 160
  },
  {
    id: 21,
    title: "DAY-NRLM (Self-Employment)",
    category: "Employment",
    description: "Promotes self-employment and skilled wage employment for rural poor by organizing them into Self Help Groups (SHG).",
    benefits: "• Interest-subvention loans for rural SHGs to start micro-businesses.\n• Financial and business training for SHG members.\n• Revolving fund support of Rs. 15,000 per SHG.",
    eligibility: "• Rural poor households, especially women SHG groups.",
    documents: "• Member list of SHG\n• Group Bank Account details\n• Resolutions book",
    applicationProcess: "1. Form a Self Help Group of 10-20 local rural women.\n2. Register the SHG with the Block Development Officer (BDO).\n3. Bank account is opened, followed by revolving fund and loan applications.",
    officialSource: "https://nrlm.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 110
  },
  // Financial Inclusion (4)
  {
    id: 22,
    title: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    category: "Financial Inclusion",
    description: "A national mission for financial inclusion to ensure access to financial services like basic savings accounts.",
    benefits: "• Zero balance savings account with zero maintenance fees.\n• Free RuPay debit card with built-in Rs. 2 lakh accidental insurance cover.\n• Overdraft facility of up to Rs. 10,000.",
    eligibility: "• Any Indian citizen aged 10 years or older who does not already have a bank account.",
    documents: "• Aadhaar Card\n• Two passport-sized photographs",
    applicationProcess: "1. Download form from pmjdy.gov.in or obtain it from any bank.\n2. Submit filled form with Aadhaar copy.\n3. Bank opens account and issues RuPay debit card.",
    officialSource: "https://pmjdy.gov.in",
    stateApplicability: "All India",
    isFeatured: true,
    viewCount: 220
  },
  {
    id: 23,
    title: "Atal Pension Yojana (APY)",
    category: "Financial Inclusion",
    description: "Guaranteed pension scheme for workers in the unorganized sector, providing regular retirement income.",
    benefits: "• Guaranteed pension of Rs. 1,000 to Rs. 5,000 per month after age 60.\n• Spouse receives pension after subscriber's death; nominee gets corpus.",
    eligibility: "• Any Indian citizen aged between 18 and 40 years.\n• Must have bank account and not be a tax payer.",
    documents: "• Bank Account details\n• Aadhaar Card",
    applicationProcess: "1. Visit the bank branch holding your savings account.\n2. Request APY registration form.\n3. Choose pension slab and sign auto-debit consent.",
    officialSource: "https://www.npscra.nsdl.co.in",
    stateApplicability: "All India",
    isFeatured: true,
    viewCount: 175
  },
  {
    id: 24,
    title: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    category: "Financial Inclusion",
    description: "A government-backed life insurance scheme providing term life coverage at a nominal premium.",
    benefits: "• Life insurance cover of Rs. 2 lakh payable to nominee in event of death due to any cause.\n• Low premium of Rs. 436 per year auto-debited from bank account.",
    eligibility: "• All savings bank account holders in the age group of 18 to 50 years.",
    documents: "• Bank account details\n• Aadhaar Card (linked to bank account)",
    applicationProcess: "1. Log in to net banking or visit your bank branch.\n2. Submit PMJJBY enrollment form.\n3. Provide auto-debit consent.",
    officialSource: "https://jansuraksha.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 155
  },
  {
    id: 25,
    title: "Stand-Up India Scheme",
    category: "Financial Inclusion",
    description: "Promotes entrepreneurship at the grassroots level by funding SC, ST, and women entrepreneurs.",
    benefits: "• Bank loans between Rs. 10 Lakh and Rs. 1 Crore for setting up greenfield enterprises.\n• Covers 75% of project cost; lower interest rates.\n• Collateral-free loans via Credit Guarantee Scheme.",
    eligibility: "• SC/ST or women entrepreneurs aged above 18 years.",
    documents: "• Project Report / Business Plan\n• Caste/Community Certificate (for SC/ST)\n• Identity, Address, and PAN cards\n• Land registry/rental agreements",
    applicationProcess: "1. Apply online via Stand-Up India portal (standupmitra.in) or visit bank branch.\n2. Fill out proposal details and request handholding support if needed.\n3. Bank reviews project viability and sanctions loan.",
    officialSource: "https://www.standupmitra.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 125
  },
  // Housing (1)
  {
    id: 26,
    title: "Pradhan Mantri Awas Yojana (PMAY)",
    category: "Housing",
    description: "Aims to provide affordable housing for the urban and rural poor, offering interest subsidies and construction grants.",
    benefits: "• Interest subsidy up to 6.5% on home loans under CLSS, saving up to Rs. 2.67 Lakh.\n• Direct financial assistance up to Rs. 1.2 Lakh (rural) for construction.\n• All homes must be registered in the name of a female family member.",
    eligibility: "• First-time homebuyers (must not own a brick house anywhere).\n• EWS, LIG, or MIG income categories.",
    documents: "• Aadhaar Card\n• Income Certificate / Salary slips\n• Non-owning affidavit\n• Property blueprints/cost estimates",
    applicationProcess: "1. Apply for home loan at bank and request PMAY-CLSS subsidy.\n2. Alternatively, for direct grants, register on pmayg.nic.in via Gram Panchayat.",
    officialSource: "https://pmay-urban.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 190
  },
  // Rural Development (3)
  {
    id: 27,
    title: "PM Gram Sadak Yojana (PMGSY)",
    category: "Rural Development",
    description: "National scheme providing all-weather road connectivity to unconnected habitations in rural areas.",
    benefits: "• Connects rural habitations with paved all-weather roads.\n• Improves access to markets, schools, and hospitals in rural India.",
    eligibility: "• Rural habitations with population > 500 in plains, > 250 in hills.",
    documents: "• Road proposal plans from Gram Sabha / Block panchayat.",
    applicationProcess: "1. Gram Panchayats prepare road proposal list.\n2. Submitted to District Planning Committee and State Rural Roads Agency.\n3. Tenders are floated and construction is supervised digitally.",
    officialSource: "https://omms.nic.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 105
  },
  {
    id: 28,
    title: "PM Adarsh Gram Yojana (PMAAGY)",
    category: "Rural Development",
    description: "Aims for integrated development of villages with >50% SC population, providing drinking water, electricity, and schools.",
    benefits: "• Infrastructure grants to build roads, solar lights, and community halls.\n• 100% household toilet coverage and clean drinking water pipeline.",
    eligibility: "• Notified villages with scheduled caste population above 50%.",
    documents: "• Village development plan reports.",
    applicationProcess: "1. District Collector prepares Needs Assessment and Village Development Plan.\n2. Funds are released by ministry to state department.\n3. Local panchayats implement public works.",
    officialSource: "https://pmaagy.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 88
  },
  {
    id: 29,
    title: "DAY-NRLM Mahila Kisan Scheme",
    category: "Rural Development",
    description: "Supports rural women farmers through sustainable agriculture practices and organic farming inputs.",
    benefits: "• Free organic seed kits and bio-fertilizer training.\n• Setup of local Custom Hiring Centres (CHC) for farm machinery.\n• Direct market access and fair pricing for organic farm produce.",
    eligibility: "• Rural women farmers belonging to SHGs.",
    documents: "• SHG membership certificate\n• Land cultivation proof\n• Aadhaar Card",
    applicationProcess: "1. Local SHG forwards women farmer names to block co-ordinator.\n2. Enrolled women attend training camps at Krishi Vigyan Kendra.\n3. Receives inputs and tools from local Custom Hiring Centre.",
    officialSource: "https://aajeevika.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 92
  },
  // SC/ST Welfare (2)
  {
    id: 30,
    title: "PM-DAKSH Skill Training",
    category: "SC/ST Welfare",
    description: "National action plan providing free skill training and stipends to SC, OBC, and sanitation workers.",
    benefits: "• Free skill training in job-oriented sectors (manufacturing, services).\n• Monthly stipend of Rs. 1,000 to Rs. 1,500 during training.\n• Capital subsidy up to Rs. 50,000 for self-employment loans.",
    eligibility: "• Scheduled Castes, OBCs with income < Rs. 3 Lakh, and waste pickers.",
    documents: "• Caste Certificate\n• Income Certificate\n• Aadhaar Card\n• Bank Passbook details",
    applicationProcess: "1. Register on PM-DAKSH portal (pmdaksh.dosje.gov.in) or mobile app.\n2. Choose a training partner and course in your district.\n3. Attend classes and complete exam to receive certificate and stipend.",
    officialSource: "https://pmdaksh.dosje.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 110
  },
  {
    id: 31,
    title: "Post Matric Scholarship for SC Students",
    category: "SC/ST Welfare",
    description: "Fully funded scholarship covering tuition fees and maintenance allowances for SC students pursuing post-matric courses.",
    benefits: "• 100% compulsory tuition fee refund paid to college.\n• Academic maintenance allowance up to Rs. 13,500/year to student.\n• Additional benefits for disabled scholars.",
    eligibility: "• Scheduled Caste students studying in class 11th or above with family income < Rs. 2.5 Lakh/year.",
    documents: "• Caste/Community Certificate\n• Income Certificate\n• Marks card of previous class\n• Aadhaar Card\n• Bank details linked to Aadhaar",
    applicationProcess: "1. Apply online on State Scholarship Portal or National Scholarship Portal.\n2. Upload income, caste, and academic admission documents.\n3. District welfare officer verifies and releases funds to college and student via DBT.",
    officialSource: "https://scholarships.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 140
  },
  // Senior Citizen (2)
  {
    id: 32,
    title: "Rashtriya Vayoshri Yojana (RVY)",
    category: "Senior Citizen",
    description: "Provides physical aids and assisted-living devices (wheelchairs, hearing aids, spectacles) to senior citizens.",
    benefits: "• Free high-quality walking sticks, elbow crutches, walkers, hearing aids, and wheelchairs.\n• Free custom-fit dental dentures and spectacles.\n• Distributed in free local medical camps.",
    eligibility: "• Senior citizens (aged 60+) belonging to BPL category or monthly income < Rs. 15,000.",
    documents: "• Age Proof (Aadhaar or birth proof)\n• BPL Card or Income Certificate\n• Doctor's prescription specifying disability/aid needed",
    applicationProcess: "1. Apply online via ALIMCO portal or register at local Social Welfare office.\n2. Attend local distribution camp organized by district administration.\n3. Undergo checkup and collect devices instantly.",
    officialSource: "https://socialjustice.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 130
  },
  {
    id: 33,
    title: "Indira Gandhi Old Age Pension (IGNOAPS)",
    category: "Senior Citizen",
    description: "Provides a monthly social security pension to elderly citizens living below the poverty line.",
    benefits: "• Monthly pension of Rs. 200/month (ages 60-79) and Rs. 500/month (ages 80+).\n• Additional state contribution (e.g. Tamil Nadu adds Rs. 1,000/month, making total Rs. 1,000-1,500).",
    eligibility: "• Senior citizens aged 60 years or above belonging to BPL households.",
    documents: "• BPL Ration Card\n• Aadhaar Card\n• Bank Passbook / Post office account details\n• Age Proof certificate",
    applicationProcess: "1. Obtain application form from local Revenue office (Tahsildar/Block Office) or apply on state e-district portal.\n2. Submit documents for verification.\n3. Monthly pension is credited directly to bank account.",
    officialSource: "https://nsap.nic.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 150
  },
  // Startup (2)
  {
    id: 34,
    title: "PM Mudra Yojana",
    category: "Startup",
    description: "Enables micro-enterprises and small business owners to access collateral-free institutional loans up to Rs. 10 lakh for starting or expanding business units.",
    benefits: "• Collateral-free business loans in three categories: Shishu (up to Rs. 50,000), Kishor (Rs. 50,000 to Rs. 5 lakh), and Tarun (Rs. 5 lakh to Rs. 10 lakh).\n• Lower interest rates than local money lenders.\n• Mudra Debit Card issued for working capital.",
    eligibility: "• Entrepreneurs with business plans requiring capital up to Rs. 10 lakh.",
    documents: "• Business Plan / Project Report\n• Proof of Identity and Address\n• Quotation for machinery or assets",
    applicationProcess: "1. Select loan category based on requirements.\n2. Apply online via Udyami Mitra portal or visit any bank.\n3. Submit proposal with KYC proofs.",
    officialSource: "https://www.mudra.org.in",
    stateApplicability: "All India",
    isFeatured: true,
    viewCount: 210
  },
  {
    id: 35,
    title: "Startup India Seed Fund Scheme (SISFS)",
    category: "Startup",
    description: "Provides financial assistance to startups for proof of concept, prototype development, product trials, and market entry.",
    benefits: "• Grants up to Rs. 20 Lakh for proof of concept or trials.\n• Debt/Convertible debentures up to Rs. 50 Lakh for market entry and scaling.\n• Easy online application and mentoring access.",
    eligibility: "• Startups recognized by DPIIT, incorporated < 2 years ago, with a viable business model.",
    documents: "• Certificate of Incorporation\n• DPIIT Recognition Number\n• Pitch Deck / Presentation slides\n• Business performance reports",
    applicationProcess: "1. Apply online at startupindia.gov.in.\n2. Choose preferred Incubators listed under the Seed Fund scheme.\n3. Incubator reviews pitch, conducts interview, and releases seed capital.",
    officialSource: "https://seedfund.startupindia.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 155
  },
  // Women Welfare (6)
  {
    id: 36,
    title: "TAMILNADU Kalaignar Magalir Urimai Thittam",
    category: "Women Welfare",
    description: "A flagship welfare scheme of Tamil Nadu providing monthly financial assistance of Rs. 1,000 to eligible women heads of households.",
    benefits: "• Direct financial assistance of Rs. 1,000 per month (Rs. 12,000/year) credited to bank accounts.\n• Promotes financial independence and livelihood security for women.",
    eligibility: "• Women heads of families in Tamil Nadu with household income < Rs. 2.5 Lakh/year, landholding < 5 acres (wetland) or 10 acres (dryland), and electricity consumption < 3600 units/year.",
    documents: "• Smart Ration Card (showing female head)\n• Aadhaar Card\n• Bank Passbook\n• Electricity bill",
    applicationProcess: "1. Registration camps are organized at local ration shops.\n2. Fill the application form and submit biometric verification at the camp.\n3. Field officials verify family income and land details.\n4. Approved list receives direct credit every month.",
    officialSource: "https://kmut.tn.gov.in",
    stateApplicability: "Tamil Nadu",
    isFeatured: true,
    viewCount: 410
  },
  {
    id: 37,
    title: "Sukanya Samriddhi Yojana (SSY)",
    category: "Women Welfare",
    description: "A girl child prosperity savings scheme offering high interest rates and tax exemptions under Section 80C.",
    benefits: "• High interest rate (currently 8.2%) compounded annually.\n• Triple tax exemption (exempt on investment, interest, and maturity).\n• Account can be opened with just Rs. 250 (max Rs. 1.5 Lakh/year).",
    eligibility: "• Parents/guardian of a girl child below 10 years of age (max 2 accounts per family).",
    documents: "• Birth Certificate of the girl child\n• Aadhaar Card and PAN of the parents/guardian\n• Address Proof and photograph",
    applicationProcess: "1. Visit the nearest post office or public bank branch.\n2. Submit the SSY account form along with girl's birth certificate.\n3. Make the initial deposit (minimum Rs. 250) to open the account.",
    officialSource: "https://www.indiapost.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 185
  },
  {
    id: 38,
    title: "Mahila Samman Saving Certificate",
    category: "Women Welfare",
    description: "A small savings scheme for women and girls offering fixed high interest rates for a tenure of 2 years.",
    benefits: "• Fixed interest rate of 7.5% per annum.\n• Flexible deposit limits (minimum Rs. 1,000, maximum Rs. 2 Lakh).\n• Partial withdrawal option (up to 40%) allowed after 1 year.",
    eligibility: "• Any woman or girl child (represented by guardian).",
    documents: "• Aadhaar Card\n• PAN Card\n• Savings Bank Account details",
    applicationProcess: "1. Visit any post office or authorized nationalized bank.\n2. Submit the Mahila Samman account opening form.\n3. Deposit the investment amount in cash/cheque to receive the certificate.",
    officialSource: "https://www.indiapost.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 120
  },
  {
    id: 39,
    title: "Beti Bachao Beti Padhao (BBBP)",
    category: "Women Welfare",
    description: "Joint initiative to prevent female foeticide, ensure girl survival, and support girl child education.",
    benefits: "• Special scholarships and free schooling benefits for girl students.\n• Direct cash incentives for school enrollments and toilet construction.\n• Local gender sensitization and girl safety programs.",
    eligibility: "• Families with a girl child, and girl students studying in public schools.",
    documents: "• Birth Certificate of girl child\n• Aadhaar Cards of child and parents",
    applicationProcess: "1. Contact local school headmaster or block education officer.\n2. Apply for girl scholarships and free education benefits.\n3. Sukanya Samriddhi accounts can be opened simultaneously.",
    officialSource: "https://wcd.nic.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 140
  },
  {
    id: 40,
    title: "PM Matru Vandana Yojana (PMMVY)",
    category: "Women Welfare",
    description: "Maternity benefit scheme providing cash incentives of Rs. 5,000 to pregnant women for the first child.",
    benefits: "• Cash incentive of Rs. 5,000 paid in two installments directly to bank account.\n• Promotes institutional deliveries and immunization for newborns.",
    eligibility: "• Pregnant women and lactating mothers for their first live child (excluding government employees).",
    documents: "• Mother-Child Protection (MCP) card\n• Aadhaar Card of husband and wife\n• Bank Passbook details\n• Birth registration of child",
    applicationProcess: "1. Register pregnancy details at local Anganwadi center or government health center.\n2. Submit the PMMVY application form with MCP card details within 150 days of LMP.\n3. Cash is credited automatically post health checkups.",
    officialSource: "https://pmmvy.wcd.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 110
  },
  {
    id: 41,
    title: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    category: "Women Welfare",
    description: "Provides deposit-free LPG connections to women belonging to below poverty line (BPL) households.",
    benefits: "• Free deposit-free LPG connection including regulator, hose, and domestic gas card.\n• Financial assistance of Rs. 1,600 per connection.\n• Interest-free loan option for hot plate and cylinder refills.",
    eligibility: "• Adult women belonging to BPL households (SC/ST, PMAY beneficiaries).",
    documents: "• BPL Ration Card\n• Aadhaar Card of applicant and adult family members\n• Bank Passbook",
    applicationProcess: "1. Visit the nearest LPG distributor or apply online at pmuy.gov.in.\n2. Submit form with Aadhaar and BPL ration card copies.\n3. Distributor verifies details and issues the connection.",
    officialSource: "https://pmuy.gov.in",
    stateApplicability: "All India",
    isFeatured: false,
    viewCount: 150
  },
  {
    id: 42,
    title: "Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme)",
    category: "Education",
    description: "Provides monthly financial assistance of Rs. 1,000 to female students from government schools who enroll in higher education courses in Tamil Nadu.",
    benefits: "• Monthly incentive of Rs. 1,000 directly credited to the student's bank account until completion of UG/Diploma/ITI.\n• Helps reduce dropout rates of girl students and encourages higher studies.",
    eligibility: "• Girl students who studied in Government schools from Class 6 to 12 in Tamil Nadu.",
    documents: "• School Transfer Certificate (TC)\n• Aadhaar Card\n• College Admission Proof\n• Bank Passbook",
    applicationProcess: "1. Apply through the college office or online via the Penkalvi portal.\n2. Submit school education certificates (6th to 12th) and college admission letters.\n3. Verification by the social welfare department.\n4. Pension/allowance starts upon approval.",
    officialSource: "https://www.penkalvi.tn.gov.in",
    stateApplicability: "Tamil Nadu",
    isFeatured: false,
    viewCount: 220
  },
  {
    id: 43,
    title: "Tamil Nadu Illam Thedi Kalvi",
    category: "Education",
    description: "A volunteer-led home-based education scheme designed to bridge learning gaps for primary and upper-primary children in Tamil Nadu.",
    benefits: "• Free evening remedial classes within the neighborhood.\n• Interactive, activity-based learning materials provided to volunteers.\n• Reduces post-pandemic academic deficits.",
    eligibility: "• Open to all school-going children in Tamil Nadu from Class 1 to 8.",
    documents: "• No formal documents required for students. Volunteers must register with educational qualifications (12th pass/degree).",
    applicationProcess: "1. Parents can send children to local neighborhood study centers run by volunteers.\n2. Register directly with the local volunteer instructor.",
    officialSource: "https://illamthedikalvi.tnschools.gov.in",
    stateApplicability: "Tamil Nadu",
    isFeatured: false,
    viewCount: 140
  },
  {
    id: 44,
    title: "Maharashtra Majhi Ladki Bahin Yojana",
    category: "Women Welfare",
    description: "A financial support scheme in Maharashtra providing monthly assistance to women from low-income families.",
    benefits: "• Monthly direct benefit transfer of Rs. 1,500 into the bank account of the woman head.\n• Promotes financial autonomy and health of women in Maharashtra.",
    eligibility: "• Female residents of Maharashtra aged 21 to 65 years.\n• Annual family income must be less than Rs. 2.5 Lakh.",
    documents: "• Domicile Certificate of Maharashtra\n• Aadhaar Card\n• Income Certificate\n• Bank Passbook",
    applicationProcess: "1. Apply online via the Nari Shakti Doot app or visit local Anganwadi/CSC.\n2. Upload documents and register biometrics.\n3. Verification by local revenue officers.\n4. Monthly transfers credit automatically.",
    officialSource: "https://ladkibahin.maharashtra.gov.in",
    stateApplicability: "Maharashtra",
    isFeatured: true,
    viewCount: 450
  },
  {
    id: 45,
    title: "Maharashtra Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)",
    category: "Healthcare",
    description: "Maharashtra state's flagship cashless health insurance scheme offering coverage for selected specialty medical procedures.",
    benefits: "• Cashless medical coverage up to Rs. 5 Lakh per family per year.\n• Access to free diagnostics, operations, and post-operative care at empanelled network hospitals.",
    eligibility: "• Families holding Yellow, Orange, or Antyodaya ration cards in Maharashtra.",
    documents: "• Yellow/Orange Ration Card\n• Aadhaar Card or Voter ID\n• Photo ID proof",
    applicationProcess: "1. Visit the helpdesk of any empanelled hospital (Arogyamitra helpdesk).\n2. Present ration card and health cards.\n3. Hospital raises a pre-authorization request.\n4. Cashless treatment is administered upon approval.",
    officialSource: "https://www.jeevandayee.gov.in",
    stateApplicability: "Maharashtra",
    isFeatured: false,
    viewCount: 310
  },
  {
    id: 46,
    title: "Maharashtra Sanjay Gandhi Niradhaar Anudan Yojana",
    category: "Social Security",
    description: "Provides monthly financial aid to destitute persons, blind, disabled, orphans, and women suffering from major illnesses in Maharashtra.",
    benefits: "• Monthly pension of Rs. 1,500 to help meet basic needs.\n• Direct credit to bank accounts.",
    eligibility: "• Destitute, disabled (40%+ disability), orphans, or single women with family income under Rs. 21,000/year.",
    documents: "• Age Proof\n• Disability Certificate (if applicable)\n• Income Certificate\n• Maharashtra Domicile",
    applicationProcess: "1. Collect the application form from the office of Tehsildar or Collector.\n2. Submit the form with documents.\n3. The Sanjay Gandhi Committee reviews and approves applications.",
    officialSource: "https://maharashtra.gov.in",
    stateApplicability: "Maharashtra",
    isFeatured: false,
    viewCount: 195
  },
  {
    id: 47,
    title: "Delhi Ladli Scheme",
    category: "Women Welfare",
    description: "A scheme of the Delhi Government that offers financial incentives at various milestones of a girl child's education to prevent dropouts.",
    benefits: "• Cash deposits at birth and upon admission to classes I, VI, IX, XI, and XII.\n• The accumulated amount (approx Rs. 1 Lakh) is given to the girl when she turns 18 and passes class X/XII.",
    eligibility: "• Parents residing in Delhi for at least 3 years, family income < Rs. 1 Lakh/year. Girl must be born in Delhi.",
    documents: "• Birth Certificate of the girl child\n• Residence Proof (3 years)\n• Income Certificate\n• Aadhaar Card",
    applicationProcess: "1. Apply within one year of the girl's birth or at the time of school admission.\n2. Submit application to District Women and Child Development Office or SBI.",
    officialSource: "https://wcd.delhi.gov.in",
    stateApplicability: "Delhi",
    isFeatured: false,
    viewCount: 280
  },
  {
    id: 48,
    title: "Delhi Mukhyamantri Tirath Yatra Yojana",
    category: "Social Security",
    description: "Provides free pilgrimage tours to senior citizens of Delhi to selected holy places across India.",
    benefits: "• Free AC train travel, boarding, lodging, meals, and insurance for the pilgrim and one helper.\n• Guided tours to spots like Ayodhya, Rameshwaram, Dwarka, etc.",
    eligibility: "• Senior citizens aged 60 and above residing in Delhi. Must not be a government employee.",
    documents: "• Delhi Voter ID card (mandatory)\n• Aadhaar Card\n• Self-declaration of physical fitness from a doctor",
    applicationProcess: "1. Apply online on the Delhi e-District portal (edistrict.delhigovt.nic.in).\n2. Upload Voter ID, Aadhaar, and fitness certificate.\n3. Selected candidates are notified about train schedules.",
    officialSource: "https://edistrict.delhigovt.nic.in",
    stateApplicability: "Delhi",
    isFeatured: false,
    viewCount: 190
  },
  {
    id: 49,
    title: "Karnataka Gruha Lakshmi Scheme",
    category: "Women Welfare",
    description: "A direct benefit transfer scheme of Karnataka that supports women heads of households with a monthly allowance.",
    benefits: "• Direct financial assistance of Rs. 2,000 per month credited via DBT.\n• Supports household expenditure and reduces poverty for women.",
    eligibility: "• Woman designated as the 'head of household' in RC/Antyodaya/BPL cards. Must not be a taxpayer.",
    documents: "• Ration Card (BPL/APL)\n• Aadhaar Cards of woman and husband\n• Mobile number linked to Aadhaar\n• Bank Passbook",
    applicationProcess: "1. Register at Karnataka One, Bangalore One, Grama One centers or online on Seva Sindhu portal.\n2. Provide Aadhaar card and ration card details for e-KYC.\n3. Application is processed and DBT starts.",
    officialSource: "https://sevasindhugs.karnataka.gov.in",
    stateApplicability: "Karnataka",
    isFeatured: true,
    viewCount: 420
  },
  {
    id: 50,
    title: "Karnataka Shakti Scheme",
    category: "Social Security",
    description: "Provides free bus travel for women, girls, and transgender residents of Karnataka in state-run road transport corporations.",
    benefits: "• Free travel in non-luxury state buses (KSRTC, BMTC, NWKRTC, KKRTC).\n• Ensures safe and free mobility for education, work, and leisure.",
    eligibility: "• All female and transgender residents of Karnataka.",
    documents: "• Government-issued ID card with Karnataka address (Aadhaar, Voter ID, DL, etc.). Shakti Smart Card is issued for seamless access.",
    applicationProcess: "1. Show any state address ID proof to the bus conductor to receive a free ticket.\n2. Apply for the Shakti Smart Card online via Seva Sindhu portal for long-term use.",
    officialSource: "https://sevasindhu.karnataka.gov.in",
    stateApplicability: "Karnataka",
    isFeatured: false,
    viewCount: 380
  },
  {
    id: 51,
    title: "West Bengal Lakshmir Bhandar Scheme",
    category: "Women Welfare",
    description: "Provides monthly financial assistance to female heads of families in West Bengal to support general household expenses.",
    benefits: "• Monthly allowance of Rs. 1,000 for General category and Rs. 1,200 for SC/ST category.\n• Direct bank transfer to the female head of the family.",
    eligibility: "• Female residents of West Bengal aged 25 to 60 years.\n• Must have a Swasthya Sathi card.",
    documents: "• Swasthya Sathi Card\n• Aadhaar Card\n• SC/ST Certificate (for higher rate)\n• Bank Passbook",
    applicationProcess: "1. Collect the application form from local 'Duare Sarkar' camps.\n2. Submit the filled form with documents at the camp.\n3. Application verified and monthly pension starts.",
    officialSource: "https://socialsecurity.wb.gov.in",
    stateApplicability: "West Bengal",
    isFeatured: true,
    viewCount: 480
  },
  {
    id: 52,
    title: "West Bengal Kanyashree Prakalpa",
    category: "Education",
    description: "A conditional cash transfer scheme aimed at improving the status and education of girls and preventing child marriage in West Bengal.",
    benefits: "• Annual scholarship of Rs. 1,000 (K1) to girls aged 13-18 (grades VIII-XII) to continue schooling.\n• One-time grant of Rs. 25,000 (K2) when the girl turns 18 and is still unmarried and studying.",
    eligibility: "• Unmarried girl residents of West Bengal studying in recognized schools/colleges.\n• Family income under Rs. 1.2 Lakh/year (waived for disabled girls or orphans).",
    documents: "• Enrollment Certificate from School/College\n• Unmarried status declaration\n• Income Certificate\n• Aadhaar Card",
    applicationProcess: "1. Collect application forms from the school/college.\n2. Submit filled form with headmaster's certification.\n3. Data is uploaded to the Kanyashree portal and money credited directly.",
    officialSource: "https://www.wbkanyashree.gov.in",
    stateApplicability: "West Bengal",
    isFeatured: false,
    viewCount: 350
  },
  {
    id: 53,
    title: "West Bengal Sabooj Sathi Scheme",
    category: "Education",
    description: "Distributes bicycles to students of government and government-aided schools to ease their travel to school in West Bengal.",
    benefits: "• Free high-quality bicycle distributed directly at school.\n• Enhances student attendance and reduces school dropout rates, especially in rural areas.",
    eligibility: "• Boys and girls studying in Class IX, X, XI, and XII in Government/Government-aided schools in West Bengal.",
    documents: "• School ID Card\n• Student Registration details",
    applicationProcess: "1. No individual application required.\n2. Schools submit student roll lists of eligible classes to the district administration.\n3. Bicycles are distributed in school distribution camps.",
    officialSource: "http://www.wbsaboojsathi.gov.in",
    stateApplicability: "West Bengal",
    isFeatured: false,
    viewCount: 260
  }
];

// 4. Generating exactly 135 News Articles
const NEWS_CATEGORIES = ["New Laws", "Scheme Updates", "Public Advisories", "Government Notifications"];
const NEWS_SOURCES = ["PIB India", "PIB Finance Ministry", "PIB Law Ministry", "NDTV India", "The Hindu"];

const HEADLINE_TEMPLATES = [
  {
    category: "New Laws",
    title: "Supreme Court Rules on Digital Personal Data Privacy and Consent",
    summary: "Landmark judgment defines strict guidelines for mobile app companies collecting biometric details.",
    content: "The Supreme Court of India in a unanimous decision ruled that digital personal data collection must be strictly backed by explicit consent. Mobile apps can no longer force users to provide biometric details for simple service access.",
    source: "The Hindu"
  },
  {
    category: "New Laws",
    title: "Parliament Passes Real Estate Regulation (Amendment) Bill",
    summary: "New provisions mandate immediate escrow accounts for all residential projects above 4 units.",
    content: "The Parliament has approved the RERA Amendment Bill, tightening accountability on developers. Builders must now deposit 70% of buyer payments in dedicated escrow accounts, even for smaller projects.",
    source: "PIB Law Ministry"
  },
  {
    category: "New Laws",
    title: "Motor Vehicle Amendment Act: Fine Structure Revised for Over-speeding",
    summary: "Transport Ministry increases highway over-speeding fines to control accidents.",
    content: "The Ministry of Road Transport has notified revisions to fine structures. Highway over-speeding will now attract a fine of Rs. 2,000 for the first offence, and license suspension for subsequent violations.",
    source: "PIB India"
  },
  {
    category: "Scheme Updates",
    title: "Union Budget: Standard Tax Deduction Raised to Rs. 75,000",
    summary: "Salaried taxpayers under the default new tax regime receive tax reliefs.",
    content: "The Finance Ministry announced standard deduction enhancements in the budget. Taxpayers under the new tax regime will get Rs. 75,000 standard deduction, up from Rs. 50,000.",
    source: "PIB Finance Ministry"
  },
  {
    category: "Scheme Updates",
    title: "Ayushman Bharat Scheme Expanded for Citizens Above 70 Years",
    summary: "Senior citizens above 70 get additional free health insurance cover of Rs. 5 Lakh.",
    content: "The Union Cabinet has approved expanding the PM-JAY health insurance scheme. All senior citizens aged 70 and above will get a free health card with Rs. 5 Lakh annual cover, irrespective of income.",
    source: "PIB India"
  },
  {
    category: "Scheme Updates",
    title: "PM-KISAN: 17th Installment of Rs. 2,000 Disbursed to Farmers",
    summary: "Direct Benefit Transfer deposits income support funds to 9.2 Crore landholders.",
    content: "The Prime Minister has released the 17th installment of the PM-KISAN income support scheme. Over Rs. 20,000 Crore was disbursed directly to landholding farmers' bank accounts via DBT.",
    source: "PIB Finance Ministry"
  },
  {
    category: "Public Advisories",
    title: "RBI Issues Warning Against UPI Phishing and Screen-Sharing Scams",
    summary: "Advisory urges consumers never to download screen-sharing apps during banking calls.",
    content: "The Reserve Bank of India has issued a public advisory cautioning citizens against growing UPI frauds. Scammers are using screen-sharing apps to extract PINs; RBI reminds that banks never ask for OTPs or PINs.",
    source: "NDTV India"
  },
  {
    category: "Public Advisories",
    title: "Cyber Cell Alerts: Rise in Part-Time Job Scam Messages on WhatsApp",
    summary: "Advisory cautions citizens against payment requests for online tasks.",
    content: "The National Cyber Crime Cell has warned citizens of fake part-time job offers. Victims are lured with small profits, then tricked into depositing lakhs; call 1930 immediately to report frauds.",
    source: "NDTV India"
  },
  {
    category: "Government Notifications",
    title: "UIDAI Launches Free Online Document Update Service Till December",
    summary: "Citizens can upload identity and address proof documents for free on myAadhaar.",
    content: "The UIDAI has extended the free online document update service. Citizens who got their Aadhaar card 10 years ago are requested to update their proof of identity and address online for free.",
    source: "PIB India"
  },
  {
    category: "Government Notifications",
    title: "State Income Certificate Applications Move Entirely Online",
    summary: "Revenue Department shifts income certificate processing to digital portals to curb delays.",
    content: "The Revenue Department has notified that physical applications for Income Certificates will no longer be accepted. All applications must be filed online through the e-district portal, with processing completed in 7-15 days.",
    source: "The Hindu"
  }
];

const LOCATIONS = ["Chennai", "Coimbatore", "Delhi", "Mumbai", "Bengaluru", "Kolkata", "Madurai", "Trichy", "Kochi", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Patna"];

function generateNewsArticles(count: number): any[] {
  const articles: any[] = [];
  const now = new Date();
  
  for (let i = 1; i <= count; i++) {
    const template = HEADLINE_TEMPLATES[(i - 1) % HEADLINE_TEMPLATES.length];
    const location = LOCATIONS[i % LOCATIONS.length];
    const title = `${location}: ${template.title} (Update #${i})`;
    const publishedAt = new Date(now.getTime() - i * 4 * 60 * 60 * 1000).toISOString();
    
    articles.push({
      id: i,
      title,
      category: template.category,
      summary: `${template.summary} Verified news update for ${location} residents.`,
      content: `${template.content}\n\nThis update is part of public notifications issued in ${location}. Please refer to official web resources for detailed guidelines.\n\nSource: ${template.source}`,
      source: template.source,
      publishedAt
    });
  }
  
  return articles;
}

const GENERATED_NEWS = generateNewsArticles(135);

const FULL_SEED_DATA = {
  laws: LAWS,
  schemes: SCHEMES,
  services: SERVICES,
  complaints: [
    {
      id: 1,
      title: "Consumer Court Complaint Wizard",
      category: "Consumer Court",
      issue: "A consumer purchased a defective washing machine. The retailer refuses a refund, and the brand's service center is unresponsive.",
      steps: "Step 1: Send a formal written notice to the company giving 15 days to resolve.\nStep 2: File a free report at the National Consumer Helpline (1915).\nStep 3: If unresolved, log in to edaakhil.nic.in.\nStep 4: Draft your complaint, upload the bill, written notice copy, and photos of the defect.\nStep 5: Pay the commission fee (FREE up to Rs. 5 lakh) and submit the petition.",
      authority: "District Consumer Disputes Redressal Commission",
      officialPortal: "https://edaakhil.nic.in",
      downloadableFormats: "Consumer Notice Template, Formal Complaint Petition Format"
    },
    {
      id: 2,
      title: "Cyber Crime Financial Fraud Reporting",
      category: "Cyber Crime",
      issue: "A citizen fell victim to a UPI phishing scam, and Rs. 50,000 was debited from their bank account without authorization.",
      steps: "Step 1: CALL 1930 immediately (within the golden hour) to report the scam. The operator will coordinate with banks to freeze the money trail.\nStep 2: Take screenshots of all payment receipts, SMS alerts, and transaction IDs.\nStep 3: Call your bank helpline to freeze your account and debit card.\nStep 4: Register the complaint at cybercrime.gov.in.\nStep 5: Submit the transaction details, screenshots, and bank account info.",
      authority: "National Cyber Crime Reporting Portal",
      officialPortal: "https://cybercrime.gov.in",
      downloadableFormats: "UPI Fraud Evidence Sheet, Bank Dispute Form Letter"
    }
  ],
  news: GENERATED_NEWS,
  documentTemplates: [
    {
      id: 1,
      name: "House Rental Agreement",
      description: "Standard draft agreement between property landlord and tenant for residential lease.",
      fields: JSON.stringify([
        { key: "landlordName", label: "Landlord Full Name" },
        { key: "tenantName", label: "Tenant Full Name" },
        { key: "propertyAddress", label: "Lease Property Address" },
        { key: "rentAmount", label: "Monthly Rent Amount (Rs.)" },
        { key: "depositAmount", label: "Security Deposit Amount (Rs.)" },
        { key: "termMonths", label: "Agreement Term (Months)" }
      ]),
      category: "Property"
    },
    {
      id: 2,
      name: "Standard Self-Declaration Affidavit",
      description: "Self-attested affidavit sworn by a citizen for general declaration purposes.",
      fields: JSON.stringify([
        { key: "declarantName", label: "Full Name of Declarant" },
        { key: "fatherName", label: "Father's / Guardian's Name" },
        { key: "address", label: "Residential Address" },
        { key: "declarationText", label: "Statement of Declaration" },
        { key: "purpose", label: "Purpose of Affidavit" }
      ]),
      category: "General Legal"
    },
    {
      id: 3,
      name: "Consumer Complaint Letter Template",
      description: "Official legal notice format to send to a retailer or brand before taking court action.",
      fields: JSON.stringify([
        { key: "complainantName", label: "Your Full Name" },
        { key: "complainantAddress", label: "Your Billing Address" },
        { key: "companyName", label: "Name of Defaulter Company" },
        { key: "productDetails", label: "Product / Service Purchased Details" },
        { key: "defectDetails", label: "Details of Defect / Complaint" },
        { key: "pricePaid", label: "Price Paid (Rs.)" }
      ]),
      category: "Consumer Protection"
    }
  ],
  courses: [
    { id: 1, title: "Constitutional Rights", description: "Learn about your 6 fundamental rights, directive principles, and how to file writs.", lessons: 5, xpReward: 100, category: "Rights", icon: "Scale" },
    { id: 2, title: "RTI (Right to Information)", description: "Understand how to file RTI applications, timelines, appeals, and penalties.", lessons: 5, xpReward: 100, category: "Laws", icon: "BookOpen" },
    { id: 3, title: "Consumer Protection Act 2019", description: "Know your rights as a consumer, unfair trade practices, and how to file complaints online.", lessons: 5, xpReward: 100, category: "Laws", icon: "FileText" },
    { id: 4, title: "Women's Safety and Legal Rights", description: "Learn about domestic violence laws, workplace safety (POSH), and helplines.", lessons: 6, xpReward: 120, category: "Rights", icon: "User" }
  ],
  quizzes: [
    { id: 1, title: "Constitutional Rights Quiz", questions: 9, xpReward: 90, category: "Rights" },
    { id: 2, title: "Consumer Protection Quiz", questions: 10, xpReward: 100, category: "Laws" },
    { id: 3, title: "RTI Act Quiz", questions: 6, xpReward: 60, category: "Laws" },
    { id: 4, title: "Labour Law Quiz", questions: 10, xpReward: 100, category: "Workplace" }
  ],
  chatMessages: [],
  suggestedQuestions: [
    { id: 1, question: "How do I file an RTI application?", category: "RTI" },
    { id: 2, question: "What are my consumer rights for online purchases?", category: "Consumer" },
    { id: 3, question: "How do I report cyber fraud and block transactions?", category: "Cyber" },
    { id: 4, question: "What is the procedure for instant e-PAN?", category: "PAN" }
  ],
  bookmarks: []
};

const TS_CONTENT = `export const SEED_DATA: Record<string, any[]> = ${JSON.stringify(FULL_SEED_DATA, null, 2)};\n`;

fs.writeFileSync(SEED_TS_PATH, TS_CONTENT, "utf8");
console.log("Successfully generated seedData.ts at:", SEED_TS_PATH);

fs.writeFileSync(DB_JSON_PATH, JSON.stringify(FULL_SEED_DATA, null, 2), "utf8");
console.log("Successfully generated db.json at:", DB_JSON_PATH);
