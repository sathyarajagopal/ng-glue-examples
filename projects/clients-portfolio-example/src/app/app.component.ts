import { Component, OnInit } from '@angular/core';
import { SharedContextsService } from '@glue42/ng-glue';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    public contextService: SharedContextsService
  ) { }

  public ngOnInit(): void {
    this.changeTheme();
  }

  private changeTheme(): void {
    this.contextService.context('NgGlue42.Theme')
      .subscribe(({ data }) => {
        const theme = data.theme;

        document.getElementById('clients-portfolio').className = theme;
      });
  }
}
