import { Injectable } from '@angular/core';
import { hasValue, isEmpty } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../locale/locale.service';
import { MetadataValueFilter } from '../shared/metadata.models';

/**
 * Returns a name for a {@link DSpaceObject} based
 * on its render types.
 */
@Injectable({
  providedIn: 'root'
})
export class DSONameService {

  constructor(private translateService: TranslateService, private locale: LocaleService) {

  }

  /**
   * Functions to generate the specific names.
   *
   * If this list ever expands it will probably be worth it to
   * refactor this using decorators for specific entity types,
   * or perhaps by using a dedicated model for each entity type
   *
   * With only two exceptions those solutions seem overkill for now.
   */
  private readonly factories = {
    Person: (dso: DSpaceObject): string => {
      const familyName = dso.firstMetadataValue('person.familyName');
      const givenName = dso.firstMetadataValue('person.givenName');
      if (isEmpty(familyName) && isEmpty(givenName)) {
        return dso.firstMetadataValue('dc.title') || dso.name;
      } else {
        return `${familyName}, ${givenName}`;
      }
    },
    OrgUnit: (dso: DSpaceObject): string => {
      return dso.firstMetadataValue('organization.legalName') || dso.firstMetadataValue('dc.title');
    },
    Default: (dso: DSpaceObject): string => {
      const filter: MetadataValueFilter = { language: this.locale.getCurrentLanguageCode() };
      // If object doesn't have dc.title metadata use name property
      return dso.firstMetadataValue('dc.title', filter) || dso.name || this.translateService.instant('dso.name.untitled');
    }
  };

  /**
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getName(dso: DSpaceObject): string {
    const match = this.getEntityType(dso, (type: string) => Object.keys(this.factories).includes(type));

    if (hasValue(match)) {
      return this.factories[match](dso);
    } else {
      return  this.factories.Default(dso);
    }
  }

  /**
   * Get the entity type for the given dso {@link DSpaceObject} and applies
   * the target predicate to evaluate for the dso entityType.
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   * @param predicate  The predicate that the entity needs to validate
   */
  getEntityType(dso: DSpaceObject, predicate: (string) => boolean = () => true): string {
    return dso.getRenderTypes().find(type => typeof type === 'string' && predicate(type)) as string;
  }

}
