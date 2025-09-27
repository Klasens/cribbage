import React, { useEffect, useState, useRef } from "react";
import Modal from "../../ui/Modal";

export default function NumberModal({ open, onClose, onSubmit }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);

  // Reset the value only when the modal opens and focus the input.
  useEffect(() => {
    if (!open) return;
    setVal("");
    // Focus after open for faster entry
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  const submit = () => {
    const n = Number(val);
    if (Number.isFinite(n) && n !== 0) {
      onSubmit?.(n);
      onClose?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add points" width={360}>
      <div style={{ display: "grid", gap: 10 }}>
        <input
          ref={inputRef}
          type="number"
          placeholder="Enter a number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: 8,
            background: "#222",
            color: "var(--c-text)",
            border: "1px solid var(--c-border)",
          }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 12px" }}>
            Cancel
          </button>
          <button onClick={submit} style={{ padding: "8px 12px" }}>
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
}

