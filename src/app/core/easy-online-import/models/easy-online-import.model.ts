import { autoserialize, deserialize } from 'cerialize';

import { EASY_ONLINE_IMPORT } from './easy-online-import.resource-type';
import { typedObject } from '../../cache/builders/build-decorators';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { CacheableObject } from '../../cache/object-cache.reducer';

/**
 * Model class for a VocabularyEntry
 */
@typedObject
export class EasyOnlineImport extends CacheableObject {
  static type = EASY_ONLINE_IMPORT;

  /**
   * The identifier of this vocabulary entry
   */
  @autoserialize
  id: string;

  /**
   * The display value of this vocabulary entry
   */
  @autoserialize
  created: string[];

  /**
   * The value of this vocabulary entry
   */
  @autoserialize
  modified: string[];

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The {@link HALLink}s for this ExternalSourceEntry
   */
  @deserialize
  _links: {
    self: HALLink;
  };

}
