import { Component, OnInit } from '@angular/core';
import {
  SwiperConfigInterface,
} from 'ngx-swiper-wrapper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getCookie } from '../ts/cookie';
import { Router } from '@angular/router';


@Component({
  selector: 'app-historical-statistics',
  templateUrl: './historical-statistics.component.html',
  styleUrls: ['./historical-statistics.component.scss']
})
export class HistoricalStatisticsComponent implements OnInit {

  public passingRateOption4;
  public scoreOpiton4;
  public passingNumberOption4;
  public passingRateOption6;
  public scoreOpiton6;
  public passingNumberOption6;
  public type; // 四级还是六级, 1为四级，0为六级
  public level; // 类型等级，如：最强王者
  public totalNumber; // 总查询人数
  public percent; // 超过人群比例, 0~100
  public rank; // 名次
  public isPass; // 是否通过考试
  public config: SwiperConfigInterface;
  public warning; // 未找到学院数据时使用


  constructor(
    public http: HttpClient,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.fetchInfo();
    this.fetchStatistic();
  }

  fetchInfo () {
    if (getCookie('cetNum')) {
      const headers = new HttpHeaders().set('token', getCookie('token'));
      this.http.post('https://os.ncuos.com/api/info/cet', {
        'verify': 0,
        'cet_num': getCookie('cetNum'),
        'name': getCookie('name')
      }, {headers})
      .subscribe(d => { this.setInfo(d); });
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchStatistic () {
    const headers = new HttpHeaders().set('token', getCookie('token'));
    this.http.get('https://os.ncuos.com/api/info/cet_pre?type=cet4', {headers}).subscribe(
      (data) => { this.setStatistic(data, 1);
    });
    this.http.get('https://os.ncuos.com/api/info/cet_pre?type=cet6', {headers}).subscribe(
      (data) => { this.setStatistic(data, 0);
    });
  }

  setStatistic (data, type) {
    if (data.status) {
      const keys = Object.keys(data.data);
      const years = [];
      const maxScores = [];
      const averageScores = [];
      const passNumbers = [];
      const nopassNumbers = [];
      const passRatios = [];
      const totalNumbers = [];
      const firstPassNumbers = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const year = key.slice(0, key.indexOf('-'));
        const passNumber = data.data[key].pass;
        const nopassNumber = data.data[key].depass;
        const totalNumber = passNumber + nopassNumber;
        const firstPassNumber = data.data[key].first_pass * totalNumber;
        console.log(data.data[key].first_pass);
        years.push(year);
        maxScores.push(Math.floor(data.data[key].max));
        averageScores.push(Math.floor(data.data[key].average));
        passRatios.push(Math.floor(data.data[key].pass_bit * 100));
        passNumbers.push(Math.floor(passNumber));
        nopassNumbers.push(Math.floor(nopassNumber));
        totalNumbers.push(Math.floor(totalNumber));
        firstPassNumbers.push(Math.floor(firstPassNumber));
      }
      if (type) {
        this.setDiagramsLevel4(years, maxScores, averageScores, passRatios, passNumbers, nopassNumbers, totalNumbers, firstPassNumbers);
      } else {
        this.setDiagramsLevel6(years, maxScores, averageScores, passRatios, passNumbers, nopassNumbers, totalNumbers, firstPassNumbers);
      }
      this.setSwiper();
    } else {
      // 没有找到学院数据
      this.warning = data.message;
      this.setSwiper();
    }
  }

  setInfo (data) {
    this.isPass = data.is_pass;
    this.type = data.level;
    this.rank = data.rank;
    this.totalNumber = data.count;
    this.percent = 100 - this.rank * 100 / this.totalNumber;
    if (this.percent > 85) {
      this.level = '至尊星耀';
    } else if (this.percent >= 75) {
      this.level = '永恒钻石';
    } else if (this.percent >= 65) {
      this.level = '尊贵铂金';
    } else if (this.percent >= 50) {
      this.level = '荣耀黄金';
    } else if (this.percent >= 30) {
      this.level = '秩序白银';
    } else {
      this.level = '倔强青铜';
    }
  }

  setDiagramsLevel4 (years, maxScores, averageScores, passRatios, passNumbers, nopassNumbers, totalNumbers, firstPassNumbers) {
    this.passingRateOption4 = {
      legend:  {
        data: ['通过率', '通过数', '未通过数'],
        left: '4%',
        top: '5%'
      },
      grid: {
        x: '15%',
        x2: '15%',
        y2: '12%'
      },
      tooltip : {
        trigger: 'axis',
        formatter: '{b} <br/>{a0} : {c0}% <br/>{a1} : {c1}人 <br/>{a2} : {c2}人'
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : years,
          axisLabel: {
            color: '#7b90cf',
            fontSize: 12
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type : 'value',
          show: false,
          name: '比率'
        },
        {
          type : 'value',
          show: false,
          name: '人数',
          max: function (value) {
            return value.max * 2;
          }
        },
      ],
      series: [
        {
          name: '通过率',
          type: 'line',
          yAxisIndex: 0,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#f66d94',
              borderColor: 'rgb(249,204,208, 0.5)',
              borderWidth: 3,
              symbolSize: 7,
              lineStyle: {
                color: '#e495ba',
                width: 3
              },
              label: {
                show: true,
                color: '#7b90cf',
                formatter: '{c}%',
                fontSize: 12
              },
            }
          },
          data: passRatios,
        },
        {
          name: '未通过数',
          type: 'bar',
          yAxisIndex: 1,
          stack: '人数',
          barWidth: '50%',
          itemStyle: {
            normal: {
              color: '#94a7dd',
              label: {
                show: true,
                color: '#ffffff',
                fontSize: 12,
                position: 'inside'
              }
            }
          },
          data: nopassNumbers,
        },
        {
          name: '通过数',
          type: 'bar',
          yAxisIndex: 1,
          barWidth: '50%',
          stack: '人数',
          itemStyle: {
            normal: {
              color: '#f57d84',
              barBorderRadius: [100, 100, 0, 0],
              label: {
                show: true,
                color: '#ffffff',
                fontSize: 12,
                position: 'inside'
              }
            }
          },
          data: passNumbers
        },
      ]
    };

    this.scoreOpiton4 = {
      legend:  {
        data: ['平均分', '最高分'],
        left: '4%',
        top: '5%'
      },
      grid: {
        y: '30%',
        y2: '12%'
      },
      tooltip : {
        trigger: 'axis'
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : years,
          axisLabel: {
            color: '#7b90cf',
            fontSize: 12
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type : 'value',
          show: false,
        }
      ],
      series: [
        {
          name: '平均分',
          type: 'line',
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#f66d94',
              borderColor: 'rgb(249,204,208, 0.5)',
              borderWidth: 3,
              symbolSize: 7,
              lineStyle: {
                color: '#e495ba',
                width: 3
              },
              label: {
                show: true,
                color: '#7b90cf',
                formatter: '{c}',
                fontSize: 12
              },
            }
          },
          data: averageScores,
        },
        {
          name: '最高分',
          type: 'line',
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#f66d94',
              borderColor: 'rgb(249,204,208, 0.5)',
              borderWidth: 3,
              symbolSize: 7,
              lineStyle: {
                color: '#f8a6bf',
                width: 3
              },
              label: {
                show: true,
                color: '#7b90cf',
                formatter: '{c}',
                fontSize: 12
              },
            }
          },
          data: maxScores,
        },
      ]
    };

    this.passingNumberOption4 = {
      grid: {
        y: '30%',
        y2: '12%',
        x: '7%',
        x2: '7%'
      },
      legend: {
        data: ['总人数', '首次通过人数'],
        left: '4%',
        top: '5%'
      },
      xAxis: {
        data: years,
        axisLabel: {
          color: '#7b90cf',
          fontSize: 12
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        show: false
      },
      series: [
        {
          name: '总人数',
          type: 'bar',
          data: totalNumbers,
          itemStyle: {
            normal: {
              color: '#f49096',
              barBorderRadius: [100, 100, 0, 0],
              label: {
                show: true,
                color: '#7b90cf',
                fontSize: 12,
                position: 'top'
              }
            }
          }
        },
        {
          name: '首次通过人数',
          type: 'bar',
          data: firstPassNumbers,
          itemStyle: {
            normal: {
              color: '#f07e9c',
              barBorderRadius: [100, 100, 0, 0],
              label: {
                show: true,
                color: '#7b90cf',
                fontSize: 12,
                position: 'top'
              }
            }
          }
        }
      ]
    };
  }

  setDiagramsLevel6 (years, maxScores, averageScores, passRatios, passNumbers, nopassNumbers, totalNumbers, firstPassNumbers) {
    this.passingRateOption6 = {
      legend:  {
        data: ['通过率', '通过数', '未通过数'],
        left: '4%',
        top: '5%'
      },
      grid: {
        x: '15%',
        x2: '15%',
        y2: '12%'
      },
      tooltip : {
        trigger: 'axis',
        formatter: '{b} <br/>{a0} : {c0}% <br/>{a1} : {c1}人 <br/>{a2} : {c2}人'
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : years,
          axisLabel: {
            color: '#7b90cf',
            fontSize: 12
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type : 'value',
          show: false,
          name: '比率'
        },
        {
          type : 'value',
          show: false,
          name: '人数',
          max: function(value) {
            return value.max * 2;
        }
        },
      ],
      series: [
        {
          name: '通过率',
          type: 'line',
          yAxisIndex: 0,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#f66d94',
              borderColor: 'rgb(249,204,208, 0.5)',
              borderWidth: 3,
              symbolSize: 7,
              lineStyle: {
                color: '#e495ba',
                width: 3
              },
              label: {
                show: true,
                color: '#7b90cf',
                formatter: '{c}%',
                fontSize: 12
              },
            }
          },
          data: passRatios,
        },
        {
          name: '未通过数',
          type: 'bar',
          yAxisIndex: 1,
          stack: '人数',
          barWidth: '50%',
          data: nopassNumbers,
          itemStyle: {
            normal: {
              color: '#94a7dd',
              label: {
                show: true,
                color: '#ffffff',
                fontSize: 12,
                position: 'inside'
              }
            }
          },
        },
        {
          name: '通过数',
          type: 'bar',
          yAxisIndex: 1,
          barWidth: '50%',
          stack: '人数',
          data: passNumbers,
          itemStyle: {
            normal: {
              color: '#f57d84',
              barBorderRadius: [100, 100, 0, 0],
              label: {
                show: true,
                color: '#ffffff',
                fontSize: 12,
                position: 'inside'
              }
            }
          }
        },
      ]
    };

    this.scoreOpiton6 = {
      legend:  {
        data: ['平均分', '最高分'],
        left: '4%',
        top: '5%'
      },
      grid: {
        y: '30%',
        y2: '12%'
      },
      tooltip : {
        trigger: 'axis'
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : years,
          axisLabel: {
            color: '#7b90cf',
            fontSize: 12
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type : 'value',
          show: false,
        }
      ],
      series: [
        {
          name: '平均分',
          type: 'line',
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#f66d94',
              borderColor: 'rgb(249,204,208, 0.5)',
              borderWidth: 3,
              symbolSize: 7,
              lineStyle: {
                color: '#e495ba',
                width: 3
              },
              label: {
                show: true,
                color: '#7b90cf',
                formatter: '{c}',
                fontSize: 12
              },
            }
          },
          data: averageScores,
        },
        {
          name: '最高分',
          type: 'line',
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#f66d94',
              borderColor: 'rgb(249,204,208, 0.5)',
              borderWidth: 3,
              symbolSize: 7,
              lineStyle: {
                color: '#f8a6bf',
                width: 3
              },
              label: {
                show: true,
                color: '#7b90cf',
                formatter: '{c}',
                fontSize: 12
              },
            }
          },
          data: maxScores,
        },
      ]
    };

    this.passingNumberOption6 = {
      grid: {
        y: '30%',
        y2: '12%',
        x: '7%',
        x2: '7%'
      },
      legend: {
        data: ['总人数', '首次通过人数'],
        left: '4%',
        top: '5%'
      },
      xAxis: {
        data: years,
        axisLabel: {
          color: '#7b90cf',
          fontSize: 12
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        show: false
      },
      series: [
        {
          name: '总人数',
          type: 'bar',
          data: totalNumbers,
          itemStyle: {
            normal: {
              color: '#f49096',
              barBorderRadius: [100, 100, 0, 0],
              label: {
                show: true,
                color: '#7b90cf',
                fontSize: 12,
                position: 'top'
              }
            }
          }
        },
        {
          name: '首次通过人数',
          type: 'bar',
          data: firstPassNumbers,
          itemStyle: {
            normal: {
              color: '#f07e9c',
              barBorderRadius: [100, 100, 0, 0],
              label: {
                show: true,
                color: '#7b90cf',
                fontSize: 12,
                position: 'top'
              }
            }
          }
        }
      ]
    };
  }

  setSwiper () {
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
    }, 20);
  }
}
