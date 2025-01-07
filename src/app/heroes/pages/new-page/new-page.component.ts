import { Component } from '@angular/core';

@Component({
  selector: 'heroes-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {
  public publishers = [
    {value: 'DC Comics', name: 'DC - Comics'},
    {value: 'Marvel Comics', name: 'Marvel - Comics'},
  ]

}
