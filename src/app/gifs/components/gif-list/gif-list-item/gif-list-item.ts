import { Component, input } from '@angular/core';
import { Gif } from 'src/app/gifs/models/gif/gif';

@Component({
  selector: 'gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.html',
})
export class GifListItem {
  gif = input.required<Gif>();
}
