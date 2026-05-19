'use client';

import { jsPDF } from 'jspdf';
import { CheckReport } from '@/lib/types/report';

export function ReportPdfButton({ report }: { report: CheckReport }) {
  const downloadPdf = () => {
    const doc = new jsPDF();
    let y = 15;
    const write = (line: string) => {
      doc.text(line, 14, y);
      y += 8;
    };

    doc.setFontSize(16);
    write('Integrity Analysis Report');
    doc.setFontSize(11);
    write(`File: ${report.fileName}`);
    write(`Checked at: ${new Date(report.checkedAt).toLocaleString()}`);
    write(`Check type: ${report.checkType}`);
    if (typeof report.plagiarismScore === 'number') write(`Plagiarism score: ${report.plagiarismScore}%`);
    if (typeof report.aiScore === 'number') write(`AI-writing score: ${report.aiScore}%`);
    write(`Risk level: ${report.riskLevel}`);
    y += 4;
    write('Highlights:');
    report.highlights.slice(0, 4).forEach((h, idx) => {
      write(`${idx + 1}. ${h.reason}`);
    });
    y += 2;
    const lines = doc.splitTextToSize(report.disclaimer, 180);
    doc.text(lines, 14, y);

    doc.save(`report-${report.fileName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <button onClick={downloadPdf} className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
      Download PDF Report
    </button>
  );
}
