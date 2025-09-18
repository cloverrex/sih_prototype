"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJSON, postJSON, debugEnabled } from '../utils/shared';
import { useAuth } from '../providers/AuthContext';
import { Spinner } from '../components/Spinner';
import { useToast } from '../components/Toast';

export default function MentorshipPage(){
  const { status } = useAuth();
  const { push } = useToast();
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [response, setResponse] = useState<any>(null);

  async function createMentorship(){
    const body = { topic, details };
    const { status, body: resp } = await postJSON('/api/mentorship', body);
    setResponse({ status, data: resp });
    setTopic(''); setDetails('');
    listMine();
    if(status===201 || status===200) push('Mentorship request submitted','success');
  }

  function statusBadge(status: string){
    const base = 'text-xs rounded px-2 py-1 border';
    if (status === 'approved') return `${base} border-green-300 text-green-700 dark:border-green-700 dark:text-green-300`;
    if (status === 'rejected') return `${base} border-red-300 text-red-700 dark:border-red-700 dark:text-red-300`;
    return `${base} border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300`;
  }

  async function listMine(){
    const { status, body } = await getJSON('/api/mentorship/mine');
    setResponse({ status, data: body });
    setRequests((body && body.requests) || []);
  }

  useEffect(() => { if(status.authenticated) listMine(); }, [status.authenticated]);

  if(!status.loaded){
    return <div className="max-w-4xl mx-auto px-4 py-16 flex items-center gap-3 text-sm opacity-70"><Spinner /> <span>Loading session…</span></div>;
  }
  if(!status.authenticated){
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Mentorship</h1>
        <p className="mb-6 opacity-80">Sign in to request mentorship and view your requests.</p>
        <Link href="/auth" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500">Go to Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/">← Home</Link>
      </header>

      <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold mb-3">Request Mentorship</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm opacity-80">Topic</label>
            <input value={topic} onChange={e=>setTopic(e.target.value)} className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" placeholder="Career Guidance" />
          </div>
          <div>
            <label className="text-sm opacity-80">Details</label>
            <input value={details} onChange={e=>setDetails(e.target.value)} className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" placeholder="I need help with..." />
          </div>
        </div>
        <button className="mt-4 btn bg-purple-600 text-white rounded px-3 py-2 hover:bg-purple-700" onClick={createMentorship}>Submit</button>
      </section>

      <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Requests</h2>
          <button className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={listMine}>Refresh</button>
        </div>
        <div className="grid gap-3">
          {requests.length === 0 && <p className="text-sm opacity-70">No mentorship requests yet.</p>}
          {requests.map(r => (
            <div key={r.id} className="card border border-gray-100 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{r.topic}</h3>
                  <p className="text-sm opacity-80">{r.details}</p>
                </div>
                <span className={statusBadge(r.status)}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {debugEnabled() && (
        <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 mt-6">
          <h2 className="text-lg font-semibold mb-3">Response (Debug)</h2>
          <pre className="bg-black dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 rounded overflow-auto h-64">{JSON.stringify(response, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
