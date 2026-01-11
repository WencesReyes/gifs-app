import { Gif } from '../models/gif/gif';
import { GiphyItem } from '../models/giphy/giphy';

export class GifMapper {
  static mapGiphyItemToGif(giphyItem: GiphyItem): Gif {
    return {
      id: giphyItem.id,
      title: giphyItem.title,
      url: giphyItem.images.original.url,
    };
  }

  static mapGiphyItemsToGifs(giphyItems: GiphyItem[]): Gif[] {
    return giphyItems.map(this.mapGiphyItemToGif);
  }
}
