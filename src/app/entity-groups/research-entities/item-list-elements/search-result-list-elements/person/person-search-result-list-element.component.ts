import { Component } from '@angular/core';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { Item } from '../../../../../core/shared/item.model';
import { isNotEmpty } from '../../../../../shared/empty.util';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-person-search-result-list-element',
  styleUrls: ['./person-search-result-list-element.component.scss'],
  templateUrl: './person-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Person
 */
export class PersonSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {

  getPersonName(): string {
    let personName = this.dso.name;
    if (isNotEmpty(this.firstMetadataValue('person.familyName')) && isNotEmpty(this.firstMetadataValue('person.givenName'))) {
      personName = this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName');
    }

    return personName;
  }
}
