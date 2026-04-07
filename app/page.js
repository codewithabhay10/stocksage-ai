"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatMessage from "@/components/ChatMessage";
import ThinkingPanel from "@/components/ThinkingPanel";
import MessageInput from "@/components/MessageInput";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinkingSteps]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setThinkingSteps([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.role,
            content: m.role === "user" ? m.content : JSON.stringify(m.data || m.content),
          })),
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const chunk = JSON.parse(line);
            if (chunk.type === "thinking") {
              setThinkingSteps((prev) => [...prev, chunk.step]);
            } else if (chunk.type === "result") {
              const aiMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: chunk.data.analysis?.overview || "",
                data: chunk.data,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, aiMessage]);
              setThinkingSteps([]);
            } else if (chunk.type === "error") {
              const errMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: chunk.message || "Sorry, something went wrong. Please try again.",
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, errMessage]);
              setThinkingSteps([]);
            }
          } catch (e) {
            // skip malformed JSON chunks
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsLoading(false);
      setThinkingSteps([]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setThinkingSteps([]);
    setIsLoading(false);
  };

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onNewChat={handleNewChat}
        messages={messages}
      />

      <div className="main-content">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          hasMessages={messages.length > 0}
        />

        <div className="chat-area">
          {messages.length === 0 && !isLoading ? (
            <WelcomeScreen onSuggestionClick={handleSendMessage} />
          ) : (
            <div className="chat-messages">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isLoading && thinkingSteps.length > 0 && (
                <div className="message assistant">
                  <div className="message-avatar ai">S</div>
                  <div className="message-content">
                    <ThinkingPanel steps={thinkingSteps} />
                  </div>
                </div>
              )}

              {isLoading && thinkingSteps.length === 0 && (
                <div className="message assistant">
                  <div className="message-avatar ai">S</div>
                  <div className="message-content">
                    <div className="typing-dots">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
