import { Config } from './config.interface';

export interface CommentConfig extends Config {
  commentEditFormName: string;
  commentEditFormSection: string;
  commentEditMode: string;
  commentEntityType: string;
  commentRelationItemMetadata: string;
  commentRelationItemVersionMetadata?: string;
  commentRelationProjectMetadata?: string;
  commentRelationProjectVersionMetadata?: string;
}

