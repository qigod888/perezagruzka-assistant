import fs from 'fs';
import path from 'path';

// Загружаем book.json один раз при старте функции
let bookData = [];

try {
  const bookPath = path.join(process.cwd(), 'public', 'book.json');
  const raw = fs.readFileSync(bookPath, 'utf-8');
  bookData = JSON.parse(raw);
  console.log('book.json loaded, chunks:', bookData.length);
} catch (e) {
  console.error('Failed to load book.json:', e);
  bookData = [];
}

// Косинусное сходство для двух массивов чисел
function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { queryEmbedding, topK = 4 } = req.body || {};
    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      res.status(400).json({ error: 'queryEmbedding is required' });
      return;
    }

    if (!bookData.length) {
      res.status(500).json({ error: 'book_not_loaded' });
      return;
    }

    const scored = bookData.map(item => ({
      text: item.text,
      score: cosineSim(queryEmbedding, item.emb)
    }));

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topK);

    const context = top.map((s, idx) =>
      `Фрагмент ${idx + 1}:\n${s.text}`
    ).join('\n\n---\n\n');

    res.status(200).json({ context });
  } catch (e) {
    console.error('search error:', e);
    res.status(500).json({ error: 'search_failed', message: e.message });
  }
}
