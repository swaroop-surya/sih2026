export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isWarning?: boolean;
}

export async function askAIAssistant(
  message: string,
  history: AIChatMessage[] = [],
  language: string = 'en'
): Promise<{ reply: string; isFallback: boolean; disclaimer: string }> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history, language })
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend AI route unavailable, using local client safety engine:', err);
    // Offline / fallback intelligent safety engine
    const lower = message.toLowerCase();
    let reply = "Abhaya safety guidance is active. If you feel at risk, prioritize moving to a populated area and notify your trusted circle.";
    
    if (lower.includes('passport') || lower.includes('document') || lower.includes('contract')) {
      reply = "Withholding your original passport, Aadhaar, or education certificates is a hallmark indicator of coercive control and forced labor. Under Indian law, no employer or agency has the legal right to seize your identity papers. You can seek free legal aid via NALSA (15100) or report directly to 181.";
    } else if (lower.includes('photo') || lower.includes('blackmail') || lower.includes('leak') || lower.includes('money')) {
      reply = "Extortion using private photographs is a severe cybercrime under Section 66E and 67 of the IT Act. Do not delete the chat logs or pay any extortion demand. Save screenshots, compute their cryptographic hashes in your Evidence Vault, and register an official complaint on cybercrime.gov.in or call 1930.";
    } else if (lower.includes('follow') || lower.includes('stalk') || lower.includes('watcher')) {
      reply = "Physical stalking requires immediate situational awareness. Avoid isolated short-cuts, enter a well-lit store or cafe, activate an Abhaya Safety Check-In, and dial 112 if the individual approaches you.";
    }

    return {
      reply,
      isFallback: true,
      disclaimer: "Informational safety tool. Not a substitute for official law enforcement or emergency intervention."
    };
  }
}

export async function analyzeRecruitmentOffer(text: string, url?: string) {
  try {
    const res = await fetch('/api/ai/analyze-recruitment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, url })
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Backend recruitment analysis route unavailable, using local heuristics:', err);
    // Local heuristic engine
    const lower = (text + ' ' + (url || '')).toLowerCase();
    const indicators: string[] = [];
    let score = 0;

    if (lower.includes('deposit') || lower.includes('processing fee') || lower.includes('registration fee')) {
      indicators.push('Demands upfront monetary payment before employment');
      score += 35;
    }
    if (lower.includes('passport') || lower.includes('original document') || lower.includes('surrender certificate')) {
      indicators.push('Requires surrendering personal passport or original certificates');
      score += 45;
    }
    if (lower.includes('urgent') || lower.includes('within 24 hours') || lower.includes('immediate fly')) {
      indicators.push('Pressure to relocate with extreme urgency');
      score += 25;
    }
    if (lower.includes('no experience') && (lower.includes('high salary') || lower.includes('lakh') || lower.includes('huge income'))) {
      indicators.push('Unrealistically high compensation with zero qualifications required');
      score += 20;
    }

    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 60) riskLevel = 'CRITICAL';
    else if (score >= 40) riskLevel = 'HIGH';
    else if (score >= 20) riskLevel = 'MODERATE';

    return {
      riskLevel,
      riskScore: score,
      detectedIndicators: indicators,
      explanation: indicators.length > 0
        ? `Identified ${indicators.length} warning signs commonly associated with deceptive recruitment and debt bondage.`
        : 'No obvious red flags detected in the provided snippet. Verify recruiter on official government registers.',
      recommendations: [
        'Always check the Ministry of External Affairs eMigrate portal for overseas jobs.',
        'Never surrender original passport or identity documents.',
        'Keep family and trusted contacts fully informed of all interview details.'
      ],
      disclaimer: 'This screening tool highlights warning patterns. It is not an official legal adjudication.'
    };
  }
}
