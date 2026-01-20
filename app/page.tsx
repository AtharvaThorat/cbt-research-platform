export default function Home() {
  return (
    <main style={{ padding: "3rem" }}>
      <div className="card" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div className="research-tag">USC · Viterbi Research Prototype</div>
        <h1>CBT Research Platform</h1>

        <p style={{ marginTop: "1rem" }}>
          This platform supports research on engagement in cognitive behavioral
          therapy exercises and socially assistive interventions.
        </p>

        <p>
          Participants can complete a guided CBT reflection, and researchers can
          review anonymized session data.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "2.5rem",
          }}
        >
          <a href="/session">
            <button>Start Session</button>
          </a>

          <a href="/research">
            <button style={{ backgroundColor: "#64748b" }}>
              View Research Dashboard
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}
