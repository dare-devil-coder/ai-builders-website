import { useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Check, Copy } from 'lucide-react'
import { pageMeta } from '../data/pages'
import { PageHero, Reveal, SectionIntro } from '../components/ui/Sections'

const interests = ['LLMs', 'RAG', 'AI Agents', 'Web Development', 'Open Source', 'Workshops', 'Other']
const initial = { name: '', email: '', year: '', program: '', interests: [], why: '', github: '', linkedin: '' }
const key = 'ai-builders-application-draft'

function applicationText(data) {
  return `AI BUILDERS MEMBERSHIP APPLICATION\n\nFull name: ${data.name}\nEmail: ${data.email}\nYear of study: ${data.year}\nBranch / program: ${data.program}\nAreas of interest: ${data.interests.join(', ')}\nWhy I want to join:\n${data.why}\nGitHub: ${data.github || 'Not provided'}\nLinkedIn: ${data.linkedin || 'Not provided'}\n`
}

export default function Join() {
  const [form, setForm] = useState(() => { try { return { ...initial, ...JSON.parse(localStorage.getItem(key)) } } catch { return initial } })
  const [prepared, setPrepared] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [interestError, setInterestError] = useState(false)
  const update = (field, value) => { setForm(old => ({ ...old, [field]: value })); setPrepared(false); setSaved(false) }
  const toggleInterest = value => { update('interests', form.interests.includes(value) ? form.interests.filter(item => item !== value) : [...form.interests, value]); setInterestError(false) }
  const saveDraft = () => { localStorage.setItem(key, JSON.stringify(form)); setSaved(true) }
  const clearDraft = () => { localStorage.removeItem(key); setForm(initial); setPrepared(false); setSaved(false); setCopied(false); setInterestError(false) }
  const prepare = event => { event.preventDefault(); if (!form.interests.length) { setInterestError(true); return } setPrepared(true); saveDraft() }
  const download = () => {
    const url = URL.createObjectURL(new Blob([applicationText(form)], { type: 'text/plain' }))
    const link = document.createElement('a'); link.href = url; link.download = 'ai-builders-application.txt'; link.click(); URL.revokeObjectURL(url)
  }
  const copy = async () => { await navigator.clipboard.writeText(applicationText(form)); setCopied(true) }
  return <><PageHero meta={pageMeta.join} />
    <section className="section shell"><SectionIntro index="01" label="WHY JOIN" title={<>Build a portfolio.<br /><em>Find your people.</em></>} /><div className="reason-grid">{[
      'Work on real AI projects that go live, beyond graded assignments.',
      'Learn from peers who are actively building and shipping.',
      'Contribute to open source and build a public portfolio.',
      'Access workshops, mentorship, and a community that pushes you forward.',
      'Represent your work at hackathons, conferences, and online communities.',
    ].map((reason, i) => <Reveal key={reason} className="reason-row"><span>{String(i + 1).padStart(2, '0')}</span><p>{reason}</p><Check size={18} /></Reveal>)}</div></section>
    <section className="section section-alt"><div className="shell"><SectionIntro index="02" label="MEMBERSHIP" title={<>Tell us what you<br /><em>want to build.</em></>} description="Complete the form to prepare your introduction. The club has not supplied an application inbox yet, so this site saves a draft on your device and lets you export it; it does not send an application." /><div className="form-layout"><form className="join-form" onSubmit={prepare}>
      <div className="form-pair"><label>Full name <input required value={form.name} onChange={e => update('name', e.target.value)} autoComplete="name" placeholder="Your name" /></label><label>Email address <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} autoComplete="email" placeholder="you@example.com" /></label></div>
      <div className="form-pair"><label>Year of study <select required value={form.year} onChange={e => update('year', e.target.value)}><option value="">Select a year</option>{['First Year','Second Year','Third Year','Fourth Year'].map(year => <option key={year}>{year}</option>)}</select></label><label>Branch / program <input required value={form.program} onChange={e => update('program', e.target.value)} placeholder="e.g. B.Tech AI/ML" /></label></div>
      <fieldset aria-describedby={interestError ? 'interest-error' : undefined}><legend>Areas of interest</legend><div className="interest-list">{interests.map(interest => <label key={interest} className={form.interests.includes(interest) ? 'interest active' : 'interest'}><input type="checkbox" checked={form.interests.includes(interest)} onChange={() => toggleInterest(interest)} />{interest}</label>)}</div>{interestError && <p id="interest-error" className="field-error" role="alert">Choose at least one area of interest.</p>}</fieldset>
      <label>Why do you want to join AI Builders? <textarea required value={form.why} onChange={e => update('why', e.target.value)} placeholder="Tell us what you want to learn or make." rows="5" aria-invalid={form.why.trim().split(/\s+/).filter(Boolean).length > 150} /></label><span className={form.why.trim().split(/\s+/).filter(Boolean).length > 150 ? 'field-help field-error' : 'field-help'}>{form.why.trim().split(/\s+/).filter(Boolean).length} / 150 words</span>
      <div className="form-pair"><label>GitHub profile <span>(optional)</span><input type="url" value={form.github} onChange={e => update('github', e.target.value)} placeholder="https://github.com/..." /></label><label>LinkedIn profile <span>(optional)</span><input type="url" value={form.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /></label></div>
      <div className="form-actions"><button className="button button-primary" type="submit" disabled={form.why.trim().split(/\s+/).filter(Boolean).length > 150}>Prepare application <ArrowUpRight size={17} /></button><button className="button button-outline" type="button" onClick={saveDraft}>Save draft</button><button className="button button-outline" type="button" onClick={clearDraft}>Clear draft</button></div>{saved && <p className="form-status" role="status"><Check size={16} /> Draft saved on this device.</p>}
    </form><aside className="form-aside"><span className="eyebrow">BEFORE YOU APPLY</span><h3>Your next step starts with a conversation.</h3><p>AI Builders is open to students at Universal AI University. Share your interests, experience, or half-formed idea. There is no need to have everything figured out.</p><div className="aside-rule" /><span className="eyebrow">CONTACT DETAILS</span><p>For collaborations, partnerships, event invitations, or media inquiries, the club email and social links will appear here when confirmed.</p></aside></div>
      {prepared && <div className="prepared-panel" role="status"><span className="eyebrow">APPLICATION PREPARED</span><h3>Your introduction is ready.</h3><p>It has been saved in this browser. Copy or download it and share it with the club once a verified contact channel is available. No application has been sent.</p><div className="form-actions"><button type="button" className="button button-primary" onClick={copy}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Copied' : 'Copy application'}</button><button type="button" className="button button-outline" onClick={download}><ArrowDownToLine size={17} /> Download text</button></div></div>}
    </div></section>
  </>
}
