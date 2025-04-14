"use client";

import { useState, useRef, useEffect } from "react";
import { Users, SendHorizonal, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "positive" | "negative" | null;
}

interface HrQaChatProps {
  agentId: string;
  agentName: string;
}

export default function HrQaChat({ agentId, agentName }: HrQaChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hallo! Ik ben de HR-assistent. Stel me gerust een vraag over personeelszaken, zoals verlof, ziekte, of andere HR-gerelateerde onderwerpen.",
      timestamp: new Date(),
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch("/api/hr/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
        }),
      });

      const data = await response.json();

      // Add bot response
      const botMessage: Message = {
        role: "assistant",
        content: data.answer || "Sorry, er is een fout opgetreden bij het verwerken van je vraag.",
        timestamp: new Date(),
        feedback: null
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Er is een probleem opgetreden bij het verwerken van je vraag. Probeer het later opnieuw.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleFeedback = async (messageIndex: number, type: "positive" | "negative") => {
    // Only allow feedback on assistant messages
    if (messages[messageIndex].role !== "assistant") return;
    
    // Update the message with feedback
    const updatedMessages = [...messages];
    updatedMessages[messageIndex].feedback = type;
    setMessages(updatedMessages);
    
    // Find the related user question (message before this one)
    if (messageIndex > 0 && messages[messageIndex - 1].role === "user") {
      const question = messages[messageIndex - 1].content;
      const answer = messages[messageIndex].content;
      
      // Save feedback to Supabase
      try {
        await supabase.from("hr.chat_history").update({
          user_feedback: type === "positive"
        }).match({
          question,
          answer
        });
      } catch (error) {
        console.error("Error saving feedback:", error);
      }
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5 text-blue-500" />
          <span>{agentName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-lg max-w-[80%] ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <div>{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === "user" 
                      ? "text-blue-100" 
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  
                  {/* Feedback buttons for assistant messages */}
                  {message.role === "assistant" && (
                    <span className="ml-2 space-x-1 inline-flex items-center">
                      <button 
                        onClick={() => handleFeedback(index, "positive")}
                        className={`p-1 rounded hover:bg-gray-200 ${message.feedback === "positive" ? "text-green-500" : ""}`}
                        aria-label="Dit antwoord was nuttig"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => handleFeedback(index, "negative")}
                        className={`p-1 rounded hover:bg-gray-200 ${message.feedback === "negative" ? "text-red-500" : ""}`}
                        aria-label="Dit antwoord was niet nuttig"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Auto-scroll to bottom anchor */}
          <div ref={messageEndRef} />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none">
                <div className="flex items-center space-x-1">
                  <span className="sr-only">Laden</span>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex items-center">
          <Input
            placeholder="Typ een vraag..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 mr-2"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            <SendHorizonal className="h-5 w-5" />
            <span className="sr-only">Verstuur</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 