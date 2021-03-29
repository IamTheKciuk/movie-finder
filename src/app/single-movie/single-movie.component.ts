import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    public router: Router
  ) {
    // fetch new movie while url changes
    router.events.subscribe((val) => {
      this.getMovie();
    });
  }

  ngOnInit(): void {
    this.getMovie(); // fetch movie on init
  }

  // getting single movie from api
  getMovie(): void {
    // turn on loading
    this.isLoading = true;

    const id = +this.route.snapshot.paramMap.get('id'); // getting id from url params

    // fetching and handling response
    this.moviesService.getMovie(id).subscribe((movie) => {
      // destructure movie
      const {
        id,
        title,
        vote_average: rating,
        release_date,
        overview,
        genres,
        original_language,
        tagline,
        vote_count,
        reviews,
        similar,
      } = movie;

      // set image to poster or to NOIMAGE if there is no poster from API
      let image: string;
      if (movie.poster_path) {
        image = `http://image.tmdb.org/t/p/w185${movie.poster_path}`;
      } else {
        image = 'assets/noimage.png';
      }

      // set movie
      this.movie = {
        id,
        title,
        rating,
        release_date,
        overview,
        genres,
        image,
        original_language,
        tagline,
        vote_count,
        reviews,
        similar,
      };

      // turn off loading
      this.isLoading = false;
    });
  }

  // open/close description
  toggleOverview(): void {
    this.overviewShow = !this.overviewShow;
  }
}
