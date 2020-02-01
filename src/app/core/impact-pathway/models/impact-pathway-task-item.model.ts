import { uniqueId } from 'lodash';
import { ExploitationPlanType } from './exploitation-plan-type';
import { isEmpty } from '../../../shared/empty.util';

export class ImpactPathwayTaskItem {

  private _id: string;

  constructor(
    private _taskId: string,
    private _type: string,
    private _title = '',
    private _note = '') {

    this._id = uniqueId(this._taskId);
    if (isEmpty(this._title)) {
      this._title = `${this._type} ${this._id}`;
    }
/*    if (isEmpty(this.exploitationPlans)) {
      const count: number = Math.floor(Math.random() * 4);
      for (let i = 0; i <= count; i++) {
        this.exploitationPlans.push(this.generateRandomExploitationPlanType(i))
      }
    }*/
  };

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get taskId(): string {
    return this._taskId;
  }

  set taskId(value: string) {
    this._taskId = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get note(): string {
    return this._note;
  }

  set note(value: string) {
    this._note = value;
  }

  private generateRandomExploitationPlanType(index: number): ExploitationPlanType {
    let type: ExploitationPlanType;

    switch (index) {
      case 0:
        type = ExploitationPlanType.Question1;
        break;
      case 1:
        type = ExploitationPlanType.Question2;
        break;
      case 2:
        type = ExploitationPlanType.Question3;
        break;
      case 3:
        type = ExploitationPlanType.Question4;
        break;
    }

    return type;
  }
}
