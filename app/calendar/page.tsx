"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

function buildCalendarSrc(id: string, mode: string, tz: string){
  if (!id) return '';
  const base = 'https://calendar.google.com/calendar/embed';
  const params = new URLSearchParams();
  params.set('src', id);
  params.set('ctz', tz);
  if (mode === 'AGENDA') params.set('mode', 'AGENDA');
  if (mode === 'WEEK') params.set('mode', 'WEEK');
  params.set('showPrint','0');
  params.set('showTabs','1');
  params.set('showCalendars','0');
  params.set('wkst','1');
  return `${base}?${params.toString()}`;
}

export default function CalendarPage(){
  const [calendarId, setCalendarId] = useState('');
  const [inputId, setInputId] = useState('');
  const [mode, setMode] = useState('MONTH');
  const [tz, setTz] = useState('UTC');

  useEffect(() => {
    const tzGuess = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    setTz(tzGuess);
    const saved = localStorage.getItem('gcal_id') || '';
    if (saved) { setCalendarId(saved); setInputId(saved); }
  }, []);

  function loadCalendar(){
    if (!inputId.trim()) return;
    localStorage.setItem('gcal_id', inputId.trim());
    setCalendarId(inputId.trim());
  }

  const src = buildCalendarSrc(calendarId, mode, tz);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="link hover:text-blue-600 dark:hover:text-blue-400">← Home</Link>
        {calendarId && (
          <div className="flex items-center gap-2 text-sm" id="modeTabs">
            {['MONTH','WEEK','AGENDA'].map(m => (
              <button key={m} onClick={()=>setMode(m)} className={`px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${mode===m?'bg-blue-600 text-white':''}`}>{m.charAt(0)+m.slice(1).toLowerCase()}</button>
            ))}
          </div>
        )}
      </header>
      {!calendarId && (
        <div className="p-6 space-y-3 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-sm">
            <p className="mb-2">Google Calendar ID not configured. Paste your calendar ID below:</p>
            <ul className="list-disc list-inside opacity-80">
              <li>Calendar settings → Integrate calendar → Calendar ID</li>
              <li>Example: <code>your_calendar_id@group.calendar.google.com</code></li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <input value={inputId} onChange={e=>setInputId(e.target.value)} className="flex-1 border rounded px-3 py-2 border-gray-300 dark:border-gray-700 dark:bg-gray-800" placeholder="calendar_id@group.calendar.google.com" />
            <button onClick={loadCalendar} className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700">Load</button>
          </div>
        </div>
      )}
      {calendarId && (
        <div className="rounded border border-gray-200 dark:border-gray-700 overflow-hidden" style={{height:'80vh'}}>
          <iframe title="calendar" src={src} className="w-full h-full" frameBorder={0} scrolling="no" />
        </div>
      )}
    </div>
  );
}
