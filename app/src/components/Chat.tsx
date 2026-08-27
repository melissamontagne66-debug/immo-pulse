import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChatMessage } from '@/types';
import type { UserProfile } from '@/types/profile';
import { Send, Trash2, Bot, User, Sparkles, Target, Phone, MessageCircle } from 'lucide-react';

interface ChatProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  profile: UserProfile;
  dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number };
}

const QUICK_QUESTIONS = [
  "Comment préparer mon R1 ?",
  "La technique des 3 oui en message LeBonCoin",
  "Gérer l'objection prix trop haut",
  "Comment créer l'urgence lors d'une visite ?",
  "La règle du silence en négociation",
  "Qu'est-ce que la Garantie 30 Jours ?",
  "Comment qualifier un acquéreur ?",
  "Le kit notaire : les 10 pièces",
  "Gestion du temps : time blocking",
  "Motivation : j'ai du mal aujourd'hui",
];

export function Chat({ messages, isTyping, onSendMessage, onClearChat, profile, dailyTargets }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <p key={i} className="font-bold text-gray-900 text-base mt-3 mb-1">{line.replace('## ', '')}</p>;
      }
      if (line.startsWith('**') && line.endsWith('**') && !line.includes('**', 2)) {
        return <p key={i} className="font-bold text-gray-900 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ')) {
        return <p key={i} className="flex items-start gap-2 text-sm text-gray-700 ml-2"><span className="text-red-500 mt-0.5 flex-shrink-0">•</span><span>{line.replace('• ', '')}</span></p>;
      }
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^\d+/)?.[0] || '';
        const rest = line.replace(/^\d+\.\s/, '');
        return <p key={i} className="flex items-start gap-2 text-sm text-gray-700 ml-2"><span className="font-semibold text-red-600 flex-shrink-0">{num}.</span><span>{rest}</span></p>;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return <p key={i} className="text-sm text-gray-700 leading-relaxed">{parts.map((part, j) => part.startsWith('**') && part.endsWith('**') ? <strong key={j} className="text-gray-900">{part.replace(/\*\*/g, '')}</strong> : part)}</p>;
      }
      return <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3 text-white flex items-center gap-3 shadow-md">
        <Target className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-medium opacity-90">Mes objectifs aujourd'hui {profile.firstName ? `- ${profile.firstName}` : ''}</p>
          <p className="text-sm font-semibold">{dailyTargets.calls} conversations · {dailyTargets.contactsPhysiques} contacts physiques · {dailyTargets.rdvR1} R1 · {dailyTargets.rdvR2} R2</p>
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg"><Phone className="w-4 h-4" /><span className="text-sm font-bold">{dailyTargets.calls}</span></div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md"><Sparkles className="w-5 h-5 text-white" /></div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">Le Coach Immo <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">En ligne</span></h2>
            <p className="text-xs text-gray-500">Basé sur les méthodes des tops performers</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClearChat} className="text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4 mr-1" />Effacer</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Messages area with proper scroll */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-100' : 'bg-gradient-to-br from-red-500 to-red-600 shadow-sm'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-red-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-900 rounded-tl-sm'}`}>
                    {msg.role === 'assistant' ? <div className="space-y-0.5">{formatMessage(msg.content)}</div> : <p className="text-sm">{msg.content}</p>}
                    <p className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-red-200' : 'text-gray-400'}`}>{new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm"><Bot className="w-4 h-4 text-white" /></div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3"><div className="flex gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
            <div className="flex gap-3">
              <Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Poser ma question au Coach..." className="flex-1" disabled={isTyping} />
              <Button type="submit" disabled={!input.trim() || isTyping} className="bg-red-600 hover:bg-red-700"><Send className="w-4 h-4" /></Button>
            </div>
          </form>
        </div>

        <div className="hidden lg:block space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><MessageCircle className="w-4 h-4 text-red-600" />Questions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => !isTyping && onSendMessage(q)} disabled={isTyping} className="w-full text-left text-xs p-2.5 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-700 text-gray-600 transition-colors disabled:opacity-50">{q}</button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
