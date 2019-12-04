# NgGlue42

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Installation

```
npm install @glue42/desktop @glue42/ng-glue
```

## Importing the Glue42 NgModule

Once installed NgGlue42Module needs to be imported and the static method **withConfig** to be invoked with an optional configuration. **withConfig** inits an instance of glue library:

```typescript
import { NgGlue42Module } from '@glue42/ng-glue';

@NgModule({
  imports: [
    NgGlue42Module.withConfig({})
  ]
})
export class AppModule { }
```

## Using the library
Start using by injecting any of the provided API into your components and services:

```typescript
import { InteropService } from '@glue42/ng-glue';

@Component({
  selector: 'app-my-component',
  templateUrl: 'my.component.html'
})
export class MyComponent implements OnInit {

  constructor(interopService: InteropService) { }

  ngOnInit(): void {
      interopService.methodRegistered({ name: 'SampleMethodName' }).subscribe((method) => {
        ...
      });
  }
 }
```

## API

* [ Interop ](./api-docs/interop-readme.md)
* [ Application Manager ](./api-docs/app-manager-readme.md)
* [ Windows ](./api-docs/windows-readme.md)
* [ Groups ](./api-docs/groups-readme.md)
* [ GD Window ](./api-docs/gd-window-readme.md)
* [ Activities ](./api-docs/activities-readme.md)
* [ My Activity ](./api-docs/my-activity-readme.md)
* [ Shared Contexts ](./api-docs/shared-contexts-readme.md)
* [ Channels ](./api-docs/channels-readme.md)
* [ Layouts ](./api-docs/layouts-readme.md)

## Build

* Run `npm run prepublish` to build the project and prepare it for publishing. The build artifacts will be stored in the `dist/` directory, along with a .tgz archive representing the package as it would be published.

## Publishing

Go to the dist folder `cd dist/ng-glue42` and run `npm publish`.

## Running unit tests

Run `ng test ng-glue42` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
