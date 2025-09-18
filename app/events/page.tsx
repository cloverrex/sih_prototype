"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getJSON, postJSON, debugEnabled } from "../utils/shared";
import { useAuth } from "../providers/AuthContext";
import { useToast } from "../components/Toast";
import { Spinner } from "../components/Spinner";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const { status } = useAuth();
  const { push } = useToast();
  const authenticated = status.authenticated;
  const user = status.user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'superadmin');

  async function listEvents() {
    const { status, body } = await getJSON("/api/events");
    setResponse({ status, data: body });
    setEvents(body?.events || []);
  }

  async function listMyRegs() {
    if (!authenticated) {
      setMyRegs([]);
      return;
    }
    const { status, body } = await getJSON("/api/events/mine");
    setMyRegs(body?.events || []);
  }

  async function createEvent() {
    if (!title || !start) return setError("Title and start time required");
    const body = { title, start_time: new Date(start).toISOString() };
    const { status, body: resp } = await postJSON("/api/events", body);
    setResponse({ status, data: resp });
    if (status !== 201) {
      setError((resp && (resp.error || resp.details)) || "Event creation failed");
      return;
    }
    setTitle("");
    setStart("");
    setError("");
    listEvents();
    push('Event created','success');
  }

  async function registerEvent(id: string) {
    const { status, body } = await postJSON(`/api/events/${id}/register`, {});
    setResponse({ status, data: body });
    if (status === 200) {
      listMyRegs();
      push('Registered for event','success');
    }
  }

  useEffect(() => {
    if(status.loaded){
      listEvents();
      if(authenticated) listMyRegs();
    }
    // eslint-disable-next-line
  }, [authenticated, status.loaded]);

  if(!status.loaded){
    return <div className="max-w-5xl mx-auto px-4 py-16 flex items-center gap-3 text-sm opacity-70"><Spinner /> <span>Loading session…</span></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/">← Home</Link>
      </header>

      {isAdmin && (
        <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-semibold mb-3">Create Event (admin)</h2>
          <div className="grid md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-sm opacity-80">Title</label>
              <input className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
            </div>
            <div>
              <label className="text-sm opacity-80">Start</label>
              <input type="datetime-local" className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" value={start} onChange={e => setStart(e.target.value)} required />
            </div>
            <button className="btn bg-purple-600 text-white rounded px-3 py-2 hover:bg-purple-700" onClick={createEvent}>Create</button>
          </div>
          <p className="text-xs opacity-70 mt-2">Only visible for admin users.</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </section>
      )}

      <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Events</h2>
          <button className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={listEvents}>Refresh</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {events.length === 0 && <p className="text-sm opacity-70">No events yet. Admins can create the first one.</p>}
          {events.map((ev: any) => (
            <div key={ev.id} className="card border border-gray-100 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
              <h3 className="font-semibold">{ev.title}</h3>
              <p className="text-sm opacity-80 mt-1">{new Date(ev.start_time).toLocaleString()}</p>
              <div className="mt-3 flex gap-2 items-center">
                <button className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => registerEvent(ev.id)}>Register</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {authenticated && (
        <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Registrations</h2>
            <button className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={listMyRegs}>Refresh</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {myRegs.length === 0 && <p className="text-sm opacity-70">You have not registered for any events yet.</p>}
            {myRegs.map((ev: any) => (
              <div key={ev.id} className="card border border-gray-100 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
                <h3 className="font-semibold">{ev.title}</h3>
                <p className="text-sm opacity-80">{new Date(ev.start_time).toLocaleString()}</p>
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
