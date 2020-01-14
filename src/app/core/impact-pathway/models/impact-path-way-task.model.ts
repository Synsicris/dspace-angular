import { uniqueId } from 'lodash';

import { ImpactPathWayTaskItem } from './impact-path-way-task-item.model';
import { isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { ImpactPathWayTaskType } from './impact-path-way-task-type';
import { ExploitationPlanType } from './exploitation-plan-type';

export class ImpactPathWayTask {
  public id: string;

  constructor(
    public type: ImpactPathWayTaskType = null,
    public parentId: string = null,
    public item: ImpactPathWayTaskItem = null,
    public description = '',
    public title = '',
    private _exploitationPlans: ExploitationPlanType[] = []) {

    this.id = uniqueId();
    if (isEmpty(this.description)) {
      this.description = `Description of ${this.type}`;
    }

    if (isEmpty(this.item)) {
      this.item = new ImpactPathWayTaskItem(this.id, this.type, title);
    }
  };

  hasParent() {
    return isNotEmpty(this.parentId);
  }

  get exploitationPlans(): ExploitationPlanType[] {
    return this._exploitationPlans;
  }

  set exploitationPlans(value: ExploitationPlanType[]) {
    this._exploitationPlans.length = 0;
    value
      .forEach((entry) => {
      this._exploitationPlans.push(entry);
    })
  }
}
