
# Cognitive Behavioral Therapy (CBT) Engagement Research Platform  
*A Full-Stack Research Prototype for Studying Engagement in CBT Exercises*

---

## Overview

This project is a **research-oriented web platform** designed to support studies on **engagement in Cognitive Behavioral Therapy (CBT)** exercises. It provides a complete participant-facing flow for guided CBT reflection and a researcher-facing dashboard for reviewing anonymized session data.

The platform was built as a **prototype research system**, inspired by ongoing work in **mental health, human-centered AI, and socially assistive robotics (SARs)**. The primary goal is to demonstrate how structured CBT interactions can be delivered digitally, how engagement signals can be collected, and how the resulting data can be reviewed and analyzed by researchers.

This project is **not a clinical tool** and does not provide treatment. It is intended solely for **research and prototyping purposes**.

---

## Motivation

Mental health challenges among university-age young adults are increasing, while access to traditional therapy remains limited due to cost, availability, stigma, and scalability issues. CBT is a well-established therapeutic approach, but a key challenge is **sustaining engagement** during difficult reflection exercises.

Research labs exploring **socially assistive robots (SARs)** and digital mental health tools need:
- Structured ways to deliver CBT-style exercises
- Low-friction, ethical data collection
- Signals that capture participant engagement
- Researcher-facing tools to review and analyze collected data

This platform addresses those needs by providing:
- A guided CBT reflection experience for participants
- Mandatory, structured input to reduce missing data
- Engagement scoring
- A clean researcher dashboard for reviewing sessions

---

## Key Features

### Participant Experience
- Informed consent flow
- Guided CBT reflection with structured prompts:
  - Situation description
  - Initial reaction
  - Emotions experienced
  - Cognitive reframing
  - Self-reported engagement level
- All fields are required to ensure clean research data
- Review step allowing participants to verify responses
- Ability to begin a new session after completion

### Researcher Dashboard
- Separate researcher-facing view
- Aggregated list of all sessions
- Clear tabular presentation with:
  - Timestamp
  - Engagement score
  - Situation
  - Reaction
  - Emotion
  - Reframe
- Engagement indicators for quick scanning
- Defensive parsing to support evolving data schemas

### Backend & Infrastructure
- Firebase Firestore for session storage
- Anonymous Firebase Authentication for ethical, low-friction participation
- Environment-variable-based configuration for secure deployment
- Deployed as a live demo on Netlify

---

## Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript  
- **Backend:** Firebase Firestore  
- **Authentication:** Firebase Anonymous Auth  
- **Styling:** Custom CSS with a calm, academic UI design  
- **Deployment:** Netlify  
- **Version Control:** GitHub  

---

## Application Architecture

```

src/
├── app/
│   ├── layout.tsx        # Global layout and metadata
│   ├── page.tsx          # Landing page
│   ├── session/
│   │   └── page.tsx      # Participant CBT flow
│   └── research/
│       └── page.tsx      # Researcher dashboard
├── lib/
│   └── firebase.ts       # Firebase initialization

````

- The **participant flow** and **research dashboard** are intentionally separated.
- Firebase logic is centralized to keep components clean.
- Absolute imports (`@/lib/...`) are used for maintainability.

---

## Data Model

Each CBT session stored in Firestore includes:

```json
{
  "thought": "Structured CBT reflection text",
  "engagement": 3,
  "timestamp": "2026-01-19T16:54:27.000Z"
}
````

The `thought` field contains structured, labeled text (Situation, Reaction, Emotion, Reframe).
The researcher dashboard **parses this text defensively** to support evolving study designs without breaking older data.

---

## Ethical & Research Considerations

* Anonymous authentication ensures participants are not personally identifiable
* No clinical claims are made
* No diagnosis or treatment is provided
* The platform is framed explicitly as a **research prototype**
* UI design prioritizes calmness and clarity to reduce cognitive load

---

## Live Demo

**Live Deployment:**
👉 [https://graceful-nasturtium-f665e5.netlify.app](https://graceful-nasturtium-f665e5.netlify.app)

Recommended pages to explore:

* `/session` — participant CBT flow
* `/research` — researcher dashboard

---

## Local Development

### Prerequisites

* Node.js (v18 recommended)
* npm

### Setup

```bash
git clone https://github.com/AtharvaThorat/cbt-research-platform.git
cd cbt-research-platform
npm install
```

### Environment Variables

Create a `.env.local` file with Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Run Locally

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Potential Extensions & Future Work

This prototype can be extended in several directions:

* Multimodal data collection (audio, video, sensor data)
* Longitudinal engagement tracking across sessions
* Integration with socially assistive robots (SARs)
* Adaptive interventions based on engagement patterns
* Visualization of engagement trends over time
* Export tools for downstream analysis

---

## Disclaimer

This project is intended for **research and educational purposes only**.
It is **not a medical device** and does **not provide therapy or diagnosis**.

---

## Author

**Atharva Thorat**
Master’s Student (Prospective)
Computer Science

GitHub: [https://github.com/AtharvaThorat](https://github.com/AtharvaThorat)

---

## Acknowledgements

This project is inspired by interdisciplinary research at the intersection of:

* Mental health
* Human-centered AI
* Socially assistive robotics

