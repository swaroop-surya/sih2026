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
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'Aegis',
    tagline: 'Prevention, Early Risk Detection & Discreet Emergency Response',
    quickExit: 'Quick Exit',
    emergencySOS: 'EMERGENCY SOS',
    silentSOS: 'Silent SOS',
    checkMyRisk: 'CHECK MY RISK',
    imInDanger: "I'M IN DANGER",
    recordIncident: 'REPORT / RECORD INCIDENT',
    safetyCheckin: 'SAFETY CHECK-IN',
    mySafetyPlan: 'My Safety Plan',
    trustedCircle: 'Trusted Circle',
    recentIncidents: 'Recent Incidents',
    safetyResources: 'Verified Safety Resources',
    learnPrevent: 'Learn & Prevent',
    currentStatus: 'Safety Shield',
    statusSafe: 'Active & Protected',
    statusMonitoring: 'Active Check-In In Progress',
    statusDanger: 'EMERGENCY TRIGGERED',
    holdToActivate: 'Hold for 1.5s to trigger SOS',
    navHome: 'Home',
    navSafety: 'Safety',
    navSOS: 'SOS',
    navIncidents: 'Incidents',
    navResources: 'Resources',
    navAI: 'AI',
    navProfile: 'Profile',
    evidenceVault: 'Evidence Vault',
    recruitmentChecker: 'Recruitment Risk Checker',
    cyberSafety: 'Cyber Safety',
    aiAssistant: 'AI Safety Advisor',
    riskDisclaimer: 'Risk indicators are informational safety observations, not legal or medical diagnoses. Does not replace emergency services.',
    emergencyDisclaimer: 'Aegis coordinates with your trusted contacts and connects to 112 emergency services.',
    call112: 'Call 112 Police Emergency',
    call181: 'Call 181 Women Helpline',
    languageSelect: 'Select Language'
  },
  hi: {
    appName: 'एजिस (Aegis)',
    tagline: 'सुरक्षा, प्रारंभिक जोखिम पहचान और गुप्त आपातकालीन प्रतिक्रिया',
    quickExit: 'त्वरित निकास',
    emergencySOS: 'आपातकालीन एसओएस',
    silentSOS: 'मौन (साइलेंट) एसओएस',
    checkMyRisk: 'अपना जोखिम जांचें',
    imInDanger: 'मैं खतरे में हूँ',
    recordIncident: 'घटना दर्ज / रिपोर्ट करें',
    safetyCheckin: 'सुरक्षा चेक-इन',
    mySafetyPlan: 'मेरी सुरक्षा योजना',
    trustedCircle: 'विश्वसनीय संपर्क चक्र',
    recentIncidents: 'हाल की घटनाएं',
    safetyResources: 'सत्यापित सहायता संसाधन',
    learnPrevent: 'सीखें और रोकथाम करें',
    currentStatus: 'सुरक्षा कवच',
    statusSafe: 'सक्रिय और सुरक्षित',
    statusMonitoring: 'सक्रिय चेक-इन जारी है',
    statusDanger: 'आपातकाल सक्रिय',
    holdToActivate: 'एसओएस शुरू करने के लिए 1.5 सेकंड दबाकर रखें',
    navHome: 'होम',
    navSafety: 'सुरक्षा',
    navSOS: 'SOS',
    navIncidents: 'घटनाएं',
    navResources: 'संसाधन',
    navAI: 'AI',
    navProfile: 'प्रोफ़ाइल',
    evidenceVault: 'सुरक्षित साक्ष्य वॉल्ट',
    recruitmentChecker: 'नौकरी / भर्ती जोखिम जांच',
    cyberSafety: 'साइबर सुरक्षा',
    aiAssistant: 'एआई सुरक्षा सहायक',
    riskDisclaimer: 'जोखिम स्कोर केवल सुरक्षा संकेत हैं, कोई कानूनी या चिकित्सीय निदान नहीं। आपातकाल में 112 पर कॉल करें।',
    emergencyDisclaimer: 'एजिस आपके विश्वसनीय संपर्कों को सतर्क करता है और 112 आपातकालीन सेवाओं से जोड़ता है।',
    call112: '112 पुलिस आपातकाल',
    call181: '181 महिला हेल्पलाइन',
    languageSelect: 'भाषा चुनें'
  },
  te: {
    appName: 'ఏజిస్ (Aegis)',
    tagline: 'నివారణ, ముందస్తు ప్రమాద గుర్తింపు మరియు గోప్యతా అత్యవసర స్పందన',
    quickExit: 'త్వరిత నిష్క్రమణ',
    emergencySOS: 'అత్యవసర SOS',
    silentSOS: 'సైలెంట్ SOS',
    checkMyRisk: 'ప్రమాద తీవ్రతను తనిఖీ చేయండి',
    imInDanger: 'నేను ప్రమాదంలో ఉన్నాను',
    recordIncident: 'సంఘటన నమోదు చేయండి',
    safetyCheckin: 'సేఫ్టీ చెక్-ఇన్',
    mySafetyPlan: 'నా భద్రతా ప్రణాళిక',
    trustedCircle: 'నమ్మకమైన వ్యక్తుల సర్కిల్',
    recentIncidents: 'ఇటీవలి సంఘటనలు',
    safetyResources: 'ధృవీకరించబడిన వనరులు',
    learnPrevent: 'తెలుసుకోండి & అప్రమత్తంగా ఉండండి',
    currentStatus: 'భద్రతా కవచం',
    statusSafe: 'సురక్షితంగా ఉన్నారు',
    statusMonitoring: 'చెక్-ఇన్ పర్యవేక్షణలో ఉంది',
    statusDanger: 'అత్యవసర పరిస్థితి సక్రియం చేయబడింది',
    holdToActivate: 'SOS కోసం 1.5 సెకన్లు నొక్కి ఉంచండి',
    navHome: 'హోమ్',
    navSafety: 'భద్రత',
    navSOS: 'SOS',
    navIncidents: 'సంఘటనలు',
    navResources: 'వనరులు',
    navAI: 'AI',
    navProfile: 'ప్రొఫైల్',
    evidenceVault: 'సాక్ష్యాల వాల్ట్',
    recruitmentChecker: 'ఉద్యోగ రిక్రూట్‌మెంట్ రిస్క్ చెకర్',
    cyberSafety: 'సైబర్ భద్రత',
    aiAssistant: 'AI రక్షణ సహాయకుడు',
    riskDisclaimer: 'రిస్క్ స్కోర్లు కేవలం సూచికలు మాత్రమే, వైద్య లేదా చట్టపరమైన నిర్ధారణలు కావు.',
    emergencyDisclaimer: 'ఏజిస్ మీ కుటుంబ సభ్యులను అప్రమత్తం చేస్తుంది మరియు 112 అత్యవసర సేవలతో కలుపుతుంది.',
    call112: '112 అత్యవసర కాల్',
    call181: '181 మహిళా హెల్ప్‌లైన్',
    languageSelect: 'భాషను ఎంచుకోండి'
  },
  ta: {
    appName: 'ஏஜிஸ் (Aegis)',
    tagline: 'தடுப்பு, முன்கூட்டியே ஆபத்தை கண்டறிதல் மற்றும் அவசர உதவி',
    quickExit: 'விரைவு வெளியேறு',
    emergencySOS: 'அவசர SOS',
    silentSOS: 'அமைதியான SOS',
    checkMyRisk: 'ஆபத்து அளவை சோதிக்கவும்',
    imInDanger: 'நான் ஆபத்தில் உள்ளேன்',
    recordIncident: 'சம்பவத்தை பதிவு செய்',
    safetyCheckin: 'பாதுகாப்பு செக்-இன்',
    mySafetyPlan: 'என் பாதுகாப்பு திட்டம்',
    trustedCircle: 'நம்பகமான நபர்கள்',
    recentIncidents: 'சமீபத்திய சம்பவங்கள்',
    safetyResources: 'சரிபார்க்கப்பட்ட உதவி எண்கள்',
    learnPrevent: 'கற்றுக்கொள்ளுங்கள்',
    currentStatus: 'பாதுகாப்பு நிலை',
    statusSafe: 'பாதுகாப்பாக உள்ளீர்கள்',
    statusMonitoring: 'செக்-இன் செயல்பாட்டில் உள்ளது',
    statusDanger: 'அவசர நிலை செயல்படுத்தப்பட்டது',
    holdToActivate: 'SOSக்கு 1.5 வினாடிகள் அழுத்திப் பிடிக்கவும்',
    navHome: 'முகப்பு',
    navSafety: 'பாதுகாப்பு',
    navSOS: 'SOS',
    navIncidents: 'சம்பவங்கள்',
    navResources: 'உதவி எண்கள்',
    navAI: 'AI',
    navProfile: 'சுயவிவரம்',
    evidenceVault: 'சான்று பெட்டகம்',
    recruitmentChecker: 'வேலை வாய்ப்பு இடர் சோதனையாளர்',
    cyberSafety: 'சைபர் பாதுகாப்பு',
    aiAssistant: 'AI பாதுகாப்பு ஆலோசகர்',
    riskDisclaimer: 'ஆபத்து அளவீடுகள் வழிகாட்டுதலுக்காக மட்டுமே, சட்டபூர்வ தீர்ப்புகள் அல்ல.',
    emergencyDisclaimer: 'ஏஜிஸ் உங்களை 112 மற்றும் 181 அரசு அவசர சேவைகளுடன் இணைக்க உதவுகிறது.',
    call112: '112 காவல்துறை அவசரம்',
    call181: '181 மகளிர் உதவி எண்',
    languageSelect: 'மொழியைத் தேர்ந்தெடுக்கவும்'
  }
};
