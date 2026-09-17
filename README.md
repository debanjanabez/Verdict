# VERDICT

### Research. Compare. Decide.

VERDICT is an AI-powered comparison platform designed to help people make better-informed decisions.

Instead of relying on scattered searches, reviews, and comparison websites, VERDICT brings the research process into one place. Users can enter multiple options, specify what matters to them, add personal context, and receive an AI-generated comparison based on current web research.


## ✨ WHAT VEDICT DOES:

VERDICT allows users to:

- Compare multiple options side by side
- Add up to 8 options to a comparison
- Define personal priorities such as:
  - Price
  - Performance
  - Quality
  - Features
  - Reviews
  - Durability
  - Battery
  - Portability
- Add custom comparison criteria
- Provide additional personal context
- Use AI to research options using current web information
- Generate an AI-powered comparison and verdict

The goal is simple:
 **Research less. Understand more. Decide with confidence.**


## HOW IT WORKS

```text
User enters options
        ↓
User selects priorities
        ↓
User adds personal context
        ↓
VERDICT sends the comparison to the AI
        ↓
AI researches the web
        ↓
Relevant information is analyzed
        ↓
Options are compared according to user priorities
        ↓
VERDICT generates the result

## CURRENT FEATURES

- **Multi-option comparison** — Compare 2–8 options in a single decision.
- **Personalized priorities** — Choose factors such as price, performance, quality, battery, or add your own.
- **Personal context** — Tell VERDICT about your situation so the research can be tailored to your needs.
- **AI-powered web research** — Research options using current information from the web.
- **AI-generated verdict** — Get a structured comparison covering key differences, trade-offs, and a final verdict.
- **Source-backed research** — View the sources used during the research process.

## PROJECT STRUCTURE
verdict/
│
├── app/
│   ├── api/
│   │   └── research/
│   │       └── route.ts
│   │
│   ├── compare/
│   │   ├── page.tsx
│   │   └── results/
│   │       └── page.tsx
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── public/
│
├── .env.local
├── .gitignore
├── package.json
├── next.config.ts
└── README.md