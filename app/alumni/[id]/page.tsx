"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getJSON, putJSON, debugEnabled } from '../../utils/shared';
import { useAuth } from '../../providers/AuthContext';
import { Spinner } from '../../components/Spinner';
import { useToast } from '../../components/Toast';

interface Alumnus { id: number; name?: string; email?: string; role?: string; graduation_year?: number; degree?: string; department?: string; company?: string; position?: string; location?: string; linkedin?: string; bio?: string; skills?: string; updated_at?: string; }

export default function AlumnusDetailPage(){
  const { status } = useAuth();
  const { push } = useToast();
  const params = useParams();
  const id = params?.id as string;
  const [data,setData]=useState<Alumnus|null>(null);
  const [edit,setEdit]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [resp,setResp]=useState<any>(null);
  const user = status.user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'superadmin');

  async function load(){
    if(!id) return;
    const { status, body } = await getJSON(`/api/alumni/${id}`);
    setResp({ status, body });
    setData(body?.alumnus || null);
  }

  async function save(){
    if(!id || !data) return;
    setSaving(true); setError('');
    const payload = { ...data };
    const { status, body } = await putJSON(`/api/alumni/${id}`, payload);
    setResp({ status, body });
  if(status===200){ setData(body.alumnus); setEdit(false); push('Alumnus updated','success'); }
    else setError((body && (body.error||body.details)) || 'Update failed');
    setSaving(false);
  }

  useEffect(()=>{ if(status.authenticated) load(); },[id, status.authenticated]);

  function field<K extends keyof Alumnus>(k:K,label?:string,type='text'){
    if(!data) return null;
    return (
      <label className="block text-sm mb-3" key={k}>
        <span className="opacity-80 block mb-1">{label||k}</span>
        <input disabled={!edit} value={(data[k] as any)??''} onChange={e=> setData(d=> d? ({...d,[k]: type==='number'? (e.target.value? Number(e.target.value): undefined): e.target.value }) : d)} type={type} className="w-full border rounded px-3 py-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 disabled:opacity-60" />
      </label>
    );
  }

  if(!status.loaded){
    return <div className="max-w-4xl mx-auto px-4 py-8 flex items-center gap-3"><Spinner /><p className="text-sm opacity-70">Loading session…</p></div>;
  }
  if(!status.authenticated){
    return <div className="max-w-4xl mx-auto px-4 py-8"><Link href="/alumni" className="text-sm underline">← Directory</Link><p className="mt-6 text-sm opacity-70">Sign in required.</p></div>;
  }
  if(!data) return <div className="max-w-4xl mx-auto px-4 py-8"><Link href="/alumni" className="text-sm underline">← Directory</Link><p className="mt-6 text-sm opacity-70">Loading alumnus…</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/alumni">← Directory</Link>
        {isAdmin && !edit && <button onClick={()=>setEdit(true)} className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600">Edit</button>}
        {isAdmin && edit && (
          <div className="flex gap-2">
            <button disabled={saving} onClick={save} className="btn bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 disabled:opacity-50">{saving? 'Saving...':'Save'}</button>
            <button disabled={saving} onClick={()=>{ setEdit(false); load(); }} className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50">Cancel</button>
          </div>
        )}
      </header>

      <h1 className="text-2xl font-semibold mb-6">{data.name || 'Alumnus'} <span className="text-sm opacity-60">#{data.id}</span></h1>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {field('name','Name')}
        {field('email','Email')}
        {field('role','Role')}
        {field('graduation_year','Graduation Year','number')}
        {field('degree','Degree')}
        {field('department','Department')}
        {field('company','Company')}
        {field('position','Position')}
        {field('location','Location')}
        {field('linkedin','LinkedIn URL')}
        {field('skills','Skills')}
      </div>
      <div className="mb-6">
        <label className="block text-sm mb-2 opacity-80">Bio</label>
        <textarea disabled={!edit} value={data.bio||''} onChange={e=> setData(d=> d? {...d,bio:e.target.value}: d)} className="w-full min-h-[120px] border rounded px-3 py-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 disabled:opacity-60" />
      </div>
      {data.updated_at && <p className="text-xs opacity-60 mb-4">Updated: {new Date(data.updated_at).toLocaleString()}</p>}
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {debugEnabled() && (
        <section className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6 mt-8">
          <h2 className="text-lg font-semibold mb-3">Raw (Debug)</h2>
            <pre className="bg-black dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 rounded overflow-auto max-h-64">{JSON.stringify(data,null,2)}</pre>
            <h3 className="text-sm font-semibold mt-4 mb-2">Last Response</h3>
            <pre className="bg-black dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 rounded overflow-auto max-h-64">{JSON.stringify(resp,null,2)}</pre>
        </section>
      )}
    </div>
  );
}
