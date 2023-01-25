import { EditItemDataService } from '../../core/submission/edititem-data.service';
import { GetItemMetadataValuePipe } from './get-item-metadata-value.pipe';

describe('GetItemMetadataValuePipe', () => {
  let pipe: GetItemMetadataValuePipe;
  let editItemService: EditItemDataService;

  beforeEach(() => {
    editItemService = jasmine.createSpyObj('editItemService', {
      searchEditMetadataByID: {}
    });

    pipe = new GetItemMetadataValuePipe(editItemService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
