import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-single-movie',
  templateUrl: './single-movie.component.html',
  styleUrls: ['./single-movie.component.css'],
})
export class SingleMovieComponent implements OnInit {
  isLoading: boolean = true;
  movie: any;
  overviewShow: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getMovie();
  }

  // getting single movie from api
  getMovie(): void {
    // turn on loading
    this.isLoading = true;

    const id = +this.route.snapshot.paramMap.get('id'); // getting id from url params

    this.moviesService.getMovie(id).subscribe((movie) => {
      console.log(movie);

      // destructure movie
      const {
        id,
        title,
        vote_average: rating,
        release_date,
        overview,
        genres,
        original_language,
      } = movie;

      const image = `http://image.tmdb.org/t/p/w185${movie.poster_path}`;

      this.movie = {
        id,
        title,
        rating,
        release_date,
        overview,
        genres,
        image,
        original_language,
      };

      // turn off loading
      this.isLoading = false;
    });
  }

  toggleOverview(): void {
    this.overviewShow = !this.overviewShow;
  }
}
