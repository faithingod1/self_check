import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/services/extractText';
import { runMockPlagiarismCheck } from '@/lib/services/plagiarismChecker';
import { runMockAiCheck } from '@/lib/services/aiChecker';
import { buildReport } from '@/lib/services/reportGenerator';
import { CheckType } from '@/lib/types/report';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const checkType = formData.get('checkType') as CheckType | null;

  if (!file || !checkType) {
    return NextResponse.json({ error: 'File and check type are required.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
  }

  const text = await extractTextFromFile(file);
  const highlights = [];
  let plagiarismScore: number | undefined;
  let aiScore: number | undefined;

  if (checkType === 'plagiarism' || checkType === 'both') {
    const p = runMockPlagiarismCheck(text);
    plagiarismScore = p.score;
    highlights.push(...p.highlights);
  }

  if (checkType === 'ai' || checkType === 'both') {
    const a = runMockAiCheck(text);
    aiScore = a.score;
    highlights.push(...a.highlights);
  }

  const report = buildReport({
    fileName: file.name,
    checkType,
    plagiarismScore,
    aiScore,
    highlights
  });

  return NextResponse.json(report);
}
