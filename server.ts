import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google Gen AI helper
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Abhaya',
    hasGemini: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Helper for timeout-guarded async operations (18s timeout for stability)
function withTimeout<T>(promise: Promise<T>, ms: number = 18000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), ms))
  ]);
}

// Candidate models with preference for high availability & speed
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

async function generateWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  timeoutMs: number = 18000
): Promise<string | null> {
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: prompt,
        }),
        timeoutMs
      );
      if (response?.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[AI] Model ${model} unavailable: ${err?.message || err}`);
    }
  }
  return null;
}

// Helper for trauma-informed rule-based safety responses
function getRuleBasedSafetyReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('passport') || lower.includes('document') || lower.includes('contract') || lower.includes('leave') || lower.includes('traffick')) {
    return "Restricting personal identity documents (such as withholding your passport, Aadhaar, or education certificates) or restricting your freedom of movement is a serious violation associated with coercive control and forced labor.\n\nKey Steps:\n1. Under Indian law, no employer or agency has the legal right to confiscate your original papers.\n2. Contact the National Emergency Number at 112 or the Women Helpline at 181.\n3. For overseas recruitment verification, check emigrate.gov.in (MEA eMigrate).\n4. Seek free legal guidance through NALSA (dial 15100).";
  } else if (lower.includes('photo') || lower.includes('blackmail') || lower.includes('video') || lower.includes('leak') || lower.includes('extort') || lower.includes('cyber')) {
    return "Digital extortion or threats to distribute private photos/videos is a punishable offense under Sections 66E and 67 of the IT Act, as well as the BNS (Indian criminal code).\n\nImmediate Actions:\n1. Do NOT delete messages, screenshots, or call records—they are crucial legal evidence.\n2. Do NOT send money or comply with extortion demands; compliance rarely stops blackmail.\n3. Report immediately to the National Cyber Crime Portal at cybercrime.gov.in or call the 1930 Cyber Fraud helpline.\n4. Hash and save your evidence securely in your Abhaya Evidence Vault.";
  } else if (lower.includes('follow') || lower.includes('stalk') || lower.includes('tracking') || lower.includes('watching')) {
    return "Being followed or tracked is frightening and requires immediate situational awareness.\n\nSafety Steps:\n1. Head immediately toward a well-lit, populated public area—such as a metro station, hospital, 24/7 store, or police station.\n2. Do not go directly home or into isolated lanes.\n3. Call 112 immediately or trigger your Abhaya Emergency SOS to alert your trusted contacts.\n4. You can also start an Abhaya Safety Check-In with an automatic countdown.";
  } else if (lower.includes('fir') || lower.includes('police') || lower.includes('complaint') || lower.includes('legal') || lower.includes('rights')) {
    return "Your Legal Rights in India:\n1. Zero FIR: Any police station in India is legally obligated to register a Zero FIR for a cognizable offense against women, regardless of where the incident occurred, and transfer it to the jurisdictional station.\n2. Free Legal Aid: The National Legal Services Authority (NALSA) provides free legal assistance to women. Helpline: 15100.\n3. Statement to Magistrate: Under Section 164 CrPC / BNSS, your statement can be recorded confidentially by a female magistrate.\n4. NCW: National Commission for Women helpline 7827170170.";
  } else if (lower.includes('relationship') || lower.includes('partner') || lower.includes('husband') || lower.includes('boyfriend') || lower.includes('abuse') || lower.includes('hit') || lower.includes('threat')) {
    return "Recognizing unhealthy control or abuse is an important first step. You deserve to be safe, respected, and free from fear.\n\nGuidance:\n1. Create a confidential safety plan: know where your emergency documents and spare cash are kept.\n2. Establish a safe word with a trusted friend or neighbor.\n3. Reach out to the 181 Women Helpline (24/7, confidential) or visit a local One Stop Centre (Sakhi Centre) for shelter, legal aid, and counseling.\n4. In any active physical danger, dial 112 or use Abhaya SOS.";
  } else {
    return "I am here with you. Abhaya is designed to support you with objective, confidential safety guidance.\n\nYou can ask about:\n• Warning signs of coercion, harassment, or stalking\n• Your legal rights under Indian law (including Zero FIR)\n• Cyber safety, blackmail response, and evidence preservation\n• How to plan a safe exit or set up check-in timers\n\nIf you are in immediate danger right now, please dial 112 or activate Emergency SOS.";
  }
}

// AI Safety Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'en' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAI();
    let reply = '';
    let isFallback = false;

    if (ai) {
      const systemInstruction = `You are Abhaya AI Safety Advisor, an empathetic, trauma-informed safety advisor built for women's protection and autonomy.
CORE MANDATES:
1. Emphasize immediate physical safety first. If in imminent danger, urge using the 112 Emergency helpline or Abhaya SOS.
2. NEVER engage in victim blaming, judgment, or dismissive remarks.
3. NEVER instruct the user to aggressively confront a potentially dangerous perpetrator or abuser.
4. Distinguish clearly that risk assessments and indicators are informational flags, NOT definitive legal verdicts or medical diagnoses.
5. Important product policy: Consensual adult sex work must NOT be treated as trafficking. Specifically focus on coercion, exploitation, trafficking, violence, harassment, stalking, abuse, blackmail, forced activity, and inability to safely leave.
6. Provide structured, actionable next steps: evidence preservation (screenshots, timestamps), trusted circle alert, safe places, verified Indian resources (112, 181 Women Helpline, 1930 Cyber Crime, One Stop Centres / Sakhi Centres, NALSA 15100).
7. Respond in ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : 'English'}, or provide clear, accessible explanations.
8. Keep your response calm, grounded, objective, structured, and easy to read.`;

      let conversationContext = '';
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        const cleanHistory = conversationHistory
          .filter((m: any) => m && m.text && m.id !== 'welcome')
          .slice(-6)
          .map((m: any) => `${m.sender === 'user' ? 'User' : 'Abhaya Advisor'}: ${m.text}`)
          .join('\n');
        if (cleanHistory) {
          conversationContext = `\nRecent Conversation Context:\n${cleanHistory}\n`;
        }
      }

      const prompt = `${systemInstruction}${conversationContext}\nUser situation: "${message}"\nProvide a supportive, objective safety response:`;
      const generated = await generateWithFallback(ai, prompt, 18000);
      if (generated) {
        reply = generated;
      } else {
        reply = getRuleBasedSafetyReply(message);
        isFallback = true;
      }
    } else {
      reply = getRuleBasedSafetyReply(message);
      isFallback = true;
    }

    if (!reply) {
      reply = getRuleBasedSafetyReply(message);
      isFallback = true;
    }

    return res.json({
      reply,
      isFallback,
      disclaimer: "Informational safety tool. Not a substitute for emergency services."
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.json({
      reply: getRuleBasedSafetyReply(req.body?.message || ''),
      isFallback: true,
      disclaimer: "Informational safety tool. Not a substitute for emergency services."
    });
  }
});

// AI Recruitment & Job Offer Analyzer Endpoint
app.post('/api/ai/analyze-recruitment', async (req, res) => {
  try {
    const { text, url } = req.body;
    if (!text && !url) {
      return res.status(400).json({ error: 'Text or URL is required for analysis' });
    }

    const ai = getAI();
    const contentToAnalyze = text || url || '';

    // Deterministic heuristic rule checks
    const indicators: string[] = [];
    let riskScore = 0;
    const lower = contentToAnalyze.toLowerCase();

    if (lower.includes('deposit') || lower.includes('processing fee') || lower.includes('pay first') || lower.includes('registration fee') || lower.includes('security deposit')) {
      indicators.push('Demands upfront fee, security deposit, or payment prior to employment');
      riskScore += 30;
    }
    if (lower.includes('passport') || lower.includes('surrender document') || lower.includes('keep original') || lower.includes('submit original certificate')) {
      indicators.push('Demands retention of original identification or passport documents');
      riskScore += 45;
    }
    if (lower.includes('urgent') || lower.includes('immediate travel') || lower.includes('fly tonight') || lower.includes('leave within 24 hours') || lower.includes('hurry')) {
      indicators.push('Artificial extreme urgency or rapid relocation pressure');
      riskScore += 25;
    }
    if (lower.includes('no experience') && (lower.includes('lakh') || lower.includes('$5000') || lower.includes('huge salary') || lower.includes('high income') || lower.includes('unrealistic'))) {
      indicators.push('Disproportionately high compensation for zero qualifications or vague roles');
      riskScore += 25;
    }
    if (lower.includes('free accommodation') && (lower.includes('isolated') || lower.includes('cannot leave') || lower.includes('strict house rules') || lower.includes('curfew enforced'))) {
      indicators.push('Recruiter-controlled housing with potential movement restrictions');
      riskScore += 30;
    }
    if (lower.includes('tourist visa') && (lower.includes('work') || lower.includes('job'))) {
      indicators.push('Offers work on tourist/visit visa rather than legal work permit');
      riskScore += 40;
    }
    if (lower.includes('telegram') || lower.includes('whatsapp only') || (!lower.includes('company') && !lower.includes('registered'))) {
      indicators.push('Informal communication channels without verifiable registered entity');
      riskScore += 15;
    }

    let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskScore >= 60) level = 'CRITICAL';
    else if (riskScore >= 40) level = 'HIGH';
    else if (riskScore >= 20) level = 'MODERATE';

    let aiExplanation = '';
    if (ai) {
      const aiPrompt = `Analyze the following job/travel offer for human trafficking, exploitation, debt bondage, or fraud indicators.
Content: "${contentToAnalyze.slice(0, 1500)}"
Provide a 2-3 sentence objective assessment of potential risks and 2 safety verification steps.
Do not make a definitive accusation; frame as indicators to inspect.`;
      const generated = await generateWithFallback(ai, aiPrompt, 18000);
      if (generated) {
        aiExplanation = generated;
      }
    }

    return res.json({
      riskLevel: level,
      riskScore: Math.min(100, riskScore),
      detectedIndicators: indicators,
      explanation: aiExplanation || (level === 'LOW' 
        ? 'No overt high-risk flags detected in this text. Still exercise standard caution and verify company registration.' 
        : `Identified ${indicators.length} warning indicators commonly associated with recruitment scams or exploitative employment.`),
      recommendations: [
        'Never surrender your passport, Aadhaar, or educational certificates to any agency.',
        'Verify overseas recruiters through the Ministry of External Affairs eMigrate portal (emigrate.gov.in).',
        'Insist on a legitimate, written employment contract before accepting travel arrangements.',
        'Share recruiter details and destination address with a trusted contact before traveling.'
      ],
      disclaimer: 'This screening tool highlights warning patterns. It is not an official legal adjudication or guarantee.'
    });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze-recruitment:', error);
    return res.status(500).json({ error: 'Failed to analyze recruitment offer' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function start() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Abhaya] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
