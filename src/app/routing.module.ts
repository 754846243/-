import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ScoreComponent } from './score/score.component';
import { HistoricalStatisticsComponent } from './historical-statistics/historical-statistics.component';
import { SkillComponent } from './skill/skill.component';

const ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'score',
    component: ScoreComponent
  },
  {
    path: 'statistics',
    component: HistoricalStatisticsComponent
  },
  {
    path: 'skill',
    component: SkillComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule {}
