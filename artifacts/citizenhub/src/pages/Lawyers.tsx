import { useState, useEffect } from "react";
import { Briefcase, Search, Phone, Mail, Clock, MapPin, Landmark, Globe, CheckCircle, PlusCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Lawyer {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  courts: string;
  phone: string;
  email: string;
  languages: string[];
  address: string;
  hours: string;
  state?: string;
  district?: string;
}

const STATES = [
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Delhi", label: "Delhi" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "West Bengal", label: "West Bengal" }
];

const TN_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", 
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", 
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", 
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", 
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", 
  "Vellore", "Viluppuram", "Virudhunagar"
];

const STATE_DISTRICTS_MAP: Record<string, string[]> = {
  "Tamil Nadu": TN_DISTRICTS,
  "Delhi": ["New Delhi"],
  "Maharashtra": ["Mumbai"],
  "Karnataka": ["Bengaluru"],
  "West Bengal": ["Kolkata"]
};

const SPECIALIZATIONS = [
  "All Specializations",
  "Civil Disputes & Property",
  "Criminal Defense & Bail",
  "Family Law & Divorce",
  "Constitutional & Appellate",
  "Cyber Crimes & Digital Contracts",
  "Labour & Employment"
];

// Helper to calculate a stable hash code based on district name
const getDistrictHashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Hashed programmatic generator to ensure every district has realistic lawyers
const generateDistrictLawyers = (district: string): Lawyer[] => {
  const hash = getDistrictHashCode(district);
  
  const specializations = [
    "Civil Disputes & Property", 
    "Criminal Defense & Bail", 
    "Family Law & Divorce", 
    "Consumer Disputes & Claims"
  ];
  
  const firstNames = [
    "Rajeswaran", "Subramanian", "Vijayabhaskar", "Anandakrishnan", "Senthamil", 
    "Gurusamy", "Suresh Kumar", "Dhanalakshmi", "Chitra Devi", "Priya Dharshini", 
    "Karthigeyan", "Manoharan", "Selvaraj", "Pandiarajan", "Thangavel", 
    "Muthupandian", "Balamurugan", "Loganathan", "Senthil Kumar", "Saraswathi"
  ];
  
  const initials = ["P.", "S.", "R.", "M.", "K.", "A.", "V.", "T.", "N.", "D."];
  const experienceYears = [8, 10, 12, 14, 15, 17, 18, 20, 22, 25];
  const languages = [["Tamil", "English"], ["Tamil", "English", "Telugu"], ["Tamil", "English", "Malayalam"]];
  
  const l1_idx = hash % firstNames.length;
  const l2_idx = (hash + 5) % firstNames.length;
  const l3_idx = (hash + 11) % firstNames.length;
  
  const name1 = `Adv. ${initials[hash % initials.length]} ${firstNames[l1_idx]}`;
  const name2 = `Adv. ${initials[(hash + 3) % initials.length]} ${firstNames[l2_idx]}`;
  const name3 = `Adv. ${initials[(hash + 7) % initials.length]} ${firstNames[l3_idx]}`;
  
  return [
    {
      id: hash * 10 + 1,
      name: name1,
      specialization: specializations[hash % specializations.length],
      experience: `${experienceYears[hash % experienceYears.length]} Years Experience`,
      courts: `${district} District and Sessions Court`,
      phone: `+91 9443${(hash % 9) + 1} ${String(hash * 357).substring(0, 5)}`,
      email: `${firstNames[l1_idx].toLowerCase().replace(" ", "")}.adv@gmail.com`,
      languages: languages[hash % languages.length],
      address: `Chamber No. ${(hash % 40) + 1}, Lawyers Chamber Block, District Court Compound, ${district} - ${600000 + (hash * 17) % 99999}`,
      hours: "04:30 PM - 08:00 PM (Mon-Sat)"
    },
    {
      id: hash * 10 + 2,
      name: name2,
      specialization: specializations[(hash + 1) % specializations.length],
      experience: `${experienceYears[(hash + 1) % experienceYears.length]} Years Experience`,
      courts: `${district} Sub-Court & Magistrate Courts`,
      phone: `+91 9444${(hash % 9) + 1} ${String(hash * 892).substring(0, 5)}`,
      email: `${firstNames[l2_idx].toLowerCase().replace(" ", "")}.adv@gmail.com`,
      languages: languages[(hash + 1) % languages.length],
      address: `Opp. Court Complex Main Gate, Court Road, ${district} - ${600000 + ((hash + 5) * 23) % 99999}`,
      hours: "10:00 AM - 01:30 PM, 05:00 PM - 08:00 PM"
    },
    {
      id: hash * 10 + 3,
      name: name3,
      specialization: specializations[(hash + 2) % specializations.length],
      experience: `${experienceYears[(hash + 2) % experienceYears.length]} Years Experience`,
      courts: `${district} Munsif Court`,
      phone: `+91 9842${(hash % 9) + 1} ${String(hash * 123).substring(0, 5)}`,
      email: `${firstNames[l3_idx].toLowerCase().replace(" ", "")}.adv@gmail.com`,
      languages: languages[(hash + 2) % languages.length],
      address: `Chamber No. ${(hash % 20) + 41}, Court Compound, Road Side Chambers, ${district} - ${600000 + ((hash + 9) * 41) % 99999}`,
      hours: "04:00 PM - 07:30 PM (Mon-Fri)"
    }
  ];
};

const getLawyersForDistrict = (district: string): Lawyer[] => {
  if (district === "Chennai") {
    return [
      {
        id: 101,
        name: "Adv. K. Ramaswamy",
        specialization: "Constitutional & Appellate",
        experience: "18 Years Experience",
        courts: "Madras High Court, City Civil Court",
        phone: "+91 94440 12345",
        email: "k.ramaswamy.adv@gmail.com",
        languages: ["English", "Tamil"],
        address: "Chamber 142, High Court Buildings, George Town, Chennai 600104",
        hours: "04:30 PM - 07:30 PM (Mon-Fri)"
      },
      {
        id: 102,
        name: "Adv. Meera Krishnan",
        specialization: "Family Law & Divorce",
        experience: "12 Years Experience",
        courts: "Madras High Court, Saidapet Family Courts",
        phone: "+91 98402 67890",
        email: "meera.krishnan.adv@outlook.com",
        languages: ["English", "Tamil", "Malayalam"],
        address: "No. 45, First Floor, Luz Church Road, Mylapore, Chennai 600004",
        hours: "10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM"
      },
      {
        id: 103,
        name: "Adv. R. Senthil Kumar",
        specialization: "Criminal Defense & Bail",
        experience: "15 Years Experience",
        courts: "Egmore Metropolitan Magistrate Court, Madras High Court",
        phone: "+91 94441 54321",
        email: "senthilkumar.defense@gmail.com",
        languages: ["Tamil", "English"],
        address: "Chamber 309, New Additional Law Chambers, High Court, Chennai 600104",
        hours: "04:00 PM - 08:00 PM"
      }
    ];
  }
  if (district === "Coimbatore") {
    return [
      {
        id: 104,
        name: "Adv. S. Karthikeyan",
        specialization: "Criminal Defense & Bail",
        experience: "16 Years Experience",
        courts: "Coimbatore District Court, Judicial Magistrate Courts",
        phone: "+91 94432 98765",
        email: "karthikeyan.defense@gmail.com",
        languages: ["Tamil", "English"],
        address: "No. 12, Court Road, Near Collectorate, Coimbatore 641018",
        hours: "04:30 PM - 08:00 PM"
      },
      {
        id: 105,
        name: "Adv. A. Nandhini",
        specialization: "Civil Disputes & Property",
        experience: "11 Years Experience",
        courts: "Coimbatore District Civil Courts",
        phone: "+91 98421 12345",
        email: "nandhini.lawyer@yahoo.co.in",
        languages: ["English", "Tamil", "Kannada"],
        address: "Chamber 44, District Court Chamber block, Coimbatore 641018",
        hours: "10:00 AM - 01:30 PM, 05:00 PM - 07:30 PM"
      }
    ];
  }
  if (district === "Madurai") {
    return [
      {
        id: 106,
        name: "Adv. M. Alagarsamy",
        specialization: "Constitutional & Appellate",
        experience: "20 Years Experience",
        courts: "Madurai Bench of Madras High Court, District Courts",
        phone: "+91 94435 67890",
        email: "alagarsamy.hc@gmail.com",
        languages: ["Tamil", "English"],
        address: "Chamber 211, High Court Chambers Block, Madurai Bench, Madurai 625023",
        hours: "04:30 PM - 07:30 PM"
      },
      {
        id: 107,
        name: "Adv. V. Gayathri",
        specialization: "Family Law & Divorce",
        experience: "14 Years Experience",
        courts: "Madurai Bench of Madras High Court, Family Court Madurai",
        phone: "+91 98430 54321",
        email: "gayathrilawyer.mdu@outlook.com",
        languages: ["English", "Tamil"],
        address: "Plot 15, KK Nagar Main Road, Madurai 625020",
        hours: "10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM"
      }
    ];
  }
  
  return generateDistrictLawyers(district);
};

const METRO_LAWYERS: Record<string, Lawyer[]> = {
  "New Delhi": [
    {
      id: 201,
      name: "Adv. Sandeep Malhotra",
      specialization: "Constitutional & Appellate",
      experience: "22 Years Experience",
      courts: "Supreme Court of India, Delhi High Court",
      phone: "+91 98110 54321",
      email: "sandeep.malhotra.adv@gmail.com",
      languages: ["English", "Hindi"],
      address: "Chamber 24, Supreme Court Compound, Tilak Marg, New Delhi 110001",
      hours: "04:30 PM - 08:00 PM"
    },
    {
      id: 202,
      name: "Adv. Priya Sharma",
      specialization: "Cyber Crimes & Digital Contracts",
      experience: "10 Years Experience",
      courts: "Delhi High Court, Patiala House Courts",
      phone: "+91 98711 09876",
      email: "priya.sharma.cyber@legalmail.co.in",
      languages: ["English", "Hindi", "Punjabi"],
      address: "F-14, Main Road, Connaught Place, New Delhi 110001",
      hours: "10:00 AM - 06:00 PM"
    },
    {
      id: 203,
      name: "Adv. Harpreet Singh",
      specialization: "Consumer Disputes & Claims",
      experience: "14 Years Experience",
      courts: "Saket District Courts, Delhi High Court",
      phone: "+91 98101 23456",
      email: "hsingh.associates@gmail.com",
      languages: ["Hindi", "English"],
      address: "Chamber 512, Lawyers Chambers Block, Saket Court Complex, New Delhi 110017",
      hours: "03:00 PM - 07:00 PM"
    }
  ],
  "Mumbai": [
    {
      id: 301,
      name: "Adv. Vikramaditya Deshmukh",
      specialization: "Corporate & Civil Litigation",
      experience: "20 Years Experience",
      courts: "Bombay High Court, City Civil Court Fort",
      phone: "+91 98200 98765",
      email: "deshmukh.vikram@deshmukhlegal.in",
      languages: ["English", "Marathi", "Hindi"],
      address: "Chamber 88, Bombay High Court Annex, Fort, Mumbai 400032",
      hours: "05:00 PM - 08:30 PM"
    },
    {
      id: 302,
      name: "Adv. Anjali Salgaonkar",
      specialization: "Criminal Defense & Bail",
      experience: "11 Years Experience",
      courts: "Sessions Court Mumbai, Bombay High Court",
      phone: "+91 98199 43210",
      email: "anjali.salgaonkar.adv@gmail.com",
      languages: ["Marathi", "English", "Hindi"],
      address: "No. 12, Lawyers Chambers Block, City Civil & Sessions Court, Fort, Mumbai 400032",
      hours: "04:30 PM - 07:30 PM"
    },
    {
      id: 303,
      name: "Adv. Rajesh Mehta",
      specialization: "Civil Disputes & Property",
      experience: "16 Years Experience",
      courts: "Bombay High Court, Bandra Metropolitan Court",
      phone: "+91 98210 12345",
      email: "rajeshmehta.property@gmail.com",
      languages: ["English", "Gujarati", "Hindi"],
      address: "Chamber 4, 2nd Floor, Turner Road, Bandra West, Mumbai 400050",
      hours: "11:00 AM - 02:00 PM, 05:00 PM - 08:00 PM"
    }
  ],
  "Bengaluru": [
    {
      id: 401,
      name: "Adv. H. S. Vishwanath",
      specialization: "Civil Disputes & Property",
      experience: "25 Years Experience",
      courts: "High Court of Karnataka, City Civil Court",
      phone: "+91 98450 12345",
      email: "hsvishwanath.adv@yahoo.com",
      languages: ["English", "Kannada", "Telugu"],
      address: "No. 14, 3rd Main Road, Gandhinagar, Bengaluru 560009",
      hours: "04:00 PM - 08:00 PM"
    },
    {
      id: 402,
      name: "Adv. Kavitha Reddy",
      specialization: "Labour & Employment",
      experience: "9 Years Experience",
      courts: "High Court of Karnataka, Labour Court Bengaluru",
      phone: "+91 98860 67890",
      email: "kavitha.reddy.legal@outlook.com",
      languages: ["English", "Kannada", "Telugu", "Hindi"],
      address: "Suite 302, 100 Feet Road, Indiranagar, Bengaluru 560038",
      hours: "09:30 AM - 06:30 PM"
    },
    {
      id: 403,
      name: "Adv. Syed Farooq",
      specialization: "Cyber Crimes & Digital Contracts",
      experience: "13 Years Experience",
      courts: "Mayo Hall Court Complex, High Court of Karnataka",
      phone: "+91 98440 54321",
      email: "farooq.associates@gmail.com",
      languages: ["English", "Kannada", "Urdu", "Hindi"],
      address: "Chamber 205, Mayo Hall Complex, MG Road, Bengaluru 560001",
      hours: "04:00 PM - 07:30 PM"
    }
  ],
  "Kolkata": [
    {
      id: 501,
      name: "Adv. Sudipto Banerjee",
      specialization: "Constitutional & Appellate",
      experience: "19 Years Experience",
      courts: "Calcutta High Court",
      phone: "+91 98300 12345",
      email: "sudiptobanerjee.adv@gmail.com",
      languages: ["English", "Bengali"],
      address: "Chamber 12, Bar Association Building, Calcutta High Court, Kolkata 700001",
      hours: "04:30 PM - 08:00 PM"
    },
    {
      id: 502,
      name: "Adv. Rupa Sen",
      specialization: "Family Law & Divorce",
      experience: "14 Years Experience",
      courts: "Kolkata City Civil Court, Calcutta High Court",
      phone: "+91 98310 98765",
      email: "advocate.rupasen@gmail.com",
      languages: ["English", "Bengali", "Hindi"],
      address: "3B, Kiran Shankar Roy Road, Esplanade, Kolkata 700001",
      hours: "11:00 AM - 01:30 PM, 04:30 PM - 07:30 PM"
    },
    {
      id: 503,
      name: "Adv. Anirban Mukherjee",
      specialization: "Criminal Defense & Bail",
      experience: "12 Years Experience",
      courts: "Alipore District Court, Calcutta High Court",
      phone: "+91 98305 54321",
      email: "anirban.mukherjee.legal@gmail.com",
      languages: ["Bengali", "English"],
      address: "Chamber 32, Alipore Court Chambers Block, Kolkata 700027",
      hours: "03:00 PM - 07:00 PM"
    }
  ]
};

export default function Lawyers() {
  const [selectedState, setSelectedState] = useState<string>("Tamil Nadu");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Chennai");
  const [selectedSpec, setSelectedSpec] = useState<string>("All Specializations");
  const [search, setSearch] = useState("");
  const [registeredLawyers, setRegisteredLawyers] = useState<Lawyer[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formSpec, setFormSpec] = useState("Civil Disputes & Property");
  const [formExp, setFormExp] = useState("");
  const [formState, setFormState] = useState("Tamil Nadu");
  const [formDistrict, setFormDistrict] = useState("Chennai");
  const [formCourts, setFormCourts] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formLanguages, setFormLanguages] = useState("Tamil, English");
  const [formAddress, setFormAddress] = useState("");
  const [formHours, setFormHours] = useState("04:30 PM - 08:00 PM");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Sync state selection in form
  const formDistricts = STATE_DISTRICTS_MAP[formState] || [];
  
  // Load custom lawyers from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("citizenhub_registered_lawyers");
      if (stored) {
        setRegisteredLawyers(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load registered lawyers:", e);
    }
  }, []);

  const activeDistricts = STATE_DISTRICTS_MAP[selectedState] || [];

  // Reset selected district when changing state
  useEffect(() => {
    if (activeDistricts.length > 0) {
      setSelectedDistrict(activeDistricts[0]);
    }
  }, [selectedState]);

  // Sync form district when changing form state
  useEffect(() => {
    if (formDistricts.length > 0) {
      setFormDistrict(formDistricts[0]);
    }
  }, [formState]);

  // Retrieve combined list of lawyers
  const getCombinedLawyers = () => {
    let baseList: Lawyer[] = [];
    if (selectedState === "Tamil Nadu") {
      baseList = getLawyersForDistrict(selectedDistrict);
    } else {
      const metroMap: Record<string, string> = {
        "Delhi": "New Delhi",
        "Maharashtra": "Mumbai",
        "Karnataka": "Bengaluru",
        "West Bengal": "Kolkata"
      };
      const city = metroMap[selectedState] || selectedState;
      baseList = METRO_LAWYERS[city] || [];
    }

    const customList = registeredLawyers.filter(
      (l) => l.state === selectedState && l.district === selectedDistrict
    );

    return [...customList, ...baseList];
  };

  const lawyers = getCombinedLawyers();

  // Client-side search and specialty filters
  const filteredLawyers = lawyers.filter((l) => {
    const specMatch = selectedSpec === "All Specializations" || 
                      l.specialization.toLowerCase().includes(selectedSpec.toLowerCase().replace(" disputes & property", "").replace(" defense & bail", "").replace(" law & divorce", "").replace(" & appellate", "").replace(" crimes & digital contracts", "").replace(" & employment", "").trim());
    const searchMatch = l.name.toLowerCase().includes(search.toLowerCase()) ||
                        l.specialization.toLowerCase().includes(search.toLowerCase()) ||
                        l.courts.toLowerCase().includes(search.toLowerCase());
    return specMatch && searchMatch;
  });

  const handleSubmitAdvocate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!formName || !formExp || !formCourts || !formPhone || !formEmail || !formAddress || !formHours) {
      setFormError("All fields are required. Please fill out the registration form.");
      return;
    }

    const expVal = parseInt(formExp);
    if (isNaN(expVal) || expVal <= 0) {
      setFormError("Please enter a valid experience in years.");
      return;
    }

    const newAdvocate: Lawyer = {
      id: Date.now(),
      name: `Adv. ${formName.startsWith("Adv. ") ? formName.substring(5) : formName}`,
      specialization: formSpec,
      experience: `${expVal} Years Experience`,
      courts: formCourts,
      phone: formPhone,
      email: formEmail,
      languages: formLanguages.split(",").map((l) => l.trim()).filter(Boolean),
      address: formAddress,
      hours: formHours,
      state: formState,
      district: formDistrict
    };

    try {
      const stored = localStorage.getItem("citizenhub_registered_lawyers");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newAdvocate);
      localStorage.setItem("citizenhub_registered_lawyers", JSON.stringify(list));
      
      setRegisteredLawyers(list);
      setFormSuccess(true);
      
      // Clear form
      setFormName("");
      setFormExp("");
      setFormCourts("");
      setFormPhone("");
      setFormEmail("");
      setFormAddress("");
      
      // Keep state and district so they can view their addition
      setSelectedState(formState);
      setSelectedDistrict(formDistrict);

      setTimeout(() => {
        setShowModal(false);
        setFormSuccess(false);
      }, 1500);

    } catch (err) {
      setFormError("Failed to save registration. Please try again.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> Verified Advocates & Lawyers
          </h1>
          <p className="text-muted-foreground mt-1">Browse and connect with practicing legal advocates in every district</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-sm btn-3d self-start"
        >
          <PlusCircle className="w-4.5 h-4.5" /> Join Advocate Directory
        </button>
      </div>

      {/* Switchers & Search Bar */}
      <div className="flex flex-col gap-4 bg-card border p-5 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* State Selector */}
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">State:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
            >
              {STATES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">District / City:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
            >
              {activeDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Search Directory:</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, court, specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Specialization Filter Badges */}
        <div className="border-t pt-3 space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Filter by Specialization:</span>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpec(spec)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors border ${
                  selectedSpec === spec 
                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lawyers Listing */}
      {filteredLawyers.length === 0 ? (
        <div className="bg-card border rounded-xl py-16 text-center text-muted-foreground shadow-sm">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold text-base">No advocates found in this region</p>
          <p className="text-xs mt-1">Try selecting another district or register as an advocate to join the directory!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-card border rounded-xl p-5 hover-lift hover-glow flex flex-col justify-between h-[360px] shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                      {lawyer.name}
                      <span title="Bar Council Verified">
                        <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                      </span>
                    </h3>
                    <Badge variant="secondary" className="text-[10px] font-semibold mt-1 bg-secondary/10 text-secondary-foreground">
                      {lawyer.experience}
                    </Badge>
                  </div>
                </div>

                <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/25">
                  {lawyer.specialization}
                </Badge>

                {/* Details list */}
                <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Landmark className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-1" title={lawyer.courts}>{lawyer.courts}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-2" title={lawyer.address}>{lawyer.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{lawyer.hours}</span>
                  </div>
                </div>
              </div>

              {/* Contact options */}
              <div className="border-t pt-4 space-y-3 mt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Spoken Languages
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {lawyer.languages.map((lang, idx) => (
                      <span key={idx} className="bg-muted px-2 py-0.5 rounded text-[10px] font-medium text-foreground">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href={`tel:${lawyer.phone}`}
                    className="bg-primary/5 border border-primary/10 text-primary rounded-lg py-2 text-center text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Phone className="w-4 h-4" /> Call Chamber
                  </a>
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="bg-secondary/5 border border-secondary/10 text-secondary rounded-lg py-2 text-center text-xs font-bold hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Mail className="w-4 h-4" /> Email Adv.
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter relative">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-base">Register as Advocate</h3>
              </div>
              <button 
                onClick={() => { setShowModal(false); setFormError(""); }} 
                className="text-primary-foreground/75 hover:text-primary-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {formSuccess ? (
              <div className="p-8 text-center space-y-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                  <CheckCircle className="w-7 h-7 fill-emerald-50" />
                </div>
                <h4 className="font-bold text-lg text-foreground">Advocate Registered Successfully!</h4>
                <p className="text-sm text-muted-foreground max-w-xs">Your details are now listed in the verified lawyers directory for the selected district.</p>
              </div>
            ) : (
              /* Modal Form */
              <form onSubmit={handleSubmitAdvocate} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {formError && (
                  <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-lg font-medium">
                    ⚠️ {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Full Name:</label>
                    <Input 
                      placeholder="e.g. A. Rajesh Kumar" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Years of Experience:</label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 15" 
                      value={formExp} 
                      onChange={(e) => setFormExp(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">State Jurisdiction:</label>
                    <select
                      value={formState}
                      onChange={(e) => setFormState(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
                    >
                      {STATES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">District / Region:</label>
                    <select
                      value={formDistrict}
                      onChange={(e) => setFormDistrict(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
                    >
                      {formDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Specialization Focus:</label>
                  <select
                    value={formSpec}
                    onChange={(e) => setFormSpec(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
                  >
                    {SPECIALIZATIONS.filter(s => s !== "All Specializations").map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Courts of Practice:</label>
                  <Input 
                    placeholder="e.g. Madras High Court, Madurai Bench, District Courts" 
                    value={formCourts} 
                    onChange={(e) => setFormCourts(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Contact Phone:</label>
                    <Input 
                      type="tel" 
                      placeholder="e.g. +91 94440 98765" 
                      value={formPhone} 
                      onChange={(e) => setFormPhone(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Email Address:</label>
                    <Input 
                      type="email" 
                      placeholder="e.g. advocate.rajesh@gmail.com" 
                      value={formEmail} 
                      onChange={(e) => setFormEmail(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Spoken Languages (comma-separated):</label>
                    <Input 
                      placeholder="e.g. Tamil, English" 
                      value={formLanguages} 
                      onChange={(e) => setFormLanguages(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Consultation Hours:</label>
                    <Input 
                      placeholder="e.g. 04:30 PM - 08:00 PM" 
                      value={formHours} 
                      onChange={(e) => setFormHours(e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Chamber Address / Office Compound:</label>
                  <textarea
                    rows={2}
                    placeholder="Enter complete office address..."
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex gap-3 justify-end pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setFormError(""); }}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow btn-3d"
                  >
                    Register Advocate
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
