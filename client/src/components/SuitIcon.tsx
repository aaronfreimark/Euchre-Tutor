import { Heart, Diamond, Club, Spade } from "lucide-react";
import { type Suit } from "@/lib/euchre";

interface SuitIconProps {
  suit: Suit;
  className?: string;
}

export function SuitIcon({ suit, className = "w-6 h-6" }: SuitIconProps) {
  const props = {
    className,
    fill: "currentColor",
    strokeWidth: 1.5,
  };

  switch (suit) {
    case "Hearts": return <Heart {...props} />;
    case "Diamonds": return <Diamond {...props} />;
    case "Clubs": return <Club {...props} />;
    case "Spades": return <Spade {...props} />;
  }
}
