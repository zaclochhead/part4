import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { PostsService } from '../../../../app/posts.service';
import { Event } from '../../../../app/event';

@Component({
  selector: 'ngx-chartjs-pie',
  template: `
    <chart type="pie" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsPieComponent implements OnDestroy {
  data: any;
  options: any;
  themeSubscription: any;
  ioConnection: any;
  @Output() waterUsage: EventEmitter<any> = new EventEmitter();
  
  constructor(private theme: NbThemeService, private postsService: PostsService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.data = {
        labels : [],
        datasets: [{
          data: [100 ],
          backgroundColor: ['#27CFC3'],
        }],
      };

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        }, 
      };
    });
    this.initIoConnection();        
  }

  private initIoConnection(): void {
    this.postsService.initSocket();

    this.ioConnection = this.postsService.onLevel()
      .subscribe((message : any) => {
        const waterLevel = message.level;
        this.updateResults(waterLevel); 
    });


    this.postsService.onEvent(Event.CONNECT)
      .subscribe(() => {
      });

    this.postsService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
      });
  }


  private updateResults(waterLevel){
    const emptyData = 100-waterLevel; 
    if(emptyData >0){
      this.data = {
        labels: [],
        datasets: [{
          data: [waterLevel, emptyData ],
          backgroundColor: ['#27CFC3', 'white'],
        }],
      };
    }
    else{
      this.data = {
        labels: [],
        datasets: [{
          data: [waterLevel],
          backgroundColor: ['#27CFC3'],
        }],
      };
    }
    this.waterUsage.emit(waterLevel);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
