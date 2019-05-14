import { Component, OnInit, Directive } from '@angular/core';
import { HTTPControllerService, Group } from '../httpcontroller.service';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private __httpService: HTTPControllerService;

  // setting properties
  public selectedGroup: Group;
  public selectedGroupObs: Observable<any>;

  public selectedStartDate: NgbDateStruct;
  public selectedStartDateObs: Observable<any>;

  public selectedEndDate: NgbDateStruct;
  public selectedEndDateObs: Observable<any>;

  public GroupArrObs: Observable<any>;
  public groupArr: Group[];

  constructor(httpService: HTTPControllerService) {
    this.__httpService = httpService;
    this.GroupArrObs = this.__httpService.groupArr;
    this.selectedGroupObs=this.__httpService.selectedGroupObs;
    this.selectedStartDateObs=this.__httpService.selectedStartDateObs;
    this.selectedEndDateObs=this.__httpService.selectedEndDateObs;
  }

  ngOnInit() {

    // subscribe selected cat
    this.selectedGroupObs.subscribe((data:Group)=>{
      this.selectedGroup=data;
    })
    //subscribe group arr
    this.GroupArrObs.subscribe((data: Group[]) => {
      this.groupArr = data;
    });

    //start date and end date
    this.selectedStartDateObs.subscribe((data:NgbDate) => {
      this.selectedStartDate=data;
    })
    this.selectedEndDateObs.subscribe((data:NgbDateStruct)=>{
      this.selectedEndDate=data;
    })

    //initialize
    if(!this.groupArr || this.groupArr.length <1){
      this.__httpService.getGroups();
    }

    this.__httpService.getCategories();


  }



  ApplySetting() {
    this.__httpService.getExpenses(
      this.selectedGroup.ID,
      this.selectedStartDate,
      this.selectedEndDate
    );

  }

  public onStartDateSelect(data){
    this.__httpService.changeStartDate(data);
  }

  public onEndDateSelect(data){
    this.__httpService.changeEndDate(data);
  }

  public groupChange(data) {
    this.selectedGroup = data;
    this.__httpService.getUsers(this.selectedGroup.ID);
    this.__httpService.changeGroupSelection(this.selectedGroup);
  }
}

@Directive({
  selector: '[appDateValidDirective]',
  providers: [{provide: NG_VALIDATORS,useExisting:DateValidDirective,multi: true}]
})
export class DateValidDirective implements Validator{
  validate(control: AbstractControl) : ValidationErrors {
    return dateRangeValidator(control);
  }


}

export const dateRangeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const startDateCtrl = control.get('startDatePicker');
  const endDateCtrl = control.get('endDatePicker');

  if(!startDateCtrl || !endDateCtrl || !startDateCtrl.value || !endDateCtrl.value) {
    return null;
  }

  if(startDateCtrl.value.year > endDateCtrl.value.year) {
    return {'dateError':true};
  }

  if(startDateCtrl.value.year === endDateCtrl.value.year && startDateCtrl.value.month > endDateCtrl.value.month ) {
    return {'dateError':true};
  }

  if(startDateCtrl.value.month === endDateCtrl.value.month && startDateCtrl.value.day > endDateCtrl.value.day){
    return {'dateError':true};
  }

  return null;
}