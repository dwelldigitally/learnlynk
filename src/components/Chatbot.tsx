
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  mode?: "dashboard" | "homepage";
}

const Chatbot: React.FC<ChatbotProps> = ({ mode = "homepage" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: mode === "dashboard" 
        ? "Hi there! I can help you analyze your lead data or answer questions about your dashboard. What would you like to know?" 
        : "Hi there! I'm the Learnlynk assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      text: currentMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");

    // Simulate AI response
    setTimeout(() => {
      let responseText = "";
      
      if (mode === "dashboard") {
        if (currentMessage.toLowerCase().includes("performance")) {
          responseText = "Your team's performance has improved by 27% since implementing our AI lead distribution system. Would you like to see a detailed report?";
        } else if (currentMessage.toLowerCase().includes("conversion")) {
          responseText = "Your current conversion rate is 42%, which is 15% higher than the industry average. The AI has optimized lead assignments based on rep strengths.";
        } else if (currentMessage.toLowerCase().includes("analysis")) {
          responseText = "I can run custom analyses on your data. Would you like to see trends by lead source, rep performance, or conversion metrics?";
        } else {
          responseText = "I can help you understand your data and run custom analyses. What specific information would you like to know about your leads or team performance?";
        }
      } else {
        if (currentMessage.toLowerCase().includes("pricing")) {
          responseText = "We offer several pricing tiers starting at $49/month for small teams. Would you like me to explain the features included in each plan?";
        } else if (currentMessage.toLowerCase().includes("how")) {
          responseText = "Our AI analyzes your historical sales data to match leads with the best-suited sales representatives, increasing your conversion rates by an average of 35%. Would you like to learn more?";
        } else {
          responseText = "Learnlynk uses advanced AI to optimize lead distribution, increasing conversion rates by matching leads with the right representatives. How can I help you learn more about our solution?";
        }
      }

      const botMessage: Message = {
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={toggleChatbot}
        className={`fixed ${mode === "dashboard" ? "bottom-6 right-6" : "bottom-6 right-6"} rounded-full h-14 w-14 shadow-lg z-50 ${isOpen ? "bg-gray-700" : "bg-saas-blue"}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 h-96 shadow-xl flex flex-col z-50 overflow-hidden">
          <div className="bg-saas-blue text-white p-3 font-medium flex justify-between items-center">
            <span>Learnlynk Assistant</span>
            <Button variant="ghost" size="sm" onClick={toggleChatbot} className="text-white h-6 w-6 p-0">
              <X size={18} />
            </Button>
          </div>

          <div className="flex-grow overflow-y-auto p-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 max-w-[80%] ${
                  message.isUser ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.isUser
                      ? "bg-saas-blue text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    message.isUser ? "text-right" : ""
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t flex">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-saas-blue"
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-l-none bg-saas-blue"
            >
              <Send size={18} />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
