"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getJSON, putJSON, debugEnabled } from "../utils/shared";
import { useAuth } from "../providers/AuthContext";
import { Spinner } from "../components/Spinner";
import { useToast } from "../components/Toast";

export default function ProfilePage() {
  const { status } = useAuth();
  const { push } = useToast();
  const [form, setForm] = useState({
    degree: "",
    department: "",
    company: "",
    position: "",
    graduation_year: "",
    linkedin: ""
  });
  const [response, setResponse] = useState<any>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveProfile() {
    const body = {
      ...form,
      graduation_year: Number(form.graduation_year) || null,
      linkedin: form.linkedin || null
    };
    const { status, body: resp } = await putJSON("/api/profile/me", body);
    setResponse({ status, data: resp });
    if(status===200) push('Profile saved','success'); else push('Save failed','error');
  }

  async function getProfile() {
    const { status, body } = await getJSON("/api/profile/me");
    setResponse({ status, data: body });
    if (body) {
      setForm({
        degree: body.degree || "",
        department: body.department || "",
        company: body.company || "",
        position: body.position || "",
        graduation_year: body.graduation_year ? String(body.graduation_year) : "",
        linkedin: body.linkedin || ""
      });
    }
  }

  useEffect(()=>{ if(status.authenticated) getProfile(); },[status.authenticated]);

  if(!status.loaded){
    return <div className="max-w-4xl mx-auto px-4 py-16 flex items-center gap-3 text-sm opacity-70"><Spinner /> <span>Loading session…</span></div>;
  }
  if(!status.authenticated){
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p className="mb-6 opacity-80">Sign in to view and edit your profile.</p>
        <Link href="/auth" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500">Go to Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/">← Home</Link>
      </header>
      <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">My Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="degree" placeholder="Degree" value={form.degree} onChange={handleChange} className="border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" />
          <input name="position" placeholder="Position" value={form.position} onChange={handleChange} className="border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" />
          <input name="graduation_year" placeholder="Graduation Year" value={form.graduation_year} onChange={handleChange} className="border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" />
          <input name="linkedin" placeholder="LinkedIn URL (optional)" value={form.linkedin} onChange={handleChange} className="border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 placeholder:dark:text-gray-400" />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700" onClick={saveProfile}>Save</button>
          <button className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={getProfile}>Load</button>
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
