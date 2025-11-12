import React from "react";

interface Message {
  text: string;
  user: string;
  timestamp: string;
  socketId?: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        height: "300px",
        overflowY: "auto",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {messages.length === 0 ? (
        <p style={{ color: "#666", textAlign: "center", marginTop: "50px" }}>
          Nenhuma mensagem ainda. Seja o primeiro a enviar!
        </p>
      ) : (
        messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <strong style={{ color: "#5A3825" }}>{msg.user}:</strong>{" "}
            <span style={{ color: "#3A2B1D" }}>{msg.text}</span>
            <br />
            <small style={{ color: "#8B5E3C", fontSize: "0.85em" }}>
              {msg.timestamp}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

