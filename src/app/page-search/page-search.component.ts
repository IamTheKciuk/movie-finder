import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.css'],
})
export class PageSearchComponent implements OnInit {
  isLoading$: boolean = true;
  error$ = { isError: false, msg: '' };
  movieList$ = {};

  filterSearch$: boolean = true; // true if searching by filters - used for active search tab choose

  // filters
  filters$: boolean = false; // check if searched by filters - used for choosing right fetch method
  selectedGenre$: string = '';
  selectedYear$: string = '';
  selectedMinRating$: string = '';
  selectedMinVotes$: number = 1000;
  sortBy$: string = 'popularity.desc';

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

  constructor(private moviesService: MoviesService) {
    //  ------- SUBSCRIBING TO SERVICE ---------------
    this.moviesService.isLoading.subscribe((value) => {
      this.isLoading$ = value;
    });

    this.moviesService.fitlerSearch.subscribe((value) => {
      this.filterSearch$ = value;
    });

    this.moviesService.error.subscribe((value) => {
      this.error$.isError = value['isError'];
      this.error$.msg = value['msg'];
    });

    this.moviesService.movies.subscribe((value) => {
      this.movieList$ = value;
    });

    this.moviesService.filters.subscribe((value) => {
      this.filters$ = value;
    });

    this.moviesService.selectedGenre.subscribe((value) => {
      this.selectedGenre$ = value;
    });

    this.moviesService.selectedYear.subscribe((value) => {
      this.selectedYear$ = value;
    });

    this.moviesService.selectedMinRating.subscribe((value) => {
      this.selectedMinRating$ = value;
    });

    this.moviesService.selectedMinVotes.subscribe((value) => {
      this.selectedMinVotes$ = value;
    });

    this.moviesService.sortBy.subscribe((value) => {
      this.sortBy$ = value;
    });
  }

  ngOnInit(): void {
    if (this.filters$) {
      this.moviesService.searchMoviesFilters();
    } else {
      this.moviesService.searchMoviesByName();
    }
  }

  //handle name search button
  handleSearchName(search: string): void {
    this.spreadSearchTerm(search);
    this.moviesService.handleSearchName();
  }

  // handle filter search button
  handleSearchFilter(): void {
    this.spreadFilters();
    this.moviesService.handleSearchFilter();
  }

  // updating searchTerm in service
  spreadSearchTerm(searchTerm: string): void {
    this.moviesService.updateSearchTerm(searchTerm);
  }

  // updating filters in service whil button clicked
  spreadFilters(): void {
    this.moviesService.updateFilters(
      this.selectedGenre$,
      this.selectedYear$,
      this.selectedMinRating$,
      this.selectedMinVotes$,
      this.sortBy$
    );
  }

  // handle choosing search
  chooseSearch(value: string): void {
    if (value === 'name') {
      this.moviesService.setFilterSearch(false);
    }

    if (value === 'filters') {
      this.moviesService.setFilterSearch(true);
    }
  }

  nextPage(): void {
    this.moviesService.nextPage();

    // if filters are true search for next page with filters
    if (this.filters$) {
      this.moviesService.searchMoviesFilters();
    } else {
      // if filters are false search for next page with name
      this.moviesService.searchMoviesByName();
    }
  }

  previousPage(): void {
    this.moviesService.previousPage();

    // if filters are true search for previous page with filters
    if (this.filters$) {
      this.moviesService.searchMoviesFilters();
    } else {
      // if filters are false search for previous page with name
      this.moviesService.searchMoviesByName();
    }
  }
}
