export default function InputDialog({ open, value, onChange, onSubmit, onClose }) {
  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#141824", border: "1px solid #232838", borderRadius: 10, padding: 20, width: 300 }}>
        <p style={{ color: "#fff", fontSize: 14, marginBottom: 12 }}>Enter category name</p>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
          style={{ width: "100%", background: "#0b0d12", border: "1px solid #232838", borderRadius: 8, padding: "8px 10px", color: "#fff", fontSize: 13, boxSizing: "border-box", marginBottom: 16 }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid #232838", color: "#9aa0ac", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>Close</button>
          <button onClick={onSubmit} style={{ background: "rgba(37,211,102,0.15)", border: "none", color: "#25d366", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>Submit</button>
        </div>
      </div>
    </div>
  );
}