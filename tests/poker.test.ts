import { Card, Rank, Suit } from '../src/poker';

describe('Poker - Bases des cartes', () => {
  test('devrait créer une carte avec rang et couleur', () => {
    const card = new Card(Rank.Ace, Suit.Spades);
    expect(card.rank).toBe(Rank.Ace);
    expect(card.suit).toBe(Suit.Spades);
  });
});
