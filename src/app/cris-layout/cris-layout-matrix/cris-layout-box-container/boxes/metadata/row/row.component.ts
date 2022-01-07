import { Component, Input } from '@angular/core';
import { Item } from '../../../../../../core/shared/item.model';
import {
  CrisLayoutBox,
  LayoutField,
  MetadataBoxCell,
  MetadataBoxRow
} from '../../../../../../core/layout/models/box.model';
import { isEmpty, isNotEmpty } from '../../../../../../shared/empty.util';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: '[ds-row]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class RowComponent {

  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * Current layout box
   */
  @Input() box: CrisLayoutBox;
  /**
   * Current row configuration
   */
  @Input() row: MetadataBoxRow;

  /**
   * Return the cell style
   * @param cell
   */
  getCellStyle(cell: MetadataBoxCell) {
    return (isNotEmpty(cell.style) && cell.style.includes('col'))
      ? cell.style : `col ${cell.style}`;
  }

  trackUpdate(index, field: LayoutField) {
    return field && field.metadata;
  }

  trackCellUpdate(index, cell: MetadataBoxCell) {
    return cell && cell.fields;
  }

}
