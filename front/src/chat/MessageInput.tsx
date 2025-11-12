import React, { useState } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite uma mensagem..."
        style={{
          width: "75%",
          padding: "10px",
          border: "1px solid #C9A77A",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      />
      <button
        type="submit"
        style={{
          width: "25%",
          padding: "10px",
          backgroundColor: "#5A3825",
          color: "#F8F3E7",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Enviar
      </button>
    </form>
  );
}

