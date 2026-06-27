import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Info, Mic, MicOff, Volume2, HelpCircle } from "lucide-react";
import { useListChatMessages, useListSuggestedQuestions, useSendChatMessage, getListChatMessagesQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const qc = useQueryClient();

  const { data: messages, isLoading } = useListChatMessages();
  const { data: suggested } = useListSuggestedQuestions();
  const sendMessage = useSendChatMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setMessage(transcript);
      };
      recognitionRef.current = rec;
    }
  }, []);

  function toggleListen() {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge!");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = language === "ta" ? "ta-IN" : "en-IN";
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  }

  function handleSend() {
    if (!message.trim() || sendMessage.isPending) return;
    sendMessage.mutate({ data: { content: message, language } }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListChatMessagesQueryKey() });
        setMessage("");
      },
    });
  }

  function handleSuggested(q: string) {
    if (sendMessage.isPending) return;
    sendMessage.mutate({ data: { content: q, language } }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListChatMessagesQueryKey() });
        setMessage("");
      },
    });
  }

  const displayMessages = [...(messages ?? [])].reverse();

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] max-w-4xl mx-auto space-y-0 bg-card border rounded-2xl shadow-md overflow-hidden">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shrink-0 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-secondary animate-bounce" />
          <div>
            <h1 className="text-lg font-bold tracking-tight">AI Civic Assistant</h1>
            <p className="text-xs text-primary-foreground/75">Ask about laws, schemes, rights or services</p>
          </div>
        </div>
        <div className="flex gap-1 bg-white/10 rounded-lg p-1 border border-white/10">
          <button onClick={() => setLanguage("en")} className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${language === "en" ? "bg-secondary text-white shadow-sm" : "text-primary-foreground/60 hover:text-primary-foreground"}`}>English</button>
          <button onClick={() => setLanguage("ta")} className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${language === "ta" ? "bg-secondary text-white shadow-sm" : "text-primary-foreground/60 hover:text-primary-foreground"}`}>தமிழ்</button>
        </div>
      </div>

      {/* Persistent Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-6 flex gap-2.5 shrink-0 items-center justify-center">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-[11px] text-amber-800 font-medium text-center">
          ⚠️ <strong>Educational Disclaimer:</strong> This AI assistant provides educational information and guides. It does not provide legal advice.
        </p>
      </div>

      {/* Chat History Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-start"><Skeleton className="h-14 w-3/4 rounded-2xl rounded-bl-sm" /></div>
            <div className="flex justify-end"><Skeleton className="h-10 w-2/3 rounded-2xl rounded-br-sm" /></div>
            <div className="flex justify-start"><Skeleton className="h-16 w-4/5 rounded-2xl rounded-bl-sm" /></div>
          </div>
        ) : displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 max-w-md mx-auto text-muted-foreground">
            <div className="bg-primary/5 p-4 rounded-full mb-4">
              <MessageCircle className="w-10 h-10 text-primary opacity-40 animate-pulse" />
            </div>
            <p className="font-bold text-foreground mb-1">Hello! How can I assist you today?</p>
            <p className="text-xs leading-relaxed mt-1 mb-6">Ask me questions in plain English or Tamil. Try one of the suggested civic questions below to get started:</p>
            {suggested && suggested.length > 0 && (
              <div className="flex flex-col gap-2 w-full">
                {suggested.slice(0, 4).map((q) => (
                  <button key={q.id} onClick={() => handleSuggested(q.question)} className="text-xs text-left bg-background border border-muted hover:border-primary/30 text-primary rounded-xl px-4 py-2.5 hover:bg-primary/5 transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                    <HelpCircle className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="line-clamp-1">{q.question}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          displayMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm animate-msg-user" : "bg-white border border-slate-100 text-foreground rounded-bl-sm whitespace-pre-wrap animate-msg-assistant"}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {sendMessage.isPending && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center py-1 px-0.5">
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Questions */}
      {suggested && suggested.length > 0 && displayMessages.length > 0 && (
        <div className="flex gap-2 px-6 py-2.5 bg-slate-50 border-t overflow-x-auto whitespace-nowrap shrink-0 scrollbar-none">
          <span className="text-[10px] font-bold text-muted-foreground self-center uppercase tracking-wider mr-1">Suggestions:</span>
          {suggested.slice(0, 3).map((q) => (
            <button key={q.id} onClick={() => handleSuggested(q.question)} className="text-xs bg-white border rounded-full px-3.5 py-1.5 hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary cursor-pointer shadow-sm">
              {q.question}
            </button>
          ))}
        </div>
      )}

      {/* Input Group */}
      <div className="p-4 border-t bg-background shrink-0 flex gap-2.5 items-center">
        <button
          onClick={toggleListen}
          title={isListening ? "Stop listening" : "Record voice query"}
          className={`p-3 rounded-xl transition-all border shrink-0 cursor-pointer ${isListening ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"}`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <Input
          placeholder={language === "ta" ? "உங்கள் கேள்வியை தமிழில் கேளுங்கள்..." : "Ask about your rights, schemes, or services..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 py-5 rounded-xl border-slate-200"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || sendMessage.isPending}
          className="bg-primary text-primary-foreground p-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0 cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
