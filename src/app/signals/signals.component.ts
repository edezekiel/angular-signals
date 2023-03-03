import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Widget } from '../types';

@Component({
  selector: 'app-signals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <ul>
        <li *ngFor="let widget of widgets()">
          {{ widget.description }}
          <input
            [value]="widget.description"
            (input)="updateWidget($event, widget.id)"
          />
          <button (click)="removeWidget(widget.id)">Remove</button>
        </li>
      </ul>
    </section>
    <section>
      <input id="add-widget" /><button (click)="addWidget()">Add Widget</button>
    </section>
    <section><button (click)="clearAllWidgets()">Clear All</button></section>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsComponent {
  widgets = signal<Widget[]>([{ id: 0, description: 'Thingamajig' }]);

  constructor(private readonly _cdr: ChangeDetectorRef) {}

  addWidget() {
    const description = (
      document.getElementById('add-widget') as HTMLInputElement
    )?.value;

    if (description) {
      const widget: Widget = {
        id: this.widgets().length + 1,
        description: description,
      };
      this.widgets.update((widgets) => [...widgets, widget]);
    }
  }

  updateWidget(event: Event, id: number) {
    this.widgets.update((widgets) => {
      let widget = widgets.find((w) => w.id === id);
      if (widget) {
        widget.description = (event.target as HTMLInputElement).value;
      }
      return widgets;
    });
  }

  removeWidget(index: number) {
    this.widgets.update((widgets) => widgets.filter((w) => w.id !== index));
  }

  clearAllWidgets() {
    this.widgets.set([]);
  }
}
