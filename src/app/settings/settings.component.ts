import { Component, OnInit } from '@angular/core';
import { HTTPControllerService, Group } from '../httpcontroller.service';
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
  public selectedGroup: Group;
  public selectedStartDate: NgbDateStruct;
  public selectedEndDate: NgbDateStruct;

  public GroupArrObs: Observable<any>;
  public groupArr:Group[];



  constructor(httpService: HTTPControllerService) {
    this.__httpService = httpService;
    this.GroupArrObs = this.__httpService.groupArr;

    // default start date to start of month
    // default end date to today
    const date = new Date();
    this.selectedStartDate = {year : date.getFullYear(), month : date.getMonth() + 1, day: 1};
    this.selectedEndDate = {year : date.getFullYear(), month : date.getMonth() + 1, day: date.getDate()};

   }

  ngOnInit() {
      this.__httpService.getGroups();
       //subscribe ;
    this.GroupArrObs.subscribe((data: Group[]) => {
      this.groupArr = data;
    });
  }

  ApplySetting() {

    this.__httpService.getExpenses(this.selectedGroup.ID, this.selectedStartDate, this.selectedEndDate);
    this.__httpService.getUsers(this.selectedGroup.ID);
    this.__httpService.getCategories();

  }

  public _logout() {
    this.__httpService.logout();
  }

  public _login() {
    this.__httpService.refresh();
  }

  public groupChange(data){
    console.log(data);
    this.selectedGroup=data;
    this.__httpService.changeGroupSelection(this.selectedGroup);
  }
}
