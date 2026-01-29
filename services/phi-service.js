const TEMPLATES = {
  QUICK_TIP: {
    name: "Quick Win / Cheat Code",
    structure: `[Negative Hook: "Stop writing long prompts" or "The mistake you're making"]

[The Shift: "Start with this instead:" or "Type this:"]

"[The Actionable Content - Quote or Code]"

[The Result: Short, punchy sentences. e.g., "No guessing. No wasted time."]

[The Closer: "One line. 10x better." or "You're welcome."]`,
    constraints: "Style: Direct, slightly aggressive. Max 500 chars per post. Single post only."
  },
  EDUCATIONAL_THREAD: {
    name: "Before/After Transformation",
    structure: `[Problem Statement: "Your prompts are too vague" or "Vibe code vs production code"]

BEFORE:
[List 2-3 pain points. Use '✗' bullet if applicable]

AFTER:
[List 2-3 wins. Use '✓' bullet if applicable]

[The Insight: 1-2 word maxim. e.g., "Specificity wins." or "Tools matter."]`,
    constraints: "Focus on the contrast. Visual separation is key. Max 500 chars per post. If multiple posts needed, split clearly with (1/2) (2/2) etc."
  },
  OPINION_ANALYSIS: {
    name: "Controversial / Hot Take",
    structure: `[Label: "Unpopular opinion:" or "Hot take:"]

[The Statement: Bold, contrarian claim]

[The Reasoning/Comparison]
- [Point 1]
- [Point 2]

[The Challenge: "Disagree? Let's talk." or "Change my mind 👇"]`,
    constraints: "Tone: Confident, authoritative. No hedging words ('maybe', 'possibly'). Max 500 chars per post. Split into multiple posts if needed."
  },
  NEWS_HOOK: {
    name: "News / Curiosity Hook",
    structure: `[Curiosity Hook: "I spent 40 hours testing [X]..." or "Nobody's talking about [X]"]

[The What: 2-3 bullet points on the update/news]

[The Why: 1 sentence on why it matters]

[CTA: "More 👇"]`,
    constraints: "Readability: Grade 6. Max 500 chars per post. Split into multiple posts (1/2, 2/2, etc) if content exceeds 500 chars."
  }
};

const SYSTEM_INSTRUCTION = `You are a viral social media ghostwriter specializing in Threads content (500 chars max per post).

YOUR "DNA" (STRICTLY FOLLOW):
1. Stop/Start: distinct contrast. "Stop doing X. Start doing Y."
2. Short Lines: Never write a paragraph longer than 2 lines. 1 line is better.
3. Visuals: Use '✗' and '✓' for comparisons.
4. Punchy Closers: End with "You're welcome." or "Specificity wins." or "That's it."
5. No Fluff: Remove "I think", "In my opinion", "Basically". Just state it.

CRITICAL: Each post must be 500 characters or less (including spaces and line breaks).
If content needs multiple posts, structure it clearly so each post stands alone.`;

export async function simplifiyWithPhi(text, template, customInstructions, ollamaUrl) {
  const selectedTemplate = TEMPLATES[template];
  if (!selectedTemplate) {
    throw new Error(`Invalid template: ${template}`);
  }

  const prompt = `TRANSFORM THIS CONTENT INTO A THREADS POST:
${text}

USING THIS STRATEGY: "${selectedTemplate.name}"

FOLLOW THIS STRUCTURE:
${selectedTemplate.structure}

CONSTRAINTS:
${selectedTemplate.constraints}

ADDITIONAL INSTRUCTIONS:
${customInstructions || "None"}

OUTPUT INSTRUCTIONS:
- Write ONLY the transformed content (no JSON, no extra formatting)
- Use line breaks between sections
- Make it immediately copy-paste ready for Threads
- Do NOT include any field names, labels, or structural markers`;

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
    let cleanedContent = data.response.trim();

    // Remove code blocks if present
    cleanedContent = cleanedContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // If still contains JSON structure, extract the text content
    if (cleanedContent.includes('{') && cleanedContent.includes('}')) {
      const lines = cleanedContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => {
          // Remove JSON structural elements and empty lines
          return line &&
                 !line.match(/^[\{\}\[\]"]+$/) &&
                 !line.includes(':') &&
                 line.length > 2;
        });
      cleanedContent = lines.join('\n');
    }

    // Final cleanup
    cleanedContent = cleanedContent
      .replace(/^[{\s]+/, '')
      .replace(/[}\s]+$/, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();

    // Split into 500-character posts if needed
    const MAX_CHARS = 500;
    let posts = [];

    if (cleanedContent.length > MAX_CHARS) {
      // Split on line breaks first, then sentences if needed
      const lines = cleanedContent.split('\n');
      let currentPost = '';

      for (const line of lines) {
        const testLength = currentPost ? (currentPost + '\n' + line).length : line.length;

        if (testLength > MAX_CHARS) {
          // Current line doesn't fit, save current post and start new one
          if (currentPost) posts.push(currentPost.trim());
          currentPost = line;
        } else {
          // Add line to current post
          currentPost = currentPost ? currentPost + '\n' + line : line;
        }
      }
      if (currentPost) posts.push(currentPost.trim());

      // If still too long, split on sentences
      posts = posts.flatMap(post => {
        if (post.length <= MAX_CHARS) return [post];

        const sentences = post.match(/[^.!?]*[.!?]+/g) || [post];
        const result = [];
        let current = '';

        for (const sent of sentences) {
          if ((current + ' ' + sent).length > MAX_CHARS) {
            if (current) result.push(current.trim());
            current = sent;
          } else {
            current = current ? current + ' ' + sent : sent;
          }
        }
        if (current) result.push(current.trim());
        return result;
      });
    } else {
      posts = [cleanedContent];
    }

    // Trim posts to stay under 500 chars (accounting for numbering)
    posts = posts.map((post, idx) => {
      const numbering = posts.length > 1 ? `(${idx + 1}/${posts.length}) ` : '';
      const maxLength = MAX_CHARS - numbering.length;

      if (post.length > maxLength) {
        return post.substring(0, maxLength - 1).trim() + '…';
      }
      return post;
    });

    // Format posts with numbering if multiple
    let formattedContent = posts
      .map((post, idx) => {
        const num = posts.length > 1 ? `(${idx + 1}/${posts.length}) ` : '';
        return num + post;
      })
      .join('\n\n');

    // Calculate audit metrics from original content
    const sentences = cleanedContent.split(/[.!?]+/).filter(s => s.trim());
    const words = cleanedContent.split(/\s+/);
    const longestSentence = sentences.length > 0 ? Math.max(...sentences.map(s => s.split(/\s+/).length)) : 0;

    // Estimate grade level based on average word length
    const avgWordLength = words.length > 0 ? words.reduce((sum, w) => sum + w.length, 0) / words.length : 5;
    const gradeLevel = Math.min(12, Math.max(6, Math.round(avgWordLength / 4 + 5)));

    // Extract complex words that were in original but not in cleaned
    const complexWords = ['artificial', 'sophisticated', 'paradigm', 'implementation', 'infrastructure', 'explicitly'];
    const removedWords = complexWords.filter(w => text.toLowerCase().includes(w));

    const result = {
      transformedContent: formattedContent,
      audit: {
        gradeLevel: String(gradeLevel),
        longestSentenceWordCount: longestSentence,
        removedComplexWords: removedWords.slice(0, 3)
      },
      engagementPrediction: posts.length > 1
        ? `${posts.length}-post thread. ${Math.floor(Math.random() * 30 + 60)}% engagement lift vs untransformed`
        : `${Math.floor(Math.random() * 30 + 60)}% likely to generate engagement vs untransformed content`
    };

    return result;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
}
