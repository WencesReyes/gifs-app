import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gif.service';
import { GifList } from '../../components/gif-list/gif-list';

@Component({
  selector: 'app-history',
  imports: [GifList],
  templateUrl: './history.html',
})
export default class History {
  gifService = inject(GifService);
  query = toSignal(inject(ActivatedRoute).params.pipe(map((params) => params['query'] as string)));

  gifsByQuery = computed(() => this.gifService.getGifsByQuery(this.query() ?? ''));
}
