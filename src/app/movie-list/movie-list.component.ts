import { Component, Input, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  info_icon = faQuestionCircle;
  li: any;
  @Input() movies: any;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    console.log(this.movies);

    this.movies = this.movies.results.map((item) => {
      let { id, title, vote_average: rating, poster_path: image } = item;
      image = `http://image.tmdb.org/t/p/w185${image}`;

      return { id, title, rating, image };
    });
  }
}
