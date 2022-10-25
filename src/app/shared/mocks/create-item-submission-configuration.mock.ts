export const submissionConfiguration = {
    'id': 'comments',
    'name': 'comments',
    'rows': [
        {
            'fields': [
                {
                    'input': {
                        'type': 'onebox'
                    },
                    'label': 'Title of the comment',
                    'mandatory': true,
                    'repeatable': false,
                    'mandatoryMessage': 'mandatory',
                    'selectableMetadata': [
                        {
                            'metadata': 'dc.title',
                            'label': null,
                            'closed': false
                        }
                    ],
                    'languageCodes': [],
                    'typeBind': []
                }
            ]
        },
        {
            'fields': [
                {
                    'input': {
                        'type': 'onebox'
                    },
                    'label': 'Type of comment',
                    'mandatory': false,
                    'repeatable': false,
                    'style': 'col-md-6',
                    'selectableMetadata': [
                        {
                            'metadata': 'dc.type',
                            'label': null,
                            'controlledVocabulary': 'comment',
                            'closed': true
                        }
                    ],
                    'languageCodes': [],
                    'typeBind': []
                },
                {
                    'input': {
                        'type': 'calendar'
                    },
                    'label': 'Date for reminder',
                    'mandatory': false,
                    'repeatable': false,
                    'style': 'col-md-6',
                    'selectableMetadata': [
                        {
                            'metadata': 'synsicris.date.reminder',
                            'label': null,
                            'closed': false
                        }
                    ],
                    'languageCodes': [],
                    'typeBind': []
                }
            ]
        },
        {
            'fields': [
                {
                    'input': {
                        'type': 'textarea'
                    },
                    'label': 'Comment',
                    'mandatory': false,
                    'repeatable': false,
                    'selectableMetadata': [
                        {
                            'metadata': 'dc.description',
                            'label': null,
                            'closed': false
                        }
                    ],
                    'languageCodes': [],
                    'typeBind': []
                }
            ]
        },
        {
            'fields': [
                {
                    'input': {
                        'type': 'date'
                    },
                    'visibility': {
                        'submission': 'hidden'
                    },
                    'label': 'Written at',
                    'mandatory': false,
                    'repeatable': false,
                    'style': 'col-md-6',
                    'selectableMetadata': [
                        {
                            'metadata': 'synsicris.date.creation',
                            'label': null,
                            'closed': false
                        }
                    ],
                    'languageCodes': [],
                    'typeBind': []
                },
                {
                    'input': {
                        'type': 'dropdown'
                    },
                    'visibility': {
                        'submission': 'hidden'
                    },
                    'label': 'Written by',
                    'mandatory': false,
                    'repeatable': false,
                    'style': 'col-md-6',
                    'selectableMetadata': [
                        {
                            'metadata': 'synsicris.creator',
                            'label': null,
                            'controlledVocabulary': 'PersonAuthority',
                            'closed': false
                        }
                    ],
                    'languageCodes': [],
                    'typeBind': []
                }
            ]
        },
        {
            'fields': [
                {
                    'input': {
                        'type': 'dropdown'
                    },
                    'label': 'Related item',
                    'mandatory': false,
                    'repeatable': false,
                    'selectableMetadata': [
                        {
                            'metadata': 'synsicris.relation.item',
                            'label': null,
                            'controlledVocabulary': 'CommentAuthority',
                            'closed': false
                        }
                    ],
                    'languageCodes': [],
                    'typeBind': []
                }
            ]
        }
    ],
    'type': 'submissionform',
    '_links': {
        'self': {
            'href': 'https://dspacecris1.disy.net/server/api/config/submissionforms/comments'
        }
    }
};
