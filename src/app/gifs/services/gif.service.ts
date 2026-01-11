import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type { GiphyResponse } from '../models/giphy/giphy';
import { environment } from '@environments/environment';
import type { Gif } from '../models/gif/gif';
import { GifMapper } from '../mappers/gif.mapper';
import { catchError, map, of, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient);
  _isTrandingGifsLoading = signal<boolean>(true);
  readonly isTrandingGifsLoading = this._isTrandingGifsLoading.asReadonly();

  private trandingGifs$ = this.http
    .get<GiphyResponse>(`${environment.giphyApiUrl}/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 25,
        offset: 0,
        rating: 'g',
      },
    })
    .pipe(
      map((response) => GifMapper.mapGiphyItemsToGifs(response.data)),
      tap(() => this._isTrandingGifsLoading.set(false)),
      catchError((err) => {
        console.error(err);
        this._isTrandingGifsLoading.set(false);
        return of([]);
      })
    );

  readonly trangingGifs = toSignal(this.trandingGifs$, { initialValue: [] as Gif[] }); //  signal<Gif[]>([]);
}
