"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJSON, postJSON } from '../utils/shared';

interface Item { id: string|number; name?: string; department?: string; graduation_year?: number; company?: string; position?: string; location?: string; linkedin?: string; skills?: string; }

export default function PublicDirectoryPage(){
  const [q,setQ]=useState('');
  const [dept,setDept]=useState('');
  const [year,setYear]=useState('');
  const [sort,setSort]=useState('name');
  const [order,setOrder]=useState('asc');
  const [items,setItems]=useState<Item[]>([]);
  const [page,setPage]=useState(1);
  const [total,setTotal]=useState(0);
  const limit=10;
  const [response,setResponse]=useState<any>(null);

  function buildQuery(p:number){
    const params = new URLSearchParams();
    if(q) params.set('search', q.trim());
    if(dept) params.set('department', dept.trim());
    if(year) params.set('year', year.trim());
    if(sort) params.set('sort', sort);
    if(order) params.set('order', order);
    params.set('page', String(p));
    params.set('limit', String(limit));
    return params.toString();
  }

  async function runSearch(p=1){
    setPage(p);
    const query = buildQuery(p);
    const { status, body } = await getJSON(`/api/alumni/public/list?${query}`);
    setResponse({ status, data: body });
    setItems((body && body.items) || []);
    setTotal((body && body.total) || 0);
  }

  function resetFilters(){ setQ(''); setDept(''); setYear(''); setSort('name'); setOrder('asc'); runSearch(1); }
  function prevPage(){ if(page>1) runSearch(page-1); }
  function nextPage(){ const totalPages = Math.ceil(total/limit)||1; if(page<totalPages) runSearch(page+1); }

  useEffect(()=>{ runSearch(1); },[]);

  const totalPages = Math.max(Math.ceil(total/limit),1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/">← Home</Link>
      </header>
      <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold mb-3">Public Alumni Directory</h2>
        <div className="grid md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm opacity-80">Search name, company, skills</label>
            <input value={q} onChange={e=>setQ(e.target.value)} className="w-full border rounded px-3 py-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900" placeholder="e.g., Jane, Google, React" />
          </div>
          <div>
            <label className="text-sm opacity-80">Department</label>
            <input value={dept} onChange={e=>setDept(e.target.value)} className="w-full border rounded px-3 py-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900" placeholder="CSE" />
          </div>
          <div>
            <label className="text-sm opacity-80">Grad Year</label>
            <input value={year} onChange={e=>setYear(e.target.value)} type="number" className="w-full border rounded px-3 py-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900" placeholder="2023" />
          </div>
          <div>
            <label className="text-sm opacity-80">Sort By</label>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="w-full border rounded px-3 py-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900">
              <option value="name">Name</option>
              <option value="year">Graduation Year</option>
              <option value="department">Department</option>
              <option value="company">Company</option>
              <option value="location">Location</option>
            </select>
          </div>
          <div>
            <label className="text-sm opacity-80">Order</label>
            <select value={order} onChange={e=>setOrder(e.target.value)} className="w-full border rounded px-3 py-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={()=>runSearch(1)} className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600">Search</button>
          <button onClick={resetFilters} className="btn rounded px-3 py-2 border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600">Reset</button>
        </div>
      </section>
      <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-4" id="list">
          {items.length===0 && <p className="text-sm opacity-70">No alumni found. Try different filters.</p>}
          {items.map(a => (
            <div key={a.id} className="card border border-gray-100 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800 block hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{a.name || 'Unknown'}</h3>
                  <p className="text-sm opacity-80">{a.department || ''}{a.graduation_year ? ' • '+a.graduation_year : ''}</p>
                  <p className="text-sm opacity-80">{a.company || ''}{a.position ? ' • '+a.position : ''}</p>
                  <p className="text-xs opacity-60">{a.location || ''}</p>
                </div>
                {a.linkedin && <a target="_blank" className="text-xs opacity-70" href={a.linkedin}>LinkedIn →</a>}
              </div>
              {a.skills && <p className="mt-2 text-xs opacity-70">Skills: {a.skills}</p>}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <button disabled={page<=1} onClick={prevPage} className={`btn rounded px-3 py-2 border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 ${page<=1?'opacity-50 cursor-not-allowed':''}`}>Prev</button>
          <div className="text-sm opacity-80">Page {page} of {totalPages}</div>
          <button disabled={page>=totalPages} onClick={nextPage} className={`btn rounded px-3 py-2 border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 ${page>=totalPages?'opacity-50 cursor-not-allowed':''}`}>Next</button>
        </div>
      </section>
      <section className="card bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 mt-6">
        <h2 className="text-lg font-semibold mb-3">Response</h2>
        <pre className="bg-black dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 rounded overflow-auto h-64">{JSON.stringify(response,null,2)}</pre>
      </section>
    </div>
  );
}
