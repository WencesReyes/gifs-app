import { Component, inject } from '@angular/core';
import { GifList } from '../../components/gif-list/gif-list';
import { GifService } from '../../services/gif.service';

@Component({
  selector: 'app-search',
  imports: [GifList],
  templateUrl: './search.html',
})
export default class Search {
  protected gifService = inject(GifService);

  searchedGifs = this.gifService.searchedGifs;

  onSearch(searchTerm: string) {
    if (!searchTerm.trim()) return;

    console.log('Search term:', searchTerm);
    this.gifService.search.set(searchTerm);
  }
}
