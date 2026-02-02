import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifService } from '../../services/gif.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.html',
})
export default class Trending implements AfterViewInit {
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);
  gifGrid = viewChild<ElementRef<HTMLDivElement>>('gifGrid');

  onScroll() {
    const element = this.gifGrid()?.nativeElement;
    if (!element) return;

    const clientHeight = element?.clientHeight ?? 0;
    const scrollTop = element?.scrollTop ?? 0;
    const scrollHeight = element?.scrollHeight ?? 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 300;

    if (isAtBottom) {
      this.gifService.loadNextPage();
    }

    this.scrollStateService.setScrollPosition(element.scrollTop);
  }

  ngAfterViewInit(): void {
    const element = this.gifGrid()?.nativeElement;
    if (!element) return;

    element.scrollTop = this.scrollStateService._scrollPosition();
  }
}
