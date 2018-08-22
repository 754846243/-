import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit, OnDestroy {

  public config: SwiperConfigInterface;
  public timer;

  constructor(
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.config = {
        direction: 'horizontal',
        autoHeight: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          bulletElement : 'li'
        },
        roundLengths : true
      };
    }, 500);
  }
  ngOnDestroy () {
  }

}
