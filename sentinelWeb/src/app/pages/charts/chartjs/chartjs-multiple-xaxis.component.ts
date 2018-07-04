import { Component, OnDestroy, Input} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { PostsService } from '../../../../app/posts.service';
import { Event } from '../../../../app/event';

@Component({
  selector: 'ngx-chartjs-multiple-xaxis',
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})

export class ChartjsMultipleXaxisComponent implements OnDestroy {
  @Input("weekOffset")weekOffset;
  @Input("dayOffset")dayOffset;
  @Input("dateMetric")dateMetric;
  @Input("yearOffset")yearOffset;

  data: {};
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
  eTheme;
  constructor(private theme: NbThemeService, private postsService: PostsService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.eTheme = config.variables.electricity;
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this.currentDayIndex = new Date().getDay();
      this.currentMonthIndex = new Date().getMonth();
      this.currentHourIndex = new Date().getHours();

      this.initIoConnection();          
      this.setCurrentWeeklyWaterLevels(); 
     
      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        hover: {
          mode: 'index',
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Day',
              },
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Litres',
              },
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
      };
    });    
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

        this.data = {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [{
            label: 'Litres Used',
            data: this.weeklyWaterLevels,
            borderColor: "#40dc7e",//"#27CFC3",
            backgroundColor: "#40dc7e",//"#27CFC3",
            fill: false,
            pointRadius: 8,
            pointHoverRadius: 10,
          }],
        };              
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

      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Litres Used',
          data: this.yearlyWaterLevels,
          borderColor: "#40dc7e",
          backgroundColor: "#40dc7e",
          fill: false,
          pointRadius: 8,
          pointHoverRadius: 10,
        }],
      };              
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

      this.data = {
        labels:['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00' , '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00' , '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'],
        datasets: [{
          label: 'Litres Used',
          data: this.dailyWaterLevels,
          borderColor: "#40dc7e",
          backgroundColor: "#40dc7e",
          fill: false,
          pointRadius: 8,
          pointHoverRadius: 10,
        }],
      };              
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

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
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

}
