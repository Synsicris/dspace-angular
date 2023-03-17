import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({
  name: 'dsEntityTypeTranslate'
})
export class EntityTypeTranslatePipe extends TranslatePipe implements PipeTransform {

  transform(value: string, prefix = 'search.filters.entityType'): string {
    let translatedValue = super.transform(`${prefix}.${value}`);
    if (translatedValue != null) {
      return translatedValue as string;
    }
    return value;
  }

}
