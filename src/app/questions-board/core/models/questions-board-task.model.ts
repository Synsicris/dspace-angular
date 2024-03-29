import { isNotEmpty } from '../../../shared/empty.util';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';

export class QuestionsBoardTask {

  constructor(
    public id?: string,
    public type?: string,
    public parentId?: string,
    public title?: string,
    public compareId?: string,
    public compareStatus?: ComparedVersionItemStatus,
    public description?: string,
    public status?: string,
    public internalStatus?: string) {
  }

  hasParent() {
    return isNotEmpty(this.parentId);
  }
}
