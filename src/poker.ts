export enum Suit {
  Hearts = "♥",
  Diamonds = "♦",
  Clubs = "♣",
  Spades = "♠",
}

export enum Rank {
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  Ace = 14,
}

export class Card {
  constructor(
    public rank: Rank,
    public suit: Suit,
  ) {}
}

export enum HandCategory {
  HighCard = 1,
  OnePair = 2,
  TwoPair = 3,
  ThreeOfAKind = 4,
  Straight = 5,
  Flush = 6,
  FullHouse = 7,
  FourOfAKind = 8,
  StraightFlush = 9,
}

export interface HandResult {
  category: HandCategory;
  cards: Card[];
}

export function compareCards(card1: Card, card2: Card): number {
  return card1.rank - card2.rank;
}

export function sortCardsByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => b.rank - a.rank);
}

function getRankCounts(cards: Card[]): Map<Rank, Card[]> {
  const counts = new Map<Rank, Card[]>();
  for (const card of cards) {
    if (!counts.has(card.rank)) {
      counts.set(card.rank, []);
    }
    counts.get(card.rank)!.push(card);
  }
  return counts;
}

export function evaluateFiveCards(cards: Card[]): HandResult {
  if (cards.length !== 5) {
    throw new Error('Doit fournir exactement 5 cartes');
  }
  
  const sorted = sortCardsByRank(cards);
  const rankCounts = getRankCounts(cards);
  
  // Trouver toutes les paires
  const pairs: Rank[] = [];
  for (const [rank, cardsOfRank] of rankCounts) {
    if (cardsOfRank.length === 2) {
      pairs.push(rank);
    }
  }
  
  // Vérifier Two Pair
  if (pairs.length === 2) {
    pairs.sort((a, b) => b - a); // Trier paires décroissant
    const highPair = rankCounts.get(pairs[0])!;
    const lowPair = rankCounts.get(pairs[1])!;
    const kicker = sorted.filter(c => c.rank !== pairs[0] && c.rank !== pairs[1]);
    
    return {
      category: HandCategory.TwoPair,
      cards: [...highPair, ...lowPair, ...kicker]
    };
  }
  
  // Vérifier One Pair
  if (pairs.length === 1) {
    const pairCards = rankCounts.get(pairs[0])!;
    const kickers = sorted.filter(c => c.rank !== pairs[0]);
    
    return {
      category: HandCategory.OnePair,
      cards: [...pairCards, ...kickers]
    };
  }
  
  // High Card
  return {
    category: HandCategory.HighCard,
    cards: sorted
  };
}

export function compareHands(hand1: HandResult, hand2: HandResult): number {
  // Comparer les catégories d'abord
  if (hand1.category !== hand2.category) {
    return hand1.category - hand2.category;
  }
  
  // Même catégorie : comparer les cartes une par une
  for (let i = 0; i < 5; i++) {
    const diff = hand1.cards[i].rank - hand2.cards[i].rank;
    if (diff !== 0) {
      return diff;
    }
  }
  
  return 0; // Égalité parfaite
}
