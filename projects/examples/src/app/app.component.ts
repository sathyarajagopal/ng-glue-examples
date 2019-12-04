import { Component, OnInit } from '@angular/core';
import { SharedContextsService } from '@glue42/ng-glue';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private themeCtx = 'NgGlue42.Theme';

  title = 'demos';
  menu = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Interop',
    path: 'interop'
  }, {
    name: 'Windows',
    path: 'windows'
  }, {
    name: 'GD Windows',
    path: 'gd-window'
  }, {
    name: 'App Manager',
    path: 'app-manager'
  }, {
    name: 'Notifications',
    path: 'notifications'
  },
  ];

  constructor(private contextService: SharedContextsService) { }

  public ngOnInit(): void {
    this.contextService.context(this.themeCtx).subscribe(({ data }) => {
      document.getElementsByTagName('html')[0].className = data.theme;
    });
  }
}
