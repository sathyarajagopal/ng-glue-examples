import { Component, OnInit, OnDestroy } from '@angular/core';
import { WindowsService, GDWindow } from '@glue42/ng-glue';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, timeout, filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-windows',
  templateUrl: './windows.component.html',
  styleUrls: ['./windows.component.css']
})
export class WindowsComponent implements OnInit, OnDestroy {

  public openWindowForm: FormGroup;
  public eventListenersForm: FormGroup;
  private unsubscribeFromAll = new Subject<void>();

  constructor(private windowsService: WindowsService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.openWindowForm = new FormGroup({
      name: new FormControl(''),
      url: new FormControl(''),
    });

    this.eventListenersForm = new FormGroup({
      windowOpen: new FormControl(false),
      windowClosed: new FormControl(false),
      windowGotFocus: new FormControl(false),
      windowLostFocus: new FormControl(false)
    });

    this.listenForWindowsEvents(this.windowsService.windowOpened(), 'windowOpen');
    this.listenForWindowsEvents(this.windowsService.windowClosed(), 'windowClosed');
    this.listenForWindowsEvents(this.windowsService.windowGotFocus(), 'windowGotFocus');
    this.listenForWindowsEvents(this.windowsService.windowLostFocus(), 'windowLostFocus');
  }

  ngOnDestroy() {
    this.unsubscribeFromAll.next();
  }

  public openWindow() {
    const { name, url } = this.openWindowForm.value;
    this.windowsService.open(name, 'http://' + url).pipe(
      timeout(3000)
    ).subscribe({
      next: window => {
        this.toastrService.success(`Window ${window.name} with id ${window.id} is open.`);
      },
      error: err => {
        this.toastrService.error(err);
      }
    });
  }

  private listenForWindowsEvents(eventObservable: Observable<GDWindow>, event: string) {

    eventObservable.pipe(
      withLatestFrom(this.eventListenersForm.valueChanges),
      filter(([_, data]) => data[event]),
      distinctUntilChanged(),
      takeUntil(this.unsubscribeFromAll)
    ).subscribe(([window]) => {
      this.toastrService.success(`${event} - ${window.name}`);
    });
  }
}
