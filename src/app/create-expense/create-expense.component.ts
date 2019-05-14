import { Component, OnInit, Directive, Input } from '@angular/core';
import {
  HTTPControllerService,
  Group,
  Category,
  User,
  CreateExpense,
} from '../httpcontroller.service';
import { Observable } from 'rxjs';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.css']
})
export class CreateExpenseComponent implements OnInit {
  private __httpService: HTTPControllerService;

  // properties
  public selectedGroup: Group;
  public groupArr: Group[];

  public description: string;
  public amount: number;

  public expenseCatArr: Category[];
  public selectedCategory: Category;

  // user arr
  public userArr: User[];

  // observables
  public GroupArrObs: Observable<any>;

  constructor(httpService: HTTPControllerService) {
    this.__httpService = httpService;
    this.GroupArrObs = this.__httpService.groupArr;
  }

  ngOnInit() {
    // subscribe
    this.GroupArrObs.subscribe((data: Group[]) => {
      this.groupArr = data;
    });

    // subscribe selected cat
    this.__httpService.selectedGroupObs.subscribe((data:Group)=>{
      this.selectedGroup=data;
    })

    // subscribe expenseCatArr;
    this.__httpService.categoryArr.subscribe((data: Category[]) => {
      this.expenseCatArr = data;
    });

    // subscribe userArr
    this.__httpService.userArr.subscribe((data: User[]) => {
      this.userArr = data;
    });

    if(!this.groupArr || this.groupArr.length <1){
      this.__httpService.getGroups();
    }

    //subscribe description and amount
    this.__httpService.descriptionObs.subscribe((data:string)=> {
      this.description=data;
    });

    this.__httpService.amountObs.subscribe((data:number)=>{
      this.amount=data;
    });

    //subscribe description
    this.__httpService.selectedCatObs.subscribe((data:Category)=>{
      this.selectedCategory=data;
    })

    this.__httpService.getCategories();
  }

  // listeners
  groupChanged() {

    if (this.selectedGroup) {
      this.__httpService.getUsers(this.selectedGroup.ID);
      this.__httpService.changeGroupSelection(this.selectedGroup);
    }
  }

  descriptionChanged(data:string){
    this.description=data;
    this.__httpService.changeDescription(data);
  }
  amountChanged(data:number){
    this.amount = data;
    this.__httpService.changeAmount(data);
  }
  selectedCategoryChanged(){
    this.__httpService.changeSelectedCat(this.selectedCategory);
  }

  CreateExpense() {
    //     cost	10
    // currency_code	USD
    // group_id	6962826
    // users__0__user_id	1446024
    // users__0__paid_share	10.00
    // users__0__owed_share	5.00
    // users__1__user_id	6521219
    // users__1__paid_share	0.00
    // users__1__owed_share	5.00
    // category_id	18
    // date	Sun+Apr+14+2019+20:32:46+GMT-0500+(Central+Daylight+Time)
    // description	test

    const expenseObj: CreateExpense = {
      description: this.description,
      group_id: this.selectedGroup.ID,
      payment: false,
      cost: this.amount,
      category_id: this.selectedCategory.id,
      currency_code: 'USD',
      creation_method: 'equal'
    };
    const numUsers = this.userArr.length;
    if (numUsers <= 1) {
      return;
    }

    // share for other users
    const share = this.amount / numUsers;

    for (const index in this.userArr) {
      if(index) {

        expenseObj['users__' + index + '__user_id'] = this.userArr[index].id;
        expenseObj['users__' + index + '__paid_share'] = String(share);
        expenseObj['users__' + index + '__owed_share'] = String(share);
      }
    }

    this.__httpService.createTestExpense(expenseObj);
  }

}

@Directive({
  selector: '[minValue]',
  providers: [{provide:NG_VALIDATORS, useExisting:MinDirective, multi:true}]
})
export class MinDirective implements Validator{
  @Input('minValue') validNumber: number;

  validate(control: AbstractControl): {[key:string] : any} | null{
    return Validators.min(this.validNumber)(control);
  }
}

@Directive({
  selector: '[maxValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaxDirective, multi: true}]
})
export class MaxDirective implements Validator{
  @Input('maxValue') validNumber: number;

  validate(control: AbstractControl): {[key:string] : any} | null{
    return Validators.max(this.validNumber)(control);
  }
}