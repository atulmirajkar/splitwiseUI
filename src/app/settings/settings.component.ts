import { Component, OnInit } from '@angular/core';
import { HTTPControllerService } from '../httpcontroller.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  private __httpService: HTTPControllerService;

  // setting properties
  public selectedGroup: {key: number, value: number};
  public selectedStartDate: NgbDateStruct;
  public selectedEndDate: NgbDateStruct;

  public GroupArr: Observable<any>;
  public UserArr: Observable<any>;



  constructor(httpService: HTTPControllerService) {
    this.__httpService = httpService;
    this.GroupArr = this.__httpService.groupArr;
    this.UserArr = this.__httpService.userArr;

    // default start date to start of month
    // default end date to today
    const date = new Date();
    this.selectedStartDate = {year : date.getFullYear(), month : date.getMonth() + 1, day: 1};
    this.selectedEndDate = {year : date.getFullYear(), month : date.getMonth() + 1, day: date.getDate()};

   }

  ngOnInit() {
      this.__httpService.getGroups();
  }

  ApplySetting() {

    this.__httpService.getExpenses(this.selectedGroup.key, this.selectedStartDate, this.selectedEndDate);
    this.__httpService.getUsers(this.selectedGroup.key);

  }

  public _logout() {
    this.__httpService.logout();
  }

  public _login() {
    this.__httpService.refresh();
  }
}
