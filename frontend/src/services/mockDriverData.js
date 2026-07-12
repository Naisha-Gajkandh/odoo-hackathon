export const mockDrivers = [
  {
    id: "FL-00921",
    name: "Marcus Sterling",
    role: "Senior Fleet Lead",
    experience: "12 Years Experience",
    status: "On Duty", // "On Duty", "Off Duty", "Suspended"
    routeStatus: "On Route", // Display status
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuATqmtNU1HryO6aiY08Awd_BlmiDYsSUdaKOXtDxKnY_vt3MMbx7axxA5KKIPMiWstfubK9gKJ-8XlJJEsVAlG-hDH9dKdzmHY5hOlJe21gOQOTseEYKJeoudzxIwOziSD6UGPxzKfsVgRueVESA46fAt9nSg_HPAfLNiK7zqcssOdbQL1rYxTNnuTt3QR6HAFYhscysDsLO4A_RQ-H6Cg76PiCrxdDsD_uPLfbEKvMqWFTQd3QJKfq",
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
    emergencyContact: "Sarah Sterling (Wife)",
    currentLocation: {
      description: "En-route: Houston Terminal",
      speed: "65 mph",
      temp: "72°F",
      mapUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXoes9M5y85vaev9IR2oEoesdC6k62itk9tV8eM4n3GJKpQjtmB7wDLaFmoW7bUx8w9kywjBflzrlX46aHrAIUY31rWl-g1PDgJGE5UYcSJWYMVU-Kaa7-_KBBEDmx-o7OdfkOuU3uvMFpeQWOh9NgFZKX37ll1yqnkKM2pi7g5FTVqOs9C2DsQrOuVRxYlwK7nROmiXkJ247BPc_YuhW39dTerQMM8UuuSdlRJ_vqQ8tLHcaumCiM"
    },
    safetyTimeline: [
      {
        id: "st-1",
        title: "Quarterly Defensive Driving Cert",
        description: "Renewed certification with 100% score.",
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
      { id: "T-8802", route: "Dallas Terminal ➔ Houston Terminal", date: "Jul 11, 2026", status: "Completed", cargo: "Industrial Machinery" },
      { id: "T-8741", route: "Houston Terminal ➔ San Antonio Depot", date: "Jul 08, 2026", status: "Completed", cargo: "Electronic Components" },
      { id: "T-8650", route: "Austin Depot ➔ Dallas Terminal", date: "Jul 02, 2026", status: "Completed", cargo: "Auto Parts" }
    ],
    safetyAnalytics: {
      hardBrakingEvents: 1,
      speedingAlerts: 0,
      idleTimePercent: "4%",
      totalSafeMiles: "125,000 mi",
      incidentRate: "0.02 / 10k mi"
    },
    contactInfo: {
      email: "marcus.sterling@transitops.com",
      phone: "+1 (555) 123-4567",
      address: "1428 Oakwood Dr, Houston, TX 77002",
      emergencyContact: "Sarah Sterling (Wife)",
      emergencyPhone: "+1 (555) 123-4568"
    }
  },
  {
    id: "FL-11024",
    name: "Elena Rodriguez",
    role: "Transit Specialist",
    experience: "5 Years Experience",
    status: "Suspended",
    routeStatus: "Suspended",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2ETnlIFBUgh4_syuNA4dHsD7Nvn5-SAUhQ1wz3xvwnsYRTQS-lA4pKBcoATq_TyvCSX4f3hMg2S4_bTTwXV_vsB5w3mYNnmUGCvj3HX9VaK93gcFdX5BPB5QkefQB3QIvW3QwgDUSn4VI-BiLjw_eSjqy49bwGeTAg9aFZhk5JK5GvduL39AzCNZrTpuUNexHDCR21s1qK7tdUFjh2uUBfidT5K6P_mwT_D6CsyrNfHk1Y8_6FiOl",
    safetyScore: 78,
    licenseExpiration: "02/2024",
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
    currentVehicle: "Transit Van (TX-5512) • Grounded",
    lastInspection: "Oct 05, 2023 (Pass)",
    emergencyContact: "Roberto Rodriguez (Brother)",
    currentLocation: {
      description: "Grounded at Austin Depot",
      speed: "0 mph",
      temp: "82°F",
      mapUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXoes9M5y85vaev9IR2oEoesdC6k62itk9tV8eM4n3GJKpQjtmB7wDLaFmoW7bUx8w9kywjBflzrlX46aHrAIUY31rWl-g1PDgJGE5UYcSJWYMVU-Kaa7-_KBBEDmx-o7OdfkOuU3uvMFpeQWOh9NgFZKX37ll1yqnkKM2pi7g5FTVqOs9C2DsQrOuVRxYlwK7nROmiXkJ247BPc_YuhW39dTerQMM8UuuSdlRJ_vqQ8tLHcaumCiM"
    },
    safetyTimeline: [
      {
        id: "st-4",
        title: "License Expiration Alert",
        description: "CDL expired on Feb 09, 2024. Driver suspended pending renewal.",
        date: "Feb 10, 2024",
        type: "error"
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
      { id: "T-8501", route: "Austin Depot ➔ Houston Terminal", date: "Feb 02, 2024", status: "Completed", cargo: "General Retail" }
    ],
    safetyAnalytics: {
      hardBrakingEvents: 8,
      speedingAlerts: 5,
      idleTimePercent: "12%",
      totalSafeMiles: "45,000 mi",
      incidentRate: "0.18 / 10k mi"
    },
    contactInfo: {
      email: "elena.rodriguez@transitops.com",
      phone: "+1 (555) 234-5678",
      address: "782 Pine St, Austin, TX 78701",
      emergencyContact: "Roberto Rodriguez (Brother)",
      emergencyPhone: "+1 (555) 234-5679"
    }
  },
  {
    id: "FL-04289",
    name: "Chen Wei",
    role: "Heavy Haul Expert",
    experience: "8 Years Experience",
    status: "Off Duty",
    routeStatus: "Off Duty",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfsAlI7OpHxJhgWWlY1vBZER9lq8J7REJZpDGRLGBnk_LC7glCodDu2vdW0lZGXoqnn3cA77EH5oDPa5T7EoeP-g56TaQz0LSs68vZFhJD7ROTtyD3g9HyTKlmoHRAoYKv4vJY0ebMLZuV-C_4MhLkBOaFaxjx24XS8w1cEuHVfOGOsl_ESZDJqtVluaMAQMJ-gm4CJgXfJa1ZNUPeap82SKdWmL3bT8GOtgDVWmjh3DWnUpdSUM9c",
    safetyScore: 92,
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
    emergencyContact: "Lin Wei (Mother)",
    currentLocation: {
      description: "Resting: Dallas Depot",
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
      { id: "T-8799", route: "Fort Worth Depot ➔ Dallas Terminal", date: "Jul 10, 2026", status: "Completed", cargo: "Frozen Seafood" },
      { id: "T-8692", route: "Houston Terminal ➔ Dallas Terminal", date: "Jul 05, 2026", status: "Completed", cargo: "Pharmaceuticals" }
    ],
    safetyAnalytics: {
      hardBrakingEvents: 3,
      speedingAlerts: 1,
      idleTimePercent: "8%",
      totalSafeMiles: "88,000 mi",
      incidentRate: "0.05 / 10k mi"
    },
    contactInfo: {
      email: "chen.wei@transitops.com",
      phone: "+1 (555) 345-6789",
      address: "405 Blossom Ln, Plano, TX 75023",
      emergencyContact: "Lin Wei (Mother)",
      emergencyPhone: "+1 (555) 345-6780"
    }
  },
  {
    id: "FL-09822",
    name: "David Miller",
    role: "Delivery Professional",
    experience: "6 Years Experience",
    status: "On Duty",
    routeStatus: "On Route",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9nCQyOFwJaziHm_cb81BkCqypYrveKYxcp7PHuM7n72PB5slUaedykxp2CaUkMr8225IsKjwUDGritZrL_0pJgS3tBzb0GvjxA5236UstrfLiPSQV_KnQzg68mKXSIjg7wWayn17-wzcryRl1jI3UWw1dhqiWZfI4NMDxM6EfvKfdRPvVxCKz-8w-WjjLLWmVihUlYzG_PqiwEkaCqOiD4H82RGXXuupVLaBhdZZamPyDgIeFahdX",
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
    emergencyContact: "Jane Miller (Wife)",
    currentLocation: {
      description: "En-route: Galveston Port",
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
      { id: "T-8801", route: "Houston Terminal ➔ Galveston Port", date: "Jul 11, 2026", status: "Completed", cargo: "Construction Materials" }
    ],
    safetyAnalytics: {
      hardBrakingEvents: 2,
      speedingAlerts: 2,
      idleTimePercent: "6%",
      totalSafeMiles: "62,000 mi",
      incidentRate: "0.08 / 10k mi"
    },
    contactInfo: {
      email: "david.miller@transitops.com",
      phone: "+1 (555) 456-7890",
      address: "112 Westheimer Rd, Houston, TX 77056",
      emergencyContact: "Jane Miller (Wife)",
      emergencyPhone: "+1 (555) 456-7891"
    }
  }
];
