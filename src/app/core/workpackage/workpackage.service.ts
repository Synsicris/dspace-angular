import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SubmissionFormModel } from '../config/models/config-submission-form.model';
import { ConfigData } from '../config/config-data';
import { SubmissionFormsConfigService } from '../config/submission-forms-config.service';

@Injectable()
export class WorkpackageService {

  constructor(private formConfigService: SubmissionFormsConfigService) {
  }

  getWorkpackageFormConfig(): Observable<SubmissionFormModel> {
    const formName = 'impact_pathway_step_type_1_task_form';
    return this.formConfigService.getConfigByName(formName).pipe(
      map((configData: ConfigData) => configData.payload as SubmissionFormModel)
    )
  }
}
