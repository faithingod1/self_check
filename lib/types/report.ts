export type CheckType = 'plagiarism' | 'ai' | 'both';

export type Highlight = {
  text: string;
  reason: string;
};

export type CheckReport = {
  fileName: string;
  checkedAt: string;
  checkType: CheckType;
  plagiarismScore?: number;
  aiScore?: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  highlights: Highlight[];
  recommendation: string;
  disclaimer: string;
};
