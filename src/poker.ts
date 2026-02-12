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

// Constantes pour la logique du jeu
const HAND_SIZE = 5;
const STRAIGHT_SEQUENCE_LENGTH = 4;
const MIN_CARDS_FOR_BEST_HAND = 5;

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

/**
 * Compare deux cartes par leur rang.
 * @param card1 - Première carte
 * @param card2 - Deuxième carte
 * @returns Nombre positif si card1 > card2, négatif si card1 < card2, 0 si égalité
 */
export function compareCards(card1: Card, card2: Card): number {
  return card1.rank - card2.rank;
}

/**
 * Trie un tableau de cartes par rang décroissant.
 * @param cards - Tableau de cartes à trier
 * @returns Nouveau tableau trié (ne modifie pas l'original)
 */
export function sortCardsByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => b.rank - a.rank);
}

/**
 * Regroupe les cartes par rang.
 * @param cards - Tableau de cartes
 * @returns Map associant chaque rang aux cartes correspondantes
 */
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

/**
 * Vérifie si les 5 cartes forment une quinte (suite).
 * Gère le cas spécial de la "wheel" (A-2-3-4-5).
 * @param cards - Tableau de 5 cartes
 * @returns Cartes de la quinte triées, ou null si pas de quinte
 */
function checkStraight(cards: Card[]): Card[] | null {
  const sorted = sortCardsByRank(cards);
  const uniqueRanks = [...new Set(sorted.map((c) => c.rank))].sort(
    (a, b) => b - a,
  );

  if (uniqueRanks.length < HAND_SIZE) {
    return null;
  }

  // Cas spécial: As faible (A-2-3-4-5, "wheel")
  if (
    uniqueRanks[0] === Rank.Ace &&
    uniqueRanks.includes(Rank.Five) &&
    uniqueRanks.includes(Rank.Four) &&
    uniqueRanks.includes(Rank.Three) &&
    uniqueRanks.includes(Rank.Two)
  ) {
    // Retourner les cartes dans l'ordre 5-4-3-2-A
    return [
      sorted.find((c) => c.rank === Rank.Five)!,
      sorted.find((c) => c.rank === Rank.Four)!,
      sorted.find((c) => c.rank === Rank.Three)!,
      sorted.find((c) => c.rank === Rank.Two)!,
      sorted.find((c) => c.rank === Rank.Ace)!,
    ];
  }

  // Vérifier une quinte normale
  for (let i = 0; i <= uniqueRanks.length - HAND_SIZE; i++) {
    if (uniqueRanks[i] - uniqueRanks[i + STRAIGHT_SEQUENCE_LENGTH] === STRAIGHT_SEQUENCE_LENGTH) {
      // Trouvé une quinte
      const straightRanks = uniqueRanks.slice(i, i + 5);
      const straightCards = straightRanks.map(
        (rank) => sorted.find((c) => c.rank === rank)!,
      );
      return straightCards;
    }
  }

  return null;
}

/**
 * Vérifie si les 5 cartes sont de la même couleur (flush).
 * @param cards - Tableau de 5 cartes
 * @returns Cartes triées par rang décroissant, ou null si pas de flush
 */
function checkFlush(cards: Card[]): Card[] | null {
  const firstSuit = cards[0].suit;
  const allSameSuit = cards.every((card) => card.suit === firstSuit);

  if (allSameSuit) {
    return sortCardsByRank(cards);
  }

  return null;
}

/**
 * Évalue une main de 5 cartes et retourne la meilleure catégorie.
 * 
 * L'ordre de vérification est crucial pour détecter correctement les mains :
 * 1. Four of a Kind (rare, vérification rapide via comptage)
 * 2. Full House (combinaison spécifique de brelan + paire)
 * 3. Straight Flush (DOIT être vérifié AVANT Flush et Straight séparés)
 * 4. Flush (5 cartes même couleur)
 * 5. Straight (5 cartes consécutives)
 * 6. Three of a Kind (brelan)
 * 7. Two Pair (deux paires)
 * 8. One Pair (une paire)
 * 9. High Card (aucune combinaison)
 * 
 * @param cards - Tableau de exactement 5 cartes
 * @returns HandResult contenant la catégorie et les cartes triées
 * @throws Error si le nombre de cartes n'est pas exactement 5
 */
export function evaluateFiveCards(cards: Card[]): HandResult {
  if (cards.length !== HAND_SIZE) {
    throw new Error(`Doit fournir exactement ${HAND_SIZE} cartes`);
  }

  const sorted = sortCardsByRank(cards);
  const rankCounts = getRankCounts(cards);

  // Vérifier Four of a Kind (Carré)
  for (const [rank, cardsOfRank] of rankCounts) {
    if (cardsOfRank.length === 4) {
      const quad = cardsOfRank;
      const kicker = sorted.filter((c) => c.rank !== rank);

      return {
        category: HandCategory.FourOfAKind,
        cards: [...quad, ...kicker],
      };
    }
  }

  // Vérifier Full House (Brelan + Paire)
  const ranks = Array.from(rankCounts.keys());
  const tripletRank = ranks.find((r) => rankCounts.get(r)!.length === 3);
  const pairRank = ranks.find((r) => rankCounts.get(r)!.length === 2);

  if (tripletRank && pairRank) {
    const tripletCards = rankCounts.get(tripletRank)!;
    const pairCards = rankCounts.get(pairRank)!;

    return {
      category: HandCategory.FullHouse,
      cards: [...tripletCards, ...pairCards],
    };
  }

  // Vérifier Straight Flush (doit être vérifié AVANT Flush et Straight séparés)
  const flushCards = checkFlush(cards);
  const straightCards = checkStraight(cards);

  if (flushCards && straightCards) {
    return {
      category: HandCategory.StraightFlush,
      cards: straightCards, // Utiliser l'ordre du straight
    };
  }

  // Vérifier Flush
  if (flushCards) {
    return {
      category: HandCategory.Flush,
      cards: flushCards,
    };
  }

  // Vérifier Straight
  if (straightCards) {
    return {
      category: HandCategory.Straight,
      cards: straightCards,
    };
  }

  // Vérifier Three of a Kind
  for (const [rank, cardsOfRank] of rankCounts) {
    if (cardsOfRank.length === 3) {
      const triplet = cardsOfRank;
      const kickers = sortCardsByRank(sorted.filter((c) => c.rank !== rank));

      return {
        category: HandCategory.ThreeOfAKind,
        cards: [...triplet, ...kickers],
      };
    }
  }

  // Trouver toutes les paires
  const pairs: Rank[] = [];
  for (const [rank, cardsOfRank] of rankCounts) {
    if (cardsOfRank.length === 2) {
      pairs.push(rank);
    }
  }

  // Vérifier Two Pair
  if (pairs.length === 2) {
    pairs.sort((a, b) => b - a);
    const highPair = rankCounts.get(pairs[0])!;
    const lowPair = rankCounts.get(pairs[1])!;
    const kicker = sorted.filter(
      (c) => c.rank !== pairs[0] && c.rank !== pairs[1],
    );

    return {
      category: HandCategory.TwoPair,
      cards: [...highPair, ...lowPair, ...kicker],
    };
  }

  // Vérifier One Pair
  if (pairs.length === 1) {
    const pairCards = rankCounts.get(pairs[0])!;
    const kickers = sorted.filter((c) => c.rank !== pairs[0]);

    return {
      category: HandCategory.OnePair,
      cards: [...pairCards, ...kickers],
    };
  }

  // High Card
  return {
    category: HandCategory.HighCard,
    cards: sorted,
  };
}

/**
 * Compare deux mains de poker pour déterminer le gagnant.
 * @param hand1 - Première main à comparer
 * @param hand2 - Deuxième main à comparer
 * @returns Nombre positif si hand1 gagne, négatif si hand2 gagne, 0 si égalité
 */
export function compareHands(hand1: HandResult, hand2: HandResult): number {
  // Comparer les catégories d'abord
  if (hand1.category !== hand2.category) {
    return hand1.category - hand2.category;
  }

  // Même catégorie : comparer les cartes une par une
  for (let i = 0; i < HAND_SIZE; i++) {
    const diff = hand1.cards[i].rank - hand2.cards[i].rank;
    if (diff !== 0) {
      return diff;
    }
  }

  return 0; // Égalité parfaite
}

/**
 * Trouve la meilleure main de 5 cartes parmi n cartes (typiquement 7 pour Texas Hold'em).
 * @param cards - Tableau d'au moins 5 cartes
 * @returns HandResult de la meilleure combinaison possible
 * @throws Error si moins de 5 cartes fournies
 */
export function findBestFiveCardHand(cards: Card[]): HandResult {
  if (cards.length < MIN_CARDS_FOR_BEST_HAND) {
    throw new Error(`Besoin d'au moins ${MIN_CARDS_FOR_BEST_HAND} cartes`);
  }

  if (cards.length === HAND_SIZE) {
    return evaluateFiveCards(cards);
  }

  // Générer toutes les combinaisons de 5 cartes parmi n
  const combinations: Card[][] = [];

  function combine(start: number, combo: Card[]) {
    if (combo.length === HAND_SIZE) {
      combinations.push([...combo]);
      return;
    }

    for (let i = start; i < cards.length; i++) {
      combo.push(cards[i]);
      combine(i + 1, combo);
      combo.pop();
    }
  }

  combine(0, []);

  // Évaluer toutes les combinaisons et garder la meilleure
  let bestHand = evaluateFiveCards(combinations[0]);

  for (let i = 1; i < combinations.length; i++) {
    const currentHand = evaluateFiveCards(combinations[i]);
    if (compareHands(currentHand, bestHand) > 0) {
      bestHand = currentHand;
    }
  }

  return bestHand;
}

/**
 * Détermine le(s) gagnant(s) parmi plusieurs joueurs.
 * @param playerHands - Tableau de mains de joueurs (chaque main = 7 cartes)
 * @returns Tableau des indices des joueurs gagnants (plusieurs en cas d'égalité)
 */
export function findWinners(playerHands: Card[][]): number[] {
  const evaluatedHands = playerHands.map((hand) => findBestFiveCardHand(hand));

  let bestHandIndices = [0];
  let bestHand = evaluatedHands[0];

  for (let i = 1; i < evaluatedHands.length; i++) {
    const comparison = compareHands(evaluatedHands[i], bestHand);

    if (comparison > 0) {
      // Nouvelle meilleure main
      bestHand = evaluatedHands[i];
      bestHandIndices = [i];
    } else if (comparison === 0) {
      // Égalité, ajouter à la liste
      bestHandIndices.push(i);
    }
  }

  return bestHandIndices;
}
