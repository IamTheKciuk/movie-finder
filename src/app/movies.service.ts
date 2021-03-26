import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private mainUrl = 'https://api.themoviedb.org/3';
  private apiKey = '2a288d655ac64d728a324d13ebbd8ba0';
  private page: number = 1;
  private totalPages: number;

  searchTerm: string = 'batman';

  constructor(private http: HttpClient) {}

  getMoviesByName(term: string = ''): Observable<any> {
    const url = `${this.mainUrl}/search/movie?api_key=${this.apiKey}&query=${term}&page=${this.page}`;

    return this.http.get(url);
  }

  getMovie(id: number): Observable<any> {
    const url = `${this.mainUrl}/movie/${id}?api_key=${this.apiKey}`;
    return this.http.get(url);
  }

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
}
