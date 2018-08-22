import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getCookie } from '../ts/cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  public score;
  public isShared = false;
  public isPass;
  public level; // 考试级别 1：四级   2：六级

  constructor(
    public http: HttpClient,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.isPass = false;
    this.fetchScore();
  }

  fetchScore () {
    if (getCookie('cetNum')) {
      const headers = new HttpHeaders().set('token', getCookie('token'));
      this.http.post('https://os.ncuos.com/api/info/cet', {
        'verify': 0,
        'cet_num': getCookie('cetNum'),
        'name': getCookie('name')
      }, {headers})
      .subscribe(d => { this.setScore(d); });
    } else {
      this.router.navigate(['/login']);
    }
  }

  setScore (d) {
    const data = d.data;
    this.isPass = data.is_pass;
    this.level = data.level;
    this.score = {
      total: data.score,
      detail: [
        {
          name: '听力得分',
          score: data.listening
        },
        {
          name: '阅读得分',
          score: data.reading
        },
        {
          name: '翻译与写作得分',
          score: data.translate
        },
        {
          name: '口试分数 ',
          score: data.oralLevel
        }
      ]
    };
  }

  onShare () {
    this.isShared = !this.isShared;
  }

}
