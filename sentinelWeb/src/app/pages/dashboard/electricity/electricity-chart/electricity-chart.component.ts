import { delay } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { PostsService } from '../../../../../app/posts.service';
import { Event } from '../../../../../app/event';

declare const echarts: any;

@Component({
  selector: 'ngx-electricity-chart',
  styleUrls: ['./electricity-chart.component.scss'],
  template: `
    <div echarts [options]="option" class="echart"></div>
  `,
})
export class ElectricityChartComponent implements AfterViewInit, OnDestroy {
  @Input("weekOffset")weekOffset;
  @Input("dayOffset")dayOffset;
  @Input("dateMetric")dateMetric;
  @Input("yearOffset")yearOffset;
  ioWeeklyConnection: any; 
  ioYearlyConnection:any;
  ioDailyConnection:any;     
  ioTodayConnection:any;
  weeklyWaterLevels:any = [];
  dailyWaterLevels:any = [];
  yearlyWaterLevels:any = [];  
  options: any;
  themeSubscription: any;
  currentDayIndex; 
  currentHourIndex;
  currentMonthIndex;
  option: any;
  data: Array<any>;

  constructor(private theme: NbThemeService, private postsService: PostsService) {


      this.currentDayIndex = new Date().getDay();
      this.currentMonthIndex = new Date().getMonth();
      this.currentHourIndex = new Date().getHours();

      this.initIoConnection();          
      this.setCurrentWeeklyWaterLevels(); 

      const labels = ["one", "two", "three","four"];
      const datas = [1,2,3,4];
      this.data = datas.map((p,index)=>({
        label:labels[index],
        value:p
      }));

  }

  ngAfterViewInit(): void {
    this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {
      const eTheme: any = config.variables.electricity;

      this.option = {
          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 80,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                color: eTheme.tooltipLineColor,
                width: eTheme.tooltipLineWidth,
              },
            },
            textStyle: {
              color: eTheme.tooltipTextColor,
              fontSize: 20,
              fontWeight: eTheme.tooltipFontWeight,
            },
            position: 'top',
            backgroundColor: eTheme.tooltipBg,
            borderColor: eTheme.tooltipBorderColor,
            borderWidth: 3,
            formatter: '{c0} kWh',
            extraCssText: eTheme.tooltipExtraCss,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            offset: 25,
            data: this.data.map(i => i.label),
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: eTheme.xAxisTextColor,
              fontSize: 18,
            },
            axisLine: {
              lineStyle: {
                color: eTheme.axisLineColor,
                width: '2',
              },
            },
          },
          yAxis: {
            boundaryGap: [0, '5%'],
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: eTheme.yAxisSplitLine,
                width: '1',
              },
            },
          },
          series: [
            {
              type: 'line',
              smooth: true,
              symbolSize: 20,
              itemStyle: {
                normal: {
                  opacity: 0,
                },
                emphasis: {
                  color: '#ffffff',
                  borderColor: eTheme.itemBorderColor,
                  borderWidth: 2,
                  opacity: 1,
                },
              },
              lineStyle: {
                normal: {
                  width: eTheme.lineWidth,
                  type: eTheme.lineStyle,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: eTheme.lineGradFrom,
                  }, {
                    offset: 1,
                    color: eTheme.lineGradTo,
                  }]),
                  shadowColor: eTheme.lineShadow,
                  shadowBlur: 6,
                  shadowOffsetY: 12,
                },
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: eTheme.areaGradFrom,
                  }, {
                    offset: 1,
                    color: eTheme.areaGradTo,
                  }]),
                },
              },
              data: this.data.map(i => i.value),
            },

            {
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  width: eTheme.lineWidth,
                  type: eTheme.lineStyle,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: eTheme.lineGradFrom,
                  }, {
                    offset: 1,
                    color: eTheme.lineGradTo,
                  }]),
                  shadowColor: eTheme.shadowLineDarkBg,
                  shadowBlur: 14,
                  opacity: 1,
                },
              },
              data: this.data.map(i => i.value),
            },
          ],
        };
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  private initIoConnection(): void {
    this.postsService.initSocket();
    this.ioWeeklyConnection = this.postsService.onWeek()
      .subscribe((message : any) => {
        this.currentDayIndex = new Date().getDay();
        // average water levels from today to 7 days ago
        const day1 = message[0][0];
        const day2 = message[1][0];
        const day3 = message[2][0];
        const day4 = message[3][0];
        const day5 = message[4][0];
        const day6 = message[5][0];     
        const day7 = message[6][0];  
        let dayIndex; 
        let tempWaterLevels = [day1[""],day2[""], day3[""],day4[""], day5[""],day6[""],day7[""]];

        this.weeklyWaterLevels = [];
        // need to use different logic for sundays
        if(this.currentDayIndex === 0){
          dayIndex = 6;
        }
        else{
          dayIndex = this.currentDayIndex - 1;
        }
        if(this.weekOffset ===0 ){
          for(let i = 0; i<7; i++){
            if((dayIndex - i)>=0){
              this.weeklyWaterLevels[dayIndex - i] = tempWaterLevels[i];
            }
          }
        }
        else{
          for(let i = 0;i<7; i++){
            this.weeklyWaterLevels[i] = tempWaterLevels[6-i];
          }
        }
        const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.data = this.weeklyWaterLevels.map((p,index)=>({
          label:labels[index],
          value:p
        }));   
        this.setOptions();        
    });

    this.ioYearlyConnection = this.postsService.onYear()
    .subscribe((message : any) => {
      this.currentMonthIndex = new Date().getMonth();
      // average water levels from today to 7 days ago
      const month1 = message[0][0];
      const month2 = message[1][0];
      const month3 = message[2][0];
      const month4 = message[3][0];
      const month5 = message[4][0];
      const month6 = message[5][0];     
      const month7 = message[6][0];  
      const month8 = message[7][0];
      const month9 = message[8][0];
      const month10 = message[9][0];
      const month11 = message[10][0];     
      const month12 = message[11][0];

      this.yearlyWaterLevels = [];      
      let tempWaterLevels = [month1[""],month2[""], month3[""],month4[""], month5[""],month6[""],month7[""],month8[""],month9[""],month10[""],month11[""],month12[""]];
      // need to use different logic for sundays
      if(this.yearOffset === 0){
        for(let i = 0; i<12; i++){
          if((this.currentMonthIndex - i)>=0){
            this.yearlyWaterLevels[this.currentMonthIndex - i] = tempWaterLevels[i];
          }
        }
      }
      else{
        for(let i = 0;i<12; i++){
          this.yearlyWaterLevels[i] = tempWaterLevels[11-i];
        }    
      }
      const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.data = this.yearlyWaterLevels.map((p,index)=>({
        label:labels[index],
        value:p
      })); 
      this.setOptions();      
  });

  this.ioDailyConnection = this.postsService.onDay()
  .subscribe((message : any) => {
    this.currentHourIndex = new Date().getHours();
      // average water levels from today to 7 days ago
      const hour1 = message[0][0];
      const hour2 = message[1][0];
      const hour3 = message[2][0];
      const hour4 = message[3][0];
      const hour5 = message[4][0];
      const hour6 = message[5][0];
      const hour7 = message[6][0];
      const hour8 = message[7][0];
      const hour9 = message[8][0];
      const hour10 = message[9][0];
      const hour11 = message[10][0];
      const hour12 = message[11][0];
      const hour13 = message[12][0];
      const hour14 = message[13][0];
      const hour15 = message[14][0];
      const hour16 = message[15][0];
      const hour17 = message[16][0];
      const hour18 = message[17][0];
      const hour19 = message[18][0];
      const hour20 = message[19][0];
      const hour21 = message[20][0];
      const hour22 = message[21][0];
      const hour23 = message[22][0];
      const hour24 = message[23][0];    

      let tempWaterLevels = [hour1[""],hour2[""], hour3[""],hour4[""], hour5[""],hour6[""],hour7[""],hour8[""], hour9[""],hour10[""], hour11[""],hour12[""],hour13[""],hour14[""], hour15[""],hour16[""], hour17[""],hour18[""],hour19[""],hour20[""], hour21[""],hour22[""], hour23[""],hour24[""]];
      this.dailyWaterLevels = [];

      if(this.dayOffset === 0){
        for(let i = 0; i<24; i++){
          if((this.currentHourIndex - i)>=0){
            this.dailyWaterLevels[this.currentHourIndex - i] = tempWaterLevels[i];
          }
        }
      }
      else{
        for(let i = 0;i<24; i++){
          this.dailyWaterLevels[i] = tempWaterLevels[23-i];
        }   
    }      
      const labels = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00' , '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00' , '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
      this.data = this.yearlyWaterLevels.map((p,index)=>({
        label:labels[index],
        value:p
      })); 
      this.setOptions();
});

  this.ioTodayConnection = this.postsService.onLevel()
    .subscribe((message : any) => {
/*       if(this.weekOffset === 0 && this.dayOffset === 0){
        if(this.dateMetric === "Weekly"){
          this.setCurrentWeeklyWaterLevels();
        }
        else if(this.dateMetric==="Daily"){
          this.setCurrentDailyWaterLevels();
        }
      } */
  });

  this.postsService.onEvent(Event.CONNECT)
    .subscribe(() => {
  });

  this.postsService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
      });
  }


  
  public setCurrentWeeklyWaterLevels(){
    this.postsService.getCurrentWeek().subscribe(value => { 
    });  
    return;
  }

  public setCurrentYearlyWaterLevels(){
    this.postsService.getCurrentYear().subscribe(value => { 
    });  
    return;
  }

  public setCurrentDailyWaterLevels(){
    this.postsService.getCurrentDay().subscribe(value => { 
    });  
    return;
  }

  public setWeeklyWaterLevels(week){
    this.postsService.getWeek(week).subscribe(value => { 
    });  
    return;
  }

  public setYearlyWaterLevels(month){
    this.postsService.getYear(month).subscribe(value => { 
    });  
    return;
  }

  public setDailyWaterLevels(hour){
    this.postsService.getDay(hour).subscribe(value => { 
    });  
    return;
  }
  private setOptions() {
    this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {
      const eTheme: any = config.variables.electricity;

      this.option = {
          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 80,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                color: eTheme.tooltipLineColor,
                width: eTheme.tooltipLineWidth,
              },
            },
            textStyle: {
              color: eTheme.tooltipTextColor,
              fontSize: 20,
              fontWeight: eTheme.tooltipFontWeight,
            },
            position: 'top',
            backgroundColor: eTheme.tooltipBg,
            borderColor: eTheme.tooltipBorderColor,
            borderWidth: 3,
            formatter: '{c0} kWh',
            extraCssText: eTheme.tooltipExtraCss,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            offset: 25,
            data: this.data.map(i => i.label),
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: eTheme.xAxisTextColor,
              fontSize: 18,
            },
            axisLine: {
              lineStyle: {
                color: eTheme.axisLineColor,
                width: '2',
              },
            },
          },
          yAxis: {
            boundaryGap: [0, '5%'],
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: eTheme.yAxisSplitLine,
                width: '1',
              },
            },
          },
          series: [
            {
              type: 'line',
              smooth: true,
              symbolSize: 20,
              itemStyle: {
                normal: {
                  opacity: 0,
                },
                emphasis: {
                  color: '#ffffff',
                  borderColor: eTheme.itemBorderColor,
                  borderWidth: 2,
                  opacity: 1,
                },
              },
              lineStyle: {
                normal: {
                  width: eTheme.lineWidth,
                  type: eTheme.lineStyle,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: eTheme.lineGradFrom,
                  }, {
                    offset: 1,
                    color: eTheme.lineGradTo,
                  }]),
                  shadowColor: eTheme.lineShadow,
                  shadowBlur: 6,
                  shadowOffsetY: 12,
                },
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: eTheme.areaGradFrom,
                  }, {
                    offset: 1,
                    color: eTheme.areaGradTo,
                  }]),
                },
              },
              data: this.data.map(i => i.value),
            },

            {
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  width: eTheme.lineWidth,
                  type: eTheme.lineStyle,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: eTheme.lineGradFrom,
                  }, {
                    offset: 1,
                    color: eTheme.lineGradTo,
                  }]),
                  shadowColor: eTheme.shadowLineDarkBg,
                  shadowBlur: 14,
                  opacity: 1,
                },
              },
              data: this.data.map(i => i.value),
            },
          ],
        };
    });
  }
}
