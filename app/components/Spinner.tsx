"use client";
export function Spinner({ size=20 }: { size?: number }) {
  const s = size + 'px';
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em] text-indigo-600"
      style={{ width: s, height: s }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </span>
  );
}
