import { SharedModule } from './../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list-box/comment-list.component';
import { CommentCreateComponent } from './comment-create/comment-create.component';

const COMPONENTS = [
  CommentCreateComponent,
  CommentListComponent
];

const IMPORTS = [
  CommonModule,
  SharedModule
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...IMPORTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class CommentsModule { }
