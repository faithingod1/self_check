'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckReport } from '@/lib/types/report';
import { ReportPdfButton } from '@/components/ReportPdfButton';

export default function ReportPage() {
  const [report, setReport] = useState<CheckReport | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('report');
    if (raw) setReport(JSON.parse(raw));
  }, []);

  if (!report) return <main className="p-8">No report found. <Link className="underline" href="/">Go back</Link></main>;

  const riskColor = report.riskLevel === 'Low' ? 'text-emerald-600' : report.riskLevel === 'Medium' ? 'text-amber-600' : 'text-red-600';

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-6">
      <section className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">Analysis Report</h1>
        <div className="mt-4 space-y-2 text-sm">
          <p><strong>File:</strong> {report.fileName}</p>
          <p><strong>Date/Time:</strong> {new Date(report.checkedAt).toLocaleString()}</p>
          <p><strong>Check Type:</strong> {report.checkType}</p>
          {typeof report.plagiarismScore === 'number' && <p><strong>Plagiarism:</strong> {report.plagiarismScore}%</p>}
          {typeof report.aiScore === 'number' && <p><strong>AI Generated:</strong> {report.aiScore}%</p>}
          <p><strong>Risk Level:</strong> <span className={riskColor}>{report.riskLevel}</span></p>
        </div>

        <h2 className="mt-6 text-lg font-semibold">Highlighted Sections</h2>
        <ul className="mt-2 space-y-2">
          {report.highlights.map((h, i) => (
            <li key={i} className="rounded border bg-slate-50 p-3 text-sm">
              <p className="font-medium">Reason: {h.reason}</p>
              <p className="mt-1 text-slate-600">"{h.text || 'No excerpt available.'}"</p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm"><strong>Recommendation:</strong> {report.recommendation}</p>
        <p className="mt-3 rounded bg-amber-50 p-3 text-xs text-slate-700">{report.disclaimer}</p>

        <div className="mt-6 flex gap-3">
          <ReportPdfButton report={report} />
          <Link href="/" className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold">Check Another File</Link>
        </div>
      </section>
    </main>
  );
}
