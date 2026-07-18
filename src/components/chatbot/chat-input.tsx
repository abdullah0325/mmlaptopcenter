"use client";

import { useState } from "react";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText("");
    await onSend(value);
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-t border-[#d8a928]/20 p-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about products, benefits, or order..."
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d8a928]"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-[#f6a45d] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d8861f] disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}

