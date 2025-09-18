"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getJSON, postJSON, putJSON, delJSON, debugEnabled } from "../utils/shared";
import { useAuth } from "../providers/AuthContext";
import { useToast } from "../components/Toast";
import { Spinner } from "../components/Spinner";

export default function DonationsPage() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [myDonations, setMyDonations] = useState([]);
  const [adminDonations, setAdminDonations] = useState([]);
  const [response, setResponse] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const { status } = useAuth();
  const { push } = useToast();
  const user = status.user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'superadmin');

  async function createDonation() {
    const body = { amount: Number(amount), note: message };
    const { status, body: resp } = await postJSON("/api/donations", body);
    setResponse({ status, data: resp });
    listMine();
    if(status===201) push('Donation recorded','success');
  }

  async function listMine() {
    const { status, body } = await getJSON("/api/donations/mine");
    setResponse({ status, data: body });
    const arr = (body && body.donations) || [];
    arr.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setTotal(arr.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0));
    setMyDonations(arr);
  }

  async function adminList() {
    const { status, body } = await getJSON("/api/donations");
    setResponse({ status, data: body });
    setAdminDonations((body && body.donations) || []);
  }

  async function updateDonation(d: any){
    const amt = prompt('New amount', d.amount);
    if(amt===null) return;
    const note = prompt('New note', d.note || '') ?? d.note;
    const { status, body } = await putJSON(`/api/donations/${d.id}`, { amount: Number(amt), note });
    setResponse({ status, data: body });
    if(status===200){ push('Donation updated','success'); adminList(); }
    else push('Update failed','error');
  }

  async function deleteDonation(d: any){
    if(!confirm('Delete this donation?')) return;
    const { status, body } = await delJSON(`/api/donations/${d.id}`);
    setResponse({ status, data: body });
    if(status===200){ push('Donation deleted','success'); adminList(); }
    else push('Delete failed','error');
  }

  useEffect(() => {
    if(status.authenticated){
      listMine();
      if (isAdmin) setTimeout(() => adminList(), 400);
    }
    // eslint-disable-next-line
  }, [status.authenticated, isAdmin]);

  if(!status.loaded){
    return <div className="max-w-4xl mx-auto px-4 py-16 flex items-center gap-3 text-sm opacity-70"><Spinner /> <span>Loading session…</span></div>;
  }
  if(!status.authenticated){
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Donations</h1>
        <p className="mb-6 opacity-80">Sign in to view and make donations.</p>
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
        <h2 className="text-lg font-semibold mb-3">Make a Donation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm opacity-80">Amount</label>
            <input type="number" className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" placeholder="50" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="text-sm opacity-80">Message</label>
            <input className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" placeholder="For the scholarship fund" value={message} onChange={e => setMessage(e.target.value)} />
          </div>
        </div>
        <button className="mt-4 btn bg-purple-600 text-white rounded px-3 py-2 hover:bg-purple-700" onClick={createDonation}>Donate</button>
      </section>
      <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Donations</h2>
          <button className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={listMine}>Refresh</button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-sm opacity-80">{myDonations.length ? `Total Donated: $${total}` : ''}</div>
        </div>
        <div className="grid gap-3">
          {myDonations.length === 0 && <p className="text-sm opacity-70">No donations yet.</p>}
          {myDonations.map((r: any, i: number) => (
            <div key={i} className="card border border-gray-100 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">${r.amount}</h3>
                  <p className="text-sm opacity-80">{r.note || ''}</p>
                </div>
                <span className="text-xs rounded px-2 py-1 border border-gray-200 dark:border-gray-700">{new Date(r.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {isAdmin && (
        <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Donations (Admin)</h2>
            <button className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={adminList}>Refresh</button>
          </div>
          <div className="grid gap-3">
            {adminDonations.length === 0 && <p className="text-sm opacity-70">No donations found.</p>}
            {adminDonations.map((r: any, i: number) => (
              <div key={i} className="card border border-gray-100 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold">${r.amount} <span className="text-xs opacity-70">{r.currency}</span></h3>
                    <p className="text-sm opacity-80 break-words">{r.note || ''}</p>
                    <p className="text-xs opacity-70">{r.donor_name || 'Unknown'} • {r.donor_email || ''}</p>
                    <p className="text-xs opacity-70">{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={()=>updateDonation(r)} className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500">Edit</button>
                    <button onClick={()=>deleteDonation(r)} className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-500">Del</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {debugEnabled() && (
        <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 mt-6">
          <h2 className="text-lg font-semibold mb-3">Response (Debug)</h2>
          <pre className="bg-black dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 rounded overflow-auto h-64">{JSON.stringify(response, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
