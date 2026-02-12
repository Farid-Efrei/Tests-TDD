import {
  Card,
  Rank,
  Suit,
  compareCards,
  evaluateFiveCards,
  HandCategory,
  compareHands,
} from "../src/poker";

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
      new Card(Rank.King, Suit.Hearts),
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.HighCard);
    expect(result.cards).toHaveLength(5);
    expect(result.cards[0].rank).toBe(Rank.King);
    expect(result.cards[4].rank).toBe(Rank.Two);
  });

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
});

describe("Poker - One Pair", () => {
  test("devrait identifier une paire", () => {
    const cards = [
      new Card(Rank.King, Suit.Spades),
      new Card(Rank.King, Suit.Hearts),
      new Card(Rank.Nine, Suit.Diamonds),
      new Card(Rank.Seven, Suit.Clubs),
      new Card(Rank.Three, Suit.Spades)
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.OnePair);
    expect(result.cards[0].rank).toBe(Rank.King);
    expect(result.cards[1].rank).toBe(Rank.King);
  });
});

describe("Poker - Two Pair", () => {
  test("devrait identifier une double paire", () => {
    const cards = [
      new Card(Rank.King, Suit.Spades),
      new Card(Rank.King, Suit.Hearts),
      new Card(Rank.Eight, Suit.Diamonds),
      new Card(Rank.Eight, Suit.Clubs),
      new Card(Rank.Three, Suit.Spades)
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.TwoPair);
    expect(result.cards[0].rank).toBe(Rank.King); // Paire haute
    expect(result.cards[2].rank).toBe(Rank.Eight); // Paire basse
    expect(result.cards[4].rank).toBe(Rank.Three); // Kicker
  });
});

describe("Poker - Three of a Kind", () => {
  test("devrait identifier un brelan", () => {
    const cards = [
      new Card(Rank.Queen, Suit.Spades),
      new Card(Rank.Queen, Suit.Hearts),
      new Card(Rank.Queen, Suit.Diamonds),
      new Card(Rank.Nine, Suit.Clubs),
      new Card(Rank.Three, Suit.Spades)
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.ThreeOfAKind);
    expect(result.cards[0].rank).toBe(Rank.Queen);
    expect(result.cards[1].rank).toBe(Rank.Queen);
    expect(result.cards[2].rank).toBe(Rank.Queen);
  });
});

describe("Poker - Straight", () => {
  test("devrait identifier une quinte", () => {
    const cards = [
      new Card(Rank.Five, Suit.Spades),
      new Card(Rank.Six, Suit.Hearts),
      new Card(Rank.Seven, Suit.Diamonds),
      new Card(Rank.Eight, Suit.Clubs),
      new Card(Rank.Nine, Suit.Spades)
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.Straight);
    expect(result.cards[0].rank).toBe(Rank.Nine); // Carte la plus haute
  });

  test("devrait identifier une quinte avec As faible (wheel)", () => {
    const cards = [
      new Card(Rank.Ace, Suit.Spades),
      new Card(Rank.Two, Suit.Hearts),
      new Card(Rank.Three, Suit.Diamonds),
      new Card(Rank.Four, Suit.Clubs),
      new Card(Rank.Five, Suit.Spades)
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.Straight);
    expect(result.cards[0].rank).toBe(Rank.Five); // Le 5 est la plus haute dans A-2-3-4-5
  });
});

describe("Couleur (Flush)", () => {
  test("devrait identifier une couleur", () => {
    const cards = [
      new Card(Rank.King, Suit.Hearts),
      new Card(Rank.Ten, Suit.Hearts),
      new Card(Rank.Seven, Suit.Hearts),
      new Card(Rank.Five, Suit.Hearts),
      new Card(Rank.Two, Suit.Hearts)
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.Flush);
    expect(result.cards[0].rank).toBe(Rank.King); // Carte la plus haute
  });
});

describe("Full House", () => {
  test("devrait identifier un full house", () => {
    const cards = [
      new Card(Rank.King, Suit.Hearts),
      new Card(Rank.King, Suit.Diamonds),
      new Card(Rank.King, Suit.Clubs),
      new Card(Rank.Five, Suit.Spades),
      new Card(Rank.Five, Suit.Hearts)
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.FullHouse);
    expect(result.cards[0].rank).toBe(Rank.King); // Brelan en premier
    expect(result.cards[3].rank).toBe(Rank.Five); // Paire ensuite
  });
});

describe("Four of a Kind (Carré)", () => {
  test("devrait identifier un carré", () => {
    const cards = [
      new Card(Rank.Jack, Suit.Hearts),
      new Card(Rank.Jack, Suit.Diamonds),
      new Card(Rank.Jack, Suit.Clubs),
      new Card(Rank.Jack, Suit.Spades),
      new Card(Rank.Three, Suit.Hearts)
    ];
    
    const result = evaluateFiveCards(cards);
    
    expect(result.category).toBe(HandCategory.FourOfAKind);
    expect(result.cards[0].rank).toBe(Rank.Jack); // Les 4 premières
    expect(result.cards[4].rank).toBe(Rank.Three); // Kicker en dernier
  });
});
