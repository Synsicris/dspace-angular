import { submissionObjectMock, submissionObjectWithErrors } from './../mocks/submission-object.mock';
import { SubmissionScopeType } from './../../core/submission/submission-scope-type';
import { ProjectItemService } from './../../core/project/project-item.service';
import { SectionsService } from './../../submission/sections/sections.service';
import { SubmissionService } from './../../submission/submission.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemSubmissionModalComponent } from './create-item-submission-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';
import { getMockFormBuilderService } from '../../shared/mocks/form-builder-service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { SubmissionFormsConfigService } from './../../core/config/submission-forms-config.service';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { of as observableOf } from 'rxjs';
import { SubmissionServiceStub } from '../testing/submission-service.stub';
import { FormService } from '../form/form.service';
import { getMockFormService } from '../mocks/form-service.mock';
import { SectionsServiceStub } from '../testing/sections-service.stub';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';
import { submissionConfiguration } from '../mocks/create-item-submission-configuration.mock';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { Collection } from './../../core/shared/collection.model';
import { SharedModule } from '../shared.module';
import { DebugElement } from '@angular/core';


describe('CreateItemSubmissionModalComponent', () => {
  let component: CreateItemSubmissionModalComponent;
  let fixture: ComponentFixture<CreateItemSubmissionModalComponent>;
  let de: DebugElement;
  let modal;
  let builderService: FormBuilderService;
  let submissionConfigurationStub: SubmissionFormsConfigService;

  const mockCollection: Collection = Object.assign(new Collection(), {
    id: 'ce41d451-97ed-4a9c-94a1-7de34f16a9f4',
    name: 'test-collection',
    _links: {
      mappedItems: {
        href: 'https://rest.api/collections/ce41d451-97ed-4a9c-94a1-7de34f16a9f4/mappedItems'
      },
      self: {
        href: 'https://rest.api/collections/ce41d451-97ed-4a9c-94a1-7de34f16a9f4'
      }
    }
  });

  const formData = {
    'dc.title': [
      {
        'value': 'Comments',
        'language': null,
        'authority': null,
        'display': 'Comments',
        'securityLevel': null,
        'confidence': -1,
        'place': 0,
        'otherInformation': null
      }
    ]
  };

  const collectionDataServiceStub = jasmine.createSpyObj('CollectionDataService', {
    findById: jasmine.createSpy('findById')
  });

  const projectItemServiceStub = jasmine.createSpyObj('ProjectItemService', {
    updateMultipleSubmissionMetadata: jasmine.createSpy('updateMultipleSubmissionMetadata'),
    depositWorkspaceItem: jasmine.createSpy('depositWorkspaceItem'),
  });
  const submissionServiceStub: any = new SubmissionServiceStub();

  const sectionsServiceStub: any = new SectionsServiceStub();

  function getMockSubmissionFormsConfigService(): SubmissionFormsConfigService {
    return jasmine.createSpyObj('SubmissionFormsConfigService', {
      findByName: jasmine.createSpy('findByName'),
    });
  }


  function init() {
    modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);
    builderService = getMockFormBuilderService();
    submissionConfigurationStub = getMockSubmissionFormsConfigService();
  }

  beforeEach(async () => {
    init();
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        SharedModule
      ],
      declarations: [CreateItemSubmissionModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modal },
        { provide: FormBuilderService, useValue: builderService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: CollectionDataService, useValue: collectionDataServiceStub },
        { provide: SubmissionFormsConfigService, useValue: submissionConfigurationStub },
        { provide: SubmissionService, useValue: submissionServiceStub },
        { provide: FormService, useValue: getMockFormService() },
        { provide: SectionsService, useValue: sectionsServiceStub },
        { provide: ProjectItemService, useValue: projectItemServiceStub },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemSubmissionModalComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.entityType = 'comment';
    component.collectionId = '10257c5e-9787-44c3-8036-e2fb2ccc6613';
    component.formName = 'comments';
    component.formId = '5_create-item-submission-modal';
    component.customMetadata = {
      'dc.type': [
        Object.assign(new FormFieldMetadataValueObject(),
          {
            uuid: '10257c5',
            authority: 'comment:COM13',
            confidence: 600,
            display: 'Exchange with Project required',
            language: null,
            otherInformation: null,
            place: 0,
            securityLevel: null,
            value: 'Exchange with Project required',
          }
        )
      ]
    };

    (submissionConfigurationStub.findByName as any).and.returnValue(createSuccessfulRemoteDataObject$(submissionConfiguration));
    (collectionDataServiceStub.findById as any).and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
    (sectionsServiceStub.checkSectionErrors as any).and.returnValue(null);


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called collection findById with valid parameters', () => {
    expect(collectionDataServiceStub.findById).toHaveBeenCalledWith('10257c5e-9787-44c3-8036-e2fb2ccc6613');
  });


  it('should have called configuration findByName with valid parameters', () => {
    expect(submissionConfigurationStub.findByName).toHaveBeenCalledWith('comments');
  });


  it('should have called formservice modelFromConfiguration with valid parameters', () => {
    expect(builderService.modelFromConfiguration).toHaveBeenCalledWith(null, submissionConfiguration as any, '',
      mockCollection.metadata,
      SubmissionScopeType.WorkspaceItem);
  });


  describe('When submission has errors on submit of form', () => {

    beforeEach(() => {
      projectItemServiceStub.updateMultipleSubmissionMetadata.and.returnValue(observableOf(submissionObjectWithErrors));
      submissionServiceStub.createSubmission.and.returnValue(observableOf(submissionObjectWithErrors));
      submissionServiceStub.discardSubmission.and.returnValue(observableOf(null));
      projectItemServiceStub.depositWorkspaceItem.and.returnValue(observableOf(null));
      component.submit(observableOf(formData));
      fixture.detectChanges();
    });


    it('should call the project item service updateMultipleSubmissionMetadata with valid parameters', () => {
      expect(projectItemServiceStub.updateMultipleSubmissionMetadata).toHaveBeenCalledWith(submissionObjectWithErrors, component.formName, Object.assign({}, formData, component.customMetadata));
    });

    it('should call the sectionsService.checkSectionErrors with valid parameters', () => {
      expect(sectionsServiceStub.checkSectionErrors).toHaveBeenCalledWith(submissionObjectWithErrors.id, submissionObjectWithErrors._links.self.href, component.formId, component.parseErorrs(submissionObjectWithErrors.errors));
    });

    it('should call the submissionService.discardSubmission when closing modal', () => {
      component.closeModal();
      fixture.detectChanges();
      expect(submissionServiceStub.discardSubmission).toHaveBeenCalledOnceWith(submissionObjectWithErrors.id);
    });

  });

  describe('When submission has no errors on submit of form', () => {

    beforeEach(() => {
      projectItemServiceStub.updateMultipleSubmissionMetadata.and.returnValue(observableOf(submissionObjectMock));
      submissionServiceStub.createSubmission.and.returnValue(observableOf(submissionObjectMock));
      submissionServiceStub.discardSubmission.and.returnValue(observableOf(null));
      projectItemServiceStub.depositWorkspaceItem.and.returnValue(observableOf(null));
      component.submit(observableOf(formData));
      fixture.detectChanges();
    });


    it('should call the projectItemService.depositWorkspaceItem with valid parameters', () => {
      expect(projectItemServiceStub.depositWorkspaceItem).toHaveBeenCalledOnceWith(submissionObjectMock);
    });

  });

});
