import { Component, OnInit } from '@angular/core';

import { Observable, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';

import { AppManagerService, Application, AppInstance } from '@glue42/ng-glue';
import { ToastrService } from 'ngx-toastr';

export interface AppDetails {
  appName: string;
  runningInstances: number;
}

function toAppDetails({ name: appName, instances }: Application): AppDetails {
  return ({ appName, runningInstances: (instances || []).length });
}

function incrementRunningInstances({ appName, runningInstances }: AppDetails): AppDetails {
  return {
    appName,
    runningInstances: isNaN(runningInstances) ? 0 : (runningInstances + 1)
  };
}

function decrementRunningInstances({ appName, runningInstances }: AppDetails): AppDetails {
  return {
    appName,
    runningInstances: isNaN(runningInstances) ? 0 : (runningInstances - 1)
  };
}

function appInstancesReducer(operation, appName: string) {

  return (apps: AppDetails[], currentApp: AppDetails) => {
    if (currentApp.appName === appName) {
      apps.push(operation(currentApp));
    } else {
      apps.push(currentApp);
    }

    return apps;
  };
}

@Component({
  templateUrl: './app-manager-demo.component.html'
})
export class AppManagerDemoComponent implements OnInit {

  public apps: Observable<AppDetails[]>;

  constructor(
    public appManagerService: AppManagerService,
    public toastrService: ToastrService
  ) { }

  public ngOnInit(): void {

    const applications = this.appManagerService.applications()
      .pipe(
        map(apps => apps.map(toAppDetails)),
        map((apps) => () => apps)
      );

    const appInstanceStarted = this.appManagerService.appInstanceStarted()
      .pipe(
        map(
          ({ application }: AppInstance) => (apps: AppDetails[]) =>
            apps.reduce(appInstancesReducer(incrementRunningInstances, application.name), []))
      );

    const appInstanceStopped = this.appManagerService.appInstanceStopped()
      .pipe(
        map(
          ({ application }: AppInstance) => (apps: AppDetails[]) =>
            apps.reduce(appInstancesReducer(decrementRunningInstances, application.name), []))
      );

    this.apps = merge(applications, appInstanceStarted, appInstanceStopped)
      .pipe(
        scan<any>((apps, operation) => operation(apps), [])
      );
  }

  public startApplication(appName: string) {
    this.appManagerService.start(appName)
      .subscribe({
        next: (appInstance: AppInstance) =>
          this.toastrService.success(`Application *${appInstance.application.name}* started successfully`),
        error: (err) => this.toastrService.error(err.message || err)
      });
  }
}
