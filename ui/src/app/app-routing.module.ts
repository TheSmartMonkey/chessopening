import { AnalyseBoardComponent } from './view/analyse-board/pages/analyse-board/analyse-board.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  // Redirect
  { path: '', redirectTo: 'board', pathMatch: 'full' },

  // Pages
  { path: 'board', component: AnalyseBoardComponent },

  // Not Found
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
