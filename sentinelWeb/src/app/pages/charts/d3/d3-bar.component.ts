import { Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { PostsService } from '../../../../app/posts.service';
import { Event } from '../../../../app/event';
import * as Immutable from 'immutable';

@Component({
  selector: 'ngx-d3-bar',
  template: `
    <ngx-charts-bar-vertical
      [scheme]="colorScheme"
      [results]="results"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [yAxisLabel]="yAxisLabel">
    </ngx-charts-bar-vertical>    
  `,
})
export class D3BarComponent implements OnDestroy {

  results = [
    { name: '', value: 100 },
    {name: "bar", value: 100}
  ]; 
//results = Immutable.Map({ name: '', value:100 });
  showLegend = false;
  showXAxis = false;
  showYAxis = true;
  yAxisLabel = 'Water level (m)';
  colorScheme: any;
  themeSubscription: any;
  ioConnection: any;  
  
  constructor(private theme: NbThemeService, private postsService: PostsService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: ["#27CFC3", "white", colors.successLight, colors.warningLight, colors.dangerLight],
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
    this.results = [
      { name: '', value: waterLevel },
      {name: "bar", value: 100}
    ]; 
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
