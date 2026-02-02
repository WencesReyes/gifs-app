import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  private scrollPosition = signal<number>(0);
  public readonly _scrollPosition = this.scrollPosition.asReadonly();

  setScrollPosition(position: number) {
    this.scrollPosition.set(position);
  }
}
