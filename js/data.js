/**
 * Campus2Community Jharkhand - Core Data & Mock Database Initialization
 */

window.C2C_DATA = {
  STAGES: [
    { id: 1, nameEn: "Report", nameHi: "रिपोर्ट दर्ज", descEn: "Resident reports societal problem with details & evidence", status: "Reported" },
    { id: 2, nameEn: "Verify", nameHi: "सत्यापन", descEn: "Admin checks complaint accuracy & submitted documents", status: "Verification" },
    { id: 3, nameEn: "Scrutinize", nameHi: "प्रशासनिक समीक्षा", descEn: "Admin scrutinizes feasibility & assigns initial priority", status: "Admin Scrutiny" },
    { id: 4, nameEn: "Categorize", nameHi: "श्रेणीबद्ध", descEn: "Problem is categorized under suitable theme & district", status: "University Enrollment" },
    { id: 5, nameEn: "University Enrollment", nameHi: "विश्वविद्यालय नामांकन", descEn: "Eligible universities enroll & submit solution proposals", status: "University Enrollment" },
    { id: 6, nameEn: "University Selection", nameHi: "विश्वविद्यालय चयन", descEn: "Admin evaluates proposals & assigns selected university", status: "University Selected" },
    { id: 7, nameEn: "Solution Development", nameHi: "समाधान विकास", descEn: "University team builds prototype & practical solution", status: "Solution Development" },
    { id: 8, nameEn: "Testing & Implementation", nameHi: "परीक्षण व कार्यान्वयन", descEn: "Field testing conducted in affected community area", status: "Field Testing" },
    { id: 9, nameEn: "Solve & Close", nameHi: "समाधान व बंद", descEn: "Verified resolution confirmed & problem marked solved", status: "Solved" }
  ],

  CATEGORIES: [
    "Water",
    "Roads",
    "Waste Management",
    "Agriculture",
    "NGO & Social Issues",
    "Robotics",
    "Space & Technology",
    "Environment",
    "Education",
    "Other"
  ],

  DISTRICTS: [
    "Ranchi", "Dhanbad", "Jamshedpur (East Singhbhum)", "Bokaro", "Hazaribagh",
    "Deoghar", "Dumka", "Giridih", "Palamu", "Khunti", "Ramgarh", "Chaibasa (West Singhbhum)",
    "Godda", "Sahibganj", "Koderma", "Chatra", "Lohardaga", "Gumla", "Simdega", "Latehar"
  ],

  FOUNDERS: [
    { name: "Parnavi Janbhor", role: "Co-Founder & Platform Lead", avatar: "PJ" },
    { name: "Tanmay Shirgudi", role: "Co-Founder & Technical Architect", avatar: "TS" },
    { name: "Shlok Jadhav", role: "Co-Founder & Community Outreach", avatar: "SJ" },
    { name: "Shrutesh Gaikwad", role: "Co-Founder & University Liaison", avatar: "SG" },
    { name: "Kashaf Khan", role: "Co-Founder & UX Designer", avatar: "KK" },
    { name: "Aqsa Haji", role: "Co-Founder & Operations", avatar: "AH" }
  ],

  DEMO_USERS: {
    resident: { mobile: "9876543210", password: "user123", name: "Ramesh Mahto", role: "resident", district: "Ranchi" },
    admin: { email: "admin@jharkhand.gov.in", password: "admin123", name: "State Nodal Officer", role: "admin" },
    university: { 
      email: "bit.mesra@edu.in", 
      password: "univ123", 
      name: "Birla Institute of Technology, Mesra", 
      role: "university",
      naac: "A+",
      nirf: "53",
      dept: "Department of Civil & Environmental Engineering"
    }
  },

  INITIAL_PROBLEMS: [
    {
      id: "JC2C-2026-00101",
      title: "Contaminated Village Drinking Water Supply in Ormanjhi",
      description: "High iron & arsenic content detected in 4 community borewells serving over 1,200 households in Ormanjhi block. Residents report frequent stomach illnesses.",
      category: "Water",
      district: "Ranchi",
      villageCity: "Ormanjhi Village",
      mobile: "9876543210",
      latitude: 23.4795,
      longitude: 85.4764,
      status: "University Enrollment",
      stage: 5,
      createdBy: "9876543210",
      createdAt: "2026-09-15T10:30:00Z",
      images: [
        "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=600&q=80"
      ],
      assignedUniversity: null,
      enrollments: [
        {
          id: "ENR-101-1",
          universityId: "bit.mesra@edu.in",
          universityName: "BIT Mesra, Ranchi",
          naacGrade: "A+",
          nirfRating: "53",
          department: "Department of Chemical & Environmental Engineering",
          experience: "Implemented low-cost bio-sand filters in 5 rural blocks of Khunti district in 2024.",
          proposedSolution: "Installation of automated multi-stage media filtration units with solar-powered UV sterilization. Low maintenance cost suitable for village panchayats.",
          status: "Pending Review",
          createdAt: "2026-09-18T14:20:00Z"
        },
        {
          id: "ENR-101-2",
          universityId: "iit.dhanbad@edu.in",
          universityName: "IIT (ISM) Dhanbad",
          naacGrade: "A++",
          nirfRating: "14",
          department: "Department of Environmental Science & Engineering",
          experience: "Patented heavy-metal adsorption technique using local agricultural bio-char waste.",
          proposedSolution: "Deployment of community bio-char filtration columns integrated with real-time IoT water purity monitoring sensor nodes.",
          status: "Pending Review",
          createdAt: "2026-09-19T09:10:00Z"
        }
      ]
    },
    {
      id: "JC2C-2026-00102",
      title: "Damaged Heavy Freight Rural Connecting Road in Topchanchi",
      description: "A 3.5km stretch connecting Topchanchi highway to coal transport routes has severe potholes exceeding 1 foot depth, causing transport blockades.",
      category: "Roads",
      district: "Dhanbad",
      villageCity: "Topchanchi",
      mobile: "9812345678",
      latitude: 23.9031,
      longitude: 86.2053,
      status: "Solution Development",
      stage: 7,
      createdBy: "9812345678",
      createdAt: "2026-09-10T08:15:00Z",
      images: [
        "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
      ],
      assignedUniversity: {
        id: "iit.dhanbad@edu.in",
        name: "IIT (ISM) Dhanbad",
        naac: "A++",
        nirf: "14"
      },
      enrollments: [
        {
          id: "ENR-102-1",
          universityId: "iit.dhanbad@edu.in",
          universityName: "IIT (ISM) Dhanbad",
          naacGrade: "A++",
          nirfRating: "14",
          department: "Department of Civil Engineering",
          experience: "Designed plastic-waste modified bituminous pavements for NHAI rural link projects.",
          proposedSolution: "Utilizing recycled waste plastic polymer blend to reinforce asphalt pavement durability against heavy coal truck loads.",
          status: "Selected",
          createdAt: "2026-09-12T11:00:00Z"
        }
      ]
    },
    {
      id: "JC2C-2026-00103",
      title: "Solar Irrigation Pump Micro-Grid Defect in Rural Palamu",
      description: "Solar powered pump controllers installed under farm assistance schemes suffer frequent grid synchronization failures during monsoon overcast conditions.",
      category: "Agriculture",
      district: "Palamu",
      villageCity: "Daltonganj Block",
      mobile: "9765432109",
      latitude: 24.0396,
      longitude: 84.0700,
      status: "Verification",
      stage: 2,
      createdBy: "9765432109",
      createdAt: "2026-09-22T16:45:00Z",
      images: [
        "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80"
      ],
      assignedUniversity: null,
      enrollments: []
    },
    {
      id: "JC2C-2026-00104",
      title: "Solar Micro-Grid & Streetlight Failure in Remote Tribal Khunti",
      description: "Over 40 solar streetlights in Torpa panchayat are malfunctioning due to battery charge controller circuit damage after heavy lightning storms.",
      category: "Space & Technology",
      district: "Khunti",
      villageCity: "Torpa Village",
      mobile: "9988776655",
      latitude: 22.9774,
      longitude: 85.0833,
      status: "Field Testing",
      stage: 8,
      createdBy: "9988776655",
      createdAt: "2026-09-01T12:00:00Z",
      images: [
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80"
      ],
      assignedUniversity: {
        id: "bit.mesra@edu.in",
        name: "BIT Mesra, Ranchi",
        naac: "A+",
        nirf: "53"
      },
      enrollments: [
        {
          id: "ENR-104-1",
          universityId: "bit.mesra@edu.in",
          universityName: "BIT Mesra, Ranchi",
          naacGrade: "A+",
          nirfRating: "53",
          department: "Department of Electrical & Electronics Engineering",
          experience: "Developed surge-resistant MPPT charge controllers for microgrids.",
          proposedSolution: "Installation of custom surge-protected MPPT controllers with automatic low-voltage cutoff and battery health indicator.",
          status: "Selected",
          createdAt: "2026-09-04T10:00:00Z"
        }
      ]
    },
    {
      id: "JC2C-2026-00105",
      title: "Urban Waste Segregation & Plastic Processing Unit Defect",
      description: "Commercial ward markets in Bokaro Steel City lack decentralized plastic shredding and composting facilities, resulting in open dump site fires.",
      category: "Waste Management",
      district: "Bokaro",
      villageCity: "Bokaro Sector 4",
      mobile: "9835123456",
      latitude: 23.6693,
      longitude: 86.1511,
      status: "Solved",
      stage: 9,
      createdBy: "9835123456",
      createdAt: "2026-08-10T09:30:00Z",
      images: [
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"
      ],
      assignedUniversity: {
        id: "nit.jamshedpur@edu.in",
        name: "NIT Jamshedpur",
        naac: "A",
        nirf: "90"
      },
      enrollments: [
        {
          id: "ENR-105-1",
          universityId: "nit.jamshedpur@edu.in",
          universityName: "NIT Jamshedpur",
          naacGrade: "A",
          nirfRating: "90",
          department: "Department of Mechanical & Production Engineering",
          experience: "Designed compact ward-level organic waste shredders.",
          proposedSolution: "Compact dual-shaft motor shredder unit with odor-control bio-filter chamber implemented in Sector 4 municipal market.",
          status: "Selected",
          createdAt: "2026-08-14T15:00:00Z"
        }
      ]
    }
  ],

  TRANSLATIONS: {
    en: {
      appName: "Campus2Community",
      subtitle: "Community Problem-Reporting & University Collaboration Platform for Jharkhand",
      heroHeading: "Your Problem. Our Community. Better Jharkhand.",
      heroSubheading: "Report local problems and connect them with universities working on practical solutions.",
      btnReport: "Report a Problem",
      btnTrack: "Track My Problem",
      searchPlaceholder: "Search problems or website functions... (e.g. 'water', 'track', 'university')",
      navHome: "Home",
      navReport: "Report Problem",
      navTrack: "Track Problem",
      navHowItWorks: "How We Solve",
      navAbout: "About Us",
      navLogin: "Login / Register",
      navLogout: "Logout",
      navDashboard: "Dashboard",
      cardReportTitle: "1. Report",
      cardReportDesc: "Residents submit societal issues with photos, details, and exact geolocation pin.",
      cardTrackTitle: "2. Track",
      cardTrackDesc: "Transparent 9-stage tracking from verification down to field implementation.",
      cardConnectTitle: "3. Connect",
      cardConnectDesc: "Admin reviews & matches verified problems with top accredited Jharkhand universities.",
      cardSolveTitle: "4. Solve",
      cardSolveDesc: "Universities develop practical engineering & social solutions tested directly on field.",
      recentProblems: "Active Community Problems",
      filterAll: "All Categories",
      districtAll: "All Districts",
      statusAll: "All Statuses",
      selectUniversity: "Select University",
      assignUniversity: "Assign University",
      enrolledUniversities: "Enrolled Universities",
      submitEnrollment: "Submit Enrollment",
      useMyLocation: "Use My Location",
      chatTitle: "Campus2Community Help",
      chatSubtitle: "AI Guidance Assistant",
      foundersTitle: "Founders Team",
      aboutText: "Campus2Community is a collaborative platform designed to connect local communities, universities, institutions and administrators to identify societal challenges and work together toward practical solutions."
    },
    hi: {
      appName: "Campus2Community",
      subtitle: "झारखंड जन-समस्या समाधान एवं विश्वविद्यालय सहयोग पोर्टल",
      heroHeading: "आपकी समस्या। हमारा समुदाय। बेहतर झारखंड।",
      heroSubheading: "स्थानीय समस्याओं को दर्ज करें और उन्हें व्यावहारिक समाधान पर काम कर रहे विश्वविद्यालयों से जोड़ें।",
      btnReport: "समस्या दर्ज करें",
      btnTrack: "मेरी समस्या ट्रैक करें",
      searchPlaceholder: "समस्याएं या पोर्टल सेवाएं खोजें... (जैसे 'पानी', 'ट्रैक', 'विश्वविद्यालय')",
      navHome: "मुख्य पृष्ठ",
      navReport: "समस्या दर्ज करें",
      navTrack: "ट्रैक करें",
      navHowItWorks: "समाधान प्रक्रिया",
      navAbout: "हमारे बारे में",
      navLogin: "लॉगिन / पंजीकरण",
      navLogout: "लॉगआउट",
      navDashboard: "डैशबोर्ड",
      cardReportTitle: "1. रिपोर्ट करें",
      cardReportDesc: "नागरिक फोटो, विवरण और सटीक मैप लोकेशन के साथ जन समस्या दर्ज करते हैं।",
      cardTrackTitle: "2. ट्रैक करें",
      cardTrackDesc: "सत्यापन से लेकर जमीनी समाधान तक 9-चरणीय पारदर्शी ट्रैकिंग।",
      cardConnectTitle: "3. जोड़ें",
      cardConnectDesc: "प्रशासन जांच के बाद समस्याओं को राज्य के प्रमुख विश्वविद्यालयों को सौंपता है।",
      cardSolveTitle: "4. समाधान",
      cardSolveDesc: "विश्वविद्यालय के छात्र व प्रोफेसर व्यावहारिक समाधान विकसित व लागू करते हैं।",
      recentProblems: "सक्रिय सामुदायिक समस्याएं",
      filterAll: "सभी श्रेणियां",
      districtAll: "सभी जिले",
      statusAll: "सभी स्थिति",
      selectUniversity: "विश्वविद्यालय चुनें",
      assignUniversity: "विश्वविद्यालय असाइन करें",
      enrolledUniversities: "नामांकित विश्वविद्यालय",
      submitEnrollment: "नामांकन जमा करें",
      useMyLocation: "मेरी वर्तमान लोकेशन लें",
      chatTitle: "Campus2Community सहायता",
      chatSubtitle: "एआई सहायता गाइड",
      foundersTitle: "संस्थापक टीम",
      aboutText: "Campus2Community एक सहयोगात्मक मंच है जिसे स्थानीय समुदायों, विश्वविद्यालयों, संस्थानों और प्रशासकों को सामाजिक चुनौतियों की पहचान करने और व्यावहारिक समाधानों के लिए एक साथ काम करने के लिए डिज़ाइन किया गया है।"
    }
  },

  BOT_FAQ: [
    {
      keywords: ["report", "complaint", "submit", "दर्ज", "शिकायत", "समस्या"],
      answerEn: "To report a problem, click 'Report a Problem' in the navigation. Fill in the title, description, category, district, upload photos, and click 'Use My Location' to pinpoint the issue on the map.",
      answerHi: "समस्या दर्ज करने के लिए ऊपर 'समस्या दर्ज करें' बटन पर क्लिक करें। शीर्षक, विवरण, श्रेणी, जिला चुनें, फोटो अपलोड करें और मैप पर अपनी लोकेशन चुनने के लिए 'Use My Location' दबाएं।"
    },
    {
      keywords: ["location", "map", "gps", "लोकेशन", "नेविगेशन", "मानचित्र"],
      answerEn: "Click the 'Use My Location' button inside the report form. Allow your browser location access, or click directly on the interactive Leaflet map to adjust the latitude and longitude pin.",
      answerHi: "रिपोर्ट फॉर्म में 'Use My Location' बटन पर क्लिक करें। अपने ब्राउज़र में लोकेशन अनुमति दें, या मैप पर क्लिक करके सटीक लाल पिन सेट करें।"
    },
    {
      keywords: ["photo", "image", "picture", "upload", "फोटो", "चित्र"],
      answerEn: "You can upload multiple photos (JPG, PNG, WEBP, max 5MB each) in the Report form. A live image preview will be generated, and you can remove any image before submitting.",
      answerHi: "आप रिपोर्ट फॉर्म में एक से अधिक तस्वीरें (JPG, PNG) अपलोड कर सकते हैं। सबमिट करने से पहले फोटो प्रीव्यू में आप उन्हें देख या हटा सकते हैं।"
    },
    {
      keywords: ["id", "problem id", "code", "आइडिया", "आईडी"],
      answerEn: "After submitting a problem, a unique ID such as 'JC2C-2026-00001' is generated. You can also view all your reported problem IDs inside your Resident Dashboard.",
      answerHi: "समस्या दर्ज करने के तुरंत बाद आपको 'JC2C-2026-00001' जैसा यूनिक प्रॉब्लम आईडी मिलता है। आप इसे अपने यूजर डैशबोर्ड पर भी देख सकते हैं।"
    },
    {
      keywords: ["track", "status", "stage", "ट्रैक", "स्थिति"],
      answerEn: "Go to the 'Track Problem' page, enter your Problem ID and Mobile Number, and click Track. You will see a 9-stage solution pipeline highlighting the current progress.",
      answerHi: "'ट्रैक करें' पेज पर जाएं, अपनी प्रॉब्लम आईडी और मोबाइल नंबर दर्ज करें। आपको 9-चरणीय समाधान पाइपलाइन में वर्तमान स्थिति दिखेगी।"
    },
    {
      keywords: ["university", "enroll", "college", "विश्वविद्यालय", "कॉलेज", "एनरोल"],
      answerEn: "Universities can login with their institution email, browse open problems on the University Dashboard, and click 'Enroll to Solve' to submit their NAAC rank, department experience, and proposed solution.",
      answerHi: "विश्वविद्यालय अपने आधिकारिक ईमेल से लॉगिन करके 'University Dashboard' पर उपलब्ध समस्याएं देख सकते हैं और 'Enroll to Solve' पर क्लिक करके समाधान प्रस्ताव जमा कर सकते हैं।"
    },
    {
      keywords: ["selected", "university selected", "assign", "चयनित"],
      answerEn: "'University Selected' means the State Admin has reviewed the university proposals and assigned a specific university to lead the engineering and field solution development.",
      answerHi: "'University Selected' (विश्वविद्यालय चयनित) का अर्थ है कि राज्य प्रशासक ने विश्वविद्यालयों के प्रस्तावों की समीक्षा कर एक विशिष्ट विश्वविद्यालय को समाधान विकसित करने का दायित्व सौंप दिया है।"
    }
  ]
};
