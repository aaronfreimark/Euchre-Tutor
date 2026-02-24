import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SUITS, type Suit, type Rank, getRankings, getSuitColor, getSuitSymbol } from "@/lib/euchre";
import type { CardDef } from "@/lib/euchre";
function CardChip({ card }: { card: CardDef }) {
  const isRed = card.color === 'red';
  const symbol = getSuitSymbol(card.suit);

  return (
    <span
      className={`inline-flex items-center text-sm sm:text-base font-semibold suit-symbol ${isRed ? 'text-suit-red' : 'text-suit-black'}`}
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
      <header className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900">
          Euchre Card Rankings
        </h1>
      </header>

      <div className="flex flex-col items-center mb-6 sm:mb-10 gap-2">
        <div className="flex w-full bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-md border border-slate-200 gap-1 sm:gap-1.5">
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
                  relative flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5
                  transition-all duration-200 outline-none font-display font-bold text-base sm:text-lg
                  cursor-pointer select-none
                  ${isActive
                    ? (isRed
                        ? 'text-suit-red ring-2 ring-rose-500 bg-white shadow-sm border border-transparent'
                        : 'text-suit-black ring-2 ring-slate-700 bg-white shadow-sm border border-transparent')
                    : (isRed
                        ? 'text-suit-red border border-slate-200 hover:border-rose-300 hover:bg-rose-50 active:bg-rose-100'
                        : 'text-suit-black border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100')}
                `}
              >
                <span className="text-lg sm:text-xl suit-symbol">{getSuitSymbol(suit)}</span>
                <span className="hidden sm:inline text-sm">{suit}</span>
              </button>
            );
          })}
        </div>
        <p className="text-slate-500 text-xs sm:text-sm">
          Select trump to see how rankings change
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <section data-testid="section-trump">
          <h2 className="text-base sm:text-lg font-display font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
            <span className={`suit-symbol ${getSuitColor(trump) === 'red' ? 'text-suit-red' : 'text-suit-black'}`}>
              {getSuitSymbol(trump)}
            </span>
            Trump
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium ml-auto">
              High to Low
            </span>
          </h2>

          <motion.div
            key={trump}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 sm:p-6"
          >
          <div className="grid gap-y-0" style={{ gridTemplateColumns: `repeat(${rankings.trumpCards.length}, minmax(0, 1fr))` }}>
            {rankings.trumpCards.map((card, idx) => (
              <motion.div
                key={`${trump}-${card.id}`}
                initial={{ opacity: 0, y: -12, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05, ease: "easeOut" }}
                className="flex flex-col items-center gap-0.5"
                data-testid={`card-trump-${idx}`}
              >
                <CardChip card={card} />
                {card.bower ? (
                  <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-center leading-tight ${card.bower === 'Right' ? 'text-amber-500' : 'text-slate-400'}`}>
                    {card.bower}<br />Bower
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs invisible">-</span>
                )}
              </motion.div>
            ))}
          </div>
          </motion.div>
        </section>

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
                  {rankings.offSuits.map((os, rowIdx) => (
                    offRanks.map((rank, colIdx) => {
                      const card = os.cards.find(c => c.rank === rank);
                      const isLeftBowerHole = !card && rank === 'J' && os.suit === leftSuit;
                      const delay = rowIdx * 0.08 + colIdx * 0.04;
                      return (
                        <motion.div
                          key={`${trump}-${os.suit}-${rank}`}
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.25, delay, ease: "easeOut" }}
                          className="flex items-center justify-center py-1 sm:py-1.5"
                          data-testid={card ? `card-offsuit-${os.suit.toLowerCase()}-${rank.toLowerCase()}` : undefined}
                        >
                          {card ? (
                            <CardChip card={card} />
                          ) : isLeftBowerHole ? (
                            <span className="text-[10px] sm:text-xs text-slate-300 italic">L.B.</span>
                          ) : null}
                        </motion.div>
                      );
                    })
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      </div>

      <p className="text-center text-xs sm:text-sm text-slate-400 italic mt-6 sm:mt-8">
        Remember to always play the suit of the lead card when possible.
      </p>
    </div>
  );
}
