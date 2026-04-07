import React, { useState, useEffect } from 'react';
import './Quote.css';

const QUOTES = [
  { text: "Small progress is better than no progress.", author: "Unknown" },
  { text: "The body achieves what the mind believes.", author: "Unknown" },
  { text: "No pain, no gain. Shut up and train.", author: "Unknown" },
  { text: "Wake up. Work out. Be better.", author: "Unknown" },
  { text: "Your only limit is you.", author: "Unknown" },
  { text: "Sweat now. Shine later.", author: "SweatAndGain" },
  { text: "Consistency beats intensity every single time.", author: "Unknown" },
  { text: "Don't wish for a good body. Work for it.", author: "Unknown" },
  { text: "Zindagi mei Chalna ha toh achi trah chal.", author: "Zohaib" },
];

function Quote() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [fade, setFade] = useState(true);

  const next = () => {
    setFade(false);
    setTimeout(() => {
      setIdx(i => (i + 1) % QUOTES.length);
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  const q = QUOTES[idx];

  return (
    <div className='MainQuote'>
      <span className='QuoteIcon'>"</span>
      <div className={`QuoteBody ${fade ? 'quote-visible' : 'quote-hidden'}`}>
        <p className='QuoteText'>{q.text}</p>
        <span className='QuoteAuthor'>— {q.author}</span>
      </div>
      <button className='QuoteNext' onClick={next} title="Next quote">↻</button>
    </div>
  );
}

export default Quote;