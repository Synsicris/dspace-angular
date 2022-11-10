import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { GetRequest, PostRequest } from './request.models';
import { Observable } from 'rxjs';
import { filter, find, map, skipWhile } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { Registration } from '../shared/registration.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData } from '../shared/operators';
import { ResponseParsingService } from './parsing.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { RegistrationResponseParsingService } from './registration-response-parsing.service';
import { RemoteData } from './remote-data';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

@Injectable(
  {
    providedIn: 'root',
  }
)
/**
 * Service that will register a new email address and request a token
 */
export class EpersonRegistrationService {

  protected linkPath = 'registrations';
  protected searchByTokenPath = '/search/findByToken?token=';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService,
  ) {

  }

  /**
   * Retrieves the Registration endpoint
   */
  getRegistrationEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Retrieves the endpoint to search by registration token
   */
  getTokenSearchEndpoint(token: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}${this.searchByTokenPath}${token}`));
  }

  /**
   * Register a new email address
   * @param email
   */
  registerEmail(email: string): Observable<RemoteData<Registration>> {
    const registration = new Registration();
    registration.email = email;

    return this.fetchRegister(registration);
  }

  /**
   * Send an invitation to register and join these groups
   * @param email
   * @param groups The group(s) to join
   */
  sendInvitation(email: string, groups: string[]): Observable<RemoteData<Registration>> {
    const registration = new Registration();
    registration.email = email;
    registration.groups = groups;

    return this.fetchRegister(registration);
  }

  private fetchRegister(registration: Registration) {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getRegistrationEndpoint();

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, registration);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID<Registration>(requestId).pipe(
      getFirstCompletedRemoteData()
    );
  }

  /**
   * Search a registration based on the provided token
   * @param token
   */
  searchByToken(token: string): Observable<Registration> {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getTokenSearchEndpoint(token).pipe(
      find((href: string) => hasValue(href)),
    );

    href$.subscribe((href: string) => {
      const request = new GetRequest(requestId, href);
      Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return RegistrationResponseParsingService;
        }
      });
      this.requestService.send(request, true);
    });

    return this.rdbService.buildSingle<Registration>(href$).pipe(
      skipWhile((rd: RemoteData<Registration>) => rd.isStale),
      getFirstSucceededRemoteData(),
      map((restResponse: RemoteData<Registration>) => {
        return Object.assign(new Registration(), {
          email: restResponse.payload.email, token: token, user: restResponse.payload.user,
          groupNames: restResponse.payload.groupNames ? restResponse.payload.groupNames : [],
          groups: restResponse.payload.groups ? restResponse.payload.groups : [],
          dspaceObjectNames: restResponse.payload.dspaceObjectNames ? restResponse.payload.dspaceObjectNames : []

        });
      }),
    );

  }
  searchByTokenAndHandleError(token: string): Observable<RemoteData<Registration>> {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getTokenSearchEndpoint(token).pipe(
      find((href: string) => hasValue(href)),
    );

    href$.subscribe((href: string) => {
      const request = new GetRequest(requestId, href);
      Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return RegistrationResponseParsingService;
        }
      });
      this.requestService.send(request, true);
    });
    return this.rdbService.buildSingle<Registration>(href$);
  }
}
