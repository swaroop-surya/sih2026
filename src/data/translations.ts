import { SupportedLanguage } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  quickExit: string;
  emergencySOS: string;
  silentSOS: string;
  checkMyRisk: string;
  imInDanger: string;
  recordIncident: string;
  safetyCheckin: string;
  mySafetyPlan: string;
  trustedCircle: string;
  recentIncidents: string;
  safetyResources: string;
  learnPrevent: string;
  currentStatus: string;
  statusSafe: string;
  statusMonitoring: string;
  statusDanger: string;
  holdToActivate: string;
  navHome: string;
  navSafety: string;
  navSOS: string;
  navIncidents: string;
  navResources: string;
  navAI: string;
  navProfile: string;
  evidenceVault: string;
  recruitmentChecker: string;
  cyberSafety: string;
  aiAssistant: string;
  riskDisclaimer: string;
  emergencyDisclaimer: string;
  call112: string;
  call181: string;
  languageSelect: string;

  // Screen titles & subtitles
  pageTitleHome: string;
  pageTitleCheckMyRisk: string;
  pageSubtitleCheckMyRisk: string;
  pageTitleEmergency: string;
  pageSubtitleEmergency: string;
  pageTitleIncidents: string;
  pageSubtitleIncidents: string;
  pageTitleGetHelp: string;
  pageSubtitleGetHelp: string;
  pageTitleProfile: string;
  pageSubtitleProfile: string;
  pageTitleAskAegis: string;
  pageSubtitleAskAegis: string;

  protectionIsOn: string;
  locationChip: string;
  voiceTriggerChip: string;
  contactsChip: string;
  statusOn: string;
  statusOff: string;
  statusListening: string;
  holdHeroCaption: string;
  holdHeroMuted: string;
  cancelSOS: string;
  sendingAlertIn: string;
  savedCount: string;
  stepsDone: string;
  markDone: string;
  viewPlan: string;
  checkJobOffer: string;
  cyberBlackmail: string;
  safeHavens: string;
  silentModeTitle: string;
  silentModeSubtitle: string;
  voiceSafeWordTitle: string;
  setUpVoice: string;
  emergencyNumbers: string;
  aboutAegis: string;
  seeMyResults: string;
  whatWeNoticed: string;
  whatYouCanDo: string;
  saveToIncidentLog: string;
  getHelpNow: string;
  evidenceVaultPlain: string;
  mapTab: string;
  timelineTab: string;
  logIncidentBtn: string;
  filesProtected: string;
  openVault: string;
  legend: string;
  hideDetails: string;
  showDetails: string;
  dataStaysEncrypted: string;
  downloadAppMobile: string;
  appearanceTitle: string;
  lightMode: string;
  darkMode: string;
  systemMode: string;
  privacyAndData: string;
  exportBackup: string;
  securityLog: string;
  eraseAllData: string;
  demoModeTitle: string;
  showDemoTools: string;
  tryAsking: string;
  aiDisclaimer: string;
  askAegis: string;
  clearChat: string;
  aiDisclaimerText: string;
  evidenceVaultTitle: string;
  evidenceVaultCount: string;
  logIncident: string;
  themeTitle: string;
  trustedContacts: string;
  selectedCount: string;
  emptyIncidents: string;
  emptyTrustedContacts: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'Abhaya',
    tagline: "You're not alone.",
    quickExit: 'Quick hide',
    emergencySOS: 'SOS',
    silentSOS: 'Silent SOS',
    checkMyRisk: 'Something feels off?',
    imInDanger: "I'm in danger",
    recordIncident: 'Record an incident',
    safetyCheckin: 'Safety check-in',
    mySafetyPlan: 'Your safety plan',
    trustedCircle: 'Trusted contacts',
    recentIncidents: 'Recent',
    safetyResources: 'Get help',
    learnPrevent: 'Prevention',
    currentStatus: "You're covered.",
    statusSafe: 'Active',
    statusMonitoring: 'Check-in active',
    statusDanger: 'Emergency triggered',
    holdToActivate: 'Hold for 1.5s to trigger SOS',
    navHome: 'Home',
    navSafety: 'Safety',
    navSOS: 'SOS',
    navIncidents: 'Incidents',
    navResources: 'Get help',
    navAI: 'Ask Abhaya',
    navProfile: 'Profile',
    evidenceVault: 'Your private record',
    recruitmentChecker: 'Check a job or travel offer',
    cyberSafety: 'Cyber safety',
    aiAssistant: 'Ask Abhaya',
    riskDisclaimer: 'Informational safety guidance. Not legal or police advice.',
    emergencyDisclaimer: 'Alerts your trusted contacts and connects to 112 emergency services.',
    call112: '112 Police',
    call181: '181 Women',
    languageSelect: 'Language',

    pageTitleHome: 'Home',
    pageTitleCheckMyRisk: 'Something feels off?',
    pageSubtitleCheckMyRisk: "Tell us what's happening. Nothing leaves this phone.",
    pageTitleEmergency: 'Emergency',
    pageSubtitleEmergency: 'Discreet emergency response, location alerts, and direct help.',
    pageTitleIncidents: 'Incidents',
    pageSubtitleIncidents: 'Document encounters, map patterns, and protect evidence.',
    pageTitleGetHelp: 'Get help',
    pageSubtitleGetHelp: 'Verified 24×7 helplines, support centers, and legal aid across India.',
    pageTitleProfile: 'Profile & Settings',
    pageSubtitleProfile: 'Manage your protection settings, trusted contacts, and data.',
    pageTitleAskAegis: 'Ask Abhaya',
    pageSubtitleAskAegis: 'Private guidance when you need it. Nothing leaves this phone.',

    protectionIsOn: "You're covered.",
    locationChip: 'Location',
    voiceTriggerChip: 'Voice safe word',
    contactsChip: 'Contacts',
    statusOn: 'On',
    statusOff: 'Off',
    statusListening: 'Listening',
    holdHeroCaption: 'Hold for 1.5s to trigger SOS',
    holdHeroMuted: 'Alerts your trusted contacts with your live location.',
    cancelSOS: 'Cancel SOS',
    sendingAlertIn: 'Alerting contacts in',
    savedCount: 'saved',
    stepsDone: 'steps completed',
    markDone: 'Mark done',
    viewPlan: 'View plan',
    checkJobOffer: 'Check a job or travel offer',
    cyberBlackmail: 'Cyber safety',
    safeHavens: 'Safe places',
    silentModeTitle: 'Silent mode',
    silentModeSubtitle: 'No siren, vibration or screen flashing',
    voiceSafeWordTitle: 'Voice safe word',
    setUpVoice: 'Set up',
    emergencyNumbers: 'Emergency numbers',
    aboutAegis: 'About Abhaya',
    seeMyResults: 'See my results',
    whatWeNoticed: 'What we noticed',
    whatYouCanDo: 'What you can do',
    saveToIncidentLog: 'Save to incident log',
    getHelpNow: 'Get help now',
    evidenceVaultPlain: "Save screenshots to your private record so they can't be changed later.",
    mapTab: 'Map',
    timelineTab: 'Timeline',
    logIncidentBtn: 'Log an incident',
    filesProtected: 'files protected',
    openVault: 'Open',
    legend: 'Legend',
    hideDetails: 'Hide details',
    showDetails: 'Show details',
    dataStaysEncrypted: 'All data stays private on this device.',
    downloadAppMobile: 'Download Abhaya',
    appearanceTitle: 'Appearance',
    lightMode: 'Light',
    darkMode: 'Dark',
    systemMode: 'System',
    privacyAndData: 'Data & privacy',
    exportBackup: 'Export backup',
    securityLog: 'Security log',
    eraseAllData: 'Reset all data',
    demoModeTitle: 'Demo mode',
    showDemoTools: 'Show demo tools',
    tryAsking: 'Try asking',
    aiDisclaimer: 'Abhaya provides general safety guidance, not legal or police advice. In danger, call 112.',
    askAegis: 'Ask Abhaya',
    clearChat: 'Clear chat',
    aiDisclaimerText: 'Abhaya provides general safety guidance, not legal or police advice. In danger, call 112.',
    evidenceVaultTitle: 'Your private record',
    evidenceVaultCount: 'files, protected from edits',
    logIncident: 'Log an incident',
    themeTitle: 'Appearance',
    trustedContacts: 'Trusted contacts',
    selectedCount: 'selected',
    emptyIncidents: 'Nothing here yet. If something happens, write it down. Only you can see it.',
    emptyTrustedContacts: "Add someone you trust. They'll hear from us if you need help."
  },
  hi: {
    appName: 'अभया',
    tagline: 'आप अकेले नहीं हैं।',
    quickExit: 'त्वरित छुपाएं',
    emergencySOS: 'SOS',
    silentSOS: 'साइलेंट SOS',
    checkMyRisk: 'कुछ गलत लग रहा है?',
    imInDanger: 'मैं खतरे में हूँ',
    recordIncident: 'घटना दर्ज करें',
    safetyCheckin: 'सुरक्षा चेक-इन',
    mySafetyPlan: 'सुरक्षा योजना',
    trustedCircle: 'विश्वसनीय संपर्क',
    recentIncidents: 'हालिया',
    safetyResources: 'मदद लें',
    learnPrevent: 'रोकथाम',
    currentStatus: 'आप सुरक्षित हैं।',
    statusSafe: 'सक्रिय',
    statusMonitoring: 'चेक-इन चालू',
    statusDanger: 'आपातकाल सक्रिय',
    holdToActivate: 'SOS के लिए 1.5 सेकंड दबाएं',
    navHome: 'होम',
    navSafety: 'सुरक्षा',
    navSOS: 'SOS',
    navIncidents: 'घटनाएं',
    navResources: 'मदद लें',
    navAI: 'अभया से पूछें',
    navProfile: 'प्रोफ़ाइल',
    evidenceVault: 'आपका निजी रिकॉर्ड',
    recruitmentChecker: 'नौकरी या यात्रा ऑफर जांचें',
    cyberSafety: 'साइबर सुरक्षा',
    aiAssistant: 'अभया से पूछें',
    riskDisclaimer: 'सुरक्षा मार्गदर्शन। कानूनी या पुलिस सलाह नहीं।',
    emergencyDisclaimer: 'संपर्कों को सतर्क करता है और 112 से जोड़ता है।',
    call112: '112 पुलिस',
    call181: '181 महिला हेल्पलाइन',
    languageSelect: 'भाषा',

    pageTitleHome: 'होम',
    pageTitleCheckMyRisk: 'कुछ गलत लग रहा है?',
    pageSubtitleCheckMyRisk: 'बताएं क्या हो रहा है। आपके फ़ोन से कुछ भी बाहर नहीं जाता।',
    pageTitleEmergency: 'आपातकाल',
    pageSubtitleEmergency: 'गुप्त आपातकालीन प्रतिक्रिया और सीधी सहायता।',
    pageTitleIncidents: 'घटनाएं',
    pageSubtitleIncidents: 'घटनाओं को दर्ज करें और सबूत सुरक्षित रखें।',
    pageTitleGetHelp: 'मदद लें',
    pageSubtitleGetHelp: 'सत्यापित 24×7 हेल्पलाइन और कानूनी सहायता।',
    pageTitleProfile: 'प्रोफ़ाइल और सेटिंग्स',
    pageSubtitleProfile: 'सुरक्षा सेटिंग्स और विश्वसनीय संपर्कों का प्रबंधन करें।',
    pageTitleAskAegis: 'अभया से पूछें',
    pageSubtitleAskAegis: 'निजी मार्गदर्शन। आपके फ़ोन से कुछ भी बाहर नहीं जाता।',

    protectionIsOn: 'आप सुरक्षित हैं।',
    locationChip: 'स्थान',
    voiceTriggerChip: 'गुप्त आवाज़ शब्द',
    contactsChip: 'संपर्क',
    statusOn: 'चालू',
    statusOff: 'बंद',
    statusListening: 'सुन रहा है',
    holdHeroCaption: 'SOS के लिए 1.5 सेकंड दबाएं',
    holdHeroMuted: 'आपके लाइव स्थान के साथ संपर्कों को सतर्क करता है।',
    cancelSOS: 'SOS रद्द करें',
    sendingAlertIn: 'अलर्ट भेजा जा रहा है',
    savedCount: 'सहेजे गए',
    stepsDone: 'कदम पूरे हुए',
    markDone: 'पूरा हुआ',
    viewPlan: 'योजना देखें',
    checkJobOffer: 'नौकरी या यात्रा ऑफर जांचें',
    cyberBlackmail: 'साइबर सुरक्षा',
    safeHavens: 'सुरक्षित स्थान',
    silentModeTitle: 'साइलेंट मोड',
    silentModeSubtitle: 'कोई सायरन, कंपन या स्क्रीन लाइट नहीं',
    voiceSafeWordTitle: 'गुप्त आवाज़ शब्द',
    setUpVoice: 'सेट करें',
    emergencyNumbers: 'आपातकालीन नंबर',
    aboutAegis: 'अभया के बारे में',
    seeMyResults: 'परिणाम देखें',
    whatWeNoticed: 'हमने क्या देखा',
    whatYouCanDo: 'आप क्या कर सकते हैं',
    saveToIncidentLog: 'घटना लॉग में सहेजें',
    getHelpNow: 'तुरंत मदद लें',
    evidenceVaultPlain: 'स्क्रीनशॉट सुरक्षित रखें ताकि उन्हें बाद में बदला न जा सके।',
    mapTab: 'नक्शा',
    timelineTab: 'समयरेखा',
    logIncidentBtn: 'घटना दर्ज करें',
    filesProtected: 'फ़ाइलें सुरक्षित',
    openVault: 'खोलें',
    legend: 'संकेत',
    hideDetails: 'विवरण छुपाएं',
    showDetails: 'विवरण दिखाएं',
    dataStaysEncrypted: 'सारा डेटा इस डिवाइस पर निजी रहता है।',
    downloadAppMobile: 'अभया डाउनलोड करें',
    appearanceTitle: 'दिखावट',
    lightMode: 'लाइट',
    darkMode: 'डार्क',
    systemMode: 'सिस्टम',
    privacyAndData: 'डेटा और गोपनीयता',
    exportBackup: 'बैकअप निर्यात करें',
    securityLog: 'सुरक्षा लॉग',
    eraseAllData: 'सारा डेटा रीसेट करें',
    demoModeTitle: 'डेमो मोड',
    showDemoTools: 'डेमो टूल दिखाएं',
    tryAsking: 'पूछ कर देखें',
    aiDisclaimer: 'अभया सामान्य सुरक्षा मार्गदर्शन देता है, कानूनी सलाह नहीं। खतरे में 112 पर कॉल करें।',
    askAegis: 'अभया से पूछें',
    clearChat: 'चैट साफ़ करें',
    aiDisclaimerText: 'अभया सामान्य सुरक्षा मार्गदर्शन देता है, कानूनी सलाह नहीं। खतरे में 112 पर कॉल करें।',
    evidenceVaultTitle: 'आपका निजी रिकॉर्ड',
    evidenceVaultCount: 'फ़ाइलें, संपादन से सुरक्षित',
    logIncident: 'घटना दर्ज करें',
    themeTitle: 'दिखावट',
    trustedContacts: 'विश्वसनीय संपर्क',
    selectedCount: 'चयनित',
    emptyIncidents: 'यहाँ अभी कुछ नहीं है। अगर कुछ होता है, तो उसे लिख लें। केवल आप देख सकते हैं।',
    emptyTrustedContacts: 'किसी ऐसे व्यक्ति को जोड़ें जिस पर आप भरोसा करते हैं। मदद चाहिए तो हम सूचित करेंगे।'
  },
  te: {
    appName: 'అభయ',
    tagline: 'మీరు ఒంటరిగా లేరు.',
    quickExit: 'త్వరిత దాచు',
    emergencySOS: 'SOS',
    silentSOS: 'సైలెంట్ SOS',
    checkMyRisk: 'ఏదో తేడాగా అనిపిస్తుందా?',
    imInDanger: 'నేను ప్రమాదంలో ఉన్నాను',
    recordIncident: 'సంఘటన నమోదు',
    safetyCheckin: 'సేఫ్టీ చెక్-ఇన్',
    mySafetyPlan: 'భద్రతా ప్రణాళిక',
    trustedCircle: 'నమ్మకమైన పరిచయాలు',
    recentIncidents: 'ఇటీవలి',
    safetyResources: 'సహాయం పొందండి',
    learnPrevent: 'నివారణ',
    currentStatus: 'మీరు సురక్షితంగా ఉన్నారు.',
    statusSafe: 'క్రియాశీలకం',
    statusMonitoring: 'చెక్-ఇన్ యాక్టివ్',
    statusDanger: 'ఎమర్జెన్సీ ట్రిగ్గర్ చేయబడింది',
    holdToActivate: 'SOS కోసం 1.5 సెకన్లు పట్టుకోండి',
    navHome: 'హోమ్',
    navSafety: 'భద్రత',
    navSOS: 'SOS',
    navIncidents: 'సంఘటనలు',
    navResources: 'సహాయం',
    navAI: 'అభయ ని అడగండి',
    navProfile: 'ప్రొఫైల్',
    evidenceVault: 'మీ వ్యక్తిగత రికార్డు',
    recruitmentChecker: 'ఉద్యోగ ఆఫర్ తనిఖీ',
    cyberSafety: 'సైబర్ భద్రత',
    aiAssistant: 'అభయ ని అడగండి',
    riskDisclaimer: 'భద్రతా మార్గదర్శకత్వం. చట్టపరమైన లేదా పోలీసు సలహా కాదు.',
    emergencyDisclaimer: 'మీ పరిచయాలను హెచ్చరిస్తుంది మరియు 112 కు కనెక్ట్ చేస్తుంది.',
    call112: '112 పోలీస్',
    call181: '181 మహిళా హెల్ప్‌లైన్',
    languageSelect: 'భాష',

    pageTitleHome: 'హోమ్',
    pageTitleCheckMyRisk: 'ఏదో తేడాగా అనిపిస్తుందా?',
    pageSubtitleCheckMyRisk: 'ఏమి జరుగుతుందో చెప్పండి. ఈ ఫోన్ నుండి ఏదీ బయటకు వెళ్లదు.',
    pageTitleEmergency: 'అత్యవసరం',
    pageSubtitleEmergency: 'రహస్య అత్యవసర ప్రతిస్పందన మరియు ప్రత్యక్ష సహాయం.',
    pageTitleIncidents: 'సంఘటనలు',
    pageSubtitleIncidents: 'సంఘటనలను రికార్డ్ చేయండి మరియు సాక్ష్యాలను భద్రపరచండి.',
    pageTitleGetHelp: 'సహాయం పొందండి',
    pageSubtitleGetHelp: '24×7 ధృవీకరించబడిన హెల్ప్‌లైన్‌లు మరియు చట్టపరమైన సహాయం.',
    pageTitleProfile: 'ప్రొఫైల్ & సెట్టింగ్‌లు',
    pageSubtitleProfile: 'మీ భద్రతా సెట్టింగ్‌లు మరియు పరిచయాలను నిర్వహించండి.',
    pageTitleAskAegis: 'అభయ ని అడగండి',
    pageSubtitleAskAegis: 'వ్యక్తిగత మార్గదర్శకత్వం. ఈ ఫోన్ నుండి ఏదీ బయటకు వెళ్లదు.',

    protectionIsOn: 'మీరు సురక్షితంగా ఉన్నారు.',
    locationChip: 'లొకేషన్',
    voiceTriggerChip: 'రహస్య వాయిస్ పదం',
    contactsChip: 'పరిచయాలు',
    statusOn: 'ఆన్',
    statusOff: 'ఆఫ్',
    statusListening: 'వింటోంది',
    holdHeroCaption: 'SOS కోసం 1.5 సెకన్లు పట్టుకోండి',
    holdHeroMuted: 'మీ లొకేషన్‌తో పరిచయాలను హెచ్చరిస్తుంది.',
    cancelSOS: 'SOS రద్దు చేయండి',
    sendingAlertIn: 'హెచ్చరిక పంపుతోంది',
    savedCount: 'సేవ్ చేయబడింది',
    stepsDone: 'పూర్తయిన దశలు',
    markDone: 'పూర్తయినట్లు గుర్తు పెట్టండి',
    viewPlan: 'ప్లాన్ చూడండి',
    checkJobOffer: 'ఉద్యోగ ఆఫర్ తనిఖీ',
    cyberBlackmail: 'సైబర్ భద్రత',
    safeHavens: 'సురక్షిత ప్రాంతాలు',
    silentModeTitle: 'సైలెంట్ మోడ్',
    silentModeSubtitle: 'సైరన్ లేదా స్క్రీన్ వెలుగు ఉండదు',
    voiceSafeWordTitle: 'రహస్య వాయిస్ పదం',
    setUpVoice: 'సెట్ చేయండి',
    emergencyNumbers: 'అత్యవసర నంబర్లు',
    aboutAegis: 'అభయ గురించి',
    seeMyResults: 'ఫలితాలను చూడండి',
    whatWeNoticed: 'మేము గమనించినవి',
    whatYouCanDo: 'మీరు ఏమి చేయవచ్చు',
    saveToIncidentLog: 'సంఘటన లాగ్‌లో సేవ్ చేయండి',
    getHelpNow: 'వెంటనే సహాయం పొందండి',
    evidenceVaultPlain: 'స్క్రీన్‌షాట్‌లను భద్రపరచండి, వాటిని తర్వాత మార్చలేరు.',
    mapTab: 'మ్యాప్',
    timelineTab: 'టైమ్‌లైన్',
    logIncidentBtn: 'సంఘటన నమోదు చేయండి',
    filesProtected: 'ఫైళ్లు రక్షించబడ్డాయి',
    openVault: 'తెరవండి',
    legend: 'సూచిక',
    hideDetails: 'వివరాలు దాచు',
    showDetails: 'వివరాలు చూపించు',
    dataStaysEncrypted: 'మొత్తం సమాచారం ఈ పరికరంలోనే భద్రంగా ఉంటుంది.',
    downloadAppMobile: 'అభయ యాప్ డౌన్‌లోడ్ చేయండి',
    appearanceTitle: 'రూపం',
    lightMode: 'లైట్',
    darkMode: 'డార్క్',
    systemMode: 'సిస్టమ్',
    privacyAndData: 'డేటా & గోప్యత',
    exportBackup: 'బ్యాకప్ ఎగుమతి చేయండి',
    securityLog: 'సెక్యూరిటీ లాగ్',
    eraseAllData: 'డేటా రీసెట్ చేయండి',
    demoModeTitle: 'డెమో మోడ్',
    showDemoTools: 'డెమో టూల్స్ చూపించు',
    tryAsking: 'ఇలా అడగండి',
    aiDisclaimer: 'అభయ భద్రతా మార్గదర్శకత్వాన్ని అందిస్తుంది. ప్రమాదంలో ఉన్నప్పుడు 112 కు కాల్ చేయండి.',
    askAegis: 'అభయ ని అడగండి',
    clearChat: 'చాట్ క్లియర్ చేయండి',
    aiDisclaimerText: 'అభయ భద్రతా మార్గదర్శకత్వాన్ని అందిస్తుంది. ప్రమాదంలో ఉన్నప్పుడు 112 కు కాల్ చేయండి.',
    evidenceVaultTitle: 'మీ వ్యక్తిగత రికార్డు',
    evidenceVaultCount: 'ఫైళ్లు, మార్పుల నుండి రక్షించబడ్డాయి',
    logIncident: 'సంఘటన నమోదు చేయండి',
    themeTitle: 'రూపం',
    trustedContacts: 'నమ్మకమైన పరిచయాలు',
    selectedCount: 'ఎంపిక చేయబడింది',
    emptyIncidents: 'ఇక్కడ ఇంకా ఏమీ లేదు. ఏదైనా జరిగితే రాసుకోండి. మీరు మాత్రమే చూడగలరు.',
    emptyTrustedContacts: 'మీరు విశ్వసించే వ్యక్తిని జోడించండి. సహాయం అవసరమైతే తెలియజేస్తాము.'
  },
  ta: {
    appName: 'அபயா',
    tagline: 'நீங்கள் தனியாக இல்லை.',
    quickExit: 'விரைவு மறைப்பு',
    emergencySOS: 'SOS',
    silentSOS: 'அமைதியான SOS',
    checkMyRisk: 'ஏதோ சரியில்லை என்று தோன்றுகிறதா?',
    imInDanger: 'நான் ஆபத்தில் உள்ளேன்',
    recordIncident: 'சம்பவ பதிவு',
    safetyCheckin: 'பாதுகாப்பு சோதனை',
    mySafetyPlan: 'பாதுகாப்பு திட்டம்',
    trustedCircle: 'நம்பகமான தொடர்புகள்',
    recentIncidents: 'சமீபத்தியவை',
    safetyResources: 'உதவி பெறுக',
    learnPrevent: 'தடுப்பு',
    currentStatus: 'நீங்கள் பாதுகாப்பாக உள்ளீர்கள்.',
    statusSafe: 'செயலில்',
    statusMonitoring: 'சோதனை செயலில் உள்ளது',
    statusDanger: 'அவசர நிலை தூண்டப்பட்டது',
    holdToActivate: 'SOSக்கு 1.5 வினாடிகள் அழுத்தவும்',
    navHome: 'முகப்பு',
    navSafety: 'பாதுகாப்பு',
    navSOS: 'SOS',
    navIncidents: 'சம்பவங்கள்',
    navResources: 'உதவி',
    navAI: 'அபயாவிடம் கேளுங்கள்',
    navProfile: 'சுயவிவரம்',
    evidenceVault: 'உங்கள் தனிப்பட்ட பதிவு',
    recruitmentChecker: 'வேலை வாய்ப்பு சரிபார்ப்பு',
    cyberSafety: 'சைபர் பாதுகாப்பு',
    aiAssistant: 'அபயாவிடம் கேளுங்கள்',
    riskDisclaimer: 'பாதுகாப்பு வழிகாட்டல். சட்ட அல்லது காவல் துறை ஆலோசனை அல்ல.',
    emergencyDisclaimer: 'நம்பகமான நபர்களை எச்சரித்து 112 உடன் இணைக்கிறது.',
    call112: '112 காவல்துறை',
    call181: '181 மகளிர் உதவி',
    languageSelect: 'மொழி',

    pageTitleHome: 'முகப்பு',
    pageTitleCheckMyRisk: 'ஏதோ சரியில்லை என்று தோன்றுகிறதா?',
    pageSubtitleCheckMyRisk: 'என்ன நடக்கிறது என்று சொல்லுங்கள். எதுவும் இந்த தொலைபேசியை விட்டு வெளியேறாது.',
    pageTitleEmergency: 'அவசரம்',
    pageSubtitleEmergency: 'ரகசிய அவசர உதவி மற்றும் நேரடி தொடர்பு.',
    pageTitleIncidents: 'சம்பவங்கள்',
    pageSubtitleIncidents: 'சம்பவங்களை ஆவணப்படுத்தி ஆதாரங்களை பாதுகாக்கவும்.',
    pageTitleGetHelp: 'உதவி பெறுக',
    pageSubtitleGetHelp: '24×7 அங்கீகரிக்கப்பட்ட உதவி எண்கள் மற்றும் சட்ட உதவி.',
    pageTitleProfile: 'சுயவிவரம் மற்றும் அமைப்புகள்',
    pageSubtitleProfile: 'பாதுகாப்பு அமைப்புகள் மற்றும் தொடர்புகளை நிர்வகிக்கவும்.',
    pageTitleAskAegis: 'அபயாவிடம் கேளுங்கள்',
    pageSubtitleAskAegis: 'தனிப்பட்ட வழிகாட்டல். எதுவும் இந்த தொலைபேசியை விட்டு வெளியேறாது.',

    protectionIsOn: 'நீங்கள் பாதுகாப்பாக உள்ளீர்கள்.',
    locationChip: 'இருப்பிடம்',
    voiceTriggerChip: 'ரகசிய குரல் சொல்',
    contactsChip: 'தொடர்புகள்',
    statusOn: 'ஆன்',
    statusOff: 'ஆஃப்',
    statusListening: 'கேட்கிறது',
    holdHeroCaption: 'SOSக்கு 1.5 வினாடிகள் அழுத்தவும்',
    holdHeroMuted: 'நம்பகமான நபர்களுக்கு உங்கள் இருப்பிடத்துடன் எச்சரிக்கை விடுக்கிறது.',
    cancelSOS: 'SOS ரத்து செய்',
    sendingAlertIn: 'எச்சரிக்கை அனுப்பப்படுகிறது',
    savedCount: 'சேமிக்கப்பட்டது',
    stepsDone: 'படிகள் முடிந்தது',
    markDone: 'முடிந்ததாக குறிக்கவும்',
    viewPlan: 'திட்டத்தை காண்க',
    checkJobOffer: 'வேலை வாய்ப்பை சரிபார்க்கவும்',
    cyberBlackmail: 'சைபர் பாதுகாப்பு',
    safeHavens: 'பாதுகாப்பான இடங்கள்',
    silentModeTitle: 'அமைதியான நிலை',
    silentModeSubtitle: 'சைரன், ஒலி அல்லது ஒளி இருக்காது',
    voiceSafeWordTitle: 'ரகசிய குரல் சொல்',
    setUpVoice: 'அமைக்கவும்',
    emergencyNumbers: 'அவசர எண்கள்',
    aboutAegis: 'அபயா பற்றி',
    seeMyResults: 'முடிவுகளை காண்க',
    whatWeNoticed: 'நாங்கள் கவனித்தவை',
    whatYouCanDo: 'நீங்கள் செய்யக்கூடியவை',
    saveToIncidentLog: 'சம்பவ பதிவேட்டில் சேமிக்கவும்',
    getHelpNow: 'உடனடி உதவி பெறுக',
    evidenceVaultPlain: 'திரைக்காட்சிகளை சேமிக்கவும், அவற்றை மாற்ற முடியாது.',
    mapTab: 'வரைபடம்',
    timelineTab: 'காலவரிசை',
    logIncidentBtn: 'சம்பவத்தை பதிவு செய்',
    filesProtected: 'கோப்புகள் பாதுகாக்கப்பட்டுள்ளன',
    openVault: 'திறக்கவும்',
    legend: 'குறியீடு',
    hideDetails: 'விவரங்களை மறை',
    showDetails: 'விவரங்களை காட்டு',
    dataStaysEncrypted: 'உங்கள் தகவல் இந்த சாதனத்திலேயே பாதுகாப்பாக உள்ளது.',
    downloadAppMobile: 'அபயா பதிவிறக்குக',
    appearanceTitle: 'தோற்றம்',
    lightMode: 'ஒளி',
    darkMode: 'இருள்',
    systemMode: 'கணினி',
    privacyAndData: 'தனியுரிமை & தரவு',
    exportBackup: 'காப்பகத்தை ஏற்றுமதி செய்',
    securityLog: 'பாதுகாப்பு பதிவு',
    eraseAllData: 'அனைத்து தரவையும் மீட்டமைக்கவும்',
    demoModeTitle: 'டெமோ நிலை',
    showDemoTools: 'டெமோ கருவிகளை காட்டு',
    tryAsking: 'கேட்டுப்பாருங்கள்',
    aiDisclaimer: 'அபயா பாதுகாப்பு வழிகாட்டலை வழங்குகிறது. ஆபத்தில் 112க்கு அழைக்கவும்.',
    askAegis: 'அபயாவிடம் கேளுங்கள்',
    clearChat: 'உரையாடலை அழிக்கவும்',
    aiDisclaimerText: 'அபயா பாதுகாப்பு வழிகாட்டலை வழங்குகிறது. ஆபத்தில் 112க்கு அழைக்கவும்.',
    evidenceVaultTitle: 'உங்கள் தனிப்பட்ட பதிவு',
    evidenceVaultCount: 'கோப்புகள், திருத்தங்களில் இருந்து பாதுகாக்கப்பட்டுள்ளன',
    logIncident: 'சம்பவத்தை பதிவு செய்',
    themeTitle: 'தோற்றம்',
    trustedContacts: 'நம்பகமான தொடர்புகள்',
    selectedCount: 'தேர்ந்தெடுக்கப்பட்டது',
    emptyIncidents: 'இங்கு இன்னும் எதுவும் இல்லை. ஏதேனும் நடந்தால் குறித்து வையுங்கள். நீங்கள் மட்டுமே பார்க்க முடியும்.',
    emptyTrustedContacts: 'நீங்கள் நம்பும் ஒருவரைச் சேர்க்கவும். உதவி தேவைப்பட்டால் அவர்களுக்குத் தெரிவிப்போம்.'
  }
};
