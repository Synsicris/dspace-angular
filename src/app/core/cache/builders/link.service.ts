import { Injectable, Injector } from '@angular/core';
import { hasNoValue, hasValue, isNotEmpty } from '../../../shared/empty.util';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { GenericConstructor } from '../../shared/generic-constructor';
import { HALResource } from '../../shared/hal-resource.model';
import {
  getDataServiceFor,
  getLinkDefinition,
  getLinkDefinitions,
  LinkDefinition
} from './build-decorators';
import { RemoteData } from '../../data/remote-data';
import { Observable } from 'rxjs/internal/Observable';
import { EMPTY } from 'rxjs';

/**
 * A Service to handle the resolving and removing
 * of resolved {@link HALLink}s on HALResources
 */
@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(
    protected parentInjector: Injector,
  ) {
  }

  /**
   * Resolve the given {@link FollowLinkConfig}s for the given model
   *
   * @param model the {@link HALResource} to resolve the links for
   * @param linksToFollow the {@link FollowLinkConfig}s to resolve
   */
  public resolveLinks<T extends HALResource>(model: T, ...linksToFollow: FollowLinkConfig<T>[]): T {
    linksToFollow.forEach((linkToFollow: FollowLinkConfig<T>) => {
        this.resolveLink(model, linkToFollow);
    });
    return model;
  }

  /**
   * Resolve the given {@link FollowLinkConfig} for the given model and return the result. This does
   * not attach the link result to the property on the model. Useful when you're working with a
   * readonly object
   *
   * @param model the {@link HALResource} to resolve the link for
   * @param linkToFollow the {@link FollowLinkConfig} to resolve
   */
  public resolveLinkWithoutAttaching<T extends HALResource, U extends HALResource>(model, linkToFollow: FollowLinkConfig<T>): Observable<RemoteData<U>> {
    if (typeof linkToFollow !== 'object') {
      return model;
    }

    const matchingLinkDef = getLinkDefinition(model.constructor, linkToFollow.name);

    if (hasNoValue(matchingLinkDef)) {
      throw new Error(`followLink('${linkToFollow.name}') was used for a ${model.constructor.name}, but there is no property on ${model.constructor.name} models with an @link() for ${linkToFollow.name}`);
    } else {
      const provider = getDataServiceFor(matchingLinkDef.resourceType);

      if (hasNoValue(provider)) {
        throw new Error(`The @link() for ${linkToFollow.name} on ${model.constructor.name} models uses the resource type ${matchingLinkDef.resourceType.value.toUpperCase()}, but there is no service with an @dataService(${matchingLinkDef.resourceType.value.toUpperCase()}) annotation in order to retrieve it`);
      }

      const service = Injector.create({
        providers: [],
        parent: this.parentInjector
      }).get(provider);

      const link = model._links[matchingLinkDef.linkName];
      if (hasValue(link)) {
        const href = link.href;

        try {
          if (matchingLinkDef.isList) {
            return service.findAllByHref(href, linkToFollow.findListOptions, linkToFollow.useCachedVersionIfAvailable, linkToFollow.reRequestOnStale, ...linkToFollow.linksToFollow);
          } else {
            return service.findByHref(href, linkToFollow.useCachedVersionIfAvailable, linkToFollow.reRequestOnStale, ...linkToFollow.linksToFollow);
          }
        } catch (e) {
          console.error(`Something went wrong when using @dataService(${matchingLinkDef.resourceType.value}) ${hasValue(service) ? '' : '(undefined) '}to resolve link ${linkToFollow.name} at ${href}`);
          throw e;
        }
      }
    }
    return EMPTY;
  }

  /**
   * Resolve the given {@link FollowLinkConfig} for the given model and return the model with the
   * link property attached.
   *
   * @param model the {@link HALResource} to resolve the link for
   * @param linkToFollow the {@link FollowLinkConfig} to resolve
   */
  public resolveLink<T extends HALResource>(model, linkToFollow: FollowLinkConfig<T>): T {
    model[linkToFollow.name] = this.resolveLinkWithoutAttaching(model, linkToFollow);
    return model;
  }

  /**
   * Remove any resolved links that the model may have.
   *
   * @param model the {@link HALResource} to remove the links from
   * @returns a copy of the given model, without resolved links.
   */
  public removeResolvedLinks<T extends HALResource>(model: T): T {
    const result = Object.assign(new (model.constructor as GenericConstructor<T>)(), model);
    const linkDefs = getLinkDefinitions(model.constructor as GenericConstructor<T>);
    if (isNotEmpty(linkDefs)) {
      linkDefs.forEach((linkDef: LinkDefinition<T>) => {
        result[linkDef.propertyName] = undefined;
      });
    }
    return result;
  }

}
