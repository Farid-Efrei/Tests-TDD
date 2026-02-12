# Texas Hold'em Poker Hand Evaluator

## Description
Évaluateur et comparateur de mains de poker Texas Hold'em développé en TDD (Test-Driven Development).

## Fonctionnalités
- Détection des 9 catégories de mains (High Card à Straight Flush)
- Sélection des 5 meilleures cartes parmi 7 disponibles
- Comparaison multi-joueurs avec gestion des égalités
- Gestion de l'As faible (A-2-3-4-5)
- Départage précis selon les règles officielles

## Technologies
- **TypeScript** pour le typage statique
- **Jest** pour les tests unitaires
- **Node.js** comme runtime

## Installation

```bash
npm install
```

## Lancer les tests

```bash
npm test
```

## Lancer les tests avec couverture

```bash
npm test -- --coverage
```

## Structure du projet

```
src/
  ├── poker.ts           # Logique principale
  └── types.ts           # Types et interfaces
tests/
  └── poker.test.ts      # Tests unitaires
```

## Choix de conception

### Validation des entrées
- **Hypothèse** : Les cartes fournies sont valides (pas de doublons)
- Pas de validation d'entrée (hors scope)

### Ordre des cartes retournées
Les 5 cartes sont ordonnées selon la catégorie :
- **Straight / Flush / High Card** : ordre décroissant des rangs
- **Four of a Kind** : les 4 cartes identiques, puis le kicker
- **Full House** : brelan puis paire
- **Two Pair** : paire haute, paire basse, kicker
- **Straights** : highest card first (sauf A-2-3-4-5 où le 5 est la plus haute)

### Algorithme de sélection 5/7
- Génération de toutes les combinaisons C(7,5) = 21 possibles
- Évaluation de chaque combinaison
- Sélection de la meilleure main

## Règles implémentées

### Catégories (du plus fort au plus faible)
1. Straight Flush (quinte flush)
2. Four of a Kind (carré)
3. Full House (full)
4. Flush (couleur)
5. Straight (quinte)
6. Three of a Kind (brelan)
7. Two Pair (double paire)
8. One Pair (paire)
9. High Card (carte haute)

### Règles de départage
- Implémentées selon les règles officielles du Texas Hold'em
- Pas de hiérarchie des couleurs (♠ = ♥ = ♦ = ♣)

## Développement TDD

Ce projet a été développé en suivant la méthodologie TDD stricte :
1. 🔴 **RED** : Écrire un test qui échoue
2. 🟢 **GREEN** : Écrire le code minimal pour le faire passer
3. 🔵 **REFACTOR** : Améliorer le code

L'historique Git montre cette progression.
