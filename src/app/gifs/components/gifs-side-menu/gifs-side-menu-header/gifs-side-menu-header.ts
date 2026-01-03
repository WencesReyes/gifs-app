import { Component } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './gifs-side-menu-header.html',
})
export class GifsSideMenuHeader {
  env = environment;
}
