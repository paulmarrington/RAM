/* Copy of https://github.com/evanplaice/ng2-markdown
 * converting to TS as we do not transpile es6 (babel)
 * Attempting to turn transpiler on causes an internal
 * error.
 */
import { Directive, ElementRef, OnInit } from '@angular/core';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import Showdown from 'showdown';

const temporaryMd=`
### By clicking authorise button below you agree:

* Terms and conditions / declaration item 1.
* Terms and conditions / declaration item 2.
* Terms and conditions / declaration item 3.
* Terms and conditions / declaration item 4.
* Terms and conditions / declaration item 5.
`;

//@Directive({
@Directive({
  selector: 'ng2-markdown',
  inputs: [ 'href', 'data' ],
  providers: [ HTTP_PROVIDERS ]
})
export class MarkdownComponent implements OnInit {
  constructor (private elementRef:ElementRef, private http:Http) {
  }

  public ngOnInit () {
    this.fromFile('');
  }

  private fromFile(href:string) {
    // this.http.get(href).toPromise()
    // .then((res) => {
    //    return this.prepare(res._body);
    // })
    // .then((markdown:string) => {
    //   return this.process(markdown);
    // })
    this.process(temporaryMd);
  }

private process(markdown:string) {
    let converter = new Showdown.Converter();
    this.elementRef.nativeElement.innerHTML = converter.makeHtml(markdown);
  }
}
