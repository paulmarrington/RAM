import {Component, Input} from '@angular/core';
import {ISearchResult} from '../../../../commons/RamAPI2';

@Component({
    selector: 'search-result-pagination',
    templateUrl: 'search-result-pagination.component.html',
    directives: []
})

export class SearchResultPaginationComponent {

    @Input() public searchResult: ISearchResult<Object>;

    public pages(): number[] {
        return [1,2,3,4,5];
    }

    public isPreviousDisabled(): boolean {
        return true;
    }

    public isNextDisabled(): boolean {
        return false;
    }

    public hasPreviousEllipsis(): boolean {
        return true;
    }

    public hasNextEllipsis(): boolean {
        return true;
    }

    public goToPage(page: number) {
        if (page != this.searchResult.page) {
            alert('TODO: Go To Page: ' + page);
        }
    }

    public goToPreviousPage() {
        if (!this.isPreviousDisabled()) {
            const previousPage = this.searchResult.page - 1;
            alert('TODO: Go To Previous Page: ' + previousPage);
        }
    }

    public goToNextPage() {
        if (!this.isNextDisabled()) {
            const nextPage = this.searchResult.page + 1;
            alert('TODO: Go To Next Page: ' + nextPage);
        }
    }

}