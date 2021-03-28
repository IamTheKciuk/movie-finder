import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private mainUrl = 'https://api.themoviedb.org/3';
  private apiKey = '2a288d655ac64d728a324d13ebbd8ba0';
  private page: number = 1;
  private totalPages: number;

  // movie list
  private _movies = new BehaviorSubject<object>({});
  movies = this._movies.asObservable();

  private _popularMovies = new BehaviorSubject<object>({});
  popularMovies = this._popularMovies.asObservable();

  // API loading state
  private _isLoading = new BehaviorSubject<boolean>(true);
  isLoading = this._isLoading.asObservable();

  // filter/name search tab open
  private _filterSearch = new BehaviorSubject<boolean>(true);
  fitlerSearch = this._filterSearch.asObservable();

  // error on/off and message
  private _error = new BehaviorSubject<object>({});
  error = this._error.asObservable();

  // check if filters are on/off
  private _filters = new BehaviorSubject<boolean>(true);
  filters = this._filters.asObservable();

  // sort term
  private _sortBy = new BehaviorSubject<string>('popularity.desc');
  sortBy = this._sortBy.asObservable();

  // selected movies genre
  private _selectedGenre = new BehaviorSubject<string>('');
  selectedGenre = this._selectedGenre.asObservable();

  // selected release date
  private _selectedYear = new BehaviorSubject<string>('');
  selectedYear = this._selectedYear.asObservable();

  // selected minimum rating of movies
  private _selectedMinRating = new BehaviorSubject<string>('');
  selectedMinRating = this._selectedMinRating.asObservable();

  // selected minimum votes of movies
  private _selectedMinVotes = new BehaviorSubject<number>(1000);
  selectedMinVotes = this._selectedMinVotes.asObservable();

  // search term
  private _searchTerm = new BehaviorSubject<string>('batman');
  searchTerm = this._searchTerm.asObservable();

  constructor(private http: HttpClient) {}

  // updating filters for filter search
  updateFilters(
    selectedGenre: string,
    selectedYear: string,
    selectedMinRating: string,
    selectedMinVotes: number,
    sortBy: string
  ): void {
    this._selectedGenre.next(selectedGenre);
    this._selectedYear.next(selectedYear);
    this._selectedMinRating.next(selectedMinRating);
    this._selectedMinVotes.next(selectedMinVotes);
    this._sortBy.next(sortBy);
  }

  updateSearchTerm(searchTerm: string): void {
    this._searchTerm.next(searchTerm);
  }

  // to persistence opened tab - search by name or search by filter
  setFilterSearch(filter: boolean): void {
    this._filterSearch.next(filter);
  }

  //handle name search button
  handleSearchName(): void {
    // if searching by name turn off filters //// setting all filters for initial state
    this._filters.next(false);
    this._selectedGenre.next('');
    this._selectedYear.next('');
    this._selectedMinRating.next('');
    this._selectedMinVotes.next(1000);
    this._searchTerm.next(this._searchTerm.value);
    this.resetPage(); // reset page to 1
    this.searchMoviesByName();
  }

  // searching movies by name and saving it in movie list
  searchMoviesByName(): void {
    if (this._searchTerm.value) {
      this._isLoading.next(true);
      this._error.next({ isError: false, msg: '' });

      this.getMoviesByName(this._searchTerm.value).subscribe((response) => {
        this._movies.next(response);

        this.setMaxPage(response.total_pages);

        if (!response) {
          this._error.next({
            isError: true,
            msg: 'There is no match for your search',
          });
        }

        this._isLoading.next(false);
      });
    } else {
      this._error.next({ isError: true, msg: 'No term given' });
    }
  }

  // fetching movies by name
  getMoviesByName(term: string = ''): Observable<any> {
    const url = `${this.mainUrl}/search/movie?api_key=${this.apiKey}&query=${term}&page=${this.page}`;

    return this.http.get(url);
  }

  // handle filter search event
  handleSearchFilter(): void {
    this._filters.next(true); // turn on filters if searching by filters
    this._searchTerm.next(''); // set searchterm to empty string
    this.resetPage(); // reset page to 1
    this.searchMoviesFilters();
  }

  // searching movies by filters and saving it in movie list
  searchMoviesFilters(): void {
    this._isLoading.next(true);
    this._error.next({ isError: false, msg: '' });
    this.getMoviesFilters().subscribe((response) => {
      this._movies.next(response);

      this.setMaxPage(response.total_pages);

      if (response.total_results < 1)
        this._error.next({
          isError: true,
          msg: 'There is no match for your filters',
        });

      this._isLoading.next(false);
    });
  }

  // fetching movies by name
  getMoviesFilters(): Observable<any> {
    const url = `${this.mainUrl}/discover/movie?api_key=${
      this.apiKey
    }&sort_by=${this._sortBy.value}&page=${this.page}${
      this._selectedGenre.value && `&with_genres=${this._selectedGenre.value}`
    }${
      this._selectedYear.value &&
      `&primary_release_year=${this._selectedYear.value}`
    }${
      this._selectedMinRating.value &&
      `&vote_average.gte=${this._selectedMinRating.value}`
    }${`&vote_count.gte=${this._selectedMinVotes.value}`}`;

    return this.http.get(url);
  }

  // get single movie
  getMovie(id: number): Observable<any> {
    const url = `${this.mainUrl}/movie/${id}?api_key=${this.apiKey}&append_to_response=reviews,similar`;
    return this.http.get(url);
  }

  // PAGE HANDLE //
  nextPage(): void {
    this.page = this.page + 1;
    if (this.page > this.totalPages) this.page = this.totalPages;
  }

  previousPage(): void {
    this.page = this.page - 1;
    if (this.page < 1) this.page = 1;
  }

  resetPage(): void {
    this.page = 1;
  }

  setMaxPage(totalPages: number): void {
    this.totalPages = totalPages;
  }

  //... PAGE HANDLE ...//

  getPopularMovies(): void {
    const url: string = `${this.mainUrl}/movie/popular?api_key=${this.apiKey}`;

    this._isLoading.next(true);

    this.http.get(url).subscribe((response) => {
      this._popularMovies.next(response);
      this._isLoading.next(false);
    });
  }
}
