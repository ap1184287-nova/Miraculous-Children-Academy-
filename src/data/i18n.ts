import type { LanguageCode } from '../types/school';

export interface UIMessages {
  brandName: string;
  locationLine: string;
  nav: {
    home: string;
    about: string;
    classes: string;
    notices: string;
    gallery: string;
    contact: string;
    studentCorner: string;
    adminPanel: string;
  };
  utility: {
    cbseLocation: string;
    switchLang: string;
    adminAccess: string;
  };
  home: {
    heroKicker: string;
    ctaPrimary: string;
    ctaSecondary: string;
    welcomeKicker: string;
    featuresKicker: string;
    featuresTitle: string;
    stagesKicker: string;
    stagesTitle: string;
    viewAllClasses: string;
    noticesTitle: string;
    allNotices: string;
    openNoticeBoard: string;
    principalKicker: string;
    aboutSchoolBtn: string;
    admissionsBtn: string;
    quickLinksTitle: string;
    quickLinksSubtitle: string;
  };
  about: {
    kicker: string;
    title: string;
    subtitle: string;
    visionTitle: string;
    missionTitle: string;
    historyKicker: string;
    historyTitle: string;
    principalKicker: string;
    principalTitle: string;
    teachersKicker: string;
    teachersTitle: string;
    teachersSubtitle: string;
  };
  classes: {
    kicker: string;
    title: string;
    subtitle: string;
    coreSubjects: string;
    coCurriculars: string;
    assessmentPattern: string;
    classTeacher: string;
    linkedHomework: string;
    linkedMaterials: string;
    enquireFor: string;
    openStudentCorner: string;
  };
  studentCorner: {
    kicker: string;
    title: string;
    subtitle: string;
    tabs: {
      materials: string;
      homework: string;
      papers: string;
      exams: string;
      studentLookup: string;
    };
    filterClass: string;
    allClasses: string;
    searchPlaceholder: string;
    downloadNote: string;
    readOnline: string;
    dailyHomework: string;
    holidayHomework: string;
    allHomework: string;
    examInfoTitle: string;
    examGradingTitle: string;
  };
  notices: {
    kicker: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    readCircular: string;
    noResults: string;
    resetFilters: string;
    close: string;
  };
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    empty: string;
  };
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
    deskTitle: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    mapsTitle: string;
    mapsDescription: string;
    openInMaps: string;
    formTitle: string;
    formSubtitle: string;
    submitBtn: string;
  };
  footer: {
    summary: string;
    institutionHeading: string;
    portalsHeading: string;
    officeHeading: string;
    copyright: string;
    demoNote: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, UIMessages> = {
  en: {
    brandName: 'Miraculous Children Academy',
    locationLine: 'Nikhura, Buxar, Bihar, India · CBSE Pattern (Nursery – Class 10)',
    nav: {
      home: 'Home',
      about: 'About',
      classes: 'Academics',
      notices: 'Notices',
      gallery: 'Gallery',
      contact: 'Contact',
      studentCorner: 'Student Corner',
      adminPanel: 'Admin Panel',
    },
    utility: {
      cbseLocation: 'Nikhura, Buxar, Bihar · CBSE Nursery to Class 10',
      switchLang: 'हिन्दी',
      adminAccess: 'Admin Panel (Demo)',
    },
    home: {
      heroKicker: 'CBSE Pattern · Nursery to Class 10 · Nikhura, Buxar, Bihar',
      ctaPrimary: 'Open Student Corner',
      ctaSecondary: 'Explore Academics (Nursery–10)',
      welcomeKicker: 'Welcome to Miraculous Children Academy',
      featuresKicker: 'School Highlights',
      featuresTitle: 'Why families in Buxar choose our campus',
      stagesKicker: 'Academic Architecture',
      stagesTitle: 'Four progressive stages from Nursery to Class 10',
      viewAllClasses: 'View full class curriculum',
      noticesTitle: 'Latest News & Notices',
      allNotices: 'All notices',
      openNoticeBoard: 'Open Notice Board',
      principalKicker: "From the Principal's Desk",
      aboutSchoolBtn: 'About Our School',
      admissionsBtn: 'Contact Admissions',
      quickLinksTitle: 'Important Links & Digital Resources',
      quickLinksSubtitle: 'Direct single-click access to curriculum, study notes, circulars, and school administration.',
    },
    about: {
      kicker: 'About Miraculous Children Academy · Nikhura, Buxar',
      title: 'Rooted in CBSE academic integrity, built for learners across Buxar.',
      subtitle: 'Founded in 2012 in Nikhura, Buxar, Bihar, Miraculous Children Academy nurtures students from Nursery to Class 10 with structured NCERT pedagogy, laboratories, and value-based mentorship.',
      visionTitle: 'Our Vision',
      missionTitle: 'Our Mission (हमारा उद्देश्य)',
      historyKicker: 'Institutional Journey',
      historyTitle: 'School History & Milestones',
      principalKicker: 'Academic Leadership',
      principalTitle: "Principal's Message",
      teachersKicker: 'Dedicated Faculty',
      teachersTitle: 'Meet Our Principal & Teachers',
      teachersSubtitle: 'Experienced educators guiding foundational literacy through Class 10 CBSE board readiness.',
    },
    classes: {
      kicker: 'CBSE Academics · Nursery to Class 10',
      title: 'Academics, Classes & Subjects',
      subtitle: 'Explore class-wise curriculum, subjects, assigned class teachers, homework, and study materials for every grade from Nursery to Class 10.',
      coreSubjects: 'Core CBSE Subjects',
      coCurriculars: 'Co-Curricular & Activity Tracks',
      assessmentPattern: 'Assessment Pattern',
      classTeacher: 'Class Coordinator',
      linkedHomework: 'Class Homework & Assignments',
      linkedMaterials: 'Class Study Materials & Notes',
      enquireFor: 'Admission Enquiry',
      openStudentCorner: 'Open in Student Corner',
    },
    studentCorner: {
      kicker: 'Digital Learning Hub · Nursery to Class 10',
      title: 'Student Corner & Academic Portal',
      subtitle: 'Access class-wise study materials, worksheets, sample question papers, holiday homework, exam schedule, and the auth-gated Demo Student Record lookup.',
      tabs: {
        materials: 'Study Materials & Notes',
        homework: 'Homework & Holiday Work',
        papers: 'Sample Papers',
        exams: 'Exam Information',
        studentLookup: 'Demo Student Lookup',
      },
      filterClass: 'Filter by Class',
      allClasses: 'All Classes',
      searchPlaceholder: 'Search topic, subject, or keyword...',
      downloadNote: 'Download (.txt)',
      readOnline: 'Read Material',
      dailyHomework: 'Regular Homework',
      holidayHomework: 'Holiday Homework',
      allHomework: 'All Homework',
      examInfoTitle: 'Academic Examination Calendar & Guidelines (2026–2027)',
      examGradingTitle: 'CBSE 8-Point Grading Scale (Nursery – Class 10)',
    },
    notices: {
      kicker: 'Official School Notice Board',
      title: 'School Notices & Circulars',
      subtitle: 'Holiday notices, examination schedules, important announcements, and school event updates.',
      searchPlaceholder: 'Search notice title or reference...',
      readCircular: 'Read Circular',
      noResults: 'No matching notices found',
      resetFilters: 'Reset Filters',
      close: 'Close',
    },
    gallery: {
      kicker: 'Campus Life, Events & Sports',
      title: 'School Photo Gallery',
      subtitle: 'Explore classrooms, school functions, annual sports, and cultural celebrations at Nikhura, Buxar.',
      empty: 'No photos in this category yet.',
    },
    contact: {
      kicker: 'Admissions & Campus Office · Nikhura, Buxar, Bihar',
      title: 'Contact Miraculous Children Academy',
      subtitle: 'Visit our campus at Nikhura, Buxar, Bihar, call our demo helpline, or send an enquiry directly online.',
      deskTitle: 'School Office & Communication Desk',
      addressLabel: 'School Address',
      phoneLabel: 'Helpline / Mobile (Demo)',
      emailLabel: 'Official Email',
      hoursLabel: 'Office Hours',
      mapsTitle: 'Campus Location — Nikhura, Buxar, Bihar',
      mapsDescription: 'Zero-budget external map navigation opens Google Maps directly without paid embed keys.',
      openInMaps: 'Open Location in Google Maps',
      formTitle: 'Send a Message / Admissions Enquiry',
      formSubtitle: 'Fill in your details below and our campus office will reply within one working day.',
      submitBtn: 'Submit Enquiry',
    },
    footer: {
      summary: 'Co-educational CBSE-pattern school in Nikhura, Buxar, Bihar, serving Nursery to Class 10 with modern classrooms, bilingual learning, and a zero-budget PWA portal.',
      institutionHeading: 'School Sections',
      portalsHeading: 'Student & Admin',
      officeHeading: 'Campus Contact',
      copyright: '© 2026 Miraculous Children Academy · Nikhura, Buxar, Bihar, India',
      demoNote: 'Demo Portal Data Only · Zero-Budget Static PWA Ready for GitHub Pages & Android TWA',
    },
  },
  hi: {
    brandName: 'मिरेकुलस चिल्ड्रेन एकेडमी',
    locationLine: 'निखुरा, बक्सर, बिहार, भारत · सीबीएसई पैटर्न (नर्सरी से कक्षा 10)',
    nav: {
      home: 'होम',
      about: 'परिचय',
      classes: 'शिक्षा (कक्षाएं)',
      notices: 'सूचना पट्ट',
      gallery: 'गैलरी',
      contact: 'संपर्क',
      studentCorner: 'स्टूडेंट कॉर्नर',
      adminPanel: 'एडमिन पैनल',
    },
    utility: {
      cbseLocation: 'निखुरा, बक्सर, बिहार · सीबीएसई नर्सरी से कक्षा 10',
      switchLang: 'English',
      adminAccess: 'एडमिन पैनल (डेमो)',
    },
    home: {
      heroKicker: 'सीबीएसई पैटर्न · नर्सरी से कक्षा 10 · निखुरा, बक्सर, बिहार',
      ctaPrimary: 'स्टूडेंट कॉर्नर खोलें',
      ctaSecondary: 'कक्षाएं एवं विषय देखें',
      welcomeKicker: 'मिरेकुलस चिल्ड्रेन एकेडमी में आपका स्वागत है',
      featuresKicker: 'स्कूल की प्रमुख विशेषताएं',
      featuresTitle: 'बक्सर क्षेत्र के अभिभावकों की पहली पसंद क्यों?',
      stagesKicker: 'शैक्षणिक संरचना',
      stagesTitle: 'नर्सरी से कक्षा 10 तक चार सुव्यवस्थित चरण',
      viewAllClasses: 'सभी कक्षाओं का विवरण देखें',
      noticesTitle: 'ताज़ा समाचार एवं सूचनाएं',
      allNotices: 'सभी सूचनाएं',
      openNoticeBoard: 'सूचना पट्ट खोलें',
      principalKicker: 'प्रधानाचार्य का संदेश',
      aboutSchoolBtn: 'स्कूल के बारे में जानें',
      admissionsBtn: 'प्रवेश हेतु संपर्क करें',
      quickLinksTitle: 'महत्वपूर्ण लिंक एवं डिजिटल सेवाएं',
      quickLinksSubtitle: 'पाठ्यक्रम, स्टडी मटेरियल, होमवर्क, परीक्षा सूचना और एडमिन पोर्टल पर तुरंत जाएं।',
    },
    about: {
      kicker: 'स्कूल परिचय · निखुरा, बक्सर, बिहार',
      title: 'अनुशासित सीबीएसई शिक्षा और संस्कारों का संगम।',
      subtitle: 'वर्ष 2012 में निखुरा, बक्सर (बिहार) में स्थापित मिरेकुलस चिल्ड्रेन एकेडमी नर्सरी से कक्षा 10 तक के विद्यार्थियों को गुणवत्तापूर्ण एनसीईआरटी शिक्षा, विज्ञान प्रयोगशाला और नैतिक मार्गदर्शन प्रदान करता है।',
      visionTitle: 'हमारी दृष्टि (Vision)',
      missionTitle: 'हमारा उद्देश्य (Mission)',
      historyKicker: 'हमारी यात्रा',
      historyTitle: 'स्कूल का इतिहास एवं प्रमुख पड़ाव',
      principalKicker: 'शैक्षणिक नेतृत्व',
      principalTitle: 'प्रधानाचार्य का संदेश',
      teachersKicker: 'अनुभवी शिक्षकगण',
      teachersTitle: 'प्रधानाचार्य एवं शिक्षकों का परिचय',
      teachersSubtitle: 'नर्सरी से कक्षा 10 तक प्रत्येक विद्यार्थी पर व्यक्तिगत ध्यान देने वाले समर्पित शिक्षक।',
    },
    classes: {
      kicker: 'सीबीएसई शैक्षणिक पाठ्यक्रम · नर्सरी से कक्षा 10',
      title: 'अकादमिक कक्षाएं, विषय एवं होमवर्क',
      subtitle: 'नर्सरी से कक्षा 10 तक सभी कक्षाओं की जानकारी, विषय सूची, कक्षा अध्यापक, स्टडी मटेरियल और होमवर्क देखें।',
      coreSubjects: 'मुख्य विषय (CBSE / NCERT)',
      coCurriculars: 'सह-पाठ्यक्रम एवं गतिविधियां',
      assessmentPattern: 'मूल्यांकन पद्धति',
      classTeacher: 'कक्षा समन्वयक / शिक्षक',
      linkedHomework: 'कक्षा का होमवर्क एवं असाइनमेंट',
      linkedMaterials: 'कक्षा स्टडी मटेरियल एवं नोट्स',
      enquireFor: 'प्रवेश पूछताछ',
      openStudentCorner: 'स्टूडेंट कॉर्नर में देखें',
    },
    studentCorner: {
      kicker: 'डिजिटल शिक्षण केंद्र · नर्सरी से कक्षा 10',
      title: 'स्टूडेंट कॉर्नर एवं विद्यार्थी पोर्टल',
      subtitle: 'कक्षा-वार स्टडी मटेरियल, नोट्स, वर्कशीट, सैंपल पेपर, हॉलिडे होमवर्क, परीक्षा जानकारी और डेमो छात्र प्रोफाइल (रोल नंबर खोज) यहां उपलब्ध हैं।',
      tabs: {
        materials: 'स्टडी मटेरियल व नोट्स',
        homework: 'होमवर्क व हॉलिडे कार्य',
        papers: 'सैंपल पेपर',
        exams: 'परीक्षा जानकारी',
        studentLookup: 'डेमो छात्र खोज (रोल नं.)',
      },
      filterClass: 'कक्षा चुनें',
      allClasses: 'सभी कक्षाएं',
      searchPlaceholder: 'विषय या पाठ का नाम खोजें...',
      downloadNote: 'डाउनलोड (.txt)',
      readOnline: 'ऑनलाइन पढ़ें',
      dailyHomework: 'दैनिक होमवर्क',
      holidayHomework: 'अवकाश गृहकार्य (Holiday)',
      allHomework: 'सभी होमवर्क',
      examInfoTitle: 'वार्षिक परीक्षा कैलेंडर एवं निर्देश (2026–2027)',
      examGradingTitle: 'सीबीएसई 8-पॉइंट ग्रेडिंग प्रणाली (A1–E)',
    },
    notices: {
      kicker: 'आधिकारिक स्कूल सूचना पट्ट',
      title: 'स्कूल नोटिस बोर्ड',
      subtitle: 'स्कूल की छुट्टियां, परीक्षा समय-सारणी, जरूरी घोषणाएं और स्कूल कार्यक्रमों की नवीनतम सूचनाएं।',
      searchPlaceholder: 'सूचना या संदर्भ संख्या खोजें...',
      readCircular: 'पूरी सूचना पढ़ें',
      noResults: 'कोई मेल खाती सूचना नहीं मिली',
      resetFilters: 'फ़िल्टर रीसेट करें',
      close: 'बंद करें',
    },
    gallery: {
      kicker: 'स्कूल परिसर, कार्यक्रम एवं खेलकूद',
      title: 'फोटो गैलरी',
      subtitle: 'निखुरा, बक्सर परिसर की कक्षाएं, सांस्कृतिक कार्यक्रम, विज्ञान प्रदर्शनी और खेलकूद प्रतियोगिताओं की झलकियां।',
      empty: 'इस श्रेणी में अभी कोई फोटो नहीं है।',
    },
    contact: {
      kicker: 'प्रवेश एवं कार्यालय संपर्क · निखुरा, बक्सर, बिहार',
      title: 'स्कूल से संपर्क करें',
      subtitle: 'निखुरा, बक्सर स्थित स्कूल परिसर आएं, डेमो हेल्पलाइन पर संपर्क करें या नीचे दिए गए फॉर्म से संदेश भेजें।',
      deskTitle: 'स्कूल कार्यालय एवं संपर्क विवरण',
      addressLabel: 'स्कूल का पता',
      phoneLabel: 'मोबाइल नंबर (डेमो)',
      emailLabel: 'ईमेल पता',
      hoursLabel: 'कार्यालय समय',
      mapsTitle: 'लोकेशन — निखुरा, बक्सर, बिहार',
      mapsDescription: 'बिना किसी शुल्क या API कुंजी के सीधे Google Maps में स्कूल की लोकेशन देखें।',
      openInMaps: 'Google Maps में लोकेशन खोलें',
      formTitle: 'संपर्क / प्रवेश पूछताछ फॉर्म',
      formSubtitle: 'अपना विवरण भरें, कार्यालय द्वारा शीघ्र संपर्क किया जाएगा।',
      submitBtn: 'संदेश भेजें',
    },
    footer: {
      summary: 'निखुरा, बक्सर, बिहार में स्थित सीबीएसई पैटर्न विद्यालय, जो नर्सरी से कक्षा 10 तक आधुनिक शिक्षा और निःशुल्क PWA डिजिटल पोर्टल प्रदान करता है।',
      institutionHeading: 'मुख्य अनुभाग',
      portalsHeading: 'छात्र एवं प्रशासन',
      officeHeading: 'स्कूल कार्यालय',
      copyright: '© 2026 मिरेकुलस चिल्ड्रेन एकेडमी · निखुरा, बक्सर, बिहार, भारत',
      demoNote: 'केवल डेमो डेटा · GitHub Pages और Android App (TWA) हेतु तैयार PWA',
    },
  },
};
