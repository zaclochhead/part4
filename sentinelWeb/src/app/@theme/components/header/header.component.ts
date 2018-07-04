import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  public time;
  @Input() position = 'normal';

  user: any;
  interval;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService) {
              this.getTime();

              this.interval = setInterval(() => {
                  this.getTime();
              }, 1000);
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }
  getTime(){
    var hours = new Date().getHours();
    var format = "AM";
    if(hours === 0){
      hours = 12;
    }
    else if(hours>12){
      format = "PM";
      hours = hours-12;
    }
    else if(hours===12){
      format = "PM";
    }
    var minutes = new Date().getMinutes();
    var minutesTwo = (("0" + minutes).slice(-2));
    this.time = hours + ":"+minutesTwo + format;
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
