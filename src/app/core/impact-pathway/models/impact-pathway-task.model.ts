import { isNotEmpty } from '../../../shared/empty.util';

export class ImpactPathwayTask {

  constructor(
    public id?: string,
    public type?: string,
    public parentId?: string,
    public title?: string,
    public description?: string) {
  };

  hasParent() {
    return isNotEmpty(this.parentId);
  }

}
