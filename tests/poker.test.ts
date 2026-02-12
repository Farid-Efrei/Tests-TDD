import { Card, Rank, Suit, compareCards } from "../src/poker";

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
