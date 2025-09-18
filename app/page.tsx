import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-900 shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Alumni Platform</h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/auth">Auth</Link>
            <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/profile">Profile</Link>
            <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/events">Events</Link>
            <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/mentorship">Mentorship</Link>
            <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/donations">Donations</Link>
            <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/alumni">Alumni</Link>
            <Link className="link hover:text-blue-600 dark:hover:text-blue-400" href="/directory">Public Directory</Link>
          </nav>
        </div>
      </header>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-16 fade-in">
          <h2 className="text-3xl font-semibold">Centralized Alumni Engagement</h2>
          <p className="opacity-90 mt-2 max-w-2xl">Manage alumni profiles, organize events, enable mentorship, and track donations — all in one place.</p>
          <div className="mt-6 flex gap-3">
            <Link id="get_started" href="/auth" className="btn inline-block bg-white text-blue-700 font-medium rounded px-4 py-2 hover:opacity-90 dark:bg-blue-500 dark:text-white">Get Started</Link>
            <Link href="/events" className="btn inline-block border border-white/70 rounded px-4 py-2 hover:bg-white/10">Browse Events</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
// ...existing code...
