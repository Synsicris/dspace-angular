import { ResourceType } from 'src/app/core/shared/resource-type';
import { SubmissionObject } from 'src/app/core/submission/models/submission-object.model';
import { WorkspaceitemSectionsObject } from 'src/app/core/submission/models/workspaceitem-sections.model';
import { SubmissionScopeType } from 'src/app/core/submission/submission-scope-type';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';

export const submissionObjectMock = Object.assign({}, new WorkspaceitemSectionsObject(), {
    'id': '4595',
    'uuid': '4595',
    'lastModified': new Date('2022-05-11T08:53:00.009+00:00'),
    metadata: {},
    errors: [],
    name: null,
    _name: '',
    metadataAsList: null,
    allMetadata: null,
    allMetadataValues: null,
    firstMetadata: null,
    firstMetadataValue: null,
    hasMetadata: null,
    findMetadataSortedByPlace: null,
    getRenderTypes: null,
    setMetadata: null,
    removeMetadata: null,
    equals: null,
    'sections': {
        'comments': {
            'synsicris.creator': [
                Object.assign({}, new FormFieldMetadataValueObject(), {
                    'value': 'Coordinator 4Science',
                    'language': null,
                    'authority': '2ed36d58-767b-4887-83ea-490e275b4311',
                    'confidence': 600,
                    'place': 0
                })
            ],
            'synsicris.date.creation': [
                Object.assign({}, new FormFieldMetadataValueObject(), {
                    'value': '2022-05-11',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                })
            ]
        }
    },
    'type': new ResourceType('workspaceitem'),
    '_links': {
        'collection': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595/collection'
        },
        'item': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595/item'
        },
        'submissionDefinition': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595/submissionDefinition'
        },
        'submitter': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595/submitter'
        },
        'self': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595'
        }
    },
    'self': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595'
});


export const submissionObjectWithErrors = Object.assign({}, new WorkspaceitemSectionsObject(), {
    'id': '4595',
    'uuid': '4595',
    'lastModified': new Date('2022-05-11T08:53:00.009+00:00'),
    metadata: {},
    errors: [
        {
            'message': 'error.validation.required',
            'paths': [
                '/sections/comments/dc.type'
            ]
        }],
    name: null,
    _name: '',
    metadataAsList: null,
    allMetadata: null,
    allMetadataValues: null,
    firstMetadata: null,
    firstMetadataValue: null,
    hasMetadata: null,
    findMetadataSortedByPlace: null,
    getRenderTypes: null,
    setMetadata: null,
    removeMetadata: null,
    equals: null,
    'sections': {
        'comments': {
            'synsicris.creator': [
                Object.assign({}, new FormFieldMetadataValueObject(), {
                    'value': 'Coordinator 4Science',
                    'language': null,
                    'authority': '2ed36d58-767b-4887-83ea-490e275b4311',
                    'confidence': 600,
                    'place': 0
                })
            ],
            'synsicris.date.creation': [
                Object.assign({}, new FormFieldMetadataValueObject(), {
                    'value': '2022-05-11',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                })
            ]
        }
    },
    'type': new ResourceType('workspaceitem'),
    '_links': {
        'collection': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595/collection'
        },
        'item': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595/item'
        },
        'submissionDefinition': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595/submissionDefinition'
        },
        'submitter': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595/submitter'
        },
        'self': {
            'href': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595'
        }
    },
    'self': 'https://dspacecris1.disy.net/server/api/submission/workspaceitems/4595'
});

