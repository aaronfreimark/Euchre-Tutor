export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Rank = 'J' | 'A' | 'K' | 'Q' | '10' | '9';

export const SUITS: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
export const RANKS: Rank[] = ['J', 'A', 'K', 'Q', '10', '9'];

export interface CardDef {
  id: string;
  suit: Suit;
  rank: Rank;
  color: 'red' | 'black';
  isTrump: boolean;
  bower?: 'Right' | 'Left';
}

export function getSuitColor(suit: Suit): 'red' | 'black' {
  return suit === 'Hearts' || suit === 'Diamonds' ? 'red' : 'black';
}

export function getLeftSuit(suit: Suit): Suit {
  switch (suit) {
    case 'Hearts': return 'Diamonds';
    case 'Diamonds': return 'Hearts';
    case 'Clubs': return 'Spades';
    case 'Spades': return 'Clubs';
  }
}

export function getRankings(trump: Suit): { trumpCards: CardDef[], offSuits: { suit: Suit, cards: CardDef[] }[] } {
  const leftSuit = getLeftSuit(trump);
  const trumpCards: CardDef[] = [];

  // Right Bower (Jack of Trump suit)
  trumpCards.push({ 
    id: `${trump}-J`, 
    suit: trump, 
    rank: 'J', 
    color: getSuitColor(trump), 
    isTrump: true, 
    bower: 'Right' 
  });
  
  // Left Bower (Jack of the same color suit)
  trumpCards.push({ 
    id: `${leftSuit}-J`, 
    suit: leftSuit, 
    rank: 'J', 
    color: getSuitColor(leftSuit), 
    isTrump: true, 
    bower: 'Left' 
  });

  // Rest of trump suit descending
  ['A', 'K', 'Q', '10', '9'].forEach(rank => {
    trumpCards.push({ 
      id: `${trump}-${rank}`, 
      suit: trump, 
      rank: rank as Rank, 
      color: getSuitColor(trump), 
      isTrump: true 
    });
  });

  // Off-suits
  const offSuits = SUITS.filter(s => s !== trump).map(suit => {
    const cards: CardDef[] = [];
    // If it's the "Left" suit, it doesn't have a Jack (it became the Left Bower)
    const ranksToUse = suit === leftSuit 
      ? ['A', 'K', 'Q', '10', '9'] 
      : ['A', 'K', 'Q', 'J', '10', '9'];

    ranksToUse.forEach(rank => {
      cards.push({ 
        id: `${suit}-${rank}`, 
        suit: suit, 
        rank: rank as Rank, 
        color: getSuitColor(suit), 
        isTrump: false 
      });
    });
    
    return { suit, cards };
  });

  return { trumpCards, offSuits };
}
