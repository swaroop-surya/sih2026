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

  // Check-in timer keys
  checkinTimerSection: string;
  checkinTimerSectionSubtitle: string;
  checkinDurationTitle: string;
  checkinWhatForTitle: string;
  checkinNotePlaceholder: string;
  checkinWhoAlertedTitle: string;
  checkinShareLocationSwitch: string;
  checkinTellContactsSafeSwitch: string;
  checkinStartButton: string;
  checkinHonestLine: string;
  checkinRunningStatus: string;
  checkinImSafeButton: string;
  checkinAdd10MinButton: string;
  checkinEndWithoutAlertingButton: string;
  checkinConfirmEndTitle: string;
  checkinConfirmEndSubtitle: string;
  checkinConfirmEndYes: string;
  checkinConfirmEndNo: string;
  checkinDueSoonBannerTitle: string;
  checkinAreYouSafeTitle: string;
  checkinGraceCountdownNotice: string;
  checkinAlertSentTitle: string;
  checkinAlertSentSubtitle: string;
  checkinCancelAlertButton: string;
  checkinPurposeCommute: string;
  checkinPurposeCab: string;
  checkinPurposeWalking: string;
  checkinPurposeMeeting: string;
  checkinPurposeOther: string;
  checkinDurationCustom: string;
  checkinCustomMinutesLabel: string;
  checkinLiveLocationSharing: string;

  // Auth, Welcome, Code, Onboarding & Profile
  welcomeTagline: string;
  welcomeTabPhone: string;
  welcomeTabEmail: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHint: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailHint: string;
  btnSendCode: string;
  btnSending: string;
  needHelpNow: string;
  call112Short: string;
  call181Short: string;
  call1930Short: string;
  evaluatorDemoLink: string;
  evaluatorDemoPhone: string;
  evaluatorDemoOtp: string;
  btnFillDemo: string;
  codeScreenTitle: string;
  codeSentTo: string;
  resendIn: string;
  btnResend: string;
  btnChangeTarget: string;
  tooManyAttemptsCooldown: string;
  wrongCodeError: string;
  expiredCodeError: string;
  onboardingAliasTitle: string;
  onboardingAliasSubtitle: string;
  onboardingAliasCustomPlaceholder: string;
  onboardingFirstNameTitle: string;
  onboardingFirstNameSubtitle: string;
  onboardingLanguageTitle: string;
  onboardingLocationTitle: string;
  onboardingLocationSubtitle: string;
  btnAllowLocation: string;
  btnNotNow: string;
  privacyAndRulesCheckbox: string;
  btnContinue: string;
  btnCompleteSetup: string;
  profileCommunityAlias: string;
  profileAuthAccount: string;
  btnLogout: string;
  btnLogoutConfirmTitle: string;
  btnLogoutConfirmDesc: string;
  btnDeleteCommunityData: string;
  btnDeleteCommunityDataDesc: string;
  btnConfirmDelete: string;
  btnCancel: string;

  // Nearby Community Area
  nearbyTitle: string;
  nearbyYourArea: string;
  nearbyNewAlerts24h: string;
  nearbyCommunityAlertsChip: string;
  nearbyFeedTabAll: string;
  nearbyFeedTabAlerts: string;
  nearbyFeedTabChat: string;
  nearbyPostAlertBtn: string;
  nearbyCommunityRulesBtn: string;
  nearbyReadOnlyNotice: string;
  nearbyConfirmHelpful: string;
  nearbyMarkFixed: string;
  nearbyReportContent: string;
  nearbyBlockUser: string;

  // Volunteers
  volunteersNearby: string;
  volunteersTab: string;
  becomeVolunteer: string;
  volunteersAvailableNearby: string;
  volunteersDisclaimer: string;
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
    emptyTrustedContacts: "Add someone you trust. They'll hear from us if you need help.",

    checkinTimerSection: 'Check-in timer',
    checkinTimerSectionSubtitle: 'Set automated alert countdowns for travel or meetings',
    checkinDurationTitle: 'How long will you be?',
    checkinWhatForTitle: 'What is this for?',
    checkinNotePlaceholder: 'Optional note (e.g., auto number, meeting details)',
    checkinWhoAlertedTitle: 'Who gets alerted',
    checkinShareLocationSwitch: 'Share my live location while this runs',
    checkinTellContactsSafeSwitch: "Tell my contacts when I'm safe",
    checkinStartButton: 'Start check-in',
    checkinHonestLine: 'Keep Abhaya open, or add it to your home screen, so reminders arrive on time.',
    checkinRunningStatus: 'Running',
    checkinImSafeButton: "I'm safe",
    checkinAdd10MinButton: 'Add 10 min',
    checkinEndWithoutAlertingButton: 'End without alerting',
    checkinConfirmEndTitle: 'End check-in without alerting?',
    checkinConfirmEndSubtitle: 'Your timer will stop immediately. No notifications will be sent to your contacts.',
    checkinConfirmEndYes: 'Yes, end timer',
    checkinConfirmEndNo: 'Keep running',
    checkinDueSoonBannerTitle: 'Check-in due soon. Are you okay?',
    checkinAreYouSafeTitle: 'Are you safe?',
    checkinGraceCountdownNotice: 'Alerting trusted contacts with your live location in',
    checkinAlertSentTitle: 'Overdue alert sent',
    checkinAlertSentSubtitle: 'Your trusted contacts have been sent your last known location and check-in details.',
    checkinCancelAlertButton: "I'm safe, cancel alert",
    checkinPurposeCommute: 'Commute',
    checkinPurposeCab: 'Cab or auto ride',
    checkinPurposeWalking: 'Walking home',
    checkinPurposeMeeting: 'Meeting',
    checkinPurposeOther: 'Other',
    checkinDurationCustom: 'Custom',
    checkinCustomMinutesLabel: 'Minutes (1 to 480)',
    checkinLiveLocationSharing: 'Live location sharing active',

    // Auth & Welcome
    welcomeTagline: "You're not alone.",
    welcomeTabPhone: 'Phone',
    welcomeTabEmail: 'Email',
    phoneLabel: 'Phone number',
    phonePlaceholder: '10-digit mobile number',
    phoneHint: "We'll send a 6-digit SMS code. No password needed.",
    emailLabel: 'Email address',
    emailPlaceholder: 'name@example.com',
    emailHint: "We'll email a 6-digit code. Works with any provider.",
    btnSendCode: 'Send code',
    btnSending: 'Sending code...',
    needHelpNow: 'Need help now?',
    call112Short: '112 Police',
    call181Short: '181 Women',
    call1930Short: '1930 Cyber',
    evaluatorDemoLink: 'Evaluator? Use the demo login',
    evaluatorDemoPhone: 'Demo phone',
    evaluatorDemoOtp: 'Demo code',
    btnFillDemo: 'Fill it in for me',
    codeScreenTitle: 'Enter verification code',
    codeSentTo: 'We sent a 6-digit code to',
    resendIn: 'Resend in',
    btnResend: 'Resend code',
    btnChangeTarget: 'Change number or email',
    tooManyAttemptsCooldown: 'Too many incorrect attempts. Please wait before trying again.',
    wrongCodeError: 'Incorrect code. Please check and try again.',
    expiredCodeError: 'This code has expired. Please tap Resend to get a new code.',
    onboardingAliasTitle: 'Pick a name others will see',
    onboardingAliasSubtitle: 'Your real name and phone are never shown to others in community discussions.',
    onboardingAliasCustomPlaceholder: 'Or write a custom alias (3-20 characters)',
    onboardingFirstNameTitle: 'First name (private)',
    onboardingFirstNameSubtitle: 'Only used to greet you privately on your phone.',
    onboardingLanguageTitle: 'Choose your language',
    onboardingLocationTitle: 'Area safety alerts',
    onboardingLocationSubtitle: 'We use your area to show alerts and chat near you. We never show your exact location to anyone.',
    btnAllowLocation: 'Allow location',
    btnNotNow: 'Not now',
    privacyAndRulesCheckbox: 'I accept the privacy note and community safety rules.',
    btnContinue: 'Continue',
    btnCompleteSetup: 'Finish setup',
    profileCommunityAlias: 'Community alias',
    profileAuthAccount: 'Signed in as',
    btnLogout: 'Log out',
    btnLogoutConfirmTitle: 'Log out of Abhaya?',
    btnLogoutConfirmDesc: 'You can sign back in at any time with your phone or email. Your local records remain on this phone.',
    btnDeleteCommunityData: 'Delete my community data',
    btnDeleteCommunityDataDesc: 'Removes your public profile and alias from the server. Offline records remain intact.',
    btnConfirmDelete: 'Delete data',
    btnCancel: 'Cancel',

    nearbyTitle: 'Nearby',
    nearbyYourArea: 'Your area',
    nearbyNewAlerts24h: 'new alerts in the last 24 hours',
    nearbyCommunityAlertsChip: 'Community alerts',
    nearbyFeedTabAll: 'All',
    nearbyFeedTabAlerts: 'Alerts',
    nearbyFeedTabChat: 'Local chat',
    nearbyPostAlertBtn: 'Post safety alert',
    nearbyCommunityRulesBtn: 'Community rules',
    nearbyReadOnlyNotice: 'Viewing outside your physical area. Read-only mode.',
    nearbyConfirmHelpful: 'Confirm',
    nearbyMarkFixed: 'Mark resolved',
    nearbyReportContent: 'Report',
    nearbyBlockUser: 'Block user',
    volunteersNearby: 'Volunteers nearby',
    volunteersTab: 'Volunteers',
    becomeVolunteer: 'Become a volunteer',
    volunteersAvailableNearby: 'available nearby',
    volunteersDisclaimer: "Volunteers are community members who've opted in to help. They are not police or emergency responders. For danger, use SOS or call 112."
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
    emptyTrustedContacts: 'किसी ऐसे व्यक्ति को जोड़ें जिस पर आप भरोसा करते हैं। मदद चाहिए तो हम सूचित करेंगे।',

    checkinTimerSection: 'चेक-इन टाइमर',
    checkinTimerSectionSubtitle: 'यात्रा या बैठकों के लिए स्वचालित अलर्ट उलटी गिनती सेट करें',
    checkinDurationTitle: 'आपको कितना समय लगेगा?',
    checkinWhatForTitle: 'यह किस लिए है?',
    checkinNotePlaceholder: 'वैकल्पिक नोट (उदा. ऑटो नंबर, बैठक का विवरण)',
    checkinWhoAlertedTitle: 'किन्हें सतर्क किया जाए',
    checkinShareLocationSwitch: 'चलते समय मेरा लाइव स्थान साझा करें',
    checkinTellContactsSafeSwitch: 'सुरक्षित होने पर संपर्कों को बताएं',
    checkinStartButton: 'चेक-इन शुरू करें',
    checkinHonestLine: 'अभया खुला रखें, या इसे अपनी होम स्क्रीन पर जोड़ें, ताकि अनुस्मारक समय पर मिलें।',
    checkinRunningStatus: 'चल रहा है',
    checkinImSafeButton: 'मैं सुरक्षित हूँ',
    checkinAdd10MinButton: '+10 मिनट जोड़ें',
    checkinEndWithoutAlertingButton: 'बिना अलर्ट भेजे समाप्त करें',
    checkinConfirmEndTitle: 'बिना अलर्ट भेजे चेक-इन समाप्त करें?',
    checkinConfirmEndSubtitle: 'टाइमर तुरंत रुक जाएगा। आपके संपर्कों को कोई सूचना नहीं भेजी जाएगी।',
    checkinConfirmEndYes: 'हाँ, टाइमर समाप्त करें',
    checkinConfirmEndNo: 'चालू रखें',
    checkinDueSoonBannerTitle: 'चेक-इन समय समाप्त होने वाला है। क्या आप ठीक हैं?',
    checkinAreYouSafeTitle: 'क्या आप सुरक्षित हैं?',
    checkinGraceCountdownNotice: 'जवाब न देने पर आपके लाइव स्थान के साथ संपर्कों को अलर्ट भेजा जाएगा:',
    checkinAlertSentTitle: 'ओवरड्यू अलर्ट भेजा गया',
    checkinAlertSentSubtitle: 'आपके संपर्कों को आपका अंतिम ज्ञात स्थान और विवरण भेज दिया गया है।',
    checkinCancelAlertButton: 'मैं सुरक्षित हूँ, अलर्ट रद्द करें',
    checkinPurposeCommute: 'आवागमन',
    checkinPurposeCab: 'कैब या ऑटो यात्रा',
    checkinPurposeWalking: 'पैदल घर जाना',
    checkinPurposeMeeting: 'बैठक',
    checkinPurposeOther: 'अन्य',
    checkinDurationCustom: 'कस्टम',
    checkinCustomMinutesLabel: 'मिनट (1 से 480)',
    checkinLiveLocationSharing: 'लाइव स्थान साझाकरण सक्रिय है',

    // Auth & Welcome
    welcomeTagline: 'आप अकेले नहीं हैं।',
    welcomeTabPhone: 'फ़ोन',
    welcomeTabEmail: 'ईमेल',
    phoneLabel: 'फ़ोन नंबर',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर',
    phoneHint: 'हम 6 अंकों का SMS कोड भेजेंगे। पासवर्ड की आवश्यकता नहीं।',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'name@example.com',
    emailHint: 'हम 6 अंकों का कोड ईमेल करेंगे। किसी भी प्रदाता के साथ काम करता है।',
    btnSendCode: 'कोड भेजें',
    btnSending: 'कोड भेजा जा रहा है...',
    needHelpNow: 'तुरंत मदद चाहिए?',
    call112Short: '112 पुलिस',
    call181Short: '181 महिला',
    call1930Short: '1930 साइबर',
    evaluatorDemoLink: 'परीक्षक? डेमो लॉगिन का उपयोग करें',
    evaluatorDemoPhone: 'डेमो फ़ोन',
    evaluatorDemoOtp: 'डेमो कोड',
    btnFillDemo: 'मेरे लिए भरें',
    codeScreenTitle: 'सत्यापन कोड दर्ज करें',
    codeSentTo: 'हमने 6 अंकों का कोड यहाँ भेजा:',
    resendIn: 'पुनः भेजने का समय',
    btnResend: 'कोड पुनः भेजें',
    btnChangeTarget: 'नंबर या ईमेल बदलें',
    tooManyAttemptsCooldown: 'बहुत अधिक गलत प्रयास। कृपया कुछ समय बाद प्रयास करें।',
    wrongCodeError: 'गलत कोड। कृपया जाँच कर पुनः प्रयास करें।',
    expiredCodeError: 'यह कोड समाप्त हो गया है। कृपया पुनः भेजें दबाएं।',
    onboardingAliasTitle: 'एक उपनाम चुनें जो अन्य देखेंगे',
    onboardingAliasSubtitle: 'सामुदायिक चर्चा में आपका वास्तविक नाम और नंबर कभी नहीं दिखाया जाता।',
    onboardingAliasCustomPlaceholder: 'या कोई उपनाम लिखें (3-20 वर्ण)',
    onboardingFirstNameTitle: 'पहला नाम (निजी)',
    onboardingFirstNameSubtitle: 'केवल इस फ़ोन पर आपका स्वागत करने के लिए उपयोग किया जाएगा।',
    onboardingLanguageTitle: 'अपनी भाषा चुनें',
    onboardingLocationTitle: 'क्षेत्रीय सुरक्षा अलर्ट',
    onboardingLocationSubtitle: 'हम आपके आसपास के अलर्ट दिखाने के लिए क्षेत्र का उपयोग करते हैं। सटीक स्थान कभी साझा नहीं किया जाता।',
    btnAllowLocation: 'स्थान की अनुमति दें',
    btnNotNow: 'अभी नहीं',
    privacyAndRulesCheckbox: 'मैं गोपनीयता नीति और सामुदायिक सुरक्षा नियमों को स्वीकार करती हूँ।',
    btnContinue: 'जारी रखें',
    btnCompleteSetup: 'सेटअप पूरा करें',
    profileCommunityAlias: 'सामुदायिक उपनाम',
    profileAuthAccount: 'लॉगिन खाता',
    btnLogout: 'लॉग आउट',
    btnLogoutConfirmTitle: 'अभया से लॉग आउट करें?',
    btnLogoutConfirmDesc: 'आप कभी भी अपने फ़ोन या ईमेल से पुनः साइन इन कर सकते हैं। स्थानीय डेटा फ़ोन में रहेगा।',
    btnDeleteCommunityData: 'मेरा समुदाय डेटा हटाएं',
    btnDeleteCommunityDataDesc: 'सर्वर से आपका समुदाय प्रोफ़ाइल और उपनाम हटा दिया जाएगा। ऑफ़लाइन डेटा सुरक्षित रहेगा।',
    btnConfirmDelete: 'डेटा हटाएं',
    btnCancel: 'रद्द करें',

    nearbyTitle: 'आस-पास',
    nearbyYourArea: 'आपका इलाका',
    nearbyNewAlerts24h: 'पिछले 24 घंटों में नए अलर्ट',
    nearbyCommunityAlertsChip: 'सामुदायिक अलर्ट',
    nearbyFeedTabAll: 'सभी',
    nearbyFeedTabAlerts: 'अलर्ट',
    nearbyFeedTabChat: 'स्थानीय चैट',
    nearbyPostAlertBtn: 'सुरक्षा अलर्ट पोस्ट करें',
    nearbyCommunityRulesBtn: 'समुदाय नियम',
    nearbyReadOnlyNotice: 'आप अपने क्षेत्र से बाहर देख रहे हैं। केवल पढ़ने योग्य।',
    nearbyConfirmHelpful: 'पुष्टि करें',
    nearbyMarkFixed: 'हल हो गया',
    nearbyReportContent: 'रिपोर्ट करें',
    nearbyBlockUser: 'ब्लॉक करें',
    volunteersNearby: 'आस-पास के स्वयंसेवक',
    volunteersTab: 'स्वयंसेवक',
    becomeVolunteer: 'स्वयंसेवक बनें',
    volunteersAvailableNearby: 'आस-पास उपलब्ध हैं',
    volunteersDisclaimer: 'स्वयंसेवक समुदाय के सदस्य हैं जिन्होंने मदद के लिए हामी भरी है। वे पुलिस या आपातकालीन कर्मी नहीं हैं। खतरे के लिए SOS या 112 डायल करें।'
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
    emptyTrustedContacts: 'మీరు విశ్వసించే వ్యక్తిని జోడించండి. సహాయం అవసరమైతే తెలియజేస్తాము.',

    checkinTimerSection: 'చెక్-ఇన్ టైమర్',
    checkinTimerSectionSubtitle: 'ప్రయాణం లేదా సమావేశాల కోసం ఆటోమేటెడ్ హెచ్చరిక కౌంట్‌డౌన్ సెట్ చేయండి',
    checkinDurationTitle: 'మీకు ఎంత సమయం పడుతుంది?',
    checkinWhatForTitle: 'ఇది దేని కోసం?',
    checkinNotePlaceholder: 'ఐచ్ఛిక గమనిక (ఉదా. ఆటో నంబర్, సమావేశ వివరాలు)',
    checkinWhoAlertedTitle: 'ఎవరికి హెచ్చరిక వెళ్లాలి',
    checkinShareLocationSwitch: 'ఇది నడుస్తున్నప్పుడు నా ప్రత్యక్ష స్థానాన్ని భాగస్వామ్యం చేయండి',
    checkinTellContactsSafeSwitch: 'నేను సురక్షితంగా ఉన్నప్పుడు నా పరిచయాలకు తెలియజేయండి',
    checkinStartButton: 'చెక్-ఇన్ ప్రారంభించండి',
    checkinHonestLine: 'జ్ఞాపికలు సమయానికి చేరడానికి అభయను తెరిచి ఉంచండి లేదా మీ హోమ్ స్క్రీన్‌కు జోడించండి.',
    checkinRunningStatus: 'నడుస్తోంది',
    checkinImSafeButton: 'నేను సురక్షితం',
    checkinAdd10MinButton: '+10 నిమిషాలు జోడించండి',
    checkinEndWithoutAlertingButton: 'హెచ్చరిక లేకుండా ముగించండి',
    checkinConfirmEndTitle: 'హెచ్చరిక లేకుండా చెక్-ఇన్ ముగించాలా?',
    checkinConfirmEndSubtitle: 'టైమర్ వెంటనే ఆగిపోతుంది. మీ పరిచయాలకు ఎటువంటి నోటిఫికేషన్ వెళ్లదు.',
    checkinConfirmEndYes: 'అవును, ముగించండి',
    checkinConfirmEndNo: 'కొనసాగించండి',
    checkinDueSoonBannerTitle: 'చెక్-ఇన్ సమయం దగ్గరపడింది. మీరు క్షేమంగా ఉన్నారా?',
    checkinAreYouSafeTitle: 'మీరు సురక్షితంగా ఉన్నారా?',
    checkinGraceCountdownNotice: 'స్పందించకపోతే ప్రత్యక్ష స్థానంతో హెచ్చరిక పంపబడుతుంది:',
    checkinAlertSentTitle: 'గడువు ముగిసిన హెచ్చరిక పంపబడింది',
    checkinAlertSentSubtitle: 'మీ చివరి స్థానం మరియు వివరాలు మీ నమ్మకమైన పరిచయాలకు పంపబడ్డాయి.',
    checkinCancelAlertButton: 'నేను సురక్షితం, హెచ్చరిక రద్దు చేయి',
    checkinPurposeCommute: 'ప్రయాణం',
    checkinPurposeCab: 'క్యాబ్ లేదా ఆటో ప్రయాణం',
    checkinPurposeWalking: 'నడుచుకుంటూ ఇంటికి వెళ్లడం',
    checkinPurposeMeeting: 'సమావేశం',
    checkinPurposeOther: 'ఇతర',
    checkinDurationCustom: 'అనుకూల',
    checkinCustomMinutesLabel: 'నిమిషాలు (1 నుండి 480)',
    checkinLiveLocationSharing: 'ప్రత్యక్ష స్థాన భాగస్వామ్యం ప్రారంభంలో ఉంది',

    // Auth & Welcome
    welcomeTagline: 'మీరు ఒంటరిగా లేరు.',
    welcomeTabPhone: 'ఫోన్',
    welcomeTabEmail: 'ఈమెయిల్',
    phoneLabel: 'ఫోన్ నంబర్',
    phonePlaceholder: '10 అంకెల మొబైల్ నంబర్',
    phoneHint: 'మేము 6 అంకెల SMS కోడ్‌ని పంపుతాము. పాస్‌వర్డ్ అవసరం లేదు.',
    emailLabel: 'ఈమెయిల్ చిరునామా',
    emailPlaceholder: 'name@example.com',
    emailHint: 'మేము 6 అంకెల కోడ్‌ని ఈమెయిల్ చేస్తాము. ఏ ప్రొవైడర్‌తోనైనా పనిచేస్తుంది.',
    btnSendCode: 'కోడ్ పంపండి',
    btnSending: 'కోడ్ పంపబడుతోంది...',
    needHelpNow: 'ఇప్పుడే సహాయం కావాలా?',
    call112Short: '112 పోలీస్',
    call181Short: '181 మహిళ',
    call1930Short: '1930 సైబర్',
    evaluatorDemoLink: 'మూల్యాంకనం చేస్తున్నారా? డెమో లాగిన్ వాడండి',
    evaluatorDemoPhone: 'డెమో ఫోన్',
    evaluatorDemoOtp: 'డెమో కోడ్',
    btnFillDemo: 'నా కోసం పూరించండి',
    codeScreenTitle: 'ధృవీకరణ కోడ్‌ను నమోదు చేయండి',
    codeSentTo: 'మేము 6 అంకెల కోడ్‌ను ఇక్కడికి పంపాము:',
    resendIn: 'మళ్లీ పంపే సమయం',
    btnResend: 'కోడ్ మళ్లీ పంపండి',
    btnChangeTarget: 'నంబర్ లేదా ఈమెయిల్ మార్చండి',
    tooManyAttemptsCooldown: 'చాలా తప్పుడు ప్రయత్నాలు. దయచేసి కాసేపు ఆగి మళ్లీ ప్రయత్నించండి.',
    wrongCodeError: 'తప్పుడు కోడ్. దయచేసి సరిచూసి మళ్లీ ప్రయత్నించండి.',
    expiredCodeError: 'ఈ కోడ్ గడువు ముగిసింది. కొత్త కోడ్ కోసం మళ్లీ పంపండి నొక్కండి.',
    onboardingAliasTitle: 'ఇతరులు చూసే పేరును ఎంచుకోండి',
    onboardingAliasSubtitle: 'కమ్యూనిటీలో మీ అసలు పేరు మరియు ఫోన్ నంబర్ ఎవరికీ చూపబడవు.',
    onboardingAliasCustomPlaceholder: 'లేదా ప్రత్యేక మారుపేరు రాయండి (3-20 అక్షరాలు)',
    onboardingFirstNameTitle: 'మొదటి పేరు (ప్రైవేట్)',
    onboardingFirstNameSubtitle: 'మీ ఫోన్‌లో మిమ్మల్ని పలకరించడానికి మాత్రమే వాడబడుతుంది.',
    onboardingLanguageTitle: 'మీ భాషను ఎంచుకోండి',
    onboardingLocationTitle: 'ప్రాంత భద్రతా హెచ్చరికలు',
    onboardingLocationSubtitle: 'మీ ప్రాంతానికి సంబంధించిన హెచ్చరికలను చూపించడానికి ఉపయోగిస్తాము. ఖచ్చితమైన స్థానాన్ని ఎవరికీ చూపము.',
    btnAllowLocation: 'స్థానాన్ని అనుమతించండి',
    btnNotNow: 'ఇప్పుడు కాదు',
    privacyAndRulesCheckbox: 'నేను గోప్యతా గమనిక మరియు కమ్యూనిటీ నియమాలను అంగీకరిస్తున్నాను.',
    btnContinue: 'కొనసాగించండి',
    btnCompleteSetup: 'సెటప్ పూర్తి చేయండి',
    profileCommunityAlias: 'కమ్యూనిటీ మారుపేరు',
    profileAuthAccount: 'లాగిన్ అయిన ఖాతా',
    btnLogout: 'లాగ్ అవుట్',
    btnLogoutConfirmTitle: 'అభయ నుండి లాగ్ అవుట్ అవ్వాలా?',
    btnLogoutConfirmDesc: 'మీరు ఎప్పుడైనా మీ ఫోన్ లేదా ఈమెయిల్‌తో మళ్లీ సైన్ ఇన్ చేయవచ్చు. స్థానిక రికార్డులు అలాగే ఉంటాయి.',
    btnDeleteCommunityData: 'నా కమ్యూనిటీ డేటాను తొలగించండి',
    btnDeleteCommunityDataDesc: 'సర్వర్ నుండి మీ ప్రొఫైల్ మరియు మారుపేరు తొలగించబడుతుంది. మీ ఆఫ్‌లైన్ రికార్డులు అలాగే ఉంటాయి.',
    btnConfirmDelete: 'డేటా తొలగించు',
    btnCancel: 'రద్దు చేయి',

    nearbyTitle: 'సమీపంలో',
    nearbyYourArea: 'మీ ప్రాంతం',
    nearbyNewAlerts24h: 'గత 24 గంటల్లో కొత్త అలర్ట్‌లు',
    nearbyCommunityAlertsChip: 'కమ్యూనిటీ అలర్ట్‌లు',
    nearbyFeedTabAll: 'అన్నీ',
    nearbyFeedTabAlerts: 'అలర్ట్‌లు',
    nearbyFeedTabChat: 'స్థానిక చాట్',
    nearbyPostAlertBtn: 'సేఫ్టీ అలర్ట్ పోస్ట్ చేయండి',
    nearbyCommunityRulesBtn: 'కమ్యూనిటీ నియమాలు',
    nearbyReadOnlyNotice: 'మీ భౌతిక ప్రాంతం వెలుపల చూస్తున్నారు. చదవడానికి మాత్రమే.',
    nearbyConfirmHelpful: 'ధృవీకరించండి',
    nearbyMarkFixed: 'పరిష్కరించబడింది',
    nearbyReportContent: 'రిపోర్ట్ చేయండి',
    nearbyBlockUser: 'బ్లాక్ చేయండి',
    volunteersNearby: 'సమీపంలోని వాలంటీర్లు',
    volunteersTab: 'వాలంటీర్లు',
    becomeVolunteer: 'వాలంటీర్ అవ్వండి',
    volunteersAvailableNearby: 'సమీపంలో అందుబాటులో ఉన్నారు',
    volunteersDisclaimer: 'వాలంటీర్లు సహాయం చేయడానికి ముందుకు వచ్చిన సంఘ సభ్యులు. వారు పోలీసులు లేదా అత్యవసర స్పందనదారులు కారు. ప్రమాదంలో ఉంటే SOS లేదా 112 కి కాల్ చేయండి.'
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
    emptyTrustedContacts: 'நீங்கள் நம்பும் ஒருவரைச் சேர்க்கவும். உதவி தேவைப்பட்டால் அவர்களுக்குத் தெரிவிப்போம்.',

    checkinTimerSection: 'பாதுகாப்பு சோதனை டைமர்',
    checkinTimerSectionSubtitle: 'பயணம் அல்லது கூட்டங்களுக்கான தானியங்கி எச்சரிக்கை கவுண்டவுன்',
    checkinDurationTitle: 'எவ்வளவு நேரம் ஆகும்?',
    checkinWhatForTitle: 'இது எதற்காக?',
    checkinNotePlaceholder: 'விருப்பக் குறிப்பு (எ.கா. ஆட்டோ எண், கூட்ட விவரங்கள்)',
    checkinWhoAlertedTitle: 'யாருக்கு எச்சரிக்கை அனுப்ப வேண்டும்',
    checkinShareLocationSwitch: 'இது இயங்கும் போது எனது நேரலை இருப்பிடத்தைப் பகிரவும்',
    checkinTellContactsSafeSwitch: 'நான் பாதுகாப்பாக இருக்கும்போது என் தொடர்புகளுக்குத் தெரிவிக்கவும்',
    checkinStartButton: 'செக்-இன் தொடங்கவும்',
    checkinHonestLine: 'நினைவூட்டல்கள் சரியான நேரத்தில் வர அபயாவை திறந்து வைக்கவும் அல்லது முகப்புத் திரையில் சேர்க்கவும்.',
    checkinRunningStatus: 'இயங்குகிறது',
    checkinImSafeButton: 'நான் பாதுகாப்பாக உள்ளேன்',
    checkinAdd10MinButton: '+10 நிமிடம் சேர்க்க',
    checkinEndWithoutAlertingButton: 'எச்சரிக்கை இன்றி முடிக்க',
    checkinConfirmEndTitle: 'எச்சரிக்கை இன்றி செக்-இன் முடிக்கவா?',
    checkinConfirmEndSubtitle: 'டைமர் உடனடியாக நிறுத்தப்படும். உங்கள் தொடர்புகளுக்கு எந்த அறிவிப்பும் அனுப்பப்படாது.',
    checkinConfirmEndYes: 'ஆம், முடிக்கவும்',
    checkinConfirmEndNo: 'தொடரவும்',
    checkinDueSoonBannerTitle: 'செக்-இன் நேரம் நெருங்குகிறது. நீங்கள் நலமா?',
    checkinAreYouSafeTitle: 'நீங்கள் பாதுகாப்பாக உள்ளீர்களா?',
    checkinGraceCountdownNotice: 'பதிலளிக்காவிட்டால் நேரலை இருப்பிடத்துடன் தொடர்புகளுக்கு எச்சரிக்கை அனுப்பப்படும்:',
    checkinAlertSentTitle: 'காலாவதியான எச்சரிக்கை அனுப்பப்பட்டது',
    checkinAlertSentSubtitle: 'உங்கள் கடைசி இருப்பிடம் மற்றும் விவரங்கள் உங்கள் தொடர்புகளுக்கு அனுப்பப்பட்டன.',
    checkinCancelAlertButton: 'நான் பாதுகாப்பு, எச்சரிக்கையை ரத்து செய்',
    checkinPurposeCommute: 'பயணம்',
    checkinPurposeCab: 'கேப் அல்லது ஆட்டோ பயணம்',
    checkinPurposeWalking: 'நடந்து வீடு திரும்புதல்',
    checkinPurposeMeeting: 'சந்திப்பு',
    checkinPurposeOther: 'மற்றவை',
    checkinDurationCustom: 'விருப்பப்படி',
    checkinCustomMinutesLabel: 'நிமிடங்கள் (1 முதல் 480)',
    checkinLiveLocationSharing: 'நேரலை இருப்பிடப் பகிர்வு செயலில் உள்ளது',

    // Auth & Welcome
    welcomeTagline: 'நீங்கள் தனியாக இல்லை.',
    welcomeTabPhone: 'தொலைபேசி',
    welcomeTabEmail: 'மின்னஞ்சல்',
    phoneLabel: 'தொலைபேசி எண்',
    phonePlaceholder: '10 இலக்க மொபைல் எண்',
    phoneHint: '6 இலக்க SMS குறியீட்டை அனுப்புவோம். கடவுச்சொல் தேவையில்லை.',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    emailPlaceholder: 'name@example.com',
    emailHint: '6 இலக்க குறியீட்டை அனுப்புவோம். அனைத்து மின்னஞ்சல்களுடனும் செயல்படும்.',
    btnSendCode: 'குறியீட்டை அனுப்புக',
    btnSending: 'அனுப்பப்படுகிறது...',
    needHelpNow: 'உடனடி உதவி தேவையா?',
    call112Short: '112 காவல்',
    call181Short: '181 பெண்கள்',
    call1930Short: '1930 சைபர்',
    evaluatorDemoLink: 'மதிப்பீட்டாளரா? டெமோ உள்நுழைவைப் பயன்படுத்துங்கள்',
    evaluatorDemoPhone: 'டெமோ போன்',
    evaluatorDemoOtp: 'டெமோ குறியீடு',
    btnFillDemo: 'எனக்காக நிரப்பவும்',
    codeScreenTitle: 'சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்',
    codeSentTo: '6 இலக்க குறியீடு அனுப்பப்பட்டது:',
    resendIn: 'மீண்டும் அனுப்ப நேரம்',
    btnResend: 'குறியீட்டை மீண்டும் அனுப்பு',
    btnChangeTarget: 'எண் அல்லது மின்னஞ்சலை மாற்று',
    tooManyAttemptsCooldown: 'பல தவறான முயற்சிகள். சிறிது நேரம் கழித்து முயற்சிக்கவும்.',
    wrongCodeError: 'தவறான குறியீடு. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    expiredCodeError: 'குறியீட்டின் காலாவதியானது. புதிய குறியீட்டைப் பெற மீண்டும் அனுப்பு என்பதைத் தட்டவும்.',
    onboardingAliasTitle: 'பிறர் பார்க்கும் புனைப்பெயரைத் தேர்ந்தெடுக்கவும்',
    onboardingAliasSubtitle: 'சமூகத்தில் உங்கள் உண்மையான பெயர் மற்றும் எண் எப்போதும் காட்டப்படாது.',
    onboardingAliasCustomPlaceholder: 'அல்லது விருப்பப் பெயரை எழுதுங்கள் (3-20 எழுத்துகள்)',
    onboardingFirstNameTitle: 'முதல் பெயர் (தனிப்பட்டது)',
    onboardingFirstNameSubtitle: 'உங்கள் தொலைபேசியில் உங்களை வரவேற்க மட்டுமே பயன்படுத்தப்படும்.',
    onboardingLanguageTitle: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    onboardingLocationTitle: 'பகுதி பாதுகாப்பு எச்சரிக்கைகள்',
    onboardingLocationSubtitle: 'உங்கள் பகுதிக்கான எச்சரிக்கைகளைக் காட்ட மட்டுமே பயன்படுகிறது. துல்லியமான இடம் யாருக்கும் காட்டப்படாது.',
    btnAllowLocation: 'இருப்பிடத்தை அனுமதிக்கவும்',
    btnNotNow: 'இப்போது வேண்டாம்',
    privacyAndRulesCheckbox: 'தனியுரிமை மற்றும் சமூக பாதுகாப்பு விதிகளை ஏற்கிறேன்.',
    btnContinue: 'தொடரவும்',
    btnCompleteSetup: 'முடிக்கவும்',
    profileCommunityAlias: 'சமூக புனைப்பெயர்',
    profileAuthAccount: 'உள்நுழைந்துள்ள கணக்கு',
    btnLogout: 'வெளியேறு',
    btnLogoutConfirmTitle: 'அபயாவிலிருந்து வெளியேறவா?',
    btnLogoutConfirmDesc: 'உங்கள் தொலைபேசி அல்லது மின்னஞ்சல் மூலம் எப்போது வேண்டுமானாலும் மீண்டும் உள்நுழையலாம்.',
    btnDeleteCommunityData: 'எனது சமூகத் தரவை நீக்கு',
    btnDeleteCommunityDataDesc: 'சேவையகத்திலிருந்து உங்கள் சுயவிவரம் மற்றும் புனைப்பெயர் நீக்கப்படும். உள்ளூர் தரவு பாதுகாப்பாக இருக்கும்.',
    btnConfirmDelete: 'தரவை நீக்கு',
    btnCancel: 'ரத்து செய்',

    nearbyTitle: 'அருகில்',
    nearbyYourArea: 'உங்கள் பகுதி',
    nearbyNewAlerts24h: 'கடந்த 24 மணிநேரத்தில் புதிய எச்சரிக்கைகள்',
    nearbyCommunityAlertsChip: 'சமூக எச்சரிக்கைகள்',
    nearbyFeedTabAll: 'அனைத்தும்',
    nearbyFeedTabAlerts: 'எச்சரிக்கைகள்',
    nearbyFeedTabChat: 'உள்ளூர் உரையாடல்',
    nearbyPostAlertBtn: 'பாதுகாப்பு எச்சரிக்கை இடுக',
    nearbyCommunityRulesBtn: 'சமூக விதிகள்',
    nearbyReadOnlyNotice: 'உங்கள் பகுதிக்கு வெளியே பார்க்கிறீர்கள். வாசிப்பு முறை மட்டும்.',
    nearbyConfirmHelpful: 'உறுதி செய்',
    nearbyMarkFixed: 'தீர்க்கப்பட்டது',
    nearbyReportContent: 'புகாரளி',
    nearbyBlockUser: 'தடை செய்',
    volunteersNearby: 'அருகிலுள்ள தன்னார்வலர்கள்',
    volunteersTab: 'தன்னார்வலர்கள்',
    becomeVolunteer: 'தன்னார்வலராக இணையுங்கள்',
    volunteersAvailableNearby: 'அருகில் உள்ளனர்',
    volunteersDisclaimer: 'தன்னார்வலர்கள் உதவ முன்வந்த சமூக உறுப்பினர்கள். அவர்கள் காவல்துறையோ அல்லது அவசரகால பணியாளர்களோ அல்ல. ஆபத்தில் இருந்தால் SOS அல்லது 112 ஐ அழைக்கவும்.'
  }
};
