import { Config } from './config.interface';

export interface QuestionsBoardConfig extends Config {
  questionsBoardFormPrefix: string;
  questionsBoardI18nPrefix: string;
  questionsBoardRelationMetadata: string;
  questionsBoardStepRelationMetadata: string;
  questionsBoardStepEntityName: string;
  questionsBoardTaskRelationMetadata: string;
  questionsBoardPartnerMetadata: string;
  questionsBoardTaskFormSection: string;
  questionsBoardEditFormSection: string;
  questionsBoardEditMode: string;
  questionsBoardStepIcon: boolean;
}
