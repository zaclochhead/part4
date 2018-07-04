import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { PostsService } from '../../../../app/posts.service';
import { Event } from '../../../../app/event';

import { ElectricityService } from '../../../@core/data/electricity.service';

@Component({
  selector: 'ngx-electricity',
  styleUrls: ['./electricity.component.scss'],
  templateUrl: './electricity.component.html',
})
export class ElectricityComponent implements OnDestroy, OnInit {
  @Input("weekOffset")weekOffset;
  @Input("dayOffset")dayOffset;
  @Input("dateMetric")dateMetric;
  @Input("yearOffset")yearOffset;

  @ViewChild("electricityChart") electricityChart;
  messages: String[] = [];

  messageContent: string;
  ioConnection: any;
  public kiloWatts : number = 84; 
  public interval : any;
  public info : any;
  data: Array<any>;

  type = 'week';
  types = ['week', 'month', 'year'];

  currentTheme: string;
  themeSubscription: any;

  constructor(private eService: ElectricityService, private themeService: NbThemeService, private postsService: PostsService) {
    this.data = this.eService.getData();

    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
/*        this.refreshData();
      this.interval = setInterval(() => { 
          this.refreshData(); 
      }, 100); */

    });
  }

  ngOnInit(){
    this.initIoConnection();
    let j; 

/*     this.postsService.storeData(10).subscribe(value => {
       this.kiloWatts = value.level;
    }); */
  }

/*   ngOnChanges(){
    this.postsService.getData().subscribe(value => {
      this.kiloWatts = value;
   });
  } */

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }



  private initIoConnection(): void {
    this.postsService.initSocket();

    this.ioConnection = this.postsService.onMessage()
      .subscribe((message : any) => {
        //console.log(message)
        this.kiloWatts = message.message;
       // console.log(this.messages);
    });


    this.postsService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.postsService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }
    this.postsService.send({
      message
    });
    this.messageContent = null;
  }

  public setCurrentDailyWaterLevels(){
    this.electricityChart.setCurrentDailyWaterLevels();
  }

  public setCurrentWeeklyWaterLevels(){
    this.electricityChart.setCurrentWeeklyWaterLevels();
  }

  public setCurrentYearlyWaterLevels(){
    this.electricityChart.setCurrentYearlyWaterLevels();
  }
  public setDailyWaterLevels(dayCount){
    this.electricityChart.setDailyWaterLevels(dayCount);
  }

  public setWeeklyWaterLevels(weeklyCount){
    this.electricityChart.setWeeklyWaterLevels(weeklyCount);
  }
  
  public setYearlyWaterLevels(yearCount){
    this.electricityChart.setYearlyWaterLevels(yearCount);
  }
}
