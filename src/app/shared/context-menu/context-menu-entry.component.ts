import { Component, Inject } from '@angular/core';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { ContextMenuEntryType } from './context-menu-entry-type';

/**
 * This component renders a context menu option that provides the links to edit item page.
 */
@Component({
  template: ''
})
export abstract class ContextMenuEntryComponent {

  /**
   * The menu entry type
   */
  public menuEntryType: ContextMenuEntryType;

  /**
   * The related dso
   */
  contextMenuObject: DSpaceObject;

  /**
   * The related dso type
   */
  contextMenuObjectType: DSpaceObjectType;

  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    _menuEntryType: ContextMenuEntryType
  ) {
    this.contextMenuObject = injectedContextMenuObject;
    this.contextMenuObjectType = injectedContextMenuObjectType;
    this.menuEntryType = _menuEntryType;
  }

}