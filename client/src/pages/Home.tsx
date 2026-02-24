import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SUITS, type Suit, getRankings, getSuitColor, getSuitSymbol } from "@/lib/euchre";
import type { CardDef } from "@/lib/euchre";
import { Crown, Star } from "lucide-react";

function CardChip({ card }: { card: CardDef }) {
  const isRed = card.color === 'red';
  const symbol = getSuitSymbol(card.suit);

  if (card.bower) {
    const isRight = card.bower === 'Right';
    return (
      <span
        className={`
          inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-sm sm:text-base
          border shadow-sm
          ${isRight
            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 text-amber-900'
            : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300 text-slate-800'}
        `}
        data-testid={`chip-${card.bower.toLowerCase()}-bower`}
      >
        {isRight && <Crown className="w-3.5 h-3.5 text-amber-500" />}
        {!isRight && <Star className="w-3.5 h-3.5 text-slate-400" />}
        <span className={isRed ? 'text-suit-red' : 'text-suit-black'}>{symbol}</span>{card.rank}
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide opacity-60 ml-0.5">
          {card.bower}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center text-sm sm:text-base font-semibold ${isRed ? 'text-suit-red' : 'text-suit-black'}`}
    >
      {symbol}{card.rank}
    </span>
  );
}

export default function Home() {
  const [trump, setTrump] = useState<Suit>("Spades");
  const rankings = useMemo(() => getRankings(trump), [trump]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10 max-w-2xl mx-auto">
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900">
          Euchre Card Rankings
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Select trump to see how rankings change
        </p>
      </header>

      <div className="flex justify-center mb-6 sm:mb-10">
        <div className="inline-flex bg-white/80 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/60 gap-0.5 sm:gap-1">
          {SUITS.map((suit) => {
            const isActive = suit === trump;
            const isRed = getSuitColor(suit) === "red";
            const symbol = getSuitSymbol(suit);

            return (
              <button
                key={suit}
                data-testid={`button-suit-${suit.toLowerCase()}`}
                onClick={() => setTrump(suit)}
                className={`
                  relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-1.5
                  transition-all duration-200 outline-none font-display font-bold text-base sm:text-lg
                  ${isActive
                    ? (isRed ? 'text-suit-red bg-red-50 border border-red-100' : 'text-suit-black bg-slate-100 border border-slate-200')
                    : 'text-slate-400 hover:text-slate-600 border border-transparent'}
                `}
              >
                <span className="text-lg sm:text-xl">{symbol}</span>
                <span className="hidden sm:inline text-sm">{suit}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <motion.section
          key={trump}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 sm:p-6"
          data-testid="section-trump"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 flex items-center gap-2">
              <span className={getSuitColor(trump) === 'red' ? 'text-suit-red' : 'text-suit-black'}>
                {getSuitSymbol(trump)}
              </span>
              Trump
            </h2>
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">
              High to Low
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2">
            {rankings.trumpCards.map((card, idx) => (
              <span key={card.id} className="flex items-center gap-1.5 sm:gap-2" data-testid={`card-trump-${idx}`}>
                <CardChip card={card} />
                {idx < rankings.trumpCards.length - 1 && (
                  <span className="text-slate-300 text-xs select-none">&gt;</span>
                )}
              </span>
            ))}
          </div>
        </motion.section>

        <section data-testid="section-offsuits">
          <h2 className="text-base sm:text-lg font-display font-bold text-slate-800 mb-3 sm:mb-4">
            Off-Suits
          </h2>

          <div className="space-y-3">
            {rankings.offSuits.map((os) => (
              <div
                key={os.suit}
                className="bg-white/50 border border-slate-200/60 rounded-lg p-3 sm:p-4"
                data-testid={`section-offsuit-${os.suit.toLowerCase()}`}
              >
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5">
                  <span className={`font-display font-bold text-sm sm:text-base ${getSuitColor(os.suit) === 'red' ? 'text-suit-red' : 'text-suit-black'} min-w-[5rem] sm:min-w-[6rem]`}>
                    {getSuitSymbol(os.suit)} {os.suit}
                  </span>
                  {os.cards.map((card, idx) => (
                    <span key={card.id} className="flex items-center gap-1.5 sm:gap-2" data-testid={`card-offsuit-${os.suit.toLowerCase()}-${idx}`}>
                      <CardChip card={card} />
                      {idx < os.cards.length - 1 && (
                        <span className="text-slate-300 text-xs select-none">&gt;</span>
                      )}
                    </span>
                  ))}
                </div>
                {os.cards.length === 5 && (
                  <p className="text-[11px] sm:text-xs text-slate-400 italic mt-2">
                    Jack is the Left Bower in trump
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
