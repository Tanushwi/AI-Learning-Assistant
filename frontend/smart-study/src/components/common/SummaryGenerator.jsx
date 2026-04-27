import React, { useState } from "react";
import axios from "../../utils/axiosInstance";

const SummaryGenerator = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const res = await axios.post("/summary", { text });
      setSummary(res.data?.data?.summary || "No summary generated.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Summary Generator</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={8}
        style={{ width: "100%", marginBottom: 12 }}
        placeholder="Paste or type your text here..."
      />
      <br />
      <button onClick={handleGenerate} disabled={loading || !text.trim()}>
        {loading ? "Generating..." : "Generate Summary"}
      </button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      {summary && (
        <div style={{ marginTop: 24 }}>
          <h4>Summary:</h4>
          <div style={{ background: "#f6f8fa", padding: 16, borderRadius: 6 }}>{summary}</div>
        </div>
      )}
    </div>
  );
};

export default SummaryGenerator;
