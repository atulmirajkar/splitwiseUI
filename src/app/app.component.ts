import { Component } from '@angular/core';
import { HTTPControllerService } from './httpcontroller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private __httpService: HTTPControllerService;

  public title = 'splitwiseUI';

  private __opened = true;

  public get opened(){
    return this.__opened;
  }

  public set opened(opened: boolean) {
    this.__opened = opened;
  }

  constructor(httpService: HTTPControllerService) {
    this.__httpService = httpService;
    this.__opened = true;
  }



  public _toggleSidebar() {
    this.opened = !this.opened;
  }

}
