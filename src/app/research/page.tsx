"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

import { db, auth } from "@/lib/firebase";

type SessionRecord = {
  id: string;
  thought?: string;
  engagement: number;
  timestamp?: Timestamp;
};

type ParsedCBT = {
  situation: string;
  reaction: string;
  emotion: string;
  reframe: string;
};

export default function ResearchDashboard() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    signInAnonymously(auth)
      .then(() => setAuthReady(true))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!authReady) return;

    async function fetchSessions() {
      const q = query(
        collection(db, "sessions"),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);

      const results: SessionRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<SessionRecord, "id">),
      }));

      setSessions(results);
      setLoading(false);
    }

    fetchSessions();
  }, [authReady]);

  if (!authReady || loading) {
    return (
      <main style={{ padding: "3rem", textAlign: "center" }}>
        <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <p>Loading research data…</p>
        </div>
      </main>
    );
  }

  const avgEngagement =
    sessions.reduce((sum, s) => sum + s.engagement, 0) /
    (sessions.length || 1);

  return (
    <main style={{ padding: "3rem" }}>
      <div className="card" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div className="research-tag">Research Dashboard</div>
        <h1>CBT Session Data</h1>

        <p style={{ marginBottom: "2rem" }}>
          Anonymized participant responses collected for engagement analysis.
        </p>

        {/* Summary */}
        <div style={{ display: "flex", gap: "3rem", marginBottom: "2rem" }}>
          <Stat label="Total Sessions" value={sessions.length} />
          <Stat
            label="Average Engagement"
            value={avgEngagement.toFixed(2)}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Timestamp</th>
                <th style={thStyle}>Engagement</th>
                <th style={thStyle}>Situation</th>
                <th style={thStyle}>Reaction</th>
                <th style={thStyle}>Emotion</th>
                <th style={thStyle}>Reframe</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((s, index) => {
                const parsed = parseCBT(s.thought);

                return (
                  <tr
                    key={s.id}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    <td style={tdStyle}>
                      {s.timestamp
                        ? s.timestamp.toDate().toLocaleString()
                        : "—"}
                    </td>

                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <EngagementPill value={s.engagement} />
                    </td>

                    <td style={tdStyle}>{truncate(parsed.situation)}</td>
                    <td style={tdStyle}>{truncate(parsed.reaction)}</td>
                    <td style={tdStyle}>{truncate(parsed.emotion)}</td>
                    <td style={tdStyle}>{truncate(parsed.reframe)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action */}
        <div style={{ marginTop: "2.5rem" }}>
          <a href="/session">
            <button>Begin New Session</button>
          </a>
        </div>
      </div>
    </main>
  );
}

/* ================= PARSING (FIXED FOR Emotion / Emotions) ================= */

function parseCBT(text?: string): ParsedCBT {
  if (!text || typeof text !== "string") {
    return {
      situation: "—",
      reaction: "—",
      emotion: "—",
      reframe: "—",
    };
  }

  const lines = text.split("\n").map((l) => l.trim());

  const getValue = (labels: string[]) => {
    const line = lines.find((l) =>
      labels.some((label) =>
        l.toLowerCase().startsWith(label.toLowerCase() + ":")
      )
    );

    if (!line) return "—";

    return line.split(":").slice(1).join(":").trim();
  };

  return {
    situation: getValue(["Situation"]),
    reaction: getValue(["Reaction"]),
    emotion: getValue(["Emotion", "Emotions"]), // ✅ FIXED
    reframe: getValue(["Reframe"]),
  };
}

function truncate(text: string, length = 60) {
  return text.length > length ? text.slice(0, length) + "…" : text;
}

/* ================= UI COMPONENTS ================= */

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function EngagementPill({ value }: { value: number }) {
  const color =
    value <= 2 ? "#dc2626" : value <= 4 ? "#ca8a04" : "#16a34a";

  return (
    <span
      style={{
        padding: "0.35rem 0.8rem",
        borderRadius: "999px",
        backgroundColor: color,
        color: "white",
        fontSize: "0.75rem",
        fontWeight: 600,
      }}
    >
      {value}
    </span>
  );
}

/* ================= TABLE STYLES ================= */

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "1rem 1.2rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#475569",
  borderBottom: "2px solid #e5e7eb",
  backgroundColor: "#f1f5f9",
};

const tdStyle: React.CSSProperties = {
  padding: "1rem 1.2rem",
  fontSize: "0.9rem",
  color: "#1e293b",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "top",
};
