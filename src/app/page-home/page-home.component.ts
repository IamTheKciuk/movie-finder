import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css'],
})
export class PageHomeComponent implements OnInit {
  isLoading$: boolean = true;
  popularMovies$: object = {};

  // slider
  leftArrow = faAngleDoubleLeft;
  rightArrow = faAngleDoubleRight;
  activeIndex: number = 0; // active slide

  constructor(private moviesService: MoviesService) {
    this.moviesService.isLoading.subscribe((value) => {
      this.isLoading$ = value;
    });

    this.moviesService.popularMovies.subscribe((value) => {
      this.popularMovies$ = value;
    });
  }

  ngOnInit(): void {
    this.moviesService.getPopularMovies(); // get popular movies on init

    // slider auto scroll
    setInterval(() => {
      this.nextPopular();
    }, 10000);
  }

  // handle next slide
  nextPopular(): void {
    let tempIndex: number = this.activeIndex + 1;
    if (
      this.popularMovies$['results'] &&
      tempIndex > this.popularMovies$['results'].length - 1
    ) {
      tempIndex = 0;
    }
    this.activeIndex = tempIndex;
  }

  // handle previous slide
  previousPopular(): void {
    let tempIndex: number = this.activeIndex - 1;
    if (this.popularMovies$['results'] && tempIndex < 0) {
      tempIndex = this.popularMovies$['results'].length - 1;
    }
    this.activeIndex = tempIndex;
  }
}
