// client/src/components/overlays/NumberModal.jsx
import React, { useEffect, useState, useRef } from "react";
import Modal from "../../ui/Modal";
import "./number-modal.css";

export default function NumberModal({ open, onClose, onSubmit }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setVal("");
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
      <div className="nmodal">
        <input
          ref={inputRef}
          type="number"
          placeholder="Enter a number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="nmodal__input"
        />
        <div className="nmodal__actions">
          <button onClick={onClose} className="nmodal__btn">Cancel</button>
          <button onClick={submit} className="nmodal__btn">Add</button>
        </div>
      </div>
    </Modal>
  );
}

