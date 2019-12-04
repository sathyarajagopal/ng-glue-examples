import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '@glue42/ng-glue';
import { timer, Subject } from 'rxjs';
import { switchMap, takeUntil, filter, repeatWhen, startWith, take } from 'rxjs/operators';
import { GnsNotificationSettings, GnsNotification } from '@glue42/ng-glue';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  public repeatNotifications = new Subject<boolean>();
  public toggleButton = this.repeatNotifications.pipe(startWith(false));

  private on = this.repeatNotifications.pipe(filter((v) => v));
  private off = this.repeatNotifications.pipe(filter((v) => !v));

  constructor(public notificationsService: NotificationsService) { }

  public ngOnInit(): void {
    const notificationSettings: GnsNotificationSettings = {
      severity: 'Low',
      title: 'Notification on interval',
      source: 'NgGlue42'
    };

    this.on
      .pipe(
        switchMap(() => timer(0, 3000)),
        switchMap((time) =>
          this.notificationsService.raiseNotification({ ...notificationSettings, description: `${3 * time} seconds since started` })
        ),
        takeUntil(this.off),
        repeatWhen((notifier) => notifier)
      )
      .subscribe();

    this.notificationsService.notification
      .pipe(
        take(3)
      )
      .subscribe({
        next: (notification: GnsNotification) => console.log(`${notification.source} raised ${notification.title}`)
      });
  }

  public start(): void {
    this.repeatNotifications.next(true);
  }

  public stop(): void {
    this.repeatNotifications.next(false);
  }

  public raiseLowNotification() {
    const notification: GnsNotificationSettings = {
      severity: 'Low',
      title: 'Low Notification',
      source: 'NgGlue42'
    };
    this.notificationsService.raiseNotification(notification).subscribe();
  }

  public raiseMediumNotification() {
    const notification: GnsNotificationSettings = {
      severity: 'Medium',
      title: 'Medium Notification',
      source: 'NgGlue42'
    };
    this.notificationsService.raiseNotification(notification).subscribe();
  }

  public raiseHighNotification() {
    const notification: GnsNotificationSettings = {
      severity: 'High',
      title: 'High Notification',
      source: 'NgGlue42'
    };
    this.notificationsService.raiseNotification(notification).subscribe();
  }

  public raiseCriticalNotification() {
    const notification: GnsNotificationSettings = {
      severity: 'Critical',
      title: 'Critical Notification',
      source: 'NgGlue42'
    };
    this.notificationsService.raiseNotification(notification).subscribe();
  }
}
