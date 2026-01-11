import { Component, inject, signal } from '@angular/core';
import { GifList } from '../../components/gif-list/gif-list';
import { GifService } from '../../services/gif.service';

@Component({
  selector: 'app-trending',
  imports: [GifList],
  templateUrl: './trending.html',
})
export default class Trending {
  gifService = inject(GifService);
}
