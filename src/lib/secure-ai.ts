// Approved content from Secure AI Handoff v3 and its visual reference.
export const INDUSTRIES = {
  general_office:{
    safe:'With company accounts, drafts stay under your control instead of a personal free login.',
    items:[
      ['Client email drafts','Turn rough notes into a clear, polite reply ready for your review.'],
      ['Meeting notes → action list','Summarize a call and pull next steps for the team.'],
      ['Proposal first drafts','Build a starting outline from a short brief.'],
      ['SOP / how-we-do-it docs','Capture a process so new hires don’t reinvent it.'],
      ['Follow-up reminders','Draft polite check-ins after quotes or meetings.']
    ]
  },
  law:{
    safe:'Confidential matter data belongs only in approved company AI accounts, with human review on every client-facing work product.',
    items:[
      ['Engagement letter first draft','A starting draft for attorney review (not a substitute for counsel).'],
      ['Long document / contract summary','Highlight key clauses and open questions for the attorney.'],
      ['Client update emails','Clear status notes from matter notes, reviewed before send.'],
      ['Research briefing','Organize public research into a short internal brief.'],
      ['Deposition / meeting outline','Structure questions or topics from your notes.']
    ]
  },
  cpa:{
    safe:'Client financials stay in company accounts; partners review before anything goes out.',
    items:[
      ['Client tax checklist','A personalized “what we need from you” list for the season.'],
      ['Engagement letter draft','First pass for partner review.'],
      ['Financial summary in plain English','Explain a statement for a client conversation.'],
      ['Email replies on routine questions','Draft answers for common client asks.'],
      ['Workpaper narrative','Turn bullet notes into a clear memo for the file.']
    ]
  },
  retail:{
    safe:'Keep customer and inventory details in company AI accounts instead of personal free tools.',
    items:[
      ['Product descriptions','Consistent copy from specs and features.'],
      ['Social post drafts','Week’s posts from a short promo brief.'],
      ['Customer FAQ replies','Friendly answers to common questions.'],
      ['Shift / store update notes','Clear internal notes for the team.'],
      ['Supplier follow-ups','Polite chase emails on orders and deliveries.']
    ]
  },
  manufacturing:{
    safe:'Keep process and safety content in company accounts your team controls.',
    items:[
      ['SOP / work instructions','Clear steps from a supervisor’s outline.'],
      ['Safety training summaries','Short refreshers from longer materials.'],
      ['Quote follow-ups','Drafts after a bid goes out.'],
      ['Incident report first draft','Structured write-up from field notes.'],
      ['Vendor / RFQ emails','Clear requests for pricing or lead times.']
    ]
  }
} satisfies Record<string, { safe: string; items: string[][] }>;

export const QUESTIONS = [
  {q:'Are your staff using AI tools for work today?',opts:[
    {label:'Yes, regularly',pts:2},
    {label:'Sometimes, or I’m not sure',pts:1},
    {label:'No, not yet',pts:0}
  ]},
  {q:'Do you have a written AI use policy that staff have seen?',opts:[
    {label:'No',pts:2},
    {label:'We’re drafting one, or I’m not sure',pts:1},
    {label:'Yes, staff have seen it',pts:0}
  ]},
  {q:'Has your company chosen one approved AI tool for work?',opts:[
    {label:'No, people use whatever they like (or nothing yet)',pts:2},
    {label:'Informal preference, nothing official',pts:1},
    {label:'Yes, one approved tool',pts:0}
  ]},
  {q:'Do staff know which data is off-limits for AI (client info, financials, health records)?',opts:[
    {label:'No clear guidance',pts:2},
    {label:'Some people know, but not everyone',pts:1},
    {label:'Yes, we’ve made it clear',pts:0}
  ]},
  {q:'Where does busywork eat the most time?',scored:false,opts:[
    {label:'Emails and client messages',focus:'email'},
    {label:'Documents, reports, and proposals',focus:'docs'},
    {label:'Admin, scheduling, and follow-ups',focus:'admin'},
    {label:'A mix of all three',focus:'mix'}
  ]}
] satisfies { q: string; scored?: boolean; opts: { label: string; pts?: number; focus?: string }[] }[];

export const FOCUS = {
  email:'Start with email drafts and meeting summaries to simplify frequent tasks.',
  docs:'Start with document first drafts and summaries for proposals, SOPs, and long reads.',
  admin:'Start with admin checklists and follow-ups that quietly eat into the week.',
  mix:'Start with a mix: one email workflow and one document workflow your team repeats every week.'
};

export const RESULTS = {
  ready:{cls:'band-ready',band:'Ready to start safely',title:"You're in good shape to turn AI into hours back",lead:'You’ve got some structure, or you’re starting before habits get messy. A short Assessment can confirm gaps and pick a first time-saving workflow.',sec:'Keep one approved tool and company accounts as the default.'},
  gaps:{cls:'band-gaps',band:'A few gaps to close',title:'Close a few gaps, then get the time savings',lead:'Personal accounts, unclear rules, or no approved tool can slow you down. Fix those first, then train the team on the busywork that eats their day.',sec:'Pick one approved AI tool and write a short policy on what’s off-limits.'},
  guardrails:{cls:'band-guard',band:"Let's set up guardrails first",title:'Start with guardrails, then add the time-savers',lead:'Whether staff already use AI or you’re just curious, clear rules and one approved tool come first. Then we help the team get hours back on real work.',sec:'Begin with the read-only Assessment so we can map gaps without changing your systems.'}
};

export const secureAiFaqs = [
  [
    "Do we have to stop using AI?",
    "No. Banning AI rarely sticks. Staff often keep using personal tools anyway. The practical path is one approved tool, clear rules, and training so people can use AI safely and get time back."
  ],
  [
    "Do we have to replace our IT provider?",
    "No. We work alongside your current IT company or in-house tech. We focus on AI security, setup, and training; they keep running your systems. We coordinate and document what we set up."
  ],
  [
    "Is AI actually safe for client data?",
    "It can be when you use company accounts, an approved tool, and clear rules about what data is off-limits. That’s what Guardrails and Secure Enable are for. The Assessment is read-only and shows where you stand today."
  ],
  [
    "Which AI tool should we use: ChatGPT, Copilot, or Gemini?",
    "We’re vendor-neutral. You choose. We don’t sell licenses or push a brand. We secure the tool you pick, set it up, and train your team. Licenses are billed separately at the provider’s price."
  ],
  [
    "What happens during the Assessment?",
    "The AI Security & Readiness Assessment is read-only. We don’t change your systems. We identify which AI tools your staff already use and where company data may be at risk. You receive a written scorecard and a live readout with the owner. If you continue with a plan afterward, the Assessment fee is credited toward that plan."
  ],
  [
    "What does it cost?",
    "Every business is different, so we don't list prices on this page. Give us a quick call or book a short intro, and we'll walk through options that fit your team. The Assessment fee is credited toward a plan if you continue."
  ],
  [
    "Will AI replace my employees?",
    "No. Done right, AI takes busywork off their plate with drafts, summaries, and checklists, so people can spend more time on clients, quality, and the work only they can do. Your team stays in charge; AI supports them."
  ],
  [
    "How long until we see results?",
    "We don’t invent timelines. After the Assessment, Guardrails puts an approved tool and policy in place. Secure Enable adds company accounts, live training, and 2-3 saved workflows per role. That’s when most teams start feeling day-to-day time savings. Growth Partner adds ongoing check-ins and deeper workflows each quarter."
  ]
];

export type ResultBand = keyof typeof RESULTS;
export type Industry = keyof typeof INDUSTRIES;
export function readinessBand(score: number): ResultBand { return score <= 2 ? "ready" : score <= 5 ? "gaps" : "guardrails"; }
