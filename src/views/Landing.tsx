// Sanchalan landing — structured like an all-in-one event platform page,
// powered by Sanchalan's real capabilities.

import { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import { NavLink } from '../lib/nav';
import { supabase, supabaseConfigured } from '../lib/supabase';

/* ---------- Hooks ---------- */
function useLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(Boolean(data.session?.user));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(Boolean(session?.user));
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return loggedIn;
}

function useTypewriter(phrases: string[], speed = 55, pause = 2400) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let pi = 0, ci = 0, timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const phrase = phrases[pi];
      if (!done) {
        ci++;
        setText(phrase.slice(0, ci));
        if (ci >= phrase.length) { setDone(true); timer = setTimeout(tick, pause); return; }
        timer = setTimeout(tick, speed + Math.random() * 40);
      } else {
        setDone(false); setText(''); ci = 0; pi = (pi + 1) % phrases.length;
        timer = setTimeout(tick, 700);
      }
    };
    timer = setTimeout(tick, 1400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);
  return { text, done };
}

/* ---------- Product mockup ---------- */
function DashboardMock() {
  const { text, done } = useTypewriter([
    'Move the keynote to the Auditorium…',
    'What if 500 people show up?…',
    'Reassign volunteers for Hall B…',
  ]);
  return (
    <div className="mockup-float overflow-hidden rounded-xl border border-gray-800 bg-[#0d0d0f] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.5)]">
      <div className="relative flex items-center gap-1.5 overflow-hidden border-b border-gray-800 bg-[#141416] px-4 py-3">
        <div className="sweep-bar absolute inset-y-0 w-1/3 bg-white/[0.04] blur-md" />
        <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
        <div className="ml-3 rounded-md bg-[#1e1e21] px-3 py-1 text-[11px] text-gray-500 ring-1 ring-gray-800">sanchalan.app/app</div>
      </div>
      <div className="flex text-left">
        <div className="hidden w-44 shrink-0 border-r border-gray-800/60 bg-[#101012] p-3 sm:block">
          <div className="mb-3 flex items-center gap-2 px-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <div className="h-2 w-2 rounded-full border border-gray-900" />
            </div>
            <div className="h-2 w-20 rounded bg-gray-700" />
          </div>
          {['Overview', 'Changes', 'Inbox', 'Risks', 'Impact'].map((x, i) => (
            <div key={x} className={`mb-1 rounded-lg px-2.5 py-2 text-[11.5px] font-medium ${i === 1 ? 'bg-white text-gray-900' : 'text-gray-500'}`}>{x}</div>
          ))}
          <div className="mt-4 rounded-lg bg-amber-500/10 p-2.5 ring-1 ring-amber-500/20">
            <div className="text-[10px] font-semibold text-amber-400">1 P0 risk open</div>
            <div className="mt-0.5 text-[10px] text-amber-500/80">Capacity overflow</div>
          </div>
        </div>
        <div className="flex-1 p-5">
          <div className="mb-4 rounded-lg border border-gray-800 bg-[#141416] px-3.5 py-2.5">
            <span className="text-[12.5px] text-gray-300">{text}</span>
            <span className="typing-caret ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] bg-white" />
          </div>
          <div className={`transition-all duration-700 ${done ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-1'}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[15px] font-bold text-white">Move Keynote to Auditorium</div>
                <div className="mt-1 text-[12px] text-gray-500">Blast radius computed · 8 records affected</div>
              </div>
              <div className="p0-pulse rounded-md bg-amber-500/15 px-2 py-1 text-[10px] font-bold text-amber-400 ring-1 ring-amber-500/20">P0</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[['2', 'sessions'], ['4', 'tasks'], ['3', 'volunteers']].map(([n, l]) => (
                <div key={l} className="rounded-lg border border-gray-800 bg-[#141416] p-3">
                  <div className="text-[20px] font-bold tabular-nums text-white">{n}</div>
                  <div className="text-[10.5px] text-gray-500">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] p-3">
              <div className="text-[11px] font-semibold text-amber-300">Capacity risk</div>
              <div className="mt-0.5 text-[11px] leading-relaxed text-amber-200/70">Auditorium holds 300 · 200 expected + 80 waitlist = 280. Tight but feasible.</div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="rounded-lg bg-white px-4 py-2 text-[12px] font-semibold text-gray-900">Approve & apply</div>
              <div className="rounded-lg border border-gray-700 px-4 py-2 text-[12px] font-medium text-gray-400">Discard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Numbered capability section ---------- */
function Stage({ n, title, bullets, children }: { n: string; title: string; bullets: string[]; children: React.ReactNode }) {
  return (
    <div className="grid items-start gap-10 py-16 md:grid-cols-2 md:gap-16">
      <div>
        <div className="text-[13px] font-bold tabular-nums text-gray-300">{n}</div>
        <h3 className="mt-3 text-[30px] font-bold leading-[1.12] tracking-tight">{title}</h3>
        <ul className="mt-6 space-y-4">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[15px] leading-[1.65] text-gray-500">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#fafafa] p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.18)] md:p-8">
        {children}
      </div>
    </div>
  );
}

/* ---------- Mini visuals ---------- */
function ChangeVisual() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13.5px] font-medium text-gray-800 shadow-sm">
        “Move all sessions from Main Audi to Outdoor Plaza”
      </div>
      <div className="flex items-center gap-2 pl-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">Parsed</span>
        <span>→</span>
        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700">Simulated</span>
        <span>→</span>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-gray-600">Awaiting approval</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {[['2', 'sessions move'], ['3', 'tasks rewritten'], ['5', 'volunteers flagged']].map(([n, l]) => (
          <div key={l} className="rounded-xl border border-gray-200 bg-white p-3.5 text-center shadow-sm">
            <div className="text-[22px] font-bold tabular-nums">{n}</div>
            <div className="mt-0.5 text-[11px] text-gray-500">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabasesVisual() {
  const dbs = ['Events', 'Venues', 'Sessions', 'Speakers', 'Attendees', 'Volunteers', 'Tasks', 'Sponsors', 'Risks', 'Comms Log', 'Impact Reports'];
  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-[15px]">🗂️</div>
        <div className="text-[14px] font-semibold">Your Notion workspace</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {dbs.map((d) => (
          <span key={d} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-gray-700 shadow-sm">{d}</span>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] leading-relaxed text-gray-500">Read and written through the official Notion API. Unplug Sanchalan and everything is exactly where you left it.</p>
    </div>
  );
}

function RisksVisual() {
  return (
    <div className="space-y-3">
      {[
        { sev: 'P0', color: 'red', t: 'Capacity overflow', b: 'Seminar Hall B holds 120 · 200 expected. This will not fit.' },
        { sev: 'P1', color: 'amber', t: 'Volunteer shift conflict', b: '“Delay everything by 4 hours” pushes 6 morning-shift volunteers outside their window.' },
        { sev: 'P2', color: 'sky', t: 'Stale task reference', b: '4 tasks still name “Main Audi” after the venue move — flagged for rewrite.' },
      ].map((r) => (
        <div key={r.t} className={`rounded-xl border bg-white p-4 shadow-sm ${r.color === 'red' ? 'border-red-200' : r.color === 'amber' ? 'border-amber-200' : 'border-sky-200'}`}>
          <div className="flex items-center gap-2.5">
            <span className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-bold ${r.color === 'red' ? 'bg-red-100 text-red-700' : r.color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>{r.sev}</span>
            <span className="text-[13.5px] font-semibold">{r.t}</span>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-500">{r.b}</p>
        </div>
      ))}
    </div>
  );
}

function ApprovalVisual() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
        {['Analyze', 'Review', 'Approve', 'Execute', 'Audit'].map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-1 ${i < 2 ? 'bg-gray-900 text-white' : i === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</span>
            {i < 4 && <span className="text-gray-300">→</span>}
          </span>
        ))}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-[13px] font-semibold">Move Keynote → Auditorium</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-md bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">🤖 AI-generated</span>
          <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200">✅ Verified</span>
        </div>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-gray-500">Every write carries a provenance badge, so you can see exactly what the AI touched. Changed your mind? Undo anytime.</p>
      </div>
    </div>
  );
}

function AskVisual() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13.5px] font-medium text-gray-800 shadow-sm">
        “What is blocking the keynote?”
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-[13px] leading-relaxed text-gray-700">The keynote stage is blocked by <span className="font-semibold">one P0 task</span> — projector rigging in Seminar Hall B is still “In progress”.</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-medium">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">tasks/…rigging</span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">sessions/…keynote</span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">venues/…seminar-hall-b</span>
        </div>
      </div>
      <div className="flex gap-2.5">
        {['Ops lead', 'Volunteer lead', 'Leadership'].map((r) => (
          <span key={r} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-600 shadow-sm">{r}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- FAQ ---------- */
const FAQS: [string, string][] = [
  ['What is Sanchalan?', 'Sanchalan is the operational layer for events that live in Notion. You describe a change in plain English — “move the keynote to the Auditorium” — and Sanchalan parses it, simulates the blast radius, surfaces every risk, and applies it to your Notion databases once you approve.'],
  ['How is Sanchalan different from event management software?', 'Traditional event software wants to own your data and your workflow. Sanchalan doesn’t. Notion stays the system of record; Sanchalan is the command layer on top — it analyzes, simulates, and executes changes while keeping a human in the loop.'],
  ['Do I need a Notion token to try it?', 'No. Without a token, Sanchalan runs on a realistic demo dataset (BBSR Founders Meetup #1), clearly bannered DEMO DATA. Add your Notion integration token and it switches to your 11 live databases.'],
  ['What do the AI-generated and Verified badges mean?', 'Every record the AI touches carries a 🤖 AI-generated badge (amber); records a human has reviewed get ✅ Verified (green). You can always see exactly what the AI did — and undo it.'],
  ['Can I undo a change?', 'Yes. Applied changes can be undone in one click, and pending changes can be deleted before they ever touch Notion. The full audit trail stays in the Impact Reports database.'],
  ['What counts as a “blast radius”?', 'Everything one change can touch: venue moves, capacity overflow, volunteer shift conflicts, stale task references, comms that need rewriting. Sanchalan computes it with a pure dependency engine before anything is written.'],
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
        <span className="text-[15.5px] font-semibold tracking-tight">{q}</span>
        <span className={`text-[20px] text-gray-400 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="pb-6 pr-10 text-[14.5px] leading-[1.7] text-gray-500">{a}</p>}
    </div>
  );
}

/* ---------- Landing ---------- */
export default function Landing() {
  const loggedIn = useLoggedIn();
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased selection:bg-gray-900 selection:text-white">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-gray-100/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <NavLink to="/" className="flex items-center gap-2.5">
            <Logo size={30} />
            <span className="text-[16.5px] font-bold tracking-tight">Sanchalan</span>
          </NavLink>
          <div className="hidden items-center gap-8 md:flex">
            {[['Features', '/features'], ['Pricing', '/pricing'], ['About', '/about'], ['FAQ', '/faq']].map(([l, h]) => (
              <NavLink key={h} to={h} className="text-[13.5px] font-medium text-gray-500 transition-colors hover:text-gray-900">{l}</NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            {loggedIn ? (
              <NavLink to="/app" className="rounded-lg bg-gray-900 px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:bg-gray-800">Open app →</NavLink>
            ) : (
              <>
                <NavLink to="/app" className="rounded-lg px-4 py-2 text-[13.5px] font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">Sign in</NavLink>
                <NavLink to="/app" className="rounded-lg bg-gray-900 px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:bg-gray-800">Get started</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero — dark */}
      <section className="bg-[#0a0a0b] px-6 pb-24 pt-40">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="hero-anim hero-d1 text-[12px] font-bold uppercase tracking-[0.18em] text-gray-500">All-in-one event operations software</div>
            <h1 className="hero-anim hero-d2 mt-5 text-[48px] font-bold leading-[1.02] tracking-[-0.025em] text-white md:text-[72px]">
              Plan, run, and adapt<br />
              <span className="text-gray-500">your event — in plain English.</span>
            </h1>
            <p className="hero-anim hero-d3 mx-auto mt-7 max-w-xl text-[17.5px] leading-[1.65] text-gray-400">
              Describe the change. See the blast radius. Approve with confidence.
              Sanchalan is the command layer for events that live in Notion.
            </p>
            <div className="hero-anim hero-d4 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <NavLink to="/app" className="w-full rounded-xl bg-white px-8 py-3.5 text-[15px] font-semibold text-gray-900 transition-all hover:bg-gray-100 sm:w-auto">
                Start free
              </NavLink>
              <a href="#stages" className="w-full rounded-xl border border-gray-800 bg-transparent px-8 py-3.5 text-[15px] font-semibold text-gray-300 transition-all hover:border-gray-700 hover:text-white sm:w-auto">
                See how it works
              </a>
            </div>
            <p className="hero-anim hero-d5 mt-5 text-[12.5px] text-gray-600">Free during beta · No credit card · Your data stays in Notion</p>
          </div>
          <div className="hero-anim hero-d6 mx-auto mt-16 max-w-4xl">
            <DashboardMock />
          </div>
        </div>
      </section>

      {/* Stages 01–05 */}
      <section id="stages" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
        <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-gray-400">Command center</div>
        <h2 className="mt-3 max-w-xl text-[36px] font-bold leading-[1.1] tracking-tight">Plan, run, and analyze your event.</h2>
        <div className="mt-4 divide-y divide-gray-200">
          <Stage n="01" title="Ops changes, at every stage" bullets={[
            'Describe venue moves, time shifts, and volunteer reassignments in plain English.',
            'Simulate the blast radius — sessions, capacity, tasks, volunteers — before anything touches Notion.',
            'Apply exactly what you approve. Nothing more.',
          ]}><ChangeVisual /></Stage>
          <Stage n="02" title="Notion stays the system of record" bullets={[
            'All 11 databases sync through the official Notion API — events, venues, sessions, speakers, attendees, volunteers, tasks, sponsors, risks, comms, and impact reports.',
            'Your workspace is the database. Sanchalan never holds your data hostage.',
            'Run a full demo without a token — demo data is clearly bannered.',
          ]}><DatabasesVisual /></Stage>
          <Stage n="03" title="Catch the risk before it costs you" bullets={[
            'P0 capacity overflow — sessions that physically won’t fit the new venue.',
            'P1 shift conflicts — volunteers pushed outside their availability window.',
            'P2 stale references — tasks still naming the venue you just left.',
          ]}><RisksVisual /></Stage>
          <Stage n="04" title="Nothing moves without your approval" bullets={[
            'Analyze → review → approve → execute → audit. A pipeline built for humans in the loop.',
            'Provenance badges on every record: 🤖 AI-generated vs ✅ Verified.',
            'Changed your mind? One-click undo rolls applied changes back.',
          ]}><ApprovalVisual /></Stage>
          <Stage n="05" title="Smarter decisions. Greater impact." bullets={[
            'Ask in plain English — answers cite the exact sessions, tasks, and venues behind them.',
            'Impact reports are filed automatically after every change.',
            'Role dashboards for the whole control room: Ops lead, Volunteer lead, Leadership.',
          ]}><AskVisual /></Stage>
        </div>
      </section>

      {/* Stats band — dark */}
      <section className="bg-[#0a0a0b] px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
          {[
            ['11', 'Notion databases, one source of truth'],
            ['P0–P3', 'risk severity levels on every change'],
            ['100%', 'of writes wait for your approval'],
            ['1-click', 'undo on every applied change'],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-[42px] font-bold tabular-nums tracking-tight text-white">{n}</div>
              <div className="mt-2 text-[13.5px] leading-snug text-gray-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Built to make your event */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-gray-400">Built to make your event</div>
        <h2 className="mt-3 max-w-xl text-[36px] font-bold leading-[1.1] tracking-tight">Fast track to the finish line.</h2>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {[
            { t: 'Command it in plain English', b: 'Type “Delay everything by 4 hours” or “Reassign volunteers for Hall B”. Sanchalan parses natural language into a structured change — no forms, no training.', icon: '⌨️' },
            { t: 'Simulate before you commit', b: 'Run what-if scenarios and see every downstream effect first. Like the answer? Convert the simulation straight into a change.', icon: '🧪' },
            { t: 'Comms that write themselves', b: 'Venue moved? WhatsApp drafts for every affected volunteer and attendee are created automatically — ready for your review.', icon: '💬' },
            { t: 'Find anything instantly', b: 'A ⌘K command palette and global search across all 11 databases. No more hunting through pages on event day.', icon: '🔍' },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-[0_16px_48px_-24px_rgba(0,0,0,0.18)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-[22px]">{c.icon}</div>
              <div className="mt-5 text-[19px] font-semibold tracking-tight">{c.t}</div>
              <p className="mt-2.5 text-[14.5px] leading-[1.7] text-gray-500">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles — light */}
      <section className="border-y border-gray-200 bg-[#fafafa] px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-gray-400">For every seat in the control room</div>
            <h2 className="mx-auto mt-3 max-w-xl text-[36px] font-bold leading-[1.1] tracking-tight">One event. Three views.</h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:grid-cols-3">
            {[
              { t: 'Ops leads', b: 'The command console. Blast radius, approvals, audit trail — everything a change touches, in one place.' },
              { t: 'Volunteer leads', b: 'Tasks and shifts. Reconfirmation tasks are auto-created, shift conflicts surfaced before anyone complains.' },
              { t: 'Leadership', b: 'Impact reports and the risk overview. What changed, what it cost, what could go wrong — without asking anyone.' },
            ].map((r) => (
              <div key={r.t} className="bg-white p-8">
                <div className="text-[19px] font-semibold tracking-tight">{r.t}</div>
                <p className="mt-2.5 text-[14px] leading-[1.7] text-gray-500">{r.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-gray-400">Security by design. Privacy by default.</div>
          <h2 className="mt-3 text-[36px] font-bold leading-[1.1] tracking-tight">Your data stays in Notion.</h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-gray-500">
            Sanchalan reads and writes through the official Notion API — no ad trackers, no data mining, no copies of your event living on someone else’s server. Try it on clearly-labeled demo data first; connect your workspace when you’re ready.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 bg-[#fafafa] px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[36px] font-bold leading-[1.1] tracking-tight">Frequently asked questions</h2>
          <div className="mt-8 border-t border-gray-200">
            {FAQS.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* Final CTA — dark */}
      <section className="bg-[#0a0a0b] px-6 py-28 text-center">
        <h2 className="mx-auto max-w-xl text-[38px] font-bold leading-[1.08] tracking-tight text-white">Stop running your event on hope and spreadsheets.</h2>
        <p className="mx-auto mt-5 max-w-md text-[16px] text-gray-400">Connect Notion. Describe the change. Approve with confidence.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NavLink to="/app" className="rounded-xl bg-white px-8 py-3.5 text-[15px] font-semibold text-gray-900 transition-all hover:bg-gray-100">{loggedIn ? 'Open your app →' : 'Get started free'}</NavLink>
          <NavLink to="/pricing" className="rounded-xl border border-gray-800 px-8 py-3.5 text-[15px] font-semibold text-gray-300 transition-all hover:border-gray-700 hover:text-white">View pricing</NavLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-6 pb-10 pt-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo size={26} />
              <span className="text-[15px] font-bold tracking-tight">Sanchalan</span>
            </div>
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-gray-500">The operational layer for events running on Notion. Analyze, approve, execute — with a human in the loop.</p>
          </div>
          {[
            ['Product', [['Features', '/features'], ['Pricing', '/pricing'], ['Changelog', '/changelog'], ['Open app', '/app']]],
            ['Company', [['About', '/about'], ['Contact', '/contact'], ['FAQ', '/faq']]],
            ['Legal', [['Privacy', '/privacy'], ['Terms', '/terms']]],
          ].map(([h, links]) => (
            <div key={h as string}>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">{h}</div>
              <div className="mt-4 space-y-2.5">
                {(links as [string, string][]).map(([l, href]) => (
                  <NavLink key={href} to={href} className="block text-[13.5px] text-gray-500 transition-colors hover:text-gray-900">{l}</NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-gray-100 pt-6 text-center text-[12px] text-gray-400">
          Built for Kaun Banega Codepati 2026 (KBC-NOTION-03) · Team larpers
        </div>
      </footer>
    </div>
  );
}
