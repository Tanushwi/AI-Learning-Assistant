export const chunkText = (text, chunkSize = 500, overlap = 50) => {

  if (!text) return [];

  if (typeof text !== "string") {
    if (Array.isArray(text)) text = text.join(" ");
    else if (typeof text === "object") text = JSON.stringify(text);
    else text = "";
  }

  if (!text.trim()) return [];

  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunkWords = words.slice(i, i + chunkSize);

    chunks.push({
      content: chunkWords.join(" "),
      chunkIndex: chunks.length,
      pageNumber: 0,
    });

    if (i + chunkSize >= words.length) break;
  }

  return chunks;
};

export const findRelevantChunks = (chunks, query, maxChunks = 3) => {

  if (!chunks || !Array.isArray(chunks) || chunks.length === 0) return [];

  const queryWords = query.toLowerCase().split(" ");

  const scored = chunks.map(chunk => {
    let score = 0;
    const content = chunk.content.toLowerCase();

    queryWords.forEach(word => {
      if (content.includes(word)) score++;
    });

    return { ...chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
};