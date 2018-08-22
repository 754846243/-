import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ScoreComponent } from './score/score.component';
import { RoutingModule } from './routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PopupComponent } from './popup/popup.component';
import { HistoricalStatisticsComponent } from './historical-statistics/historical-statistics.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { SwiperModule } from 'ngx-swiper-wrapper';
import 'rxjs/add/operator/map';
import { SkillComponent } from './skill/skill.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ScoreComponent,
    PopupComponent,
    HistoricalStatisticsComponent,
    SkillComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    HttpClientModule,
    FormsModule,
    SwiperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
