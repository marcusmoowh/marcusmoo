import { useState, type ChangeEvent } from 'react';
import { Reveal } from '../components/Reveal';
import { Parallax } from '../components/Parallax';

const TO_EMAIL = 'marcusmoowh@gmail.com';

// ── Direct send (no backend) ────────────────────────────────────────────────
// Paste a free Web3Forms access key here to have the button email you directly.
//   1. Go to https://web3forms.com, enter marcusmoowh@gmail.com, get an Access Key.
//   2. Paste it below. Submissions are emailed straight to that inbox.
// Leave it blank to fall back to opening the visitor's mail app (mailto).
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [note, setNote] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const upd = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const send = async () => {
    if (!form.name || !form.message) {
      setNote('Please add your name and a short message.');
      return;
    }
    const subject = `[Portfolio] ${form.subject || 'Collaboration'}`;

    // Fallback: open the visitor's mail app if no key is configured.
    if (!WEB3FORMS_ACCESS_KEY) {
      const body = encodeURIComponent(`Hi Marcus,\n\n${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ''}`);
      window.location.href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
      setNote('Opening your email app…');
      return;
    }

    try {
      setStatus('sending');
      setNote('');
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject,
          from_name: form.name,
          name: form.name,
          email: form.email,
          replyto: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setNote('Thank you — your message has been sent.');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setNote('Something went wrong. Please try again, or email me directly.');
      }
    } catch {
      setStatus('error');
      setNote('Network error. Please try again, or email me directly.');
    }
  };

  return (
    <section id="contact">
      <div className="frame wide">
        <Parallax speed={0.1}><div className="eyebrow">V · Contact</div></Parallax>
        <Reveal delay={80}><h2 className="section-title">Let's build something <i>meaningful</i></h2></Reveal>
        <div className="contact-grid">
          <Reveal>
            <div className="contact-info">
              <a className="cinfo" href="tel:+6581514913"><span>Phone</span><b>+65 8151 4913</b></a>
              <a className="cinfo" href="https://wa.me/6581514913?text=Hi%20Marcus%2C" target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><b>+65 8151 4913</b></a>
              <a className="cinfo" href={`mailto:${TO_EMAIL}`}><span>Email</span><b>{TO_EMAIL}</b></a>
              <p className="copy">Open to speaking, mentorship, and tech-policy &amp; architecture collaborations across the Asia-Pacific. Reach out — I read every message.</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="cform">
              <input placeholder="Your name" value={form.name} onChange={upd('name')} />
              <input type="email" placeholder="Your email" value={form.email} onChange={upd('email')} />
              <input placeholder="Topic / subject" value={form.subject} onChange={upd('subject')} />
              <textarea rows={4} placeholder="How can we collaborate?" value={form.message} onChange={upd('message')} />
              <button type="button" onClick={send} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send message'}
              </button>
              <div className="cform-note">{note}</div>
            </div>
          </Reveal>
        </div>
        <footer className="site-footer">© {new Date().getFullYear()} Marcus Moo · An evangelist's flight through a cosmic sky</footer>
      </div>
    </section>
  );
}
