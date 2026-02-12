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

export function compareCards(card1: Card, card2: Card): number {
  return card1.rank - card2.rank;
}

export function sortCardsByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => b.rank - a.rank);
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
