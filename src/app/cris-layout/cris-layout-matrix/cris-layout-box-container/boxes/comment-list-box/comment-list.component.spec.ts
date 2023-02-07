import { Item } from './../../../../../core/shared/item.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentListComponent } from './comment-list.component';

describe('CommentListComponent', () => {
  let component: CommentListComponent;
  let fixture: ComponentFixture<CommentListComponent>;
  let stepType: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentListComponent);
    component = fixture.componentInstance;
    component.itemUuid = impactPathWayItemMock.uuid;
    component.item = Object.assign(new Item(), impactPathWayItemMock);
    component.type = 'impact_pathway_form';
    component.projectCommunityId = '29bbbb28-6187-4f1e-9509-5b3a5688d48a';
    stepType = 'step_type_1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get configuration name ', () => {
    expect(component.getConfiguration).toEqual('RELATION.impactpathwaystep.comment');
  });

  it('should render card header title Comments when Input Title has no value', () => {
    const value = fixture.debugElement.nativeElement.querySelector('.card-header > span');
    expect(value.innerText).toEqual('comment-list.header');
  });

  it('should render card header title when Input Title has value', () => {
    component.title = `impact-pathway.step.label.${stepType}`;
    const value = fixture.debugElement.nativeElement.querySelector('.card-header > span');
    expect(value.innerText).toEqual('impact-pathway.step.label.step_type_1');
  });

  it('should not show card header when showCardHeader is set to false', () => {
    component.showCardHeader = false;
    const value = fixture.debugElement.nativeElement.querySelector('.card-header');
    expect(value).not.toBeDefined();
  });
});



const impactPathWayItemMock = {
  handle: '123456789/930',
  lastModified: '2023-01-17T16:10:32.848Z',
  isArchived: true,
  isDiscoverable: true,
  isWithdrawn: false,
  entityType: 'impactpathway',
  _links: {
    bundles: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5/bundles',
    },
    mappedCollections: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5/mappedCollections',
    },
    owningCollection: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5/owningCollection',
    },
    relationships: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5/relationships',
    },
    version: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5/version',
    },
    templateItemOf: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5/templateItemOf',
    },
    metrics: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5/metrics',
    },
    thumbnail: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5/thumbnail',
    },
    self: {
      href: 'http://localhost:8080/server/api/core/items/ee8662e6-1fed-46b3-9f94-f26bbfbff8f5',
    },
  },
  _name: 'ipw one',
  id: 'ee8662e6-1fed-46b3-9f94-f26bbfbff8f5',
  uuid: 'ee8662e6-1fed-46b3-9f94-f26bbfbff8f5',
  type: 'item',
  metadata: {
    'cris.policy.group': [
      {
        uuid: '5bb2a4f9-0f03-43ad-bb0d-4534a66a5d42',
        language: null,
        value: 'project_29bbbb28-6187-4f1e-9509-5b3a5688d48a_members_group',
        place: 0,
        authority: '4c1ad3d1-8207-4b52-a5b6-e89bc9526ff9',
        confidence: 600,
      },
    ],
    'cris.project.shared': [
      {
        uuid: 'a3b16e32-a3f9-4648-b4f1-92d1c0eb3f5f',
        language: null,
        value: 'project',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'dc.date.accessioned': [
      {
        uuid: '8882259a-21bd-48f5-8064-fa9660a35dc3',
        language: null,
        value: '2022-12-13T11:36:14Z',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'dc.date.available': [
      {
        uuid: 'd8e1b00e-60ed-4520-a085-786349c411eb',
        language: null,
        value: '2022-12-13T11:36:14Z',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'dc.description': [
      {
        uuid: 'a4a39af6-6372-45b1-95a3-a4db0c78682b',
        language: null,
        value: '',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'dc.description.provenance': [
      {
        uuid: 'd7d4b787-c443-4d57-b64e-c5b5e714c7ce',
        language: 'en',
        value:
          'Submitted by user2 funding_a (user2_funding_a@synsicris.de) on 2022-12-13T11:36:14Z workflow start=Step: checkcorrectionstep - action:noUserSelectionAction\nNo. of bitstreams: 0',
        place: 0,
        authority: null,
        confidence: -1,
      },
      {
        uuid: '94c0a8f8-3ed0-4759-8a00-a617a34c3e08',
        language: 'en',
        value:
          'Made available in DSpace on 2022-12-13T11:36:14Z (GMT). No. of bitstreams: 0',
        place: 1,
        authority: null,
        confidence: -1,
      },
    ],
    'dc.identifier.uri': [
      {
        uuid: 'a905a367-0951-4550-91a6-92d369115ab3',
        language: null,
        value: 'http://localhost:4000/handle/123456789/930',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'dc.title': [
      {
        uuid: 'e13767ed-8f5f-451a-953a-5142a86301af',
        language: null,
        value: 'ipw one',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'dspace.entity.type': [
      {
        uuid: '9c346185-b7d0-496b-a330-ba4b615a1668',
        language: null,
        value: 'impactpathway',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'impactpathway.relation.step': [
      {
        uuid: '63fb7535-4b05-4ac9-8078-9ba7789cf3f2',
        language: null,
        value: 'step_type_1',
        place: 0,
        authority: 'e428334e-17f7-4d01-9c41-d7f4c04f98da',
        confidence: 600,
      },
      {
        uuid: '15e19b2e-ff22-4399-b3b8-318b2d236cdb',
        language: null,
        value: 'step_type_2',
        place: 1,
        authority: '69aff7cc-0fe6-4941-82df-69abb7b32fd0',
        confidence: 600,
      },
      {
        uuid: '12f0a82f-2e14-4a56-bc15-b14d9087bb61',
        language: null,
        value: 'step_type_3',
        place: 2,
        authority: 'a3ade691-be58-4ae0-8d87-51475ebb0a97',
        confidence: 600,
      },
      {
        uuid: 'a1243592-e805-433a-80b2-f80c60c6f483',
        language: null,
        value: 'step_type_4',
        place: 3,
        authority: '49705135-f0e4-4663-a345-e194ee45883c',
        confidence: 600,
      },
      {
        uuid: '999f121f-eb62-450d-9ae2-bdeb9ac7279c',
        language: null,
        value: 'step_type_5',
        place: 4,
        authority: 'cfa0ccf1-8775-4ca4-b16f-e83afbf4ad92',
        confidence: 600,
      },
      {
        uuid: '622c44ab-a98d-4b5d-bd96-92b5242be8cd',
        language: null,
        value: 'step_type_6',
        place: 5,
        authority: '5f653305-534d-407c-bce1-4a151c5cdf89',
        confidence: 600,
      },
    ],
    'synsicris.relation.project': [
      {
        uuid: 'a4c823bf-7caa-4485-be07-f9677135b169',
        language: null,
        value: 'project A',
        place: 0,
        authority: '155172ac-052b-4752-b089-187dc6d252fd',
        confidence: 600,
      },
    ],
  },
};
