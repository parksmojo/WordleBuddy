import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Guess } from 'wordlebuddy-shared';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'app-guess-input-popup',
  imports: [ReactiveFormsModule, ColorPickerComponent],
  templateUrl: './guess-input-popup.component.html',
  styleUrl: './guess-input-popup.component.css',
})
export class GuessInputPopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() guess = new EventEmitter<Guess>();
  colors = 'bbbbb';

  guessForm = new FormGroup({
    word: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z]{5}$/i),
    ]),
  });

  setColors(colorString: string) {
    this.colors = colorString;
  }

  submitGuess() {
    this.guess.emit(new Guess(this.guessForm.value.word!, this.colors));
  }

  closePopup() {
    this.close.emit();
  }
}
