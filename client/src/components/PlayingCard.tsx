import { motion } from "framer-motion";
import { type CardDef } from "@/lib/euchre";
import { SuitIcon } from "./SuitIcon";
import { Crown } from "lucide-react";

export function PlayingCard({ card, delay = 0 }: { card: CardDef, delay?: number }) {
  const isRed = card.color === 'red';
  const textColorClass = isRed ? 'text-suit-red' : 'text-suit-black';
  
  return (
    <motion.div
      layout
      layoutId={card.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        layout: { type: "spring", stiffness: 350, damping: 30 },
        opacity: { duration: 0.3, delay: delay * 0.05 },
        scale: { duration: 0.3, delay: delay * 0.05 }
      }}
      className={`
        relative flex flex-col items-center justify-center 
        w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44
        bg-white rounded-2xl border-2 border-slate-200/80
        shadow-sm hover:shadow-xl hover:-translate-y-2 
        transition-all duration-300 select-none cursor-default
        ${textColorClass}
        ${card.isTrump && !card.bower ? 'ring-2 ring-amber-100 ring-offset-2' : ''}
        ${card.bower ? 'border-amber-300 ring-4 ring-amber-200/50 shadow-md' : ''}
      `}
    >
      {/* Bower Badge */}
      {card.bower && (
        <div className={`
          absolute -top-3.5 left-1/2 -translate-x-1/2 
          flex items-center gap-1
          whitespace-nowrap px-3 py-1 
          text-[10px] sm:text-xs font-bold uppercase tracking-wider 
          rounded-full shadow-sm z-10 border 
          ${card.bower === 'Right' 
            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 border-amber-300' 
            : 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 border-slate-300'}
        `}>
          {card.bower === 'Right' && <Crown className="w-3 h-3" />}
          {card.bower} Bower
        </div>
      )}

      {/* Top Left Indicator */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col items-center leading-none">
        <span className="text-xl sm:text-2xl font-bold font-display tracking-tighter">
          {card.rank}
        </span>
        <SuitIcon suit={card.suit} className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5" />
      </div>

      {/* Center Icon */}
      <motion.div 
        initial={false}
        animate={{ scale: card.bower ? 1.2 : 1 }}
        className="opacity-90"
      >
        <SuitIcon suit={card.suit} className="w-10 h-10 sm:w-14 sm:h-14" />
      </motion.div>

      {/* Bottom Right Indicator (Flipped) */}
      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex flex-col items-center leading-none rotate-180">
        <span className="text-xl sm:text-2xl font-bold font-display tracking-tighter">
          {card.rank}
        </span>
        <SuitIcon suit={card.suit} className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5" />
      </div>
      
      {/* Shine effect for Bowers */}
      {card.bower && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
      )}
    </motion.div>
  );
}
