import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, config, ObservableLike } from 'rxjs';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';


/**********************************create expense******************************** */
export interface CreateExpense {
  group_id: number;
  description: string;
  payment: boolean;
  cost: number;
  category_id: number;
  currency_code: string;
  creation_method: string;
}

/**********************************create expense******************************** */

export class Category {
  public id: number;
  public name: string;
}

export class Group {
  public ID: number;
  public Name: string;
  constructor() {
    this.ID = 0;
    this.Name = "";
  }
}

export class Expense {
  category: string;
  user_id: number;
  owed_share: number;
  date: string;
}

export class User {
  public id: number;
  public first_name: string;
  public last_name?: string;
  public picture?: object;
}

interface Config {
  baseURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class HTTPControllerService {
  private __http: HttpClient;

  //groups
  private __groupArr = new BehaviorSubject<Group[]>([]);
  public groupArr: Observable<any> = this.__groupArr.asObservable();

  private __selectedGroupObs = new BehaviorSubject<Group>(new Group());
  public selectedGroupObs: Observable<Group> = this.__selectedGroupObs.asObservable();

  private __selectedGroup: Group;
  public get selectedGroup(): Group {
    return this.__selectedGroup;
  }
  public set selectedGroup(group: Group) {
    this.__selectedGroup = group;
  }

  //selected start date and end date
  private __selectedStartDate: NgbDateStruct;
  public get selectedStartDate(): NgbDateStruct {
    return this.__selectedStartDate;
  }
  public set selectedStartDate(date: NgbDateStruct) {
    this.__selectedStartDate = date;
  }
  private __selectedEndDate: NgbDateStruct;
  public get selectedEndDate(): NgbDateStruct {
    return this.__selectedEndDate;
  }
  public set selectedEndDate(date: NgbDateStruct) {
    this.__selectedEndDate = date;
  }

  private __selectedStartDateObs = new BehaviorSubject<NgbDateStruct>({ year: 0, month: 0, day: 0 });
  public selectedStartDateObs: Observable<NgbDateStruct> = this.__selectedStartDateObs.asObservable();

  private __selectedEndDateObs = new BehaviorSubject<NgbDateStruct>({ year: 0, month: 0, day: 0 });
  public selectedEndDateObs: Observable<NgbDateStruct> = this.__selectedEndDateObs.asObservable();

  //description
  private __descriptionObs = new BehaviorSubject<string>("");
  public descriptionObs: Observable<string> = this.__descriptionObs.asObservable();
  private __description: string;
  public get descripion():string{
    return this.__description;
  }
  public set description(descripion:string){
    this.__description = descripion;
  }

  //amount
  private __amountObs = new BehaviorSubject<number>(0);
  public amountObs: Observable<number> = this.__amountObs.asObservable();
  private __amount: number;
  public get amount():number{
    return this.__amount;
  }
  public set amount(amount:number){
    this.__amount= amount;
  }

  //selected category
  private __selectedCatObs = new BehaviorSubject<Category>(new Category());
  public selectedCatObs: Observable<Category> = this.__selectedCatObs.asObservable();
  private __selectedCat: Category;
  public get selectedCat():Category{
    return this.__selectedCat;
  }
  public set selectedCat(selectedCat:Category){
    this.__selectedCat= selectedCat;
  }

  //users
  private __userArr = new BehaviorSubject<User[]>([]);
  public userArr: Observable<any> = this.__userArr.asObservable();

  //expenses
  private __expenseArr = new BehaviorSubject<Expense[]>([]);
  public expenseArr: Observable<Expense[]> = this.__expenseArr.asObservable();

  //category
  private __categoryArr = new BehaviorSubject<Category[]>([]);
  public categoryArr: Observable<Category[]> = this.__categoryArr.asObservable();

  //baseURL
  private baseURL: string;

  //is auth done?
  private __isAuthenticated;
  public get isAuthenticated(): boolean {
    return this.__isAuthenticated;
  }
  public set isAuthenticated(isAuthDone: boolean) {
    this.__isAuthenticated = isAuthDone;
  }

  //constructor
  constructor(http: HttpClient) {
    this.__http = http;
    this.baseURL = environment.baseURL;
    this.__isAuthenticated = false;

    //set start and end date
    const date = new Date();
    this.changeStartDate({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: 1
    });

    this.changeEndDate({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    });
  }

  changeGroupSelection(group: Group) {
    this.__selectedGroupObs.next(group);
    this.selectedGroup = group;
  }
  changeStartDate(date: NgbDateStruct) {
    this.__selectedStartDate = date;
    this.__selectedStartDateObs.next(date);
  }

  changeEndDate(date: NgbDateStruct) {
    this.__selectedEndDate = date;
    this.__selectedEndDateObs.next(date);
  }

  changeDescription(description: string){
    this.__description = description;
    this.__descriptionObs.next(description);
  }

  changeAmount(amount: number){
    this.__amount = amount;
    this.__amountObs.next(amount);
  }

  changeSelectedCat(selectedCat:Category){
    this.__selectedCat = selectedCat;
    this.__selectedCatObs.next(selectedCat);
  }
  /*log out */
  logout() {
    this.__http.get(this.baseURL + 'logout', { withCredentials: true })
      .subscribe(() => {
        this.isAuthenticated = false;
      });
  }


  /*log in */
  login() {
    if (!this.isAuthenticated) {
      this.__http.get(this.baseURL, { withCredentials: true })
        .subscribe(() => {
          this.isAuthenticated = true;
        });

    }
  }

  /**
   * refresh
   */
  refresh() {
    window.location.href = this.baseURL;
  }



  /* getGroups gets groups - [id, string]*/
  getGroups() {
    this.__http.get(this.baseURL + 'getGroups', { withCredentials: true })
      .subscribe(
        (data: Group[]) => {
          console.log(data);
          this.__groupArr.next(data);
        }
      );
  }

  /*getExpenses - get expenses for input group , start date and end date*/
  getExpenses(groupID: number,
    startDate: NgbDateStruct,
    endDate: NgbDateStruct) {
    const params: HttpParams = new HttpParams()
      .set('groupID', groupID.toString())
      .set('startYear', startDate.year.toString())
      .set('startMonth', startDate.month.toString())
      .set('startDay', startDate.day.toString())
      .set('endYear', endDate.year.toString())
      .set('endMonth', endDate.month.toString())
      .set('endDay', endDate.day.toString());


    console.log(params);

    this.__http.get<Expense[]>(this.baseURL + 'GetGroupData', { withCredentials: true, params: params, responseType: 'json' })
      .subscribe((data: Expense[]) => {
        this.__expenseArr.next(data);

      });

  }
  /* getUsers - get users for a group*/
  getUsers(groupID: number) {
    const params: HttpParams = new HttpParams()
      .set('groupID', groupID.toString());

    console.log(params);

    this.__http.get(this.baseURL + 'GetGroupUsers', { withCredentials: true, params: params })
      .subscribe((data: User[]) => {

        this.__userArr.next(data);
      });
  }

  getCategories() {
    this.__http.get(this.baseURL + 'GetCategories', { withCredentials: true })
      .subscribe((data: Category[]) => {
        this.__categoryArr.next(data);
      })
  }

  createTestExpense(expenseObj: CreateExpense) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    this.__http.post(this.baseURL + 'CreateExpense', JSON.stringify(expenseObj), httpOptions)
      .subscribe((data) => {
        console.log(data);
        //set start and end date
        const date = new Date();
        this.changeStartDate({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: 1
        });

        this.changeEndDate({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        });

        //clear description
        this.changeDescription("");

        //clear amount
        this.changeAmount(0);

        //clear category
        this.changeSelectedCat(new Category());

        this.getExpenses(
          this.__selectedGroup.ID,
          this.__selectedStartDate,
          this.__selectedEndDate
        );
      });
  }

}
