import { CheckReport, CheckType, Highlight } from '@/lib/types/report';

export function buildReport(input: {
  fileName: string;
  checkType: CheckType;
  plagiarismScore?: number;
  aiScore?: number;
  highlights: Highlight[];
}): CheckReport {
  const scores = [input.plagiarismScore, input.aiScore].filter((v): v is number => typeof v === 'number');
  const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  const riskLevel = average < 30 ? 'Low' : average < 65 ? 'Medium' : 'High';

  return {
    fileName: input.fileName,
    checkedAt: new Date().toISOString(),
    checkType: input.checkType,
    plagiarismScore: input.plagiarismScore,
    aiScore: input.aiScore,
    riskLevel,
    highlights: input.highlights,
    recommendation:
      riskLevel === 'High'
        ? 'Perform detailed manual review and verify citations/source traceability.'
        : riskLevel === 'Medium'
          ? 'Review highlighted parts and confirm attribution quality.'
          : 'No major indicators found, but continue normal human review.',
    disclaimer:
      'This report is an automated similarity and AI-writing analysis. Results should be reviewed manually and should not be treated as final proof of misconduct.'
  };
}
