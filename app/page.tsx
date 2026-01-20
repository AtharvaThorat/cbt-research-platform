export default function Home() {
  return (
    <main style={{ padding: "3rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>CBT Research Session</h1>

      <p>
        You are invited to participate in a guided cognitive behavioral therapy
        exercise as part of a research study.
      </p>

      <p>
        The session will take approximately 10 minutes and involves reflective
        prompts.
      </p>

      <a href="/session">
        <button style={{ marginTop: "1.5rem" }}>
          Begin Session
        </button>
      </a>
    </main>
  );
}
