import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.css'],
})
export class PageSearchComponent implements OnInit {
  isLoading: boolean = true;
  error = { isError: false, msg: '' };
  movieList = {};
  private searchTerm: string = 'the lord of the rings';

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.searchMoviesByName();
  }

  searchMoviesByName(term: string = this.searchTerm): void {
    if (term != this.searchTerm) this.moviesService.resetPage();
    this.isLoading = true;
    this.error = { isError: false, msg: '' };
    this.searchTerm = term;

    this.moviesService
      .getMoviesByName(this.searchTerm)
      .subscribe((response) => {
        this.movieList = response;

        this.moviesService.setMaxPage(response.total_pages);

        if (response.total_results < 1)
          this.error = {
            isError: true,
            msg: 'There is no match for your search',
          };

        this.isLoading = false;
      });
  }

  nextPage(): void {
    this.moviesService.nextPage();
    this.searchMoviesByName();
  }

  previousPage(): void {
    this.moviesService.previousPage();
    this.searchMoviesByName();
  }
}
