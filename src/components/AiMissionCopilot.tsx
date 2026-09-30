import React, { useState } from 'react';
import { Send, Sparkles, Bot, Loader2, RefreshCw, Rocket } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiMissionCopilot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Namaste! I am the Aerospace AI Flight Officer for Team ASTRYX-K4. Led by Srishti, Vivek Matadu, Sriharsha, and Panchami, our mission is to build India's premier reusable green microlauncher, VYOM-1. Ask me anything about our hybrid propulsion chemistry, 70 km stage separation, drone ship landing in the Bay of Bengal, or university CubeSat booking!"
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const samplePrompts = [
    'Why is Stage 2 HTPB + N2O safer than hydrazine?',
    'Explain the Bay of Bengal drone ship landing sequence',
    'How do universities book a CubeSat slot on VYOM-1?',
    'What role did AI play in Team ASTRYX-K4’s design?'
  ];

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    if (!userPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'VYOM-1 Telemetry link offline. Please verify flight parameters or try again.'
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'VYOM-1 Mission Control: AI Copilot momentarily unavailable. Team ASTRYX-K4 flight telemetry remains nominal.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="copilot" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>GEMINI AEROSPACE COPILOT</span>
            <span aria-hidden="true">·</span>
            <span>AI COLLABORATION</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            ASTRYX-K4 Mission Specialist
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl">
            Interact with our AI Mission Copilot to explore aerodynamic equations, propulsion thermochemistry, student rideshare procedures, and our design methodology.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>GEMINI 3.8 FLASH ENGINE</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                    isUser
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-cyan-400'
                  }`}
                >
                  {isUser ? 'ME' : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-xl text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-600/90 text-white font-medium rounded-tr-none'
                      : 'bg-slate-950/80 border border-slate-800/80 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-md">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl rounded-tl-none flex items-center gap-2 text-xs font-mono text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                Querying ASTRYX-K4 orbital telemetry...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <Rocket className="w-3 h-3 text-cyan-400" />
              Suggested:
            </span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 hover:border-cyan-800 transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Team ASTRYX-K4's Flight Officer about VYOM-1..."
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold shadow-md shadow-cyan-600/20 shrink-0"
          >
            <span>Transmit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
