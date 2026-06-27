import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Phone, Mail, Clock, Navigation, Compass, AlertCircle, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface POI {
  id: number;
  name: string;
  category: "Police Station" | "Court" | "Legal Aid" | "Passport Office" | "RTO" | "Admin Office";
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  hours: string;
  areaCovered?: string;
  jurisdiction?: string;
  servicesOffered?: string[];
  eligibilityCriteria?: string;
  officerInCharge?: string;
}

interface CityData {
  name: string;
  lat: number;
  lng: number;
  pois: POI[];
}



const CITIES: Record<string, CityData> = {
  Chennai: {
    name: "Chennai, Tamil Nadu",
    lat: 13.0725,
    lng: 80.2520,
    pois: [
      {
        id: 101,
        name: "Egmore Police Station (F-1)",
        category: "Police Station",
        address: "Police Station Rd, Egmore, Chennai, Tamil Nadu 600008",
        lat: 13.0768,
        lng: 80.2585,
        phone: "044-23452586",
        email: "cop.chennai@tn.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Egmore, Vepery, Pudupet, Chennai Central",
        jurisdiction: "Metropolitan Magistrate Court Egmore Jurisdiction",
        officerInCharge: "Inspector S. Jagannathan"
      },
      {
        id: 102,
        name: "Nungambakkam Police Station (K-4)",
        category: "Police Station",
        address: "Valluvar Kottam High Rd, Nungambakkam, Chennai, Tamil Nadu 600034",
        lat: 13.0612,
        lng: 80.2435,
        phone: "044-23452601",
        email: "cop.chennai@tn.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Nungambakkam, Kodambakkam, T. Nagar (North)",
        jurisdiction: "Metropolitan Magistrate Court Egmore Jurisdiction",
        officerInCharge: "Inspector R. Elangovan"
      },
      {
        id: 108,
        name: "Adyar Police Station (J-2)",
        category: "Police Station",
        address: "Muthulakshmi Salai, Adyar, Chennai, Tamil Nadu 600020",
        lat: 13.0068,
        lng: 80.2575,
        phone: "044-23452592",
        email: "sho.adyar@tn.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Adyar, Besant Nagar, Thiruvanmiyur, Chennai South",
        jurisdiction: "Metropolitan Magistrate Court Saidapet Jurisdiction",
        officerInCharge: "Inspector M. Srinivasan"
      },
      {
        id: 109,
        name: "Anna Nagar Police Station (K-8)",
        category: "Police Station",
        address: "2nd Avenue, Anna Nagar, Chennai, Tamil Nadu 600040",
        lat: 13.0850,
        lng: 80.2120,
        phone: "044-23452608",
        email: "sho.annanagar@tn.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Anna Nagar, Shenoy Nagar, Kilpauk, Chennai West",
        jurisdiction: "Metropolitan Magistrate Court Egmore Jurisdiction",
        officerInCharge: "Inspector G. Ramachandran"
      },
      {
        id: 103,
        name: "Madras High Court & Legal Aid Center",
        category: "Legal Aid",
        address: "High Court Compound, George Town, Chennai, Tamil Nadu 600104",
        lat: 13.0888,
        lng: 80.2882,
        phone: "044-25342410",
        email: "tnsla@tn.gov.in",
        hours: "10:00 AM - 05:45 PM",
        areaCovered: "Entire Tamil Nadu State & Puducherry UT",
        jurisdiction: "Tamil Nadu State Legal Services Authority (TNSLA)",
        servicesOffered: ["Free Legal Counseling", "Lok Adalat Mediation", "Drafting Petitions", "Victim Compensation Assistance"],
        eligibilityCriteria: "Women, children, custody inmates, SC/ST, and individuals with annual income < ₹3,00,000",
        officerInCharge: "Hon. Justice K. Rajasekar (Member Secretary)"
      },
      {
        id: 110,
        name: "Chennai District Legal Services Authority (DLSA)",
        category: "Legal Aid",
        address: "City Civil Court Compound, George Town, Chennai, Tamil Nadu 600104",
        lat: 13.0890,
        lng: 80.2870,
        phone: "044-25340656",
        email: "dlsa.chennai@tn.gov.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "Chennai District Limits",
        jurisdiction: "District Court & Subordinate Courts",
        servicesOffered: ["Free Panel Lawyers representation", "Legal Literacy Workshops", "Lok Adalat Helpdesks"],
        eligibilityCriteria: "Socio-economically backward citizens earning less than ₹3 Lakhs/year",
        officerInCharge: "Principal District Judge (Chairman DLSA)"
      },
      {
        id: 104,
        name: "City Civil Court Chennai",
        category: "Court",
        address: "High Court Compound, George Town, Chennai, Tamil Nadu 600104",
        lat: 13.0872,
        lng: 80.2868,
        phone: "044-25340656",
        email: "ccc.chennai@tn.gov.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "Chennai Metropolitan District",
        jurisdiction: "Civil Appeals and Original Suits Up to ₹1 Crore",
        officerInCharge: "Principal Judge"
      },
      {
        id: 111,
        name: "Saidapet Metropolitan Magistrate Court",
        category: "Court",
        address: "Saidapet Court Complex, Taluk Office Road, Saidapet, Chennai 600015",
        lat: 13.0234,
        lng: 80.2212,
        phone: "044-24350102",
        email: "saidapet.court@tn.gov.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "South Chennai (Saidapet, Adyar, Guindy, Mambalam)",
        jurisdiction: "Criminal Cases/Metropolitan Magistrate Courts",
        officerInCharge: "Chief Metropolitan Magistrate"
      },
      {
        id: 105,
        name: "Passport Seva Kendra Aminjikarai",
        category: "Passport Office",
        address: "No. 24, Nelson Manickam Road, Aminjikarai, Chennai, Tamil Nadu 600029",
        lat: 13.0734,
        lng: 80.2289,
        phone: "1800-258-1800",
        email: "rpo.chennai@mea.gov.in",
        hours: "09:00 AM - 05:30 PM (Mon-Fri)",
        areaCovered: "Chennai, Kanchipuram, Tiruvallur Districts",
        officerInCharge: "Regional Passport Officer"
      },
      {
        id: 106,
        name: "Regional Transport Office (RTO) Central",
        category: "RTO",
        address: "Vasantha Garden, Ayanavaram, Chennai, Tamil Nadu 600023",
        lat: 13.0934,
        lng: 80.2312,
        phone: "044-26742323",
        email: "rtotn02@tn.gov.in",
        hours: "10:00 AM - 05:00 PM (Mon-Fri)",
        areaCovered: "Anna Nagar, Ayanavaram, Kilpauk (RTO Code: TN-02)",
        officerInCharge: "Regional Transport Officer"
      },
      {
        id: 107,
        name: "Ripon Building - Greater Chennai Corporation",
        category: "Admin Office",
        address: "Raja Muthiah Rd, Periyamet, Chennai, Tamil Nadu 600003",
        lat: 13.0825,
        lng: 80.2721,
        phone: "044-25619001",
        email: "commissioner@chennaicorporation.gov.in",
        hours: "09:45 AM - 05:45 PM",
        areaCovered: "All 15 zones of Greater Chennai City",
        officerInCharge: "Municipal Commissioner"
      }
    ]
  },
  Delhi: {
    name: "New Delhi, Delhi",
    lat: 28.6139,
    lng: 77.2090,
    pois: [
      {
        id: 201,
        name: "Parliament Street Police Station",
        category: "Police Station",
        address: "Sansad Marg, Janpath, Connaught Place, New Delhi, Delhi 110001",
        lat: 28.6254,
        lng: 77.2155,
        phone: "011-23361100",
        email: "sho-psst@delhipolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Sansad Marg, Janpath, Connaught Place, New Delhi Area",
        jurisdiction: "New Delhi Magistrate Court Jurisdiction",
        officerInCharge: "SHO Vinod Narang"
      },
      {
        id: 202,
        name: "Connaught Place Police Station",
        category: "Police Station",
        address: "Outer Circle, Connaught Place, New Delhi, Delhi 110001",
        lat: 28.6315,
        lng: 77.2198,
        phone: "011-23747100",
        email: "sho-cp@delhipolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Connaught Place Inner/Outer Circle, Barakhamba Road, Mandi House",
        jurisdiction: "New Delhi District Jurisdiction",
        officerInCharge: "SHO Ajay Kumar"
      },
      {
        id: 208,
        name: "Saket Police Station",
        category: "Police Station",
        address: "J-Block, Saket, New Delhi 110017",
        lat: 28.5230,
        lng: 77.2185,
        phone: "011-29561005",
        email: "sho-saket-dl@delhipolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Saket, Pushp Vihar, Sainik Farm, South Delhi Area",
        jurisdiction: "South Delhi District Jurisdiction",
        officerInCharge: "SHO Rajesh Sharma"
      },
      {
        id: 209,
        name: "Dwarka Sector-23 Police Station",
        category: "Police Station",
        address: "Sector 23, Dwarka, New Delhi 110077",
        lat: 28.5630,
        lng: 77.0425,
        phone: "011-28080123",
        email: "sho-dwarka23-dl@delhipolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Dwarka Sectors 21-26, Pochanpur, West Delhi Area",
        jurisdiction: "South West Delhi District Jurisdiction",
        officerInCharge: "SHO Satish Kumar"
      },
      {
        id: 203,
        name: "Delhi High Court & Legal Services Committee",
        category: "Legal Aid",
        address: "Sher Shah Road, New Delhi, Delhi 110503",
        lat: 28.6115,
        lng: 77.2385,
        phone: "011-23383418",
        email: "dhclsc@nic.in",
        hours: "10:00 AM - 05:00 PM",
        areaCovered: "Entire NCT of Delhi",
        jurisdiction: "Delhi State Legal Services Authority (DSLSA)",
        servicesOffered: ["Free Legal Aid Representation", "24/7 Helpline Counseling", "Lok Adalat Resolution", "Legal Literacy Programs"],
        eligibilityCriteria: "Women, children, custody inmates, SC/ST, and individuals with annual income < ₹3,00,000",
        officerInCharge: "Member Secretary DSLSA"
      },
      {
        id: 210,
        name: "South District Legal Services Authority (Saket DLSA)",
        category: "Legal Aid",
        address: "Saket District Court Complex, Saket, New Delhi 110017",
        lat: 28.5225,
        lng: 77.2200,
        phone: "011-29567104",
        email: "south-dslsa@nic.in",
        hours: "10:00 AM - 05:00 PM",
        areaCovered: "South & South-East Delhi Districts",
        jurisdiction: "District & Sessions Courts South Delhi",
        servicesOffered: ["Free Panel Advocate Assignment", "Legal Aid Clinics", "Victim Compensation Schemes"],
        eligibilityCriteria: "Economically weaker sections and vulnerable groups earning less than ₹3,00,000 annually",
        officerInCharge: "Secretary DLSA Saket"
      },
      {
        id: 204,
        name: "Patiala House Courts Complex",
        category: "Court",
        address: "India Gate, New Delhi, Delhi 110001",
        lat: 28.6162,
        lng: 77.2345,
        phone: "011-23384567",
        email: "phc-delhi@nic.in",
        hours: "10:00 AM - 05:00 PM",
        areaCovered: "New Delhi District, Lutyens' Delhi",
        jurisdiction: "Criminal & Civil Cases / District Courts",
        officerInCharge: "Principal District & Sessions Judge"
      },
      {
        id: 211,
        name: "Saket District Courts Complex",
        category: "Court",
        address: "Saket Court Complex, Saket, New Delhi 110017",
        lat: 28.5220,
        lng: 77.2205,
        phone: "011-29567123",
        email: "saketcourts@delhi.gov.in",
        hours: "10:00 AM - 05:00 PM",
        areaCovered: "South & South-East Delhi District Limits",
        jurisdiction: "Civil & Criminal Jurisdiction / Family Courts",
        officerInCharge: "Principal Sessions Judge Saket"
      },
      {
        id: 205,
        name: "Passport Seva Kendra Herald House",
        category: "Passport Office",
        address: "5A, Bahadur Shah Zafar Marg, ITO, New Delhi, Delhi 110002",
        lat: 28.6302,
        lng: 77.2415,
        phone: "1800-258-1800",
        email: "rpo.delhi@mea.gov.in",
        hours: "09:00 AM - 05:30 PM (Mon-Fri)",
        areaCovered: "NCT of Delhi Region",
        officerInCharge: "Regional Passport Officer"
      },
      {
        id: 206,
        name: "Regional Transport Office (RTO) IP Estate",
        category: "RTO",
        address: "IP Estate, Near ITO, New Delhi, Delhi 110002",
        lat: 28.6288,
        lng: 77.2482,
        phone: "011-23378989",
        email: "rto-dl02@delhi.gov.in",
        hours: "09:30 AM - 04:30 PM (Mon-Fri)",
        areaCovered: "New Delhi, ITO, IP Estate (RTO Code: DL-02)",
        officerInCharge: "M.L.O. IP Estate"
      },
      {
        id: 207,
        name: "Delhi Secretariat - Government of NCT of Delhi",
        category: "Admin Office",
        address: "I.P. Estate, New Delhi, Delhi 110002",
        lat: 28.6198,
        lng: 77.2512,
        phone: "011-23392001",
        email: "delhisec@delhi.gov.in",
        hours: "09:30 AM - 06:00 PM",
        areaCovered: "NCT of Delhi Administration",
        officerInCharge: "Chief Secretary Delhi"
      }
    ]
  },
  Mumbai: {
    name: "Mumbai, Maharashtra",
    lat: 18.9696,
    lng: 72.8246,
    pois: [
      {
        id: 301,
        name: "Colaba Police Station",
        category: "Police Station",
        address: "Ramchandani Marg, Colaba, Mumbai, Maharashtra 400039",
        lat: 18.9224,
        lng: 72.8315,
        phone: "022-22856817",
        email: "colabaps.mumbai@mahapolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Colaba, Cuffe Parade, Gateway of India, South Mumbai",
        jurisdiction: "Metropolitan Magistrate Esplanade Court",
        officerInCharge: "Senior PI Sandeep Bhajibhakre"
      },
      {
        id: 302,
        name: "Marine Drive Police Station",
        category: "Police Station",
        address: "Netaji Subhash Chandra Bose Rd, Marine Drive, Mumbai, Maharashtra 400020",
        lat: 18.9372,
        lng: 72.8241,
        phone: "022-22812009",
        email: "marinedriveps.mumbai@mahapolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Marine Drive, Nariman Point, Churchgate, Fort (West)",
        jurisdiction: "Metropolitan Magistrate Girgaon Court",
        officerInCharge: "Senior PI Vishwanath Kolekar"
      },
      {
        id: 308,
        name: "Bandra Police Station",
        category: "Police Station",
        address: "Hill Road, Bandra West, Mumbai, Maharashtra 400050",
        lat: 19.0550,
        lng: 72.8335,
        phone: "022-26421006",
        email: "bandra.mumbai@mahapolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Bandra West, Carter Road, Pali Hill, Khar (South)",
        jurisdiction: "Metropolitan Magistrate Bandra Court",
        officerInCharge: "Senior PI Sanjay Marathe"
      },
      {
        id: 303,
        name: "Bombay High Court & Maharashtra Legal Aid",
        category: "Legal Aid",
        address: "Dr Kane Rd, Fort, Mumbai, Maharashtra 400032",
        lat: 18.9318,
        lng: 72.8302,
        phone: "022-22691157",
        email: "mahalsach@gmail.com",
        hours: "10:30 AM - 05:30 PM",
        areaCovered: "Entire Maharashtra & Goa States",
        jurisdiction: "Maharashtra State Legal Services Authority (MSLSA)",
        servicesOffered: ["Free Legal Counseling", "Lok Adalat Arbitrations", "Drafting Applications", "Mobile Legal Aid Assistance"],
        eligibilityCriteria: "Women, children, custody inmates, SC/ST, and individuals with annual income < ₹3,0,000",
        officerInCharge: "Member Secretary MSLSA"
      },
      {
        id: 309,
        name: "Mumbai District Legal Services Authority (DLSA Fort)",
        category: "Legal Aid",
        address: "City Civil Court Compound, Fort, Mumbai, Maharashtra 400032",
        lat: 18.9300,
        lng: 72.8290,
        phone: "022-22691157",
        email: "mumbaidlsafort@gmail.com",
        hours: "10:30 AM - 05:30 PM",
        areaCovered: "Mumbai City District Limits",
        jurisdiction: "City Civil & Sessions Courts Mumbai",
        servicesOffered: ["Free Panel Lawyers representation", "Legal Literacy Workshops", "Lok Adalat Helpdesks"],
        eligibilityCriteria: "All economically weaker sections earning under ₹3 Lakhs/year",
        officerInCharge: "Secretary DLSA Mumbai"
      },
      {
        id: 304,
        name: "City Civil and Sessions Court Mumbai",
        category: "Court",
        address: "Opp. University of Mumbai, Fort, Mumbai, Maharashtra 400032",
        lat: 18.9298,
        lng: 72.8288,
        phone: "022-22650050",
        email: "sessionscourt.mumbai@maharashtra.gov.in",
        hours: "10:30 AM - 05:30 PM",
        areaCovered: "Mumbai City District",
        jurisdiction: "Civil & Serious Criminal Offences (Sessions Jurisdiction)",
        officerInCharge: "Principal Judge"
      },
      {
        id: 310,
        name: "Bandra Metropolitan Magistrate Court",
        category: "Court",
        address: "Bandra Court Complex, Bandra East, Mumbai, Maharashtra 400051",
        lat: 19.0605,
        lng: 72.8420,
        phone: "022-26512345",
        email: "bandramm.court@maharashtra.gov.in",
        hours: "10:30 AM - 05:30 PM",
        areaCovered: "Mumbai Western Suburbs (Bandra, Khar, Santacruz)",
        jurisdiction: "Criminal Trial Magistrate Courts",
        officerInCharge: "Chief Metropolitan Magistrate Bandra"
      },
      {
        id: 305,
        name: "Passport Seva Kendra Lower Parel",
        category: "Passport Office",
        address: "Urmi Transit Park, Ganpatrao Kadam Marg, Lower Parel, Mumbai, Maharashtra 400013",
        lat: 18.9954,
        lng: 72.8268,
        phone: "1800-258-1800",
        email: "rpo.mumbai@mea.gov.in",
        hours: "09:00 AM - 05:30 PM (Mon-Fri)",
        areaCovered: "Mumbai Metropolitan Region",
        officerInCharge: "Regional Passport Officer"
      },
      {
        id: 306,
        name: "RTO Mumbai South (Tardeo)",
        category: "RTO",
        address: "29/D, Manish Commercial Centre, Tardeo, Mumbai, Maharashtra 400034",
        lat: 18.9712,
        lng: 72.8138,
        phone: "022-23534646",
        email: "rto-mh01@gov.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "Mumbai South District (RTO Code: MH-01)",
        officerInCharge: "Regional Transport Officer"
      },
      {
        id: 307,
        name: "Mantralaya - Maharashtra Government HQ",
        category: "Admin Office",
        address: "Madam Cama Rd, Nariman Point, Mumbai, Maharashtra 400032",
        lat: 18.9265,
        lng: 72.8225,
        phone: "022-22025014",
        email: "chiefsecretary@maharashtra.gov.in",
        hours: "09:45 AM - 05:30 PM",
        areaCovered: "Maharashtra State Administration",
        officerInCharge: "Chief Secretary Maharashtra"
      }
    ]
  },
  Bengaluru: {
    name: "Bengaluru, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    pois: [
      {
        id: 401,
        name: "Cubbon Park Police Station",
        category: "Police Station",
        address: "Kasturba Rd, Ashok Nagar, Bengaluru, Karnataka 560001",
        lat: 12.9744,
        lng: 77.5978,
        phone: "080-22942203",
        email: "sho-cubbonpark-bcp@ksp.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Kasturba Road, Cubbon Park, MG Road, Central Bengaluru",
        jurisdiction: "Metropolitan Magistrate Court-I Bengaluru",
        officerInCharge: "Inspector B. Umesh"
      },
      {
        id: 402,
        name: "Vidhana Soudha Police Station",
        category: "Police Station",
        address: "Dr Ambedkar Veedhi, Sampangi Rama Nagar, Bengaluru, Karnataka 560001",
        lat: 12.9808,
        lng: 77.5902,
        phone: "080-22942201",
        email: "sho-vidhanasoudha-bcp@ksp.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Vidhana Soudha, Vikasa Soudha, Raj Bhavan, Secretariat Enclave",
        jurisdiction: "Metropolitan Magistrate Court-I Bengaluru",
        officerInCharge: "Inspector K. R. Prasad"
      },
      {
        id: 408,
        name: "Indiranagar Police Station",
        category: "Police Station",
        address: "100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038",
        lat: 12.9785,
        lng: 77.6385,
        phone: "080-22942215",
        email: "sho-indiranagar-bcp@ksp.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Indiranagar, Halasuru, Jeevanbheemanagar, Bengaluru East",
        jurisdiction: "Metropolitan Magistrate Court-IV Bengaluru",
        officerInCharge: "Inspector S. Nagaraj"
      },
      {
        id: 403,
        name: "High Court of Karnataka & Legal Services Committee",
        category: "Legal Aid",
        address: "Opp. Vidhana Soudha, Dr Ambedkar Veedhi, Bengaluru, Karnataka 560001",
        lat: 12.9788,
        lng: 77.5921,
        phone: "080-22268757",
        email: "klsablr@gmail.com",
        hours: "10:00 AM - 05:00 PM",
        areaCovered: "Entire Karnataka State",
        jurisdiction: "Karnataka State Legal Services Authority (KSLSA)",
        servicesOffered: ["Free Legal Aid Scheme", "Janata Justice / Lok Adalats", "Mediation Centers", "Legal Literacy Clubs"],
        eligibilityCriteria: "Women, children, industrial workers, SC/ST, and individuals with annual income < ₹3,00,000",
        officerInCharge: "Member Secretary KSLSA"
      },
      {
        id: 409,
        name: "Bengaluru Urban District Legal Services Authority (DLSA)",
        category: "Legal Aid",
        address: "City Civil Court Complex, Near Mysore Bank Circle, Bengaluru, Karnataka 560009",
        lat: 12.9738,
        lng: 77.5830,
        phone: "080-22210656",
        email: "blr-dlsa@kar.nic.in",
        hours: "10:00 AM - 05:00 PM",
        areaCovered: "Bengaluru Urban District Limits",
        jurisdiction: "District Courts & Magistrates Bengaluru Urban",
        servicesOffered: ["Free Panel Advocates Assignment", "Counseling Clinics", "Pre-litigation Mediations"],
        eligibilityCriteria: "Socio-economically backward citizens earning less than ₹3 Lakhs/year",
        officerInCharge: "Secretary DLSA Bengaluru"
      },
      {
        id: 404,
        name: "City Civil Court Bengaluru",
        category: "Court",
        address: "District Court Road, Near Mysore Bank Circle, Bengaluru, Karnataka 560009",
        lat: 12.9734,
        lng: 77.5828,
        phone: "080-22210656",
        email: "blr-court@kar.nic.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "Bengaluru Urban Civil District",
        jurisdiction: "District Civil Jurisdiction / Principal Civil Judge",
        officerInCharge: "Principal District & Sessions Judge"
      },
      {
        id: 410,
        name: "Mayo Hall Court Complex",
        category: "Court",
        address: "MG Road, Near Mayo Hall, Bengaluru, Karnataka 560001",
        lat: 12.9725,
        lng: 77.6112,
        phone: "080-25587890",
        email: "mayohall-court@kar.nic.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "Bengaluru Civil Station/East Zone Limits",
        jurisdiction: "Additional District Courts & Civil Courts",
        officerInCharge: "Senior Unit Judge Mayo Hall"
      },
      {
        id: 405,
        name: "Passport Seva Kendra Lalbagh",
        category: "Passport Office",
        address: "No. 45, Lalbagh Road, Bengaluru, Karnataka 560027",
        lat: 12.9592,
        lng: 77.5928,
        phone: "1800-258-1800",
        email: "rpo.bengaluru@mea.gov.in",
        hours: "09:00 AM - 05:30 PM (Mon-Fri)",
        areaCovered: "Bengaluru Urban, Rural, and adjacent districts",
        officerInCharge: "Regional Passport Officer"
      },
      {
        id: 406,
        name: "Regional Transport Office (RTO) Central (Koramangala)",
        category: "RTO",
        address: "2nd Block, Koramangala, Bengaluru, Karnataka 560034",
        lat: 12.9324,
        lng: 77.6245,
        phone: "080-25533525",
        email: "rto-ka01@kar.nic.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "Koramangala, HSR Layout, BTM Layout (RTO Code: KA-01)",
        officerInCharge: "RTO Koramangala"
      },
      {
        id: 407,
        name: "Vidhana Soudha - Karnataka State Assembly",
        category: "Admin Office",
        address: "Dr Ambedkar Veedhi, Sampangi Rama Nagar, Bengaluru, Karnataka 560001",
        lat: 12.9796,
        lng: 77.5906,
        phone: "080-22252402",
        email: "sec-assembly@kar.nic.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "Karnataka Legislative Administration",
        officerInCharge: "Assembly Secretary"
      }
    ]
  },
  Kolkata: {
    name: "Kolkata, West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    pois: [
      {
        id: 501,
        name: "Hare Street Police Station",
        category: "Police Station",
        address: "42, Hare St, Bowbazar, Kolkata, West Bengal 700001",
        lat: 22.5714,
        lng: 88.3495,
        phone: "033-22482255",
        email: "harestreetps@kolkatapolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "BBD Bagh, Dalhousie Square, Strand Road, Kolkata Central",
        jurisdiction: "Presidency Magistrate Courts Kolkata",
        officerInCharge: "Inspector S. K. Roy"
      },
      {
        id: 502,
        name: "Park Street Police Station",
        category: "Police Station",
        address: "52A, Park St, Park Street, Kolkata, West Bengal 700016",
        lat: 22.5488,
        lng: 88.3582,
        phone: "033-22830022",
        email: "parkstreetps@kolkatapolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Park Street, Camac Street, Theatre Road, Mullick Bazar",
        jurisdiction: "Presidency Magistrate Courts Kolkata",
        officerInCharge: "Inspector Amit Chakraborty"
      },
      {
        id: 508,
        name: "Salt Lake Sector-V Police Station",
        category: "Police Station",
        address: "Sector V, Salt Lake, Kolkata, West Bengal 700091",
        lat: 22.5735,
        lng: 88.4335,
        phone: "033-23571008",
        email: "sho.saltlake5@bidhannagarpolice.gov.in",
        hours: "24 Hours Open",
        areaCovered: "Sector V Tech Hub, Salt Lake Bypass, Kolkata East",
        jurisdiction: "Bidhannagar Magistrate Court Jurisdiction",
        officerInCharge: "Inspector P. K. Ghosh"
      },
      {
        id: 503,
        name: "Calcutta High Court & West Bengal Legal Services",
        category: "Legal Aid",
        address: "3, Esplanade Row West, High Court, Kolkata, West Bengal 700001",
        lat: 22.5684,
        lng: 88.3475,
        phone: "033-22483167",
        email: "wbslasa@wb.gov.in",
        hours: "10:30 AM - 04:30 PM",
        areaCovered: "West Bengal State & Andaman and Nicobar Islands UT",
        jurisdiction: "West Bengal State Legal Services Authority",
        servicesOffered: ["Free Legal Advice & Drafting", "Lok Adalat Settlement", "Legal Aid Panel Lawyers", "Victim Compensation Assistance"],
        eligibilityCriteria: "Women, children, custody inmates, SC/ST, and individuals with annual income < ₹3,0,000",
        officerInCharge: "Member Secretary SLSAWB"
      },
      {
        id: 509,
        name: "Kolkata District Legal Services Authority (DLSA)",
        category: "Legal Aid",
        address: "City Civil Court Compound, Kiran Shankar Roy Rd, Kolkata 700001",
        lat: 22.5690,
        lng: 88.3480,
        phone: "033-22485501",
        email: "kolkata-dlsa@wb.gov.in",
        hours: "10:30 AM - 05:00 PM",
        areaCovered: "Kolkata Municipal District Limits",
        jurisdiction: "Kolkata City Civil & Sessions Courts",
        servicesOffered: ["Legal Literacy Camps", "Mediation Services", "Free Counsel Representation"],
        eligibilityCriteria: "Marginalized sections and annual income under ₹3 Lakhs",
        officerInCharge: "Secretary DLSA Kolkata"
      },
      {
        id: 504,
        name: "Kolkata City Civil Court",
        category: "Court",
        address: "2 & 3, Kiran Shankar Roy Rd, Esplanade, Kolkata, West Bengal 700001",
        lat: 22.5694,
        lng: 88.3485,
        phone: "033-22485501",
        email: "ccc-kol@wb.nic.in",
        hours: "10:30 AM - 05:00 PM",
        areaCovered: "Kolkata Metropolitan Area",
        jurisdiction: "Civil Jurisdiction of Kolkata City",
        officerInCharge: "Chief Judge"
      },
      {
        id: 510,
        name: "Alipore District and Sessions Court",
        category: "Court",
        address: "Alipore Court Road, Alipore, Kolkata, West Bengal 700027",
        lat: 22.5298,
        lng: 88.3312,
        phone: "033-24791024",
        email: "aliporecourt@wb.gov.in",
        hours: "10:30 AM - 05:00 PM",
        areaCovered: "South 24 Parganas District Limits",
        jurisdiction: "Civil & Sessions Jurisdiction South 24 Parganas",
        officerInCharge: "Principal District & Sessions Judge"
      },
      {
        id: 505,
        name: "Passport Seva Kendra Bypass",
        category: "Passport Office",
        address: "Rajarhat Road, Chinar Park, Kolkata, West Bengal 700157",
        lat: 22.6184,
        lng: 88.4412,
        phone: "1800-258-1800",
        email: "rpo.kolkata@mea.gov.in",
        hours: "09:00 AM - 05:30 PM (Mon-Fri)",
        areaCovered: "Kolkata and South Bengal Region",
        officerInCharge: "Regional Passport Officer"
      },
      {
        id: 506,
        name: "Regional Transport Office (RTO) Beltala",
        category: "RTO",
        address: "Beltala Road, Bhawanipore, Kolkata, West Bengal 700025",
        lat: 22.5312,
        lng: 88.3508,
        phone: "033-24751622",
        email: "rto-wb02@wb.gov.in",
        hours: "10:00 AM - 05:00 PM",
        areaCovered: "Kolkata South & Central (RTO Code: WB-02)",
        officerInCharge: "RTO Beltala"
      },
      {
        id: 507,
        name: "Writers' Building - Central Secretariat",
        category: "Admin Office",
        address: "Binoy Badal Dinesh Bag, Kolkata, West Bengal 700001",
        lat: 22.5732,
        lng: 88.3502,
        phone: "033-22145656",
        email: "chiefsec@wb.gov.in",
        hours: "10:00 AM - 05:30 PM",
        areaCovered: "West Bengal Secretariat Administration",
        officerInCharge: "Chief Secretary West Bengal"
      }
    ]
  }
};

// Helper to calculate distance using Haversine formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); // Distance in km
}

export default function NearbyServices() {
  const [selectedCity, setSelectedCity] = useState<"Chennai" | "Delhi" | "Mumbai" | "Bengaluru" | "Kolkata">("Chennai");
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [pois, setPois] = useState<POI[]>(CITIES.Chennai.pois);
  const [activePoiId, setActivePoiId] = useState<number | null>(null);
  const [route, setRoute] = useState<string[] | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  const cityData = CITIES[selectedCity];

  // 1. Load Leaflet CSS and JS via CDN dynamically
  useEffect(() => {
    // Inject CSS if missing
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Inject Script if missing
    if (!(window as any).L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Initialize Leaflet Map
  function initMap() {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map instance centered at user's location
    const map = L.map(mapContainerRef.current).setView([cityData.lat, cityData.lng], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Render User Marker
    const userIcon = L.divIcon({
      className: 'bg-blue-600 border-2 border-white rounded-full w-4 h-4 shadow-md flex items-center justify-center',
      html: '<div class="w-1.5 h-1.5 bg-white rounded-full"></div>',
      iconSize: [16, 16]
    });
    const userMarker = L.marker([cityData.lat, cityData.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(`<b>You are here</b><br/>${cityData.name}`)
      .openPopup();
    userMarkerRef.current = userMarker;

    renderMarkers();
  }

  // 3. Render markers based on filters
  function renderMarkers() {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    // Remove existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Filter POIs
    const activeCityPois = CITIES[selectedCity].pois;
    const filtered = activeCityPois.filter((p) => {
      const catMatch = selectedCat === "All" || p.category === selectedCat;
      const searchMatch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.address.toLowerCase().includes(search.toLowerCase());
      return catMatch && searchMatch;
    });

    // Add new markers
    filtered.forEach((poi) => {
      const marker = L.marker([poi.lat, poi.lng])
        .addTo(map)
        .bindPopup(`<b>${poi.name}</b><br/>${poi.category}<br/><span class="text-xs text-muted-foreground">${poi.address}</span>`);
      
      marker.on("click", () => {
        handleSelectPoi(poi);
      });
      
      markersRef.current.push(marker);
    });

    setPois(filtered);
  }

  // Sync filters and search with markers
  useEffect(() => {
    renderMarkers();
  }, [selectedCat, search]);

  // Sync city selection changes
  useEffect(() => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (L && map) {
      map.setView([cityData.lat, cityData.lng], 13);
      
      // Move user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([cityData.lat, cityData.lng]);
        userMarkerRef.current.bindPopup(`<b>You are here</b><br/>${cityData.name}`).openPopup();
      }

      // Clear active polyline
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    }
    setActivePoiId(null);
    setRoute(null);
    renderMarkers();
  }, [selectedCity]);

  function handleSelectPoi(poi: POI) {
    setActivePoiId(poi.id);
    setRoute(null);

    // Pan map to clicked POI
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([poi.lat, poi.lng], 14);
    }
  }

  function handleGetDirections(poi: POI) {
    const steps = [
      `Start from ${cityData.name} center point heading toward the destination.`,
      `In 400 meters, proceed along the main arterial roadway.`,
      `Pass by key local landmarks and follow traffic directives.`,
      `Continue along the direct route leading to ${poi.name}.`,
      `Arrived at your destination: ${poi.address}.`
    ];
    setRoute(steps);

    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (map && L) {
      // Clear previous polyline
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
      }

      const bounds = L.latLngBounds([
        [cityData.lat, cityData.lng],
        [poi.lat, poi.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Draw a line representing route
      const polyline = L.polyline([
        [cityData.lat, cityData.lng],
        [poi.lat, poi.lng]
      ], { color: '#2563eb', weight: 4, dashArray: '5, 8' }).addTo(map);

      polylineRef.current = polyline;
    }
  }

  const selectedPoi = pois.find((p) => p.id === activePoiId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" /> Nearby Public Services
        </h1>
        <p className="text-muted-foreground mt-1">Locate courtrooms, legal aid helpdesks, police stations, and transport offices (RTO) in your district</p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 bg-card border p-4 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <span className="text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">Select City/District:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as any)}
              className="w-full sm:w-56 border rounded-lg p-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
            >
              {Object.keys(CITIES).map((c) => (
                <option key={c} value={c}>
                  {CITIES[c].name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search location name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="border-t pt-3 flex gap-1.5 overflow-x-auto w-full scrollbar-none pb-1 sm:pb-0">
          {["All", "Police Station", "Court", "Legal Aid", "Passport Office", "RTO", "Admin Office"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${selectedCat === cat ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* POI List Column */}
        <div className="space-y-3 lg:col-span-1 max-h-[500px] overflow-y-auto pr-1">
          {pois.length === 0 ? (
            <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">No locations matched your criteria</p>
              <p className="text-xs mt-0.5">Try widening your search terms</p>
            </div>
          ) : (
            pois.map((poi) => {
              const dist = getDistance(cityData.lat, cityData.lng, poi.lat, poi.lng);
              const isActive = poi.id === activePoiId;
              return (
                <div
                  key={poi.id}
                  onClick={() => handleSelectPoi(poi)}
                  className={`bg-card border rounded-xl p-4 cursor-pointer hover:border-primary/45 transition-all shadow-sm flex flex-col justify-between ${isActive ? "border-primary ring-1 ring-primary/10 bg-slate-50/20" : ""}`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold">{poi.category}</Badge>
                      <span className="text-[11px] font-semibold text-secondary flex items-center gap-0.5"><Compass className="w-3.5 h-3.5" /> {dist} km</span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground mt-2">{poi.name}</h3>
                    {poi.areaCovered && (
                      <p className="text-[10px] font-semibold text-muted-foreground mt-1.5 bg-muted/70 px-2 py-0.5 rounded inline-block w-fit">
                        Area: {poi.areaCovered.split(",")[0]}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1.5">{poi.address}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelectPoi(poi); handleGetDirections(poi); }}
                    className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-primary self-start hover:underline cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-current" /> Get Directions
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Map & Directions Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm h-[400px] relative z-0">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          {/* Active Detail & Route Card */}
          {selectedPoi && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card border rounded-xl p-5 shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{selectedPoi.category} Contact & Details</span>
                    <h3 className="font-bold text-base mt-0.5 text-foreground">{selectedPoi.name}</h3>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                  {selectedPoi.areaCovered && (
                    <div className="flex flex-col gap-0.5 bg-muted/40 p-2 rounded-lg border">
                      <span className="font-bold text-[10px] uppercase text-primary">Areas Covered / Neighborhoods:</span>
                      <span className="text-foreground">{selectedPoi.areaCovered}</span>
                    </div>
                  )}

                  {selectedPoi.jurisdiction && (
                    <div className="flex flex-col gap-0.5 bg-muted/40 p-2 rounded-lg border">
                      <span className="font-bold text-[10px] uppercase text-primary">Jurisdiction:</span>
                      <span className="text-foreground">{selectedPoi.jurisdiction}</span>
                    </div>
                  )}

                  {selectedPoi.officerInCharge && (
                    <div className="flex flex-col gap-0.5 bg-muted/40 p-2 rounded-lg border">
                      <span className="font-bold text-[10px] uppercase text-primary">Officer In Charge:</span>
                      <span className="text-foreground font-medium">{selectedPoi.officerInCharge}</span>
                    </div>
                  )}

                  {selectedPoi.category === "Legal Aid" && selectedPoi.servicesOffered && (
                    <div className="flex flex-col gap-1 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                      <span className="font-bold text-[10px] uppercase text-emerald-700">Services Provided (Free):</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-emerald-800 text-[11px]">
                        {selectedPoi.servicesOffered.map((serv, index) => (
                          <li key={index}>{serv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedPoi.category === "Legal Aid" && selectedPoi.eligibilityCriteria && (
                    <div className="flex flex-col gap-0.5 bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                      <span className="font-bold text-[10px] uppercase text-amber-700">Eligibility for Free Aid:</span>
                      <span className="text-amber-800 text-[11px] leading-relaxed">{selectedPoi.eligibilityCriteria}</span>
                    </div>
                  )}

                  <div className="border-t pt-2.5 space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span>{selectedPoi.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <a href={`tel:${selectedPoi.phone}`} className="hover:underline text-foreground font-medium">{selectedPoi.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <a href={`mailto:${selectedPoi.email}`} className="hover:underline text-foreground font-medium">{selectedPoi.email}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route step-by-step panel */}
              <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-primary" /> Routing from City Center
                </h4>
                {route ? (
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {route.map((step, idx) => (
                      <div key={idx} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                        <span className="font-bold text-foreground text-[10px] bg-slate-100 rounded-full w-4.5 h-4.5 flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground h-[220px]">
                    <Navigation className="w-6 h-6 text-muted-foreground/40 animate-pulse mb-1" />
                    <p className="text-xs">Click "Get Directions" on a location card to calculate route and view steps.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
