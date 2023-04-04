import { Component, Input, OnInit } from '@angular/core';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { VocabularyService } from '../../../../../../../core/submission/vocabularies/vocabulary.service';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getPaginatedListPayload,
  getRemoteDataPayload
} from '../../../../../../../core/shared/operators';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-metadata-value-pair',
  templateUrl: './metadata-value-pair.component.html',
  styleUrls: ['./metadata-value-pair.component.scss']
})
export class MetadataValuePairComponent implements OnInit {

  @Input()
  metadataValue: MetadataValue;
  @Input()
  vocabularyName: string;

  value$: Observable<string>;

  constructor(private readonly vocabularyService: VocabularyService,) {
  }

  ngOnInit(): void {

    const authority = this.metadataValue.authority ? this.metadataValue.authority.split(':') : undefined;
    const isControlledVocabulary = authority?.length > 1 && authority[0] === this.vocabularyName;

    let vocabularyEntry$ = isControlledVocabulary ?
      this.vocabularyService.findEntryDetailById(this.metadataValue.authority, this.vocabularyName).pipe(
        getFirstSucceededRemoteDataPayload()
      ) :
      this.vocabularyService.getPublicVocabularyEntryByValue(this.vocabularyName, this.metadataValue.value)
        .pipe(
          getFirstCompletedRemoteData(),
          getRemoteDataPayload(),
          getPaginatedListPayload(),
          map((res) => res[0])
        );

    this.value$ = vocabularyEntry$.pipe(
      map((res) => res?.display ?? this.metadataValue.value),
      take(1)
    );
  }
}
