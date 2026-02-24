import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SUITS, type Suit, type Rank, getRankings, getSuitColor, getSuitSymbol } from "@/lib/euchre";
import type { CardDef } from "@/lib/euchre";
import { SuitIcon } from "@/components/SuitIcon";
function CardChip({ card }: { card: CardDef }) {
  const isRed = card.color === 'red';
  const symbol = getSuitSymbol(card.suit);

  return (
    <span
      className={`inline-flex items-center text-sm sm:text-base font-semibold ${isRed ? 'text-suit-red' : 'text-suit-black'}`}
      data-testid={card.bower ? `chip-${card.bower.toLowerCase()}-bower` : undefined}
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
        <div className="inline-flex bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-md border border-slate-200 gap-1 sm:gap-1.5">
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
                  cursor-pointer select-none
                  ${isActive
                    ? (isRed
                        ? 'text-white bg-rose-500 shadow-sm border border-rose-400'
                        : 'text-white bg-slate-700 shadow-sm border border-slate-600')
                    : (isRed
                        ? 'text-suit-red border border-slate-100 hover:border-rose-300 hover:bg-rose-50 active:bg-rose-100'
                        : 'text-suit-black border border-slate-100 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100')}
                `}
              >
                <SuitIcon suit={suit} className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-white' : ''}`} />
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

          <div className="grid gap-y-0" style={{ gridTemplateColumns: `repeat(${rankings.trumpCards.length}, minmax(0, 1fr))` }}>
            {rankings.trumpCards.map((card, idx) => (
              <div key={card.id} className="flex flex-col items-center gap-0.5" data-testid={`card-trump-${idx}`}>
                <CardChip card={card} />
                {card.bower ? (
                  <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-center leading-tight ${card.bower === 'Right' ? 'text-amber-500' : 'text-slate-400'}`}>
                    {card.bower}<br />Bower
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs invisible">-</span>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        <section data-testid="section-offsuits">
          <h2 className="text-base sm:text-lg font-display font-bold text-slate-800 mb-3 sm:mb-4">
            Off-Suits
          </h2>

          <div className="bg-white/50 border border-slate-200/60 rounded-xl p-3 sm:p-5">
            {(() => {
              const offRanks: Rank[] = ['A', 'K', 'Q', 'J', '10', '9'];
              const leftSuit = rankings.offSuits.find(os => os.cards.length === 5)?.suit;
              return (
                <div className="grid gap-y-2 sm:gap-y-3" style={{ gridTemplateColumns: `repeat(${offRanks.length}, minmax(0, 1fr))` }}>
                  {offRanks.map((rank) => (
                    <div key={rank} className="text-center text-xs sm:text-sm font-display font-bold text-slate-400 pb-1 sm:pb-2 border-b border-slate-100">
                      {rank}
                    </div>
                  ))}
                  {rankings.offSuits.map((os) => (
                    offRanks.map((rank) => {
                      const card = os.cards.find(c => c.rank === rank);
                      const isLeftBowerHole = !card && rank === 'J' && os.suit === leftSuit;
                      return (
                        <div
                          key={`${os.suit}-${rank}`}
                          className="flex items-center justify-center py-1 sm:py-1.5"
                          data-testid={card ? `card-offsuit-${os.suit.toLowerCase()}-${rank.toLowerCase()}` : undefined}
                        >
                          {card ? (
                            <CardChip card={card} />
                          ) : isLeftBowerHole ? (
                            <span className="text-[10px] sm:text-xs text-slate-300 italic">L.B.</span>
                          ) : null}
                        </div>
                      );
                    })
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      </div>
    </div>
  );
}
