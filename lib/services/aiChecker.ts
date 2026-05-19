export function runMockAiCheck(text: string) {
  const score = Math.min(92, Math.max(4, Math.round((text.split(' ').length % 70) + 15)));
  return {
    score,
    highlights: [
      {
        text: text.slice(40, 140) || 'Highly uniform sentence style observed.',
        reason: 'Pattern resembles model-generated fluency with low variance.'
      }
    ]
  };
}
