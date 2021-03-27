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
  chooseSearchName: boolean = false;

  // search term for searching by name
  searchTerm: string = 'the lord of the rings';

  // filters
  filters: boolean = false; // check if searched by filters (toggle after first search by filters)
  selectedGenre: string = '';
  selectedYear: string = '';
  selectedMinRating: string = '';
  selectedMinVotes: number = 1000;
  sortBy: string = 'popularity.desc';

  // years for filtering
  years = [
    1990,
    1991,
    1992,
    1993,
    1994,
    1995,
    1996,
    1997,
    1998,
    1999,
    2000,
    2001,
    2002,
    2003,
    2004,
    2005,
    2006,
    2007,
    2008,
    2009,
    2010,
    2011,
    2012,
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
  ];

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.handleSearchFilter();
  }

  //handle name search button
  handleSearchName(search: string): void {
    this.filters = false; // if searching by name turn off filters
    this.selectedGenre = '';
    this.selectedYear = '';
    this.selectedMinRating = '';
    this.searchTerm = search;
    this.moviesService.resetPage();
    this.searchMoviesByName();
  }

  // handle filter search button
  handleSearchFilter(): void {
    this.filters = true; // turn on filters if searching by filters
    this.searchTerm = '';
    this.moviesService.resetPage();
    this.searchMoviesFilters();

    console.log(this.selectedYear);
  }

  // handle choosing search
  chooseSearch(value: string): void {
    if (value === 'name') {
      this.chooseSearchName = true;
    }

    if (value === 'filters') {
      this.chooseSearchName = false;
    }
  }

  searchMoviesByName(): void {
    if (this.searchTerm) {
      this.isLoading = true;
      this.error = { isError: false, msg: '' };

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
    } else {
      this.error = { isError: true, msg: 'No term given' };
    }
  }

  searchMoviesFilters(): void {
    this.isLoading = true;
    this.error = { isError: false, msg: '' };
    this.moviesService
      .getMoviesFilters({
        genre: this.selectedGenre,
        year: this.selectedYear,
        minRating: this.selectedMinRating,
        minVotes: this.selectedMinVotes.toString(),
        sortBy: this.sortBy,
      })
      .subscribe((response) => {
        this.movieList = response;

        this.moviesService.setMaxPage(response.total_pages);

        if (response.total_results < 1)
          this.error = {
            isError: true,
            msg: 'There is no match for your filters',
          };

        this.isLoading = false;
      });
  }

  nextPage(): void {
    this.moviesService.nextPage();
    console.log(this.filters);

    if (this.filters) {
      this.searchMoviesFilters();
    } else {
      this.searchMoviesByName();
    }
  }

  previousPage(): void {
    this.moviesService.previousPage();
    if (this.filters) {
      this.searchMoviesFilters();
    } else {
      this.searchMoviesByName();
    }
  }
}
