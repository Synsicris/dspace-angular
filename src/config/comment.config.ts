import { Config } from './config.interface';

export interface CommentConfig extends Config {
  commentEditFormSection: string;
  commentEditMode: string;
  commentEntityType: string;
}

