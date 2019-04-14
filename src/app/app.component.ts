import { Component } from '@angular/core';
import { HTTPControllerService } from './httpcontroller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private __httpService: HTTPControllerService;

  constructor(httpService: HTTPControllerService) {
    this.__httpService = httpService;
  }

  title = 'splitwiseUI';

  public _opened = false;

  public _toggleSidebar() {
    this._opened = !this._opened;
  }

}
