import { useEffect, useState, type FormEvent } from 'react';
import { useForm, ValidationError } from '@formspree/react';

type Comment = { id: string; name: string; text: string; ts: number };

// Comments are sent to Marcus via Formspree (form-to-email), and also shown on
// this device so the commenter sees their note appear immediately.
export function Comments({ postId }: { postId: string }) {
  const key = `comments:${postId}`;
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [state, handleSubmit] = useForm('xaqzrkqa');

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      setComments(raw ? (JSON.parse(raw) as Comment[]) : []);
    } catch {
      setComments([]);
    }
  }, [key]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const nm = name.trim();
    const tx = text.trim();
    if (!tx) { e.preventDefault(); return; }
    const result = (await handleSubmit(e)) as { response?: { ok?: boolean } } | undefined;
    if (result?.response?.ok) {
      const entry: Comment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: nm || 'Anonymous',
        text: tx,
        ts: Date.now(),
      };
      setComments((prev) => {
        const next = [entry, ...prev];
        try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
      setText('');
    }
  };

  const fmt = (ts: number) =>
    new Date(ts).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section className="comments">
      <h3 className="comments-title">Comments</h3>

      <form className="cmt-form" onSubmit={onSubmit}>
        <input type="hidden" name="_subject" value={`New blog comment — ${postId}`} />
        <input type="hidden" name="post" value={postId} />

        <input
          className="cmt-input" type="text" name="name" value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)" aria-label="Your name" maxLength={60}
        />
        <input
          className="cmt-input" type="email" name="email"
          placeholder="Email (optional, not shown publicly)" aria-label="Email"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="cmt-err" />

        <textarea
          className="cmt-area" name="message" value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share a thought…" aria-label="Your comment" rows={3} maxLength={1200} required
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} className="cmt-err" />

        <div className="cmt-actions">
          <button className="cmt-submit" type="submit" disabled={state.submitting || !text.trim()}>
            {state.submitting ? 'Posting…' : 'Post comment'}
          </button>
          {state.succeeded && <span className="cmt-ok">Thanks — your comment was sent!</span>}
        </div>
        <p className="cmt-note">Comments are sent to Marcus for review and shown here on your device.</p>
      </form>

      {comments.length === 0 ? (
        <p className="cmt-empty">No comments yet — be the first to share a thought.</p>
      ) : (
        <ul className="cmt-list">
          {comments.map((c) => (
            <li key={c.id} className="cmt">
              <div className="cmt-head">
                <span className="cmt-name">{c.name}</span>
                <span className="cmt-date">{fmt(c.ts)}</span>
              </div>
              <p className="cmt-body">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
