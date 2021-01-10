import { CoreModule } from './../../core/core.module';
import { AppRoutingModule } from './../../app-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyseBoardComponent } from './pages/analyse-board/analyse-board.component';


@NgModule({
  declarations: [
    AnalyseBoardComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    CoreModule,
    SharedModule
  ]
})
export class AnalyseBoardModule { }
