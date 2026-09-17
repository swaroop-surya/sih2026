import express from 'express';
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
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Aegis',
    hasGemini: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// AI Safety Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'en' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAI();
    if (!ai) {
      // Fallback rule-based responses if API key is not configured
      const lower = message.toLowerCase();
      let reply = "I understand you're sharing a sensitive situation. Aegis is here to help you identify safety indicators and connect with verified resources.";
      
      if (lower.includes('passport') || lower.includes('document') || lower.includes('contract') || lower.includes('leave')) {
        reply = "Restricting identity documents (such as withholding your passport or Aadhaar) or preventing someone from leaving is a serious warning indicator associated with coercive control and exploitation. In India, you can reach the National Emergency Service at 112 or the Women Helpline at 181 for guidance. If you are in immediate physical danger, please activate Emergency SOS.";
      } else if (lower.includes('money') || lower.includes('debt') || lower.includes('salary') || lower.includes('pay')) {
        reply = "Financial coercion—such as demanding repayment of unexplained recruitment fees, withholding earned wages, or controlling personal finances—is a significant risk indicator. Document dates and communication without confronting the person directly if it is unsafe.";
      } else if (lower.includes('photo') || lower.includes('blackmail') || lower.includes('video') || lower.includes('leak')) {
        reply = "Digital blackmail or threats to circulate private media is a cyber offense. Do not delete screenshots or chat logs, as they serve as vital evidence. In India, you can report cyber harassment anonymously to the National Cyber Crime Reporting Portal at cybercrime.gov.in or call 1930.";
      } else if (lower.includes('follow') || lower.includes('stalk') || lower.includes('tracking')) {
        reply = "Being followed physically or tracked digitally is unacceptable. Try to reach a populated, well-lit safe space (such as a metro station, store, or police station), share your live check-in with a trusted contact, and call 112 or 181 if you feel threatened.";
      } else {
        reply = "Thank you for documenting this. Notice whether there are patterns of isolation, threats, or movement restrictions. You can log this in your Incident Journal with timestamps to establish a chronological record. How else can I assist your safety right now?";
      }

      return res.json({
        reply,
        isFallback: true,
        disclaimer: "AI indicators are observational safety aids, not definitive legal or medical diagnoses. Call 112 in immediate danger."
      });
    }

    const systemInstruction = `You are Aegis AI Safety Assistant, an empathetic, trauma-informed safety advisor built for women's protection.
CORE MANDATES:
1. Emphasize immediate physical safety first. If in imminent danger, urge using the 112 Emergency helpline or Aegis SOS.
2. NEVER engage in victim blaming, judgment, or dismissive remarks.
3. NEVER instruct the user to aggressively confront a potentially dangerous perpetrator or abuser.
4. Distinguish clearly that risk assessments and indicators are informational flags, NOT definitive legal verdicts or medical diagnoses.
5. Important product policy: Consensual adult sex work must NOT be treated as trafficking. Specifically focus on coercion, exploitation, trafficking, violence, harassment, stalking, abuse, blackmail, forced activity, and inability to safely leave.
6. Provide structured, actionable next steps: evidence preservation (screenshots, timestamps), trusted circle alert, safe places, verified Indian resources (112, 181 Women Helpline, 1930 Cyber Crime, One Stop Centres).
7. Respond in ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : 'English'}, or provide clear, accessible explanations.
8. Keep your response calm, grounded, objective, and concise.`;

    const prompt = `${systemInstruction}\n\nUser situation: "${message}"\nProvide a supportive, objective safety response:`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const reply = response.text || "I am here with you. If you feel unsafe, please reach out to trusted contacts or dial 112 immediately.";

    return res.json({
      reply,
      isFallback: false,
      disclaimer: "Informational safety tool. Not a substitute for emergency services."
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.status(500).json({
      error: 'Failed to process AI safety response',
      message: error?.message || 'Unknown error'
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
      try {
        const aiPrompt = `Analyze the following job/travel offer for human trafficking, exploitation, debt bondage, or fraud indicators.
Content: "${contentToAnalyze.slice(0, 1500)}"
Provide a 2-3 sentence objective assessment of potential risks and 2 safety verification steps.
Do not make a definitive accusation; frame as indicators to inspect.`;
        const aiRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: aiPrompt
        });
        aiExplanation = aiRes.text || '';
      } catch (err) {
        console.warn('AI analysis fallback:', err);
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
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aegis] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
