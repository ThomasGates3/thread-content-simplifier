
import React from 'react';

export const TEMPLATES = [
  { id: 'QUICK_TIP', label: 'Quick Win / Hack', description: 'Actionable "Cheat Codes" (Type 1)' },
  { id: 'EDUCATIONAL_THREAD', label: 'Before/After', description: 'Transformation & Contrast (Type 2)' },
  { id: 'OPINION_ANALYSIS', label: 'Hot Take', description: 'Controversial & Bold (Type 3)' },
  { id: 'NEWS_HOOK', label: 'Curiosity Hook', description: 'News & "I tested this..." openers' },
];

export const Icons = {
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  ),
  Threads: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.07 15.65c.67-.32.93-.84.93-1.39 0-.96-.77-1.42-2.14-1.42-1.34 0-2.43.34-3.47 1.12.92-1.63 2.19-2.7 3.79-2.7 1.13 0 1.96.38 2.44 1.09.28.43.43.95.43 1.55 0 1.07-.46 2.05-1.24 2.76-.69.64-1.63 1.02-2.77 1.02-1.27 0-2.26-.45-2.83-1.29-.36-.54-.53-1.22-.53-2.02 0-1.84 1-3.41 2.87-4.5 1.76-1.04 4.04-1.36 6.55-1.12 1.4.14 2.5.4 3.42.76.11.04.11.22 0 .26-.9.36-1.96.61-3.23.76-2.31.24-4.22-.05-5.74-.84C10.7 9 9.94 10.32 9.94 11.97c0 .64.12 1.16.36 1.51.37.56 1.03.88 1.91.88.94 0 1.63-.3 2.22-.88 1.58-1.57 2.06-4.24 1.17-6.23-.8-1.78-2.61-2.9-4.88-2.9-4.33 0-7.85 3.32-7.85 7.4 0 3.73 2.59 6.84 6.13 7.64.12.03.11.21 0 .23-3.87-.73-6.73-4.13-6.73-8.12 0-4.55 3.84-8.25 8.57-8.25 2.5 0 4.7 1.08 6.17 2.8.94 1.09 1.48 2.45 1.51 3.97.02.77-.12 1.5-.4 2.13-.57 1.34-1.64 2.37-3.03 2.91-.11.04-.11.22 0 .26.96-.34 1.78-.96 2.4-1.8.38-.51.65-1.1.8-1.76.05-.2.27-.24.38-.07l.11.16c.36.56.98 1.42 1.65 1.42.87 0 1.58-.6 2.14-1.79.56-1.2.83-2.88.83-4.78 0-5.7-4.48-10.33-10-10.33S2 6.63 2 12.33c0 5.43 4.14 9.92 9.4 10.31.12.01.12.2 0 .21C5.64 22.47 1.37 17.88 1.37 12.33 1.37 6.27 6.14 1.37 12 1.37s10.63 4.9 10.63 10.96c0 2.16-.32 4.14-.96 5.67-.64 1.53-1.6 2.47-2.8 2.47-1.14 0-1.89-.96-2.18-1.82-.04-.13-.23-.13-.26 0-.27 1.1-.9 1.95-1.78 2.52-.76.49-1.69.75-2.73.75-2.28 0-4.04-1.15-5.18-3.19.14-.1.3-.2.45-.31.06-.05.12-.11.17-.16l.16-.16c-.46.85-1.07 1.4-1.82 1.4s-1.32-.41-1.74-1.22c-.41-.81-.62-2.02-.62-3.62 0-1.92.51-3.6 1.52-5.02 1-1.41 2.41-2.45 4.22-3.1 1.76-.64 3.73-.83 5.91-.56 1.4.17 2.65.51 3.76 1.02.11.05.1.23-.01.27-.85.34-1.83.58-2.95.73-1.81.23-3.48.16-4.99-.21-1.45.62-2.41 1.63-2.87 3.03.77-.38 1.62-.57 2.56-.57.88 0 1.63.18 2.25.54.62.36 1.09.89 1.41 1.59.32.7.48 1.55.48 2.55 0 1.01-.16 1.87-.48 2.57-.32.7-.79 1.23-1.41 1.59s-1.37.54-2.25.54c-1.22 0-2.2-.34-2.94-1.01-.74-.67-1.11-1.65-1.11-2.94 0-1.38.39-2.52 1.16-3.4.77-.88 1.83-1.32 3.16-1.32 1.14 0 2.05.32 2.73.96.68.64 1.02 1.54 1.02 2.7z"/></svg>
  ),
  Clipboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Warning: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  )
};
