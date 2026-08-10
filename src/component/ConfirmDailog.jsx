export default function InputDialog({ open, value, onChange, onSubmit, onClose }) {
  if (!open) return null;

  return (
    <div style={{ background: "#141824", border: "1px solid #232838", borderRadius: 10, padding: 16, marginTop: 10, maxWidth: 300 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "#0b0d12", border: "1px solid #232838", borderRadius: 8, padding: "8px 10px", color: "#fff", boxSizing: "border-box", marginBottom: 10 }}
      />
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}