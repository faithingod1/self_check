export function runMockPlagiarismCheck(text: string) {
  const base = Math.min(95, Math.max(5, Math.round((text.length % 65) + 20)));
  return {
    score: base,
    highlights: [
      {
        text: text.slice(0, 100) || 'Repeated sentence structure detected in opening section.',
        reason: 'Possible close similarity to common web wording.'
      },
      {
        text: text.slice(120, 220) || 'Citation format appears inconsistent in this section.',
        reason: 'Potentially copied phrasing without proper citation context.'
      }
    ]
  };
}
