# 🃏 Texas Hold'em Poker Evaluator

[![Tests](https://img.shields.io/badge/tests-28%20passed-success)](.)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](.)
[![License](https://img.shields.io/badge/license-MIT-green)](.)

Évaluateur de mains de poker Texas Hold'em développé en **TDD (Test-Driven Development)** avec TypeScript et Jest.

## ✨ Fonctionnalités

✅ **Détection des 9 catégories de mains**
- 🂡 High Card (Carte haute)
- 🂱 One Pair (Paire)
- 🂲 Two Pair (Double paire)
- 🂳 Three of a Kind (Brelan)
- 🂴 Straight (Quinte)
- 🂵 Flush (Couleur)
- 🂶 Full House
- 🂷 Four of a Kind (Carré)
- 🂸 Straight Flush (Quinte flush)

✅ **Comparaison intelligente de mains**
- Tie-breaking automatique selon les règles officielles
- Gestion de l'As faible dans la "wheel" (A-2-3-4-5)

✅ **Sélection optimale**
- Trouve la meilleure main parmi 7 cartes (Texas Hold'em)
- Comparaison multi-joueurs avec gestion des égalités

## 🚀 Installation

```bash
npm install
```

## 🧪 Tests

```bash
npm test                # Lancer tous les tests
npm run test:watch      # Mode watch (auto-reload)
npm run test:coverage   # Couverture de code
```

## 📖 Utilisation

### Évaluer une main de 5 cartes

```typescript
import { Card, Rank, Suit, evaluateFiveCards, HandCategory } from './src/poker';

const cards = [
  new Card(Rank.Ace, Suit.Hearts),
  new Card(Rank.Ace, Suit.Diamonds),
  new Card(Rank.King, Suit.Hearts),
  new Card(Rank.Queen, Suit.Hearts),
  new Card(Rank.Jack, Suit.Hearts)
];

const result = evaluateFiveCards(cards);
console.log(result.category); // HandCategory.OnePair
console.log(result.cards);    // [A♥, A♦, K♥, Q♥, J♥]
```

### Trouver la meilleure main parmi 7 cartes

```typescript
import { findBestFiveCardHand } from './src/poker';

const sevenCards = [
  // 2 cartes du joueur
  new Card(Rank.Ace, Suit.Hearts),
  new Card(Rank.King, Suit.Hearts),
  // 5 cartes communes (flop, turn, river)
  new Card(Rank.Queen, Suit.Hearts),
  new Card(Rank.Jack, Suit.Hearts),
  new Card(Rank.Ten, Suit.Hearts),
  new Card(Rank.Two, Suit.Diamonds),
  new Card(Rank.Three, Suit.Clubs)
];

const bestHand = findBestFiveCardHand(sevenCards);
console.log(bestHand.category); // HandCategory.StraightFlush 🎉
```

### Comparer deux mains

```typescript
import { compareHands } from './src/poker';

const hand1 = evaluateFiveCards([...]); // Brelan d'As
const hand2 = evaluateFiveCards([...]); // Paire de Rois

const result = compareHands(hand1, hand2);
if (result > 0) {
  console.log("Main 1 gagne !");
} else if (result < 0) {
  console.log("Main 2 gagne !");
} else {
  console.log("Égalité !");
}
```

### Déterminer le gagnant parmi plusieurs joueurs

```typescript
import { findWinners } from './src/poker';

const player1Cards = [
  new Card(Rank.Ace, Suit.Hearts),
  new Card(Rank.Ace, Suit.Diamonds),
  // + 5 cartes communes
  ...community
];

const player2Cards = [
  new Card(Rank.King, Suit.Hearts),
  new Card(Rank.King, Suit.Diamonds),
  // + 5 cartes communes
  ...community
];

const player3Cards = [
  new Card(Rank.Queen, Suit.Hearts),
  new Card(Rank.Queen, Suit.Diamonds),
  // + 5 cartes communes
  ...community
];

const winners = findWinners([player1Cards, player2Cards, player3Cards]);
console.log(winners); // [0] - Joueur 1 gagne
// Si égalité : [0, 2] - Joueurs 1 et 3 partagent le pot
```

## 🏗️ Architecture

### Structure du projet

```
TDD/
├── src/
│   └── poker.ts          # Logique métier (370 lignes)
├── tests/
│   └── poker.test.ts     # Suite de tests (450+ lignes)
├── jest.config.js        # Configuration Jest
├── tsconfig.json         # Configuration TypeScript
└── package.json
```

### Types principaux

```typescript
// Couleurs de cartes
enum Suit { Hearts = "♥", Diamonds = "♦", Clubs = "♣", Spades = "♠" }

// Rangs de cartes (2 à As)
enum Rank { Two = 2, ..., Ace = 14 }

// Catégories de mains
enum HandCategory { HighCard = 1, ..., StraightFlush = 9 }

// Résultat d'évaluation
interface HandResult {
  category: HandCategory;
  cards: Card[];  // Triées pour tie-breaking
}
```

## 🎓 Méthodologie TDD

Ce projet a été développé en suivant strictement le cycle **RED-GREEN-REFACTOR** :

1. 🔴 **RED** : Écrire un test qui échoue
2. 🟢 **GREEN** : Écrire le code minimal pour passer
3. 🔵 **REFACTOR** : Améliorer le code sans casser les tests
4. ♻️ Répéter

**35 commits** ont été réalisés en alternance entre deux développeurs, chacun suivant le cycle TDD de manière rigoureuse.

## 📊 Couverture de tests

- **28 tests unitaires** ✅
- Toutes les catégories de mains testées
- Tests de comparaison avancés
- Tests multi-joueurs avec égalités
- Tests edge cases (As faible, etc.)

## 🤝 Contribution

Ce projet a été développé dans le cadre d'un TP de **Test-Driven Development en M2**.

### Règles de commits

- `test:` - Ajout de tests (phase RED)
- `feat:` - Implémentation de fonctionnalités (phase GREEN)
- `refactor:` - Refactoring de code (phase REFACTOR)
- `docs:` - Documentation
- `fix:` - Corrections de bugs

## 📝 Choix de conception

### Validation des entrées
- Les cartes fournies sont supposées valides (pas de doublons)
- Validation minimale : vérification du nombre de cartes

### Ordre de vérification dans `evaluateFiveCards`
Les mains sont vérifiées dans l'ordre suivant pour optimiser la détection :

1. Four of a Kind (Carré) - rare, vérification rapide
2. Full House - combinaison spécifique
3. **Straight Flush** - vérifié AVANT Flush et Straight séparés
4. Flush
5. Straight  
6. Three of a Kind
7. Two Pair
8. One Pair
9. High Card - par défaut

### Performance
- `findBestFiveCardHand` : Complexité O(C(n,5)) = O(21) pour 7 cartes
- Génération récursive des combinaisons
- Optimisation possible pour n > 7 mais hors scope pour Texas Hold'em

## 📄 Licence

MIT

---

**Développé avec ❤️ en TDD strict**

### Ordre des cartes retournées
Les 5 cartes sont ordonnées selon la catégorie :
- **Straight / Flush / High Card** : ordre décroissant des rangs
- **Four of a Kind** : les 4 cartes identiques, puis le kicker
- **Full House** : brelan puis paire
- **Two Pair** : paire haute, paire basse, kicker
- **Straights** : highest card first (sauf A-2-3-4-5 où le 5 est la plus haute)

