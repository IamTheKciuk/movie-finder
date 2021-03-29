import { Component, Input, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  li: any;
  @Input() movies: any;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.movies = this.movies.results.map((item) => {
      // destructure movies
      let { id, title, vote_average: rating, poster_path: image } = item;

      // set default image while none is given
      if (image) {
        image = `http://image.tmdb.org/t/p/w185${image}`;
      } else {
        image = 'assets/noimage.png';
      }

      return { id, title, rating, image };
    });
  }
}
