'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckType, CheckReport } from '@/lib/types/report';

const maxSizeMb = 10;

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [checkType, setCheckType] = useState<CheckType>('both');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const validateFile = (selected: File) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (!allowed.includes(selected.type)) return 'Unsupported file type. Please upload PDF, DOCX, or TXT.';
    if (selected.size > maxSizeMb * 1024 * 1024) return `File exceeds ${maxSizeMb}MB limit.`;
    return '';
  };

  const startCheck = async () => {
    if (!file) return setError('Please upload a file first.');
    const validation = validateFile(file);
    if (validation) return setError(validation);
    setError('');
    setProcessing(true);

    const form = new FormData();
    form.append('file', file);
    form.append('checkType', checkType);

    const res = await fetch('/api/check', { method: 'POST', body: form });
    const data = (await res.json()) as CheckReport | { error: string };
    setProcessing(false);

    if (!res.ok || 'error' in data) {
      setError('error' in data ? data.error : 'Check failed.');
      return;
    }

    sessionStorage.setItem('report', JSON.stringify(data));
    router.push('/report');
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-6">
      <header className="mb-8 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">Document Integrity Checker</h1>
        <p className="mt-2 text-sm text-slate-600">Upload a file, pick a check type, and generate a review report.</p>
      </header>

      <section className="rounded-xl bg-white p-6 shadow">
        <label className="mb-2 block font-semibold">Upload document</label>
        <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full rounded border p-2" />
        {file && <p className="mt-3 text-sm text-slate-700">{file.name} • {(file.size / 1024).toFixed(1)} KB • Ready</p>}

        <label className="mb-2 mt-6 block font-semibold">Check type</label>
        <select value={checkType} onChange={(e) => setCheckType(e.target.value as CheckType)} className="w-full rounded border p-2">
          <option value="plagiarism">Plagiarism check only</option>
          <option value="ai">AI writing check only</option>
          <option value="both">Plagiarism + AI check</option>
        </select>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <button disabled={processing} onClick={startCheck} className="mt-6 rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-500 disabled:opacity-60">
          {processing ? 'Processing…' : 'Start Check'}
        </button>
      </section>
    </main>
  );
}
