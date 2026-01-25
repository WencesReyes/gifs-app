import { Component, inject } from '@angular/core';
import { MenuOption } from '../models/menu-option';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GifService } from 'src/app/gifs/services/gif.service';

@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './gifs-side-menu-options.html',
})
export class GifsSideMenuOptions {
  gifService = inject(GifService);

  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      sublabel: 'Gifs más populares',
      route: '/dashboard/trending',
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Search',
      sublabel: 'Buscar gifs',
      route: '/dashboard/search',
    },
  ];
}
