import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { PostsService } from '../../../../app/posts.service';
import { Event } from '../../../../app/event';

@Component({
  selector: 'ngx-temperature',
  styleUrls: ['./temperature.component.scss'],
  templateUrl: './temperature.component.html',
})
export class TemperatureComponent implements OnDestroy {

  waterLevel = 24;
  temperatureOff = false;
  temperature = 24;
  temperatureMode = 'cool';
  public interval : any;
  ioConnection: any;  
  humidity = 87;
  humidityOff = false;
  humidityMode = 'heat';

  colors: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService, private postsService: PostsService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.initIoConnection();
    });
  }


  private initIoConnection(): void {
    this.postsService.initSocket();

    this.ioConnection = this.postsService.onLevel()
      .subscribe((message : any) => {
        this.waterLevel = message.level;
        ; 
    });


    this.postsService.onEvent(Event.CONNECT)
      .subscribe(() => {
      });

    this.postsService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
      });
  }


  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
