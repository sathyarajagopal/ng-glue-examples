import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

import { LayoutsService, Layout, LayoutFilter, LayoutType, RestoreOptions, NewLayoutOptions } from '@glue42/ng-glue';

@Component({
  selector: 'app-layouts-demo',
  templateUrl: './layouts-demo.component.html'
})
export class LayoutsDemoComponent implements OnInit {

  public layouts: Layout[];
  public layouts$: Observable<Layout[]>;
  public removeForm;
  filterOption: LayoutFilter = {
    type: 'Global'
  };

  layoutOb: Layout = {
    name: 'Default 1',
    type: 'Global',
    components: null,
    context: { a: 'aaaa' },
    metadata: { b: 'bbbbb' },
  };

  constructor(
    private layoutService: LayoutsService
  ) {
    this.subscribeForRemovedOrAddedLayouts();
  }

  ngOnInit() {
    this.layouts = this.layoutService.api.list().filter(l => l.type === 'Global' || l.type === 'Activity');
    console.log(this.layouts);

  }

  public removeLayout(name: string, type: string) {
    this.layoutService.remove(type, name);

  }

  public renameLayout(oldName: string, newName: string) {
    const layout = this.layoutService.api.list().filter(l => l.name === oldName)[0];
    this.layoutService.rename(layout, 'asdfsdfasdf');
  }

  public saveLayout(name: string, type: LayoutType) {
    const component = {
      application: 'canvas-demo',
      componentType: 'application',
      state: {
        bounds: {
          left: 93, top: 92, width: 853, height: 580
        },
        windowState: 'Maximized', workspaces: Array(1), canvas: null, selectedWorkspace: 0
      },
      type: 'canvas'

    };
    const layout: NewLayoutOptions = {
      name,
      type,
      ignoreMyInstance: true,
      context: { test: 'Context' },
      metadata: { test: 'Metadata' },
      activityId: (type === 'Activity') ? 'activitiId' + (Math.random() * 10000) : null
    };
    console.log(layout);
    this.layoutService.save(layout).subscribe(l => console.log(l));
  }

  public restoreLayout(name: string, type: LayoutType) {
    const options: RestoreOptions = {
      name,
      type,
      closeRunningInstance: false,
      splash: null
    };

    this.layoutService.restore(options);
  }

  public subscribeForRemovedOrAddedLayouts() {
    this.layoutService.layoutSaved().pipe(
      filter(l => l.type === 'Global' || l.type === 'Activity')
    ).subscribe((a) => {
      if (this.layouts) {
        this.layouts.push(a);
      }
    });
    this.layoutService.layoutRemoved().subscribe((a) => {
      this.layouts = this.layouts.filter(x => x.name !== a.name);
    });
  }

}
