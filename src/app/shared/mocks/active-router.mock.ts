import { Data, Params } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

export class MockActivatedRoute {

  private _testParams?: any;

  // ActivatedRoute.params is Observable
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testParams);

  params = this.subject.asObservable();
  queryParams = this.subject.asObservable();

  constructor(params?: Params) {
    if (params) {
      this.testParams = params;
    } else {
      this.testParams = {};
    }
  }

  // Test parameters
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams, queryParams: this.testParams };
  }

  // ActivatedRoute.data
  get data() {
    const routeData: Data = {
      'exploitationPlan': {}
    }
    return of(routeData);
  }
}
