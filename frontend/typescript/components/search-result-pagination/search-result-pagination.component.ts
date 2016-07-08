import {Component, Input} from '@angular/core';
import {ISearchResult} from '../../../../commons/RamAPI2';

@Component({
    selector: 'search-result-pagination',
    templateUrl: 'search-result-pagination.component.html',
    directives: []
})

export class SearchResultPaginationComponent {

    @Input() public searchResult: ISearchResult<Object>;

    public totalPages(): number {
        if (this.searchResult) {
            const pageSize = this.searchResult.pageSize;
            const totalCount = this.searchResult.totalCount;
            return parseInt((totalCount + pageSize - 1) / pageSize);
        }
        return 0;
    }

    public pages(): number[] {
        let result: number[] = [];
        let totalPages = this.totalPages();
        for (let page = 1; page <= totalPages; page = page + 1) {
            result.push(page);
        }
        return result;
    }

    public isPreviousDisabled(): boolean {
        return this.searchResult ? this.searchResult.page === 1 : true;
    }

    public isNextDisabled(): boolean {
        return this.searchResult ? this.searchResult.page === (this.totalPages()) : true;
    }

    public hasPreviousEllipsis(): boolean {
        return true;
    }

    public hasNextEllipsis(): boolean {
        return true;
    }

    public goToPage(page: number) {
        if (this.searchResult && this.searchResult.page !== page) {
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