import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, startWith, map } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['teste@gmail.com'];
  allFruits: string[] = ['teste@gmail.com', 'teste2@gmail.com', 'teste3@gmail.com', 'teste4@gmail.com', 'teste5@gmail.com'];

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  folders: any[] = [
    {
      name: 'teste@gmail.com',
      updated: new Date('1/1/16'),
    },
    {
      name: 'teste2@gmail.com',
      updated: new Date('1/17/16'),
    },
  ];
  notes: any[] = [
    {
      name: 'teste3@gmail.com',
      updated: new Date('2/20/16'),
    },
    {
      name: 'teste4@gmail.com',
      updated: new Date('1/18/16'),
    },
  ];
  manuts: any[] = [
    {
      name: 'teste5@gmail.com',
      updated: new Date('2/20/16'),
    },
    {
      name: 'teste6@gmail.com',
      updated: new Date('1/18/16'),
    },
  ];

  constructor() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);

      this.announcer.announce(`Removido ${fruit}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}
