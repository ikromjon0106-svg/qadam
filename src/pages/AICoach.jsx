import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

export default function AICoach() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Salom! Men sizning shaxsiy AI murabbiyingizman 🏃‍♂️\n\nMen sizga yurish, yugurish va sog'liq bo'yicha maslahatlar beraman. Nimani bilmoqchisiz?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: (await base44.auth.me()).id });
      return profiles[0] || null;
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const context = profile
      ? `Foydalanuvchi ma'lumotlari: Ism: ${profile.display_name}, Bo'yi: ${profile.height_cm || 'noma\'lum'} sm, Vazni: ${profile.weight_kg || 'noma\'lum'} kg, Jami masofa: ${profile.total_distance_km || 0} km, Daraja: ${profile.level || 1}, Kunlik qadamlar: ${profile.daily_steps || 0}`
      : '';

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Sen "Qadam" fitness ilovasining AI murabbiyisan. O'zbek tilida javob ber. Faqat yurish, yugurish, sog'liq va fitness haqida maslahat ber. Qisqa va foydali javoblar ber.

${context}

Foydalanuvchi savoli: ${userMsg}`,
    });

    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const suggestions = [
    "Bugun qancha yurish kerak?",
    "Vazn tashlash uchun maslahat",
    "Yugurishni qanday boshlash?",
    "Kaloriya hisoblash",
  ];

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="glass-strong px-4 py-3 flex items-center gap-3 z-10">
        <Link to="/">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-bold">AI Murabbiy</h1>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Shaxsiy fitness maslahatchisi
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'glass'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <ReactMarkdown className="text-sm prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {suggestions.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="rounded-full text-xs whitespace-nowrap"
                onClick={() => { setInput(s); }}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass-strong px-4 py-3 flex gap-2">
        <Input
          placeholder="Savolingizni yozing..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="rounded-full bg-muted/50"
        />
        <Button
          size="icon"
          className="rounded-full shrink-0"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}