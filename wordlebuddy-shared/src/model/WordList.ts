import { getPossibleAnswers } from "../resources/PossibleAnswers";
import { getPossibleGuesses } from "../resources/PossibleGuesses";
import { Colors } from "./Color";
import { Filter } from "./Filter";
import { Guess } from "./Guess";

export class WordList {
  // Raw lists
  private _allPossibleGuesses: string[];
  private _allPossibleAnswers: string[];

  // Filtered lists
  private _possibleGuesses: string[];
  private _possibleAnswers: string[];

  // Helpful info
  private _helpfulWords: string[];
  private _helpfulLetters: string[];

  // Filters
  private _filters: Filter[];

  constructor() {
    this._allPossibleGuesses = getPossibleGuesses();
    this._allPossibleAnswers = getPossibleAnswers();
    this._possibleGuesses = this._allPossibleGuesses;
    this._possibleAnswers = this._allPossibleAnswers;
    this._helpfulWords = [];
    this._helpfulLetters = [];
    this._filters = [];
  }

  public reset() {
    this._possibleGuesses = this._allPossibleGuesses;
    this._possibleAnswers = this._allPossibleAnswers;
    this._helpfulWords = [];
    this._helpfulLetters = [];
    this._filters = [];
  }

  get possibleGuesses(): string[] {
    return this._possibleGuesses;
  }

  get possibleAnswers(): string[] {
    return this._possibleAnswers;
  }

  get helpfulWords(): string[] {
    return this._helpfulWords;
  }

  get helpfulLetters(): string[] {
    return this._helpfulLetters;
  }

  public filterByGuess(guess: Guess): void {
    this.addFilters(Filter.fromGuess(guess));
    this._possibleGuesses = this.applyFiltersTo(this._allPossibleGuesses);
    this._possibleAnswers = this.applyFiltersTo(this._allPossibleAnswers);
    this._helpfulLetters = this.findHelpfulLetters();
    this._helpfulWords = this.findHelpfulWords();
  }

  private addFilters(filters: Filter[]): void {
    for (let filter of filters) {
      const existingIndex = this._filters.findIndex((char) => char.character === filter.character);
      if (existingIndex >= 0) {
        if (this._filters[existingIndex].color == Colors.green) {
          continue;
        } else if (this._filters[existingIndex].color == Colors.yellow && filter.color === Colors.green) {
          this._filters[existingIndex] = filter;
        }
      } else {
        this._filters.push(filter);
      }
    }
  }

  private applyFiltersTo(words: string[], filters?: Filter[]): string[] {
    filters ??= this._filters;
    const filteredWords = words.filter((word) => {
      for (let filter of filters) {
        if (!filter.matches(word)) {
          return false;
        }
      }
      return true;
    });
    return filteredWords;
  }

  private findHelpfulLetters(numLetters?: number): string[] {
    const checkedLetters = new Set(this._filters.map((filter) => filter.character));
    const letterCounts = new Map();
    for (let word of this._possibleAnswers) {
      const letterArray = word.split("");
      const filteredArray = letterArray.filter((letter) => !checkedLetters.has(letter));
      const letters = new Set(filteredArray);
      for (let letter of letters) {
        letterCounts.set(letter, letterCounts.get(letter) ? letterCounts.get(letter) + 1 : 1);
      }
    }
    const sortedArray = Array.from(letterCounts.entries()).sort(([, countA], [, countB]) => countB - countA);
    return sortedArray.slice(0, numLetters ?? 5).map(([letter, count]) => letter);
  }

  private findHelpfulWords(): string[] {
    const filters = this._helpfulLetters.map((letter) => new Filter(letter, 0, Colors.orange));
    const allWords = [];
    for (let i = 0; i < this._helpfulLetters.length; i++) {
      allWords.push(...this.applyFiltersTo(this._allPossibleGuesses, filters));
      filters.pop();
    }
    const uniqueWords = new Set<string>(allWords);
    return Array.from(uniqueWords);
  }
}
