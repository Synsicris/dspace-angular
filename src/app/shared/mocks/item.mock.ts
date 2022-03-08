import { of as observableOf } from 'rxjs';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { Bitstream } from '../../core/shared/bitstream.model';

import { Item } from '../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { createPaginatedList } from '../testing/utils.test';
import { Bundle } from '../../core/shared/bundle.model';

export const MockBitstreamFormat1: BitstreamFormat = Object.assign(new BitstreamFormat(), {
  shortDescription: 'Microsoft Word XML',
  description: 'Microsoft Word XML',
  mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  supportLevel: 0,
  internal: false,
  extensions: null,
  _links: {
    self: {
      href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/10'
    }
  }
});

export const MockBitstreamFormat2: BitstreamFormat = Object.assign(new BitstreamFormat(), {
  shortDescription: 'Adobe PDF',
  description: 'Adobe Portable Document Format',
  mimetype: 'application/pdf',
  supportLevel: 0,
  internal: false,
  extensions: null,
  _links: {
    self: {
      href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/4'
    }
  }
});

export const MockBitstreamFormat3: BitstreamFormat = Object.assign(new BitstreamFormat(), {
  shortDescription: 'Binary',
  description: 'Some scary unknown binary file',
  mimetype: 'application/octet-stream',
  supportLevel: 0,
  internal: false,
  extensions: null,
  _links: {
    self: {
      href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/17'
    }
  }
});

export const MockBitstream1: Bitstream = Object.assign(new Bitstream(),
  {
    sizeBytes: 10201,
    content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
    format: createSuccessfulRemoteDataObject$(MockBitstreamFormat1),
    bundleName: 'ORIGINAL',
    _links: {
      self: {
        href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713'
      }
    },
    id: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
    uuid: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
    type: 'bitstream',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test_word.docx'
        }
      ]
    }
  });

export const MockBitstream2: Bitstream = Object.assign(new Bitstream(), {
  sizeBytes: 31302,
  content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/99b00f3c-1cc6-4689-8158-91965bee6b28/content',
  format: createSuccessfulRemoteDataObject$(MockBitstreamFormat2),
  bundleName: 'ORIGINAL',
  id: '99b00f3c-1cc6-4689-8158-91965bee6b28',
  uuid: '99b00f3c-1cc6-4689-8158-91965bee6b28',
  type: 'bitstream',
  _links: {
    self: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/99b00f3c-1cc6-4689-8158-91965bee6b28' },
    content: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/99b00f3c-1cc6-4689-8158-91965bee6b28/content' },
    format: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/4' },
    bundle: { href: '' }
  },
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'test_pdf.pdf'
      }
    ]
  }
});

export const MockBitstream3: Bitstream = Object.assign(new Bitstream(), {
  sizeBytes: 4975123,
  content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/4db100c1-e1f5-4055-9404-9bc3e2d15f29/content',
  format: createSuccessfulRemoteDataObject$(MockBitstreamFormat3),
  bundleName: 'ORIGINAL',
  id: '4db100c1-e1f5-4055-9404-9bc3e2d15f29',
  uuid: '4db100c1-e1f5-4055-9404-9bc3e2d15f29',
  type: 'bitstream',
  _links: {
    self: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/4db100c1-e1f5-4055-9404-9bc3e2d15f29' },
    content: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/4db100c1-e1f5-4055-9404-9bc3e2d15f29/content' },
    format: { href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/17' },
    bundle: { href: '' }
  },
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'scary'
      }
    ]
  }
});

export const MockOriginalBundle: Bundle = Object.assign(new Bundle(), {
  name: 'ORIGINAL',
  primaryBitstream: createSuccessfulRemoteDataObject$(MockBitstream2),
  bitstreams: observableOf(Object.assign({
    _links: {
      self: {
        href: 'dspace-angular://aggregated/object/1507836003548',
      }
    },
    requestPending: false,
    responsePending: false,
    isSuccessful: true,
    errorMessage: '',
    state: '',
    error: undefined,
    isRequestPending: false,
    isResponsePending: false,
    isLoading: false,
    hasFailed: false,
    hasSucceeded: true,
    statusCode: '202',
    pageInfo: {},
    payload: {
      pageInfo: {
        elementsPerPage: 20,
        totalElements: 3,
        totalPages: 1,
        currentPage: 2
      },
      page: [
        MockBitstream1,
        MockBitstream2
      ]
    }
  }))
});


/* tslint:disable:no-shadowed-variable */
export const ItemMock: Item = Object.assign(new Item(), {
  handle: '10673/6',
  lastModified: '2017-04-24T19:44:08.178+0000',
  isArchived: true,
  isDiscoverable: true,
  isWithdrawn: false,
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([
    MockOriginalBundle,
  ])),
  _links: {
    self: {
      href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357'
    }
  },
  id: '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  uuid: '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  type: 'item',
  metadata: {
    'dc.creator': [
      {
        language: 'en_US',
        value: 'Doe, Jane'
      }
    ],
    'dc.date.accessioned': [
      {
        language: null,
        value: '1650-06-26T19:58:25Z'
      }
    ],
    'dc.date.available': [
      {
        language: null,
        value: '1650-06-26T19:58:25Z'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '1650-06-26'
      }
    ],
    'dc.identifier.issn': [
      {
        language: 'en_US',
        value: '123456789'
      }
    ],
    'dc.identifier.uri': [
      {
        language: null,
        value: 'http://dspace7.4science.it/xmlui/handle/10673/6'
      }
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!'
      }
    ],
    'dc.description.provenance': [
      {
        language: 'en',
        value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)'
      },
      {
        language: 'en',
        value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).'
      },
      {
        language: 'en',
        value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).'
      },
      {
        language: 'en',
        value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).'
      }
    ],
    'dc.language': [
      {
        language: 'en_US',
        value: 'en'
      }
    ],
    'dc.rights': [
      {
        language: 'en_US',
        value: '© Jane Doe'
      }
    ],
    'dc.subject': [
      {
        language: 'en_US',
        value: 'keyword1'
      },
      {
        language: 'en_US',
        value: 'keyword2'
      },
      {
        language: 'en_US',
        value: 'keyword3'
      }
    ],
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test PowerPoint Document'
      }
    ],
    'dc.type': [
      {
        language: 'en_US',
        value: 'text'
      }
    ]
  },
  owningCollection: observableOf({
    _links: {
      self: {
        href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb'
      }
    },
    requestPending: false,
    responsePending: false,
    isSuccessful: true,
    errorMessage: '',
    statusCode: '202',
    pageInfo: {},
    payload: []
  }
  )
});
/* tslint:enable:no-shadowed-variable */

export const compareItems: [Item, Item] = [
  Object.assign(new Item(), {
    'handle': '123456789/575',
    'lastModified': '2022-03-02T19:03:31.390Z',
    'isArchived': true,
    'isDiscoverable': true,
    'isWithdrawn': false,
    'entityType': 'Publication',
    '_links': {
      'bundles': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac/bundles'
      },
      'mappedCollections': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac/mappedCollections'
      },
      'owningCollection': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac/owningCollection'
      },
      'relationships': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac/relationships'
      },
      'version': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac/version'
      },
      'templateItemOf': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac/templateItemOf'
      },
      'metrics': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac/metrics'
      },
      'thumbnail': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac/thumbnail'
      },
      'self': {
        'href': 'http://localhost:8080/server/api/core/items/df582766-5cdb-4b28-8efc-7001a8f70dac'
      }
    },
    '_name': 'Conference base item',
    'id': 'df582766-5cdb-4b28-8efc-7001a8f70dac',
    'uuid': 'df582766-5cdb-4b28-8efc-7001a8f70dac',
    'type': 'item',
    'metadata': {
      'cris.policy.group': [
        {
          'uuid': '5bd9e167-cacb-4b8d-a6d9-5b7b04fd43fc',
          'language': null,
          'value': 'project_d31debcb-b0ab-4127-a9bf-152c664e9800_members_group',
          'place': 0,
          'authority': '6c9df2b7-e9a9-4089-8bda-50dad9fc916c',
          'confidence': 600
        }
      ],
      'cris.project.shared': [
        {
          'uuid': '962547f2-b25c-41a0-8c3b-fe9fc8f2fed1',
          'language': null,
          'value': 'parentproject',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.contributor.author': [
        {
          'uuid': 'e9556c1e-e062-4a77-aac7-538b2e4a35c5',
          'language': null,
          'value': 'rezart',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        },
        {
          'uuid': '5358df3d-1a1b-4644-86ff-b6b0b42e8d7f',
          'language': null,
          'value': 'vata',
          'place': 1,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        },
        {
          'uuid': 'b72bfd07-6551-48c5-9c95-6243f149177b',
          'language': null,
          'value': 'ttttttt',
          'place': 2,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'dc.date.accessioned': [
        {
          'uuid': '8214621f-7862-4321-9b7c-9ff25ecf96f1',
          'language': null,
          'value': '2022-03-02T19:03:31Z',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.date.available': [
        {
          'uuid': '529256a9-c7d6-4aa5-ab2b-bd5350502baa',
          'language': null,
          'value': '2022-03-02T19:03:31Z',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.date.issued': [
        {
          'uuid': '5f93c96b-962a-45c5-88e4-8a97d724ea30',
          'language': null,
          'value': '1999-11-21',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.description.provenance': [
        {
          'uuid': '8c128a68-046b-49ef-a3e6-f33b69a2c5e8',
          'language': 'en',
          'value': 'Submitted by Shared Admin (shared@synsicris.de) on 2022-03-02T19:03:31Z workflow start=Step: checkcorrectionstep - action:noUserSelectionAction\nNo. of bitstreams: 1\n4science-user.txt: 337 bytes, checksum: a5da62c0534ad7494dfa32fee4958c1e (MD5)',
          'place': 0,
          'authority': null,
          'confidence': -1
        },
        {
          'uuid': '9ce2b417-e2fd-40ec-9f34-de005a3dd0a6',
          'language': 'en',
          'value': 'Made available in DSpace on 2022-03-02T19:03:31Z (GMT). No. of bitstreams: 1\n4science-user.txt: 337 bytes, checksum: a5da62c0534ad7494dfa32fee4958c1e (MD5)\n  Previous issue date: 1999-11-21',
          'place': 1,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.identifier.doi': [
        {
          'uuid': '543fad48-d8c4-495d-929b-4946fcaa3b9b',
          'language': null,
          'value': '123123',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.identifier.uri': [
        {
          'uuid': '4d8e833b-6349-4fc9-bc4d-14eac3adfbb6',
          'language': null,
          'value': 'http://localhost:4000/handle/123456789/575',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.title': [
        {
          'uuid': '51575712-95cd-4972-ae79-a49f00e512f3',
          'language': null,
          'value': 'Conference base item',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'dc.type': [
        {
          'uuid': 'aaa2523f-fa1a-4f6b-875d-bbcca6bde45c',
          'language': null,
          'value': 'conference paper',
          'place': 0,
          'authority': 'coar:c_5794',
          'confidence': 600,
          'securityLevel': 0
        }
      ],
      'dspace.entity.type': [
        {
          'uuid': '5ee73121-af5d-4f8b-928d-37750ef4a079',
          'language': null,
          'value': 'Publication',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'oairecerif.author.affiliation': [
        {
          'uuid': '279d98ae-fb50-41a4-a007-9cf54b9ebf5f',
          'language': null,
          'value': '4science',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        },
        {
          'uuid': '2654605e-39a6-4d66-8c41-b262a5870a5b',
          'language': null,
          'value': 'orgunit test 02',
          'place': 1,
          'authority': '95f6c8fc-a5e4-413d-9378-df7fd74808fc',
          'confidence': 600
        },
        {
          'uuid': '48c91f13-01c5-45f8-b75d-2cac3fdabebf',
          'language': null,
          'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
          'place': 2,
          'authority': null,
          'confidence': -1
        }
      ],
      'synsicris.relation.parentproject': [
        {
          'uuid': 'dd92cc09-8c75-474a-b4f1-84a0182263ba',
          'language': null,
          'value': 'project A',
          'place': 0,
          'authority': 'cb89207f-f696-4a75-8dbb-5f0abe99419c',
          'confidence': 600
        }
      ]
    }
  }),
  Object.assign(new Item(), {
    'handle': '123456789/576',
    'lastModified': '2022-03-02T19:08:58.468Z',
    'isArchived': true,
    'isDiscoverable': true,
    'isWithdrawn': false,
    'entityType': 'Publication',
    '_links': {
      'bundles': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847/bundles'
      },
      'mappedCollections': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847/mappedCollections'
      },
      'owningCollection': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847/owningCollection'
      },
      'relationships': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847/relationships'
      },
      'version': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847/version'
      },
      'templateItemOf': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847/templateItemOf'
      },
      'metrics': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847/metrics'
      },
      'thumbnail': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847/thumbnail'
      },
      'self': {
        'href': 'http://localhost:8080/server/api/core/items/a94167e3-e462-4cd5-8538-b80a75a38847'
      }
    },
    '_name': 'Conference base item',
    'id': 'a94167e3-e462-4cd5-8538-b80a75a38847',
    'uuid': 'a94167e3-e462-4cd5-8538-b80a75a38847',
    'type': 'item',
    'metadata': {
      'cris.policy.group': [
        {
          'uuid': 'db1dfaef-1165-4a40-b1c9-81dd2085e542',
          'language': null,
          'value': 'project_d31debcb-b0ab-4127-a9bf-152c664e9800_members_group',
          'place': 0,
          'authority': '6c9df2b7-e9a9-4089-8bda-50dad9fc916c',
          'confidence': 600
        }
      ],
      'cris.project.shared': [
        {
          'uuid': '5fe116ed-3ab3-4f1c-a1ea-fc0d3cca8932',
          'language': null,
          'value': 'parentproject',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.audience': [
        {
          'uuid': '4a8e1628-f878-4c72-bcbd-b097641b0c38',
          'language': null,
          'value': 'Science',
          'place': 0,
          'authority': null,
          'confidence': -1
        },
        {
          'uuid': '1c9dbe7a-90cb-4e56-9079-d0d8eff0b152',
          'language': null,
          'value': 'Practice',
          'place': 1,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.contributor.author': [
        {
          'uuid': 'e3820aac-8c95-402a-8c43-c1f1b1f8a3b2',
          'language': null,
          'value': 'vass',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        },
        {
          'uuid': '6a56c480-b06f-4379-a151-27e7e0f1acf0',
          'language': null,
          'value': 'rezart',
          'place': 1,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        },
        {
          'uuid': 'c9f28ea5-c7ce-4487-b742-300fc93aad9f',
          'language': null,
          'value': 'vata',
          'place': 2,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'dc.date.accessioned': [
        {
          'uuid': '21b385f8-a64b-450c-a5c0-7d5aaa07302d',
          'language': null,
          'value': '2022-03-02T19:08:58Z',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.date.available': [
        {
          'uuid': 'f337a32c-692d-4575-ba06-758c27495647',
          'language': null,
          'value': '2022-03-02T19:08:58Z',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.description.abstract': [
        {
          'uuid': '6c5f8b91-bfe2-4925-a856-acc8ddb926e8',
          'language': null,
          'value': 'testst 12312',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'dc.description.provenance': [
        {
          'uuid': 'f64cca00-0898-40d0-8ddc-545a534d19ec',
          'language': 'en',
          'value': 'Submitted by Shared Admin (shared@synsicris.de) on 2022-03-02T19:08:58Z workflow start=Step: checkcorrectionstep - action:noUserSelectionAction\nNo. of bitstreams: 1\n4science-user.txt: 337 bytes, checksum: a5da62c0534ad7494dfa32fee4958c1e (MD5)',
          'place': 0,
          'authority': null,
          'confidence': -1
        },
        {
          'uuid': '7076f874-1952-4397-83f8-940a9974f813',
          'language': 'en',
          'value': 'Made available in DSpace on 2022-03-02T19:08:58Z (GMT). No. of bitstreams: 1\n4science-user.txt: 337 bytes, checksum: a5da62c0534ad7494dfa32fee4958c1e (MD5)',
          'place': 1,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.identifier.doi': [
        {
          'uuid': '41833e74-6419-4460-8307-99ea04bbd056',
          'language': null,
          'value': '3123123',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.identifier.uri': [
        {
          'uuid': '015189c0-b9b5-4eb2-aa36-d61eefb519e1',
          'language': null,
          'value': 'http://localhost:4000/handle/123456789/576',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'dc.language.iso': [
        {
          'uuid': 'a4b5d661-d293-40fb-b841-9f45d434785f',
          'language': null,
          'value': 'en',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'dc.relation.ispartof': [
        {
          'uuid': '30604fde-4ed6-4778-b36f-ac05ccb2abb2',
          'language': null,
          'value': 'asdfasdfasdf',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'dc.title': [
        {
          'uuid': '9e1c54a4-79e0-4c54-afd0-142efdc94897',
          'language': null,
          'value': 'Conference base item',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'dc.type': [
        {
          'uuid': '08afdb1c-47f1-4641-8761-a8dbd75cd790',
          'language': null,
          'value': 'still image',
          'place': 0,
          'authority': 'coar:c_ecc8',
          'confidence': 600,
          'securityLevel': 0
        }
      ],
      'dspace.entity.type': [
        {
          'uuid': '958349e3-5728-4421-849a-ab95411bb5ba',
          'language': null,
          'value': 'Publication',
          'place': 0,
          'authority': null,
          'confidence': -1
        }
      ],
      'oaire.citation.endPage': [
        {
          'uuid': '73555e2a-b25c-4efa-8770-ba2273efe86a',
          'language': null,
          'value': '111',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'oaire.citation.issue': [
        {
          'uuid': '68834a0e-acf3-46f2-9e65-127514e0e0b0',
          'language': null,
          'value': '123',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'oaire.citation.startPage': [
        {
          'uuid': '8e69182e-4947-4a95-96f8-c0c47a8f7bf2',
          'language': null,
          'value': '1',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'oaire.citation.volume': [
        {
          'uuid': '987a53be-5d79-49e0-862e-03800c51fecd',
          'language': null,
          'value': '12',
          'place': 0,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        }
      ],
      'oairecerif.author.affiliation': [
        {
          'uuid': '7dc7fcda-6df1-499b-93e8-602d1b6a84e5',
          'language': null,
          'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
          'place': 0,
          'authority': null,
          'confidence': -1
        },
        {
          'uuid': '22e6a799-be2d-4b74-8e07-1f338e1cf48b',
          'language': null,
          'value': '4science',
          'place': 1,
          'authority': null,
          'confidence': -1,
          'securityLevel': 0
        },
        {
          'uuid': 'c0ee56ec-0808-47bb-b7cc-fd92e25487a0',
          'language': null,
          'value': 'orgunit test 01',
          'place': 2,
          'authority': '504af595-6df4-47a7-9f6f-ee59844e774a',
          'confidence': 600
        }
      ],
      'synsicris.relation.parentproject': [
        {
          'uuid': '8cec11ad-e227-4b03-b4b7-f5ef6d953d16',
          'language': null,
          'value': 'project A',
          'place': 0,
          'authority': 'cb89207f-f696-4a75-8dbb-5f0abe99419c',
          'confidence': 600
        }
      ]
    }
  })
];

