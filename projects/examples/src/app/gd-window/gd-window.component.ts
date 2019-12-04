import { Component, OnInit, OnDestroy } from '@angular/core';
import { GDWindowService, WindowsService, GDWindow } from '@glue42/ng-glue';
import { share, startWith, distinctUntilChanged, map, debounceTime, filter, switchMap, catchError, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Observable, merge, of, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gd-window',
  templateUrl: './gd-window.component.html',
  styleUrls: ['./gd-window.component.css']
})
export class GdWindowComponent implements OnInit, OnDestroy {

  public my: GDWindow;
  public window: GDWindow;
  public windowService: GDWindowService;
  public windows: GDWindow[] = [];

  public settingsFrom: FormGroup;
  public eventListenersForm: FormGroup;

  private windowAddedOrRemoved: Observable<GDWindow>;
  private unsubscribeFromAll = new Subject<void>();

  constructor(private windowsService: WindowsService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.setSettingsForm();
    this.setEventsForm();

    this.my = this.windowsService.api.my();
    this.windowAddedOrRemoved = merge(
      this.windowsService.windowOpened(),
      this.windowsService.windowClosed()
    ).pipe(
      startWith(this.my),
      filter(window => window.isVisible),
      share()
    );
  }

  ngOnDestroy() {
    this.unsubscribeFromAll.next();
  }

  public selectWindow(window: GDWindow) {
    this.unsubscribeFromAll.next();
    this.settingsFrom.reset();
    this.eventListenersForm.reset();
    this.window = window;
    this.windowService = new GDWindowService(this.window);
    this.listenForWindowEvents(this.windowService.focusChanged(), 'focus');
    this.listenForWindowEvents(this.windowService.boundsChanged(), 'bounds');
    this.listenForWindowEvents(this.windowService.maximized(), 'maximize');
  }

  public loadWindows() {
    this.windowAddedOrRemoved.subscribe(_ =>
      this.windows = this.windowsService.api.list().filter(window =>
        window.isVisible
      ));
  }

  private listenForWindowEvents(eventObservable: Observable<GDWindow>, event: string) {
    eventObservable.pipe(
      withLatestFrom(this.eventListenersForm.valueChanges),
      filter(([_, data]) => data[event]),
      distinctUntilChanged(),
      takeUntil(this.unsubscribeFromAll)
    ).subscribe(([window]) => {
      this.toastrService.success(`${event} - ${window.name}`);
    });
  }

  private handleObservableError() {
    return error => {
      this.toastrService.error(error.message);
      return of();
    };
  }

  private setSettingsForm() {
    this.settingsFrom = new FormGroup({
      color: new FormControl(''),
      title: new FormControl(''),
    });

    this.settingsFrom.valueChanges.pipe(
      debounceTime(500),
      map(data => data.color),
      filter(color => color && color !== ''),
      distinctUntilChanged(),
      switchMap(color =>
        this.windowService.setFrameColor(color).pipe(
          catchError(this.handleObservableError())
        )
      )
    ).subscribe({
      next: (window: GDWindow) => {
        this.toastrService.success(`${window.name}'s color is now ${window.frameColor ? window.frameColor : 'default'}.`);
      }
    });

    this.settingsFrom.valueChanges.pipe(
      debounceTime(300),
      map(data => data.title),
      filter(title => title && title !== ''),
      distinctUntilChanged(),
      switchMap(title =>
        this.windowService.setTitle(title).pipe(
          catchError(this.handleObservableError())
        )
      )
    ).subscribe({
      next: (window: GDWindow) => {
        this.toastrService.success(`Title has successfully changed to ${window.title}`);
      }
    });
  }

  private setEventsForm() {
    this.eventListenersForm = new FormGroup({
      focus: new FormControl(false),
      bounds: new FormControl(false),
      maximize: new FormControl(false),
    });
  }
}
