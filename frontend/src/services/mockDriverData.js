export const mockDrivers = [
  {
    id: "FL-00921",
    name: "Amit Patel",
    role: "Senior Fleet Lead",
    experience: "12 Years Experience",
    status: "On Duty", // "On Duty", "Off Duty", "Suspended"
    routeStatus: "On Route", // Display status
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e63946",
    safetyScore: 98,
    licenseExpiration: "12/2026",
    licenseDetails: {
      documentNumber: "CDL-TX-8829-001",
      classType: "Class A (Heavy Combination)",
      issueDate: "Dec 15, 2021",
      expiryDate: "Dec 14, 2026",
      status: "Valid",
      endorsements: [
        { icon: "local_fire_department", name: "Hazmat (H)" },
        { icon: "water_drop", name: "Tanker (N)" },
        { icon: "view_column", name: "Double/Triple (T)" }
      ]
    },
    currentVehicle: "Freightliner Cascadia (TX-9902)",
    lastInspection: "Nov 12, 2023 (Pass)",
    emergencyContact: "Neha Patel (Wife)",
    currentLocation: {
      description: "En-route: Mumbai Terminal",
      speed: "65 mph",
      temp: "72°F",
      mapUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXoes9M5y85vaev9IR2oEoesdC6k62itk9tV8eM4n3GJKpQjtmB7wDLaFmoW7bUx8w9kywjBflzrlX46aHrAIUY31rWl-g1PDgJGE5UYcSJWYMVU-Kaa7-_KBBEDmx-o7OdfkOuU3uvMFpeQWOh9NgFZKX37ll1yqnkKM2pi7g5FTVqOs9C2DsQrOuVRxYlwK7nROmiXkJ247BPc_YuhW39dTerQMM8UuuSdlRJ_vqQ8tLHcaumCiM"
    },
    safetyTimeline: [
      {
        id: "st-1",
        title: "Quarterly Defensive Driving Cert",
        description: "Renewed certification with 90% score.",
        date: "Nov 05, 2023",
        type: "positive"
      },
      {
        id: "st-2",
        title: "Hard Braking Alert (Non-Critical)",
        description: "Detected at Houston I-10 junction. Driver corrected quickly.",
        date: "Oct 19, 2023",
        type: "warning"
      },
      {
        id: "st-3",
        title: "3,000 Safe Mile Achievement",
        description: "Awarded for consistent adherence to safety protocols.",
        date: "Sep 24, 2023",
        type: "success"
      }
    ],
    tripHistory: [
      { id: "T-8802", route: "Mumbai Terminal ➔ Pune Terminal", date: "Jul 11, 2026", status: "Completed", cargo: "Industrial Machinery" },
      { id: "T-8741", route: "Pune Terminal ➔ Nashik Depot", date: "Jul 08, 2026", status: "Completed", cargo: "Electronic Components" },
      { id: "T-8650", route: "Nashik Depot ➔ Mumbai Terminal", date: "Jul 02, 2026", status: "Completed", cargo: "Auto Parts" }
    ],
    safetyAnalytics: {
      hardBrakingEvents: 1,
      speedingAlerts: 0,
      idleTimePercent: "4%",
      totalSafeMiles: "125,000 mi",
      incidentRate: "0.02 / 10k mi"
    },
    contactInfo: {
      email: "amit.patel@transitops.com",
      phone: "+91 98765 43210",
      address: "Andheri West, Mumbai, MH",
      emergencyContact: "Neha Patel (Wife)",
      emergencyPhone: "+91 98765 43211"
    }
  },
  {
    id: "FL-11024",
    name: "Shreya Goswami",
    role: "Transit Specialist",
    experience: "5 Years Experience",
    status: "On Duty",
    routeStatus: "On Route",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=e63946",
    safetyScore: 78,
    licenseExpiration: "02/2026",
    licenseDetails: {
      documentNumber: "CDL-TX-4451-992",
      classType: "Class C (Commercial Passenger/Transit)",
      issueDate: "Feb 10, 2019",
      expiryDate: "Feb 09, 2024",
      status: "Expired",
      endorsements: [
        { icon: "group", name: "Passenger (P)" }
      ]
    },
    currentVehicle: "Transit Van (MH-5512)",
    lastInspection: "Oct 05, 2023 (Pass)",
    emergencyContact: "Rohan Goswami (Brother)",
    currentLocation: {
      description: "En-route: Pune Depot",
      speed: "0 mph",
      temp: "82°F",
      mapUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXoes9M5y85vaev9IR2oEoesdC6k62itk9tV8eM4n3GJKpQjtmB7wDLaFmoW7bUx8w9kywjBflzrlX46aHrAIUY31rWl-g1PDgJGE5UYcSJWYMVU-Kaa7-_KBBEDmx-o7OdfkOuU3uvMFpeQWOh9NgFZKX37ll1yqnkKM2pi7g5FTVqOs9C2DsQrOuVRxYlwK7nROmiXkJ247BPc_YuhW39dTerQMM8UuuSdlRJ_vqQ8tLHcaumCiM"
    },
    safetyTimeline: [
      {
        id: "st-4",
        title: "License Renewal Notice",
        description: "CDL up for renewal in Feb 2026.",
        date: "Feb 10, 2024",
        type: "warning"
      },
      {
        id: "st-5",
        title: "Tailgating Warning",
        description: "ADAS sensor recorded proximity alert on Route 290.",
        date: "Jan 14, 2024",
        type: "warning"
      }
    ],
    tripHistory: [
      { id: "T-8501", route: "Pune Depot ➔ Mumbai Terminal", date: "Feb 02, 2024", status: "Completed", cargo: "General Retail" }
    ],
    safetyAnalytics: {
      hardBrakingEvents: 8,
      speedingAlerts: 5,
      idleTimePercent: "12%",
      totalSafeMiles: "45,000 mi",
      incidentRate: "0.18 / 10k mi"
    },
    contactInfo: {
      email: "shreya.goswami@transitops.com",
      phone: "+91 87654 32109",
      address: "Kothrud, Pune, MH",
      emergencyContact: "Rohan Goswami (Brother)",
      emergencyPhone: "+91 87654 32110"
    }
  },
  {
    id: "FL-04289",
    name: "Martin Parmar",
    role: "Heavy Haul Expert",
    experience: "8 Years Experience",
    status: "Suspended",
    routeStatus: "Suspended",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Javier&backgroundColor=e63946",
    safetyScore: 52,
    licenseExpiration: "08/2027",
    licenseDetails: {
      documentNumber: "CDL-TX-1092-482",
      classType: "Class A (Reefer/Heavy Combined)",
      issueDate: "Aug 20, 2022",
      expiryDate: "Aug 19, 2027",
      status: "Valid",
      endorsements: [
        { icon: "ac_unit", name: "Refrigerated (R)" },
        { icon: "water_drop", name: "Tanker (N)" }
      ]
    },
    currentVehicle: "Reefer Truck (TX-1182)",
    lastInspection: "Dec 01, 2023 (Pass)",
    emergencyContact: "Anjali Parmar (Mother)",
    currentLocation: {
      description: "Grounded: Bengaluru Depot",
      speed: "0 mph",
      temp: "74°F",
      mapUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXoes9M5y85vaev9IR2oEoesdC6k62itk9tV8eM4n3GJKpQjtmB7wDLaFmoW7bUx8w9kywjBflzrlX46aHrAIUY31rWl-g1PDgJGE5UYcSJWYMVU-Kaa7-_KBBEDmx-o7OdfkOuU3uvMFpeQWOh9NgFZKX37ll1yqnkKM2pi7g5FTVqOs9C2DsQrOuVRxYlwK7nROmiXkJ247BPc_YuhW39dTerQMM8UuuSdlRJ_vqQ8tLHcaumCiM"
    },
    safetyTimeline: [
      {
        id: "st-6",
        title: "Reefer Temp Management Commendation",
        description: "Excellent tracking and monitoring of temperature sensitive medical cargo.",
        date: "Dec 18, 2023",
        type: "positive"
      },
      {
        id: "st-7",
        title: "Speeding Alert (Minor)",
        description: "Exceeded 70mph limit briefly on Interstate 35.",
        date: "Nov 02, 2023",
        type: "warning"
      }
    ],
    tripHistory: [
      { id: "T-8799", route: "Chennai Depot ➔ Bengaluru Terminal", date: "Jul 10, 2026", status: "Completed", cargo: "Frozen Seafood" },
      { id: "T-8692", route: "Mumbai Terminal ➔ Bengaluru Terminal", date: "Jul 05, 2026", status: "Completed", cargo: "Pharmaceuticals" }
    ],
    safetyAnalytics: {
      hardBrakingEvents: 3,
      speedingAlerts: 1,
      idleTimePercent: "8%",
      totalSafeMiles: "88,000 mi",
      incidentRate: "0.05 / 10k mi"
    },
    contactInfo: {
      email: "martin.parmar@transitops.com",
      phone: "+91 76543 21098",
      address: "Navrangpura, Ahmedabad, GJ",
      emergencyContact: "priyank Parmar (Wife)",
      emergencyPhone: "+91 76543 21099"
    }
  },
  {
    id: "FL-09822",
    name: "Arjun Joshi",
    role: "Delivery Professional",
    experience: "6 Years Experience",
    status: "On Duty",
    routeStatus: "On Route",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Nolan&backgroundColor=e63946",
    safetyScore: 95,
    licenseExpiration: "01/2026",
    licenseDetails: {
      documentNumber: "CDL-TX-5510-388",
      classType: "Class B (Heavy Straight Truck)",
      issueDate: "Jan 10, 2021",
      expiryDate: "Jan 09, 2026",
      status: "Valid",
      endorsements: [
        { icon: "local_shipping", name: "Straight Truck (S)" }
      ]
    },
    currentVehicle: "Box Truck (TX-4401)",
    lastInspection: "Oct 28, 2023 (Pass)",
    emergencyContact: "Priyank Joshi (Wife)",
    currentLocation: {
      description: "En-route: Surat Port",
      speed: "55 mph",
      temp: "78°F",
      mapUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXoes9M5y85vaev9IR2oEoesdC6k62itk9tV8eM4n3GJKpQjtmB7wDLaFmoW7bUx8w9kywjBflzrlX46aHrAIUY31rWl-g1PDgJGE5UYcSJWYMVU-Kaa7-_KBBEDmx-o7OdfkOuU3uvMFpeQWOh9NgFZKX37ll1yqnkKM2pi7g5FTVqOs9C2DsQrOuVRxYlwK7nROmiXkJ247BPc_YuhW39dTerQMMMM8UuuSdlRJ_vqQ8tLHcaumCiM"
    },
    safetyTimeline: [
      {
        id: "st-8",
        title: "Clean Record Award",
        description: "6 months with absolutely zero telemetry alerts.",
        date: "May 12, 2026",
        type: "positive"
      }
    ],
    tripHistory: [
      { id: "T-8801", route: "Mumbai Terminal ➔ Surat Port", date: "Jul 11, 2026", status: "Completed", cargo: "Construction Materials" }
    ],
    safetyAnalytics: {
      hardBrakingEvents: 2,
      speedingAlerts: 2,
      idleTimePercent: "6%",
      totalSafeMiles: "62,000 mi",
      incidentRate: "0.08 / 10k mi"
    },
    contactInfo: {
      email: "arjun.joshi@transitops.com",
      phone: "+91 65432 10987",
      address: "Indiranagar, Bangalore, KA",
      emergencyContact: "Sunita Joshi (Mother)",
      emergencyPhone: "+91 65432 10988"
    }
  }
];
