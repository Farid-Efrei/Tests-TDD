<<<<<<< HEAD
import {
  Card,
  Rank,
  Suit,
  compareCards,
  evaluateFiveCards,
  HandCategory,
  compareHands,
} from "../src/poker";
=======
import { Card, Rank, Suit, compareCards, evaluateFiveCards, HandCategory } from "../src/poker";
>>>>>>> 374d692d95c3a882e633976c95c6b83390960821

describe("Poker - Bases des cartes", () => {
  test("devrait créer une carte avec rang et couleur", () => {
    const card = new Card(Rank.Ace, Suit.Spades);
    expect(card.rank).toBe(Rank.Ace);
    expect(card.suit).toBe(Suit.Spades);
  });

  test("devrait comparer deux cartes par rang", () => {
    const aceSpades = new Card(Rank.Ace, Suit.Spades);
    const kingHearts = new Card(Rank.King, Suit.Hearts);
    const aceHearts = new Card(Rank.Ace, Suit.Hearts);

    expect(compareCards(aceSpades, kingHearts)).toBeGreaterThan(0);
    expect(compareCards(kingHearts, aceSpades)).toBeLessThan(0);
    expect(compareCards(aceSpades, aceHearts)).toBe(0);
  });
});

describe("Poker - High Card", () => {
  test("devrait identifier une main haute carte", () => {
    const cards = [
      new Card(Rank.Two, Suit.Hearts),
      new Card(Rank.Five, Suit.Clubs),
      new Card(Rank.Nine, Suit.Diamonds),
      new Card(Rank.Jack, Suit.Spades),
<<<<<<< HEAD
      new Card(Rank.King, Suit.Hearts),
    ];
    const result = evaluateFiveCards(cards);
=======
      new Card(Rank.King, Suit.Hearts)
    ];
    
    const result = evaluateFiveCards(cards);
    
>>>>>>> 374d692d95c3a882e633976c95c6b83390960821
    expect(result.category).toBe(HandCategory.HighCard);
    expect(result.cards).toHaveLength(5);
    expect(result.cards[0].rank).toBe(Rank.King);
    expect(result.cards[4].rank).toBe(Rank.Two);
  });
<<<<<<< HEAD

  test("devrait comparer deux high cards correctement", () => {
    const hand1 = {
      category: HandCategory.HighCard,
      cards: [
        new Card(Rank.Ace, Suit.Spades),
        new Card(Rank.King, Suit.Hearts),
        new Card(Rank.Queen, Suit.Diamonds),
        new Card(Rank.Jack, Suit.Clubs),
        new Card(Rank.Nine, Suit.Spades),
      ],
    };
    const hand2 = {
      category: HandCategory.HighCard,
      cards: [
        new Card(Rank.Ace, Suit.Hearts),
        new Card(Rank.King, Suit.Clubs),
        new Card(Rank.Queen, Suit.Spades),
        new Card(Rank.Jack, Suit.Hearts),
        new Card(Rank.Eight, Suit.Diamonds),
      ],
    };
    const comparison = compareHands(hand1, hand2);
    expect(comparison).toBeGreaterThan(0);
  });
=======
>>>>>>> 374d692d95c3a882e633976c95c6b83390960821
});
