import { EditItem } from './../../core/submission/models/edititem.model';
import { EditItemDataService } from './../../core/submission/edititem-data.service';
import { Pipe, PipeTransform } from '@angular/core';
import { hasValue } from './../../shared/empty.util';
import { filter, map, take } from 'rxjs/operators';

@Pipe({
  name: 'dsGetItemMetadataValue'
})
export class GetItemMetadataValuePipe implements PipeTransform {

constructor(private editItemService: EditItemDataService) {
 }

  transform(itemId: string, key:'synsicris.type.status' |'synsicris.type.internal') {
    return this.editItemService.searchEditMetadataByID(itemId).pipe(
      filter((item: EditItem) => hasValue(item.metadata)),
      take(1),
      map((item: EditItem ) => {
       return item.firstMetadataValue(key);
      })
    );
  }
}
