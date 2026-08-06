export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0,fontFamily:"cursive", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#141824", border: "1px solid #232838", borderRadius: 10, padding: 20, width: 300 }}>
        <p style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{ background: "transparent", border: "1px solid #232838", color: "#9aa0ac", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ background: "rgba(248,113,113,0.15)", border: "none", color: "#f87171", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}