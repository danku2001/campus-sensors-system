export default function StatusBadge({ ok, text }) {
  return (<div className="badge"><span className={`dot ${ok ? 'ok' : 'bad'}`} />{text}</div>);
}
