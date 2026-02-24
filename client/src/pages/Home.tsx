import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUITS, type Suit, getRankings, getSuitColor } from "@/lib/euchre";
import { SuitIcon } from "@/components/SuitIcon";
import { PlayingCard } from "@/components/PlayingCard";
import { Info } from "lucide-react";

export default function Home() {
  const [trump, setTrump] = useState<Suit>("Spades");
  const rankings = useMemo(() => getRankings(trump), [trump]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="pt-16 pb-12 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6 border border-slate-200/60 shadow-sm">
            <Info className="w-4 h-4" />
            Beginner's Guide
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            Euchre Card Rankings
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            In Euchre, the hierarchy of cards changes completely based on which suit is declared Trump. 
            Select a suit below to see how the ranks shift!
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trump Selector */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white/80 backdrop-blur-md p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 gap-2 sm:gap-4">
            {SUITS.map((suit) => {
              const isActive = suit === trump;
              const isRed = getSuitColor(suit) === "red";
              
              return (
                <button
                  key={suit}
                  onClick={() => setTrump(suit)}
                  className={`
                    relative px-4 sm:px-8 py-4 sm:py-5 rounded-2xl flex flex-col items-center gap-3 
                    transition-all duration-300 group outline-none
                    ${isActive ? (isRed ? 'text-suit-red' : 'text-suit-black') : 'text-slate-400 hover:text-slate-600'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-suit-bg"
                      className={`
                        absolute inset-0 rounded-2xl shadow-sm
                        ${isRed ? 'bg-red-50/80 border border-red-100' : 'bg-slate-100/80 border border-slate-200'}
                      `}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <SuitIcon suit={suit} className="w-8 h-8 sm:w-10 sm:h-10" />
                  </span>
                  <span className={`relative z-10 font-display font-bold text-sm sm:text-base tracking-wide ${!isActive && 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    {suit}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rankings Board */}
        <div className="space-y-12 md:space-y-20">
          
          {/* Trump Suit Section */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent rounded-[3rem] -z-10 -mx-4 sm:-mx-8" />
            <div className="pt-6 sm:pt-8 pb-4 px-2 sm:px-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 shadow-sm">
                    <SuitIcon suit={trump} className="w-5 h-5" />
                  </span>
                  Trump Suit Rankings
                </h2>
                <div className="text-sm text-slate-500 bg-white/60 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  Highest to lowest →
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {rankings.trumpCards.map((card, idx) => (
                    <div key={card.id} className="relative">
                      <PlayingCard card={card} delay={idx} />
                      {/* Connection lines between Bowers to show they are special */}
                      {idx === 0 && (
                        <div className="hidden lg:block absolute top-1/2 -right-6 w-6 h-px bg-amber-200 border-t border-dashed border-amber-400 -translate-y-1/2 z-0" />
                      )}
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* Off-Suits Section */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-2 sm:px-4">
              <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-3">
                Off-Suits
              </h2>
              <div className="text-sm text-slate-500 bg-white/60 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                Standard ranking (A, K, Q, J, 10, 9)
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {rankings.offSuits.map((os) => (
                <div 
                  key={os.suit} 
                  className="bg-white/40 backdrop-blur-sm p-6 sm:p-8 rounded-[2rem] border border-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:bg-white/60"
                >
                  <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3 text-slate-700">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-white ${getSuitColor(os.suit) === 'red' ? 'text-suit-red' : 'text-suit-black'}`}>
                      <SuitIcon suit={os.suit} className="w-4 h-4" />
                    </span>
                    {os.suit}
                  </h3>
                  
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <AnimatePresence mode="popLayout">
                      {os.cards.map((card, idx) => (
                        <div key={card.id} className="scale-90 origin-top-left -mr-6 sm:-mr-8 last:mr-0 hover:z-10 hover:scale-100 transition-transform duration-200">
                           <PlayingCard card={card} delay={idx} />
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {/* Note for the suit missing its Jack */}
                  {os.cards.length === 5 && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="mt-6 text-sm text-slate-500 italic bg-slate-100/50 p-3 rounded-xl border border-slate-200/50"
                    >
                      * Note: The Jack of {os.suit} is currently the Left Bower in the Trump suit!
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
