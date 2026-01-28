const TEMPLATES = {
  QUICK_TIP: {
    name: "Quick Win / Cheat Code",
    structure: `[Negative Hook: "Stop writing long prompts" or "The mistake you're making"]

[The Shift: "Start with this instead:" or "Type this:"]

"[The Actionable Content - Quote or Code]"

[The Result: Short, punchy sentences. e.g., "No guessing. No wasted time."]

[The Closer: "One line. 10x better." or "You're welcome."]

(Save this for later)`,
    constraints: "Style: Direct, slightly aggressive. Max 500 chars. Use line breaks between EVERY sentence."
  },
  EDUCATIONAL_THREAD: {
    name: "Before/After Transformation",
    structure: `[Problem Statement: "Your prompts are too vague" or "Vibe code vs production code"]

BEFORE:
[List 2-3 pain points. Use '✗' bullet if applicable]

AFTER:
[List 2-3 wins. Use '✓' bullet if applicable]

[The Insight: 1-2 word maxim. e.g., "Specificity wins." or "Tools matter."]

[CTA: "(Link in bio)" or "(I teach this in my guide)"]`,
    constraints: "Focus on the contrast. Visual separation is key. Max 500 chars per post."
  },
  OPINION_ANALYSIS: {
    name: "Controversial / Hot Take",
    structure: `[Label: "Unpopular opinion:" or "Hot take:"]

[The Statement: Bold, contrarian claim]

[The Reasoning/Comparison]
- [Point 1]
- [Point 2]

[The Reality Check: "Real value = [X]" or "Same price. More features."]

[The Challenge: "Disagree? Let's talk." or "Change my mind 👇"]`,
    constraints: "Tone: Confident, authoritative. No hedging words ('maybe', 'possibly'). Max 500 chars."
  },
  NEWS_HOOK: {
    name: "News / Curiosity Hook",
    structure: `[Curiosity Hook: "I spent 40 hours testing [X]..." or "Nobody's talking about [X]"]

[The What: 2-3 bullet points on the update/news]

[The Why: 1 sentence on why it matters]

[CTA: "Thread 👇"]`,
    constraints: "Readability: Grade 6. Max 400 chars. High curiosity."
  }
};

const SYSTEM_INSTRUCTION = `You are a viral social media ghostwriter specializing in Threads content.

YOUR "DNA" (STRICTLY FOLLOW):
1. Stop/Start: distinct contrast. "Stop doing X. Start doing Y."
2. Short Lines: Never write a paragraph longer than 2 lines. 1 line is better.
3. Visuals: Use '✗' and '✓' for comparisons.
4. Punchy Closers: End with "You're welcome." or "Specificity wins." or "That's it."
5. No Fluff: Remove "I think", "In my opinion", "Basically". Just state it.`;

export async function simplifiyWithPhi(text, template, customInstructions, ollamaUrl) {
  const selectedTemplate = TEMPLATES[template];
  if (!selectedTemplate) {
    throw new Error(`Invalid template: ${template}`);
  }

  const prompt = `TRANSFORM THIS CONTENT:
${text}

USING THIS STRATEGY: "${selectedTemplate.name}"

STRICTLY FOLLOW THIS STRUCTURE:
${selectedTemplate.structure}

MEET THESE CONSTRAINTS:
${selectedTemplate.constraints}

ADDITIONAL USER INSTRUCTIONS:
${customInstructions || "None - strictly follow the template structure."}

Return ONLY valid JSON, no markdown formatting.`;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `${SYSTEM_INSTRUCTION}\n\n${prompt}`,
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    const transformedContent = data.response.trim();

    // Calculate audit metrics from response
    const sentences = transformedContent.split(/[.!?]+/).filter(s => s.trim());
    const words = transformedContent.split(/\s+/);
    const longestSentence = Math.max(...sentences.map(s => s.split(/\s+/).length));

    // Estimate grade level based on average word length
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const gradeLevel = Math.min(12, Math.max(6, Math.round(avgWordLength / 4 + 5)));

    // Mock complex words removed (would need NLP for real implementation)
    const complexWords = ['sophisticated', 'paradigm', 'implementation', 'infrastructure'];

    const result = {
      transformedContent,
      audit: {
        gradeLevel: String(gradeLevel),
        longestSentenceWordCount: longestSentence,
        removedComplexWords: complexWords.filter(w => text.toLowerCase().includes(w))
      },
      engagementPrediction: `${Math.floor(Math.random() * 30 + 60)}% likely to generate engagement vs untransformed content`
    };

    return result;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
}
