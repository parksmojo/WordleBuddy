import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Guess } from '../../model/guess/guess';
import { GuessInputPopupComponent } from '../guess-input-popup/guess-input-popup.component';

@Component({
  selector: 'app-helpful',
  imports: [GuessInputPopupComponent],
  templateUrl: './helpful.component.html',
  styleUrl: './helpful.component.css',
})
export class HelpfulComponent {
  @Input() words: string[] = [];
  @Input() letters: string[] = [];
  @Input() guessNumber: number = 0;
  presetGuess = '';

  pickGuess(word: string) {
    this.presetGuess = word;
    this.openPopup();
  }

  @Output() newGuess = new EventEmitter<Guess>();
  showPopup = false;

  openPopup() {
    this.showPopup = true;
    document.body.classList.add('no-scroll');
  }

  closePopup() {
    this.showPopup = false;
    document.body.classList.remove('no-scroll');
  }

  submitGuess(newGuess: Guess) {
    this.newGuess.emit(newGuess);
    this.closePopup();
  }
}
