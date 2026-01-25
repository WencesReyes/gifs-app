import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, effect } from '@angular/core';
import type { GiphyResponse } from '../models/giphy/giphy';
import { environment } from '@environments/environment';
import type { Gif } from '../models/gif/gif';
import { GifMapper } from '../mappers/gif.mapper';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

const GIF_LOCAL_STORAGE_KEY = 'gifs_history';

const loadGifsFromLocalStorage = (): Record<string, Gif[]> => {
  const storedData = localStorage.getItem(GIF_LOCAL_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : {};
};

@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient);
  private _isTrandingGifsLoading = signal<boolean>(true);
  readonly isTrandingGifsLoading = this._isTrandingGifsLoading.asReadonly();
  private _isSearchedGifsLoading = signal<boolean>(true);
  readonly isSearchedGifsLoading = this._isSearchedGifsLoading.asReadonly();
  public search = signal<string>('');

  private cache = signal<Record<string, Gif[]>>(loadGifsFromLocalStorage());
  public cacheKeys = computed(() => Object.keys(this.cache()));

  protected saveCacheToLocalStorageEffect = effect(() => {
    if (localStorage.getItem(GIF_LOCAL_STORAGE_KEY)) {
      localStorage.removeItem(GIF_LOCAL_STORAGE_KEY);
    }
    localStorage.setItem(GIF_LOCAL_STORAGE_KEY, JSON.stringify(this.cache()));
  });

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

  private searchedGifs$ = toObservable(this.search).pipe(
    filter((searchTerm) => searchTerm.trim().length > 0),
    tap(() => this._isSearchedGifsLoading.set(true)),
    switchMap((searchTerm) =>
      this.http
        .get<GiphyResponse>(`${environment.giphyApiUrl}/search`, {
          params: {
            api_key: environment.giphyApiKey,
            q: searchTerm,
            limit: 25,
            offset: 0,
            rating: 'g',
            lang: 'en',
          },
        })
        .pipe(
          map((response) => ({
            gifs: GifMapper.mapGiphyItemsToGifs(response.data),
            searchTerm,
          })),
          catchError((err) => {
            console.error(err);
            return of({ gifs: [] as Gif[], searchTerm });
          })
        )
    ),
    tap(({ gifs, searchTerm }) => {
      this.cache.update((cache) => ({ ...cache, [searchTerm.toLowerCase()]: gifs }));
    }),
    map(({ gifs }) => gifs),
    tap(() => this._isSearchedGifsLoading.set(false))
  );

  readonly searchedGifs = toSignal(this.searchedGifs$, { initialValue: [] as Gif[] });
  readonly trandingGifs = toSignal(this.trandingGifs$, { initialValue: [] as Gif[] });

  public getGifsByQuery(query: string): Gif[] {
    const lowerCaseQuery = query.toLowerCase();
    return this.cache()[lowerCaseQuery] ?? [];
  }
}
