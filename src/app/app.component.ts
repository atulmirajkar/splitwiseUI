import { Component, OnInit } from '@angular/core';
import { HTTPControllerService } from './httpcontroller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private __httpService: HTTPControllerService;

  public title = 'splitwiseUI';

  public tabJustify = 'center';

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

  ngOnInit(){
    this.__httpService.login();
  }


  public _toggleSidebar() {
    this.opened = !this.opened;
  }

  public _logout() {
    this.__httpService.logout();
  }

  public _login() {
    this.__httpService.refresh();
  }

}
