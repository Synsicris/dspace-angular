import { Component, Input, OnInit } from '@angular/core';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { VocabularyService } from '../../../../../../../core/submission/vocabularies/vocabulary.service';
import {
  getFirstSucceededRemoteDataPayload,
  getPaginatedListPayload
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
    const metadataValue = isControlledVocabulary ? authority[1] : this.metadataValue.value;

    this.value$ = this.vocabularyService.getPublicVocabularyEntryByValue(this.vocabularyName, metadataValue).pipe(
      getFirstSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      map((res) => res[0]?.display ?? this.metadataValue.value),
      take(1)
    );
  }
}
