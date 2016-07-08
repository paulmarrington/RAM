import {Component, Input} from '@angular/core';
import {ISearchResult} from '../../../../commons/RamAPI2';

@Component({
    selector: 'search-result-pagination',
    templateUrl: 'search-result-pagination.component.html',
    directives: []
})

export class SearchResultPaginationComponent {

    @Input() public searchResult: ISearchResult<T>;

}