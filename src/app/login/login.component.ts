import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { setCookie, getCookie } from '../ts/cookie';
import Miracle from 'incu-webview';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form;
  public identifyingImg;
  public identifyingCode;
  public cookie;
  public information;
  public showWarning;
  public showVerificationCode;
  public token;
  public date;
  public remainingHours;

  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public router: Router
  ) { }

  ngOnInit() {
    Miracle.onAppReady(() => {
      this.token = Miracle.getData().user.token;
      setCookie('token', this.token);
    });
    const date = new Date();
    const targetDate = new Date(2018, 7, 22, 9);
    this.date = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`;
    this.remainingHours = Math.ceil((Number(targetDate) - Number(date)) / (1000 * 60));
    this.form = this.fb.group({
      cetNum: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  onCancel () {
    this.information = '';
  }

  onSubmit () {
    if (this.form.valid) {
      // 使用准考证获取验证码
      const headers = new HttpHeaders().set('token', getCookie('token'));
      this.http.get(`https://os.ncuos.com/api/info/cet?cet_num=${this.form.value.cetNum}`, {headers})
        .subscribe(data => { this.setIdentifyingCode(data); });
    } else {
      this.information = '准考证或姓名未填写';
    }
  }

  onSubmitIdentifyingCode () {
    this.http.post('https://os.ncuos.com/api/info/cet', {
      'key': this.identifyingCode,
      'verify': 1,
      'result_cookies': this.cookie,
      'cet_num': this.form.value.cetNum,
      'name': this.form.value.name
    })
    .subscribe(d => { this.setScore(d); });
  }

  cancelVerificationCode () {
    this.showVerificationCode = false;
  }

  setIdentifyingCode (data) {
    console.log(data);
    if (data.status) {
      this.cookie = data.result_cookies;
      // 如果有验证码就显示验证码，没有就继续提交请求
      if (data.verify) {
        this.showVerificationCode = true;
        this.identifyingImg = data.img;
      } else {
        const headers = new HttpHeaders().set('token', getCookie('token'));
        this.http.post('https://os.ncuos.com/api/info/cet', {
          'verify': 0,
          'result_cookies': this.cookie,
          'cet_num': this.form.value.cetNum,
          'name': this.form.value.name
        }, {headers})
        .subscribe(d => { this.setScore(d); });
      }
    }
  }

  setScore (data) {
    // 如果验证码正确则跳转到成绩页面，否则重新显示一个新的验证码
    if (data.status) {
      // 跳转到成绩页面，并存储准考证号
      setCookie('cetNum', this.form.value.cetNum);
      setCookie('name', this.form.value.name);
      this.router.navigate(['/score']);
    } else {
      // 验证码错误
      this.identifyingCode = '';
      this.showWarning = true;
      this.onSubmit();
    }
  }

}
