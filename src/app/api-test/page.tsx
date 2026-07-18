"use client";

import { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  reply?: string;
  replyHtml?: string;
  recommendations?: Array<{ id: string; title: string; price: number; image?: string }>;
  draftOrder?: Record<string, unknown>;
  intent?: string;
  action?: string;
  error?: string;
}

export default function ApiTestPage() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError("");
    setResponse(null);

    const userMessage = message;
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history,
        }),
      });

      const data: ChatResponse = await res.json();

      if (!res.ok) {
        setError(`Error ${res.status}: ${data.error || "Unknown error"}`);
        return;
      }

      setResponse(data);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: data.reply || "" },
      ]);
    } catch (err) {
      setError(`Request failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setResponse(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Chat API Tester</h1>
          <p className="text-gray-600 mb-4">
            Test the <code className="bg-gray-100 px-1 rounded">POST /api/chat</code> endpoint directly in your browser.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Endpoint Details</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><strong>Method:</strong> POST</li>
              <li><strong>URL:</strong> <code className="bg-blue-100 px-1 rounded">/api/chat</code></li>
              <li><strong>Content-Type:</strong> application/json</li>
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Body (JSON)
            </label>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{JSON.stringify({ message: message || "your message here", history: history.length > 0 ? history : undefined }, null, 2)}</pre>
            </div>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Response</h2>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                200 OK
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Response Body</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>

            {response.replyHtml && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">HTML Preview</h3>
                <div
                  className="border border-gray-200 p-4 rounded-lg bg-white prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: response.replyHtml }}
                />
              </div>
            )}

            {response.recommendations && response.recommendations.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {response.recommendations.map((product) => (
                    <div key={product.id} className="border rounded-lg p-3">
                      <div className="font-medium text-sm">{product.title}</div>
                      <div className="text-gray-600 text-sm">PKR {product.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chat History</h2>
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear History
              </button>
            </div>
            <div className="space-y-4">
              {history.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-50 ml-8"
                      : "bg-gray-50 mr-8"
                  }`}
                >
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {msg.role === "user" ? "You" : "Assistant"}
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}