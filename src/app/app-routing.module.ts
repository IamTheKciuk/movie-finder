import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageSearchComponent } from './page-search/page-search.component';
import { SingleMovieComponent } from './single-movie/single-movie.component';

const routes: Routes = [
  { path: '', component: PageHomeComponent },
  { path: 'movies', component: PageSearchComponent },
  { path: 'movie', component: SingleMovieComponent },
  { path: 'movies/:id', component: SingleMovieComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
