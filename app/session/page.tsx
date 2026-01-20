"use client";

import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { db, auth } from "@/app/lib/firebase";

/**
 * Session data (stable & dashboard-compatible)
 */
type SessionData = {
  situation: string;
  thought: string;
  emotion: string;
  reframe: string;
  engagement: number;
};

export default function SessionPage() {
  const [consented, setConsented] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    signInAnonymously(auth)
      .then(() => setAuthReady(true))
      .catch(console.error);
  }, []);

  if (!authReady) {
    return (
      <main style={{ padding: "3rem", textAlign: "center" }}>
        <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <p>Initializing secure research session…</p>
        </div>
      </main>
    );
  }

  if (!consented) {
    return (
      <main style={{ padding: "3rem" }}>
        <div className="card" style={{ maxWidth: "620px", margin: "0 auto" }}>
          <div className="research-tag">USC · Viterbi Research Study</div>
          <h1>CBT Reflection Study</h1>

          <p style={{ marginTop: "1rem" }}>
            This session is part of a university research study exploring how
            students engage with cognitive behavioral therapy exercises.
          </p>

          <p>
            Your responses are anonymous and will be used only for research
            purposes.
          </p>

          <button
            onClick={() => setConsented(true)}
            style={{ marginTop: "1.8rem" }}
          >
            I Consent and Begin
          </button>
        </div>
      </main>
    );
  }

  return <CBTExercise />;
}

/* ================= CBT FORM ================= */

function CBTExercise() {
  const [situation, setSituation] = useState("");
  const [thought, setThought] = useState("");
  const [emotion, setEmotion] = useState("");
  const [reframe, setReframe] = useState("");
  const [engagement, setEngagement] = useState<number | null>(null);

  const [submittedData, setSubmittedData] =
    useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);

  const allAnswered =
    situation.trim() &&
    thought.trim() &&
    emotion.trim() &&
    reframe.trim() &&
    engagement !== null;

  async function handleSubmit() {
    if (!allAnswered) return;

    setLoading(true);

    const data: SessionData = {
      situation,
      thought,
      emotion,
      reframe,
      engagement: engagement!,
    };

    try {
      await addDoc(collection(db, "sessions"), {
        thought: `
Situation: ${situation}
Reaction: ${thought}
Emotions: ${emotion}
Reframe: ${reframe}
        `.trim(),
        engagement: engagement!,
        timestamp: new Date(),
      });

      setSubmittedData(data);
    } catch (error) {
      console.error("Error saving session:", error);
      alert("Failed to save session data.");
    } finally {
      setLoading(false);
    }
  }

  if (submittedData) {
    return (
      <ReviewPage
        data={submittedData}
        onRestart={() => {
          setSituation("");
          setThought("");
          setEmotion("");
          setReframe("");
          setEngagement(null);
          setSubmittedData(null);
        }}
      />
    );
  }

  return (
    <main style={{ padding: "3rem" }}>
      <div className="card" style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "1.2rem",
            fontSize: "0.85rem",
            color: "#64748b",
          }}
        >
          Participant Session · All fields required
        </div>

        <h1>Guided CBT Reflection</h1>
        <p style={{ marginTop: "0.5rem", maxWidth: "640px" }}>
          Please take a moment to thoughtfully reflect on the experience below.
          There are no right or wrong answers.
        </p>

        <Section>
          <Field label="1. What is the situation you are here to talk about?">
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={3}
            />
          </Field>
        </Section>

        <Section>
          <Field label="2. How did you react in this situation?">
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              rows={3}
            />
          </Field>
        </Section>

        <Section>
          <Field label="3. What are the emotions that you felt?">
            <textarea
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              rows={3}
            />
          </Field>
        </Section>

        <Section>
          <Field label="4. How would you react now after the situation is over?">
            <textarea
              value={reframe}
              onChange={(e) => setReframe(e.target.value)}
              rows={3}
            />
          </Field>
        </Section>

        <Section>
          <Field label="5. Engagement level">
            <input
              type="range"
              min="1"
              max="5"
              value={engagement ?? 3}
              onChange={(e) => setEngagement(Number(e.target.value))}
            />
          </Field>
        </Section>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
          style={{ marginTop: "2.5rem" }}
        >
          {loading ? "Submitting…" : "Submit Reflection"}
        </button>
      </div>
    </main>
  );
}

/* ================= REVIEW PAGE ================= */

function ReviewPage({
  data,
  onRestart,
}: {
  data: SessionData;
  onRestart: () => void;
}) {
  return (
    <main style={{ padding: "3rem" }}>
      <div className="card" style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div className="research-tag">Review Step</div>
        <h1>Confirm Your Responses</h1>

        <p style={{ marginBottom: "1.5rem" }}>
          Please review your responses below before they are included in the
          research dataset.
        </p>

        <ReviewItem label="Situation you described" value={data.situation} />
        <ReviewItem label="Your initial reaction" value={data.thought} />
        <ReviewItem label="Emotions you experienced" value={data.emotion} />
        <ReviewItem label="How you would respond now" value={data.reframe} />
        <ReviewItem
          label="Engagement level"
          value={`${data.engagement} / 5`}
        />

        <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
          <a href="/research">
            <button>Proceed to Research Dashboard</button>
          </a>

          <button
            onClick={onRestart}
            style={{ backgroundColor: "#64748b" }}
          >
            Begin New Session
          </button>
        </div>
      </div>
    </main>
  );
}

/* ================= UI HELPERS ================= */

function Section({ children }: { children: React.ReactNode }) {
  return <div className="section">{children}</div>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <strong>{label}</strong>
      <div style={{ marginTop: "0.6rem" }}>{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: "1.4rem" }}>
      <strong>{label}:</strong>
      <p style={{ marginTop: "0.4rem" }}>{value}</p>
    </div>
  );
}
