import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, config} from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';


/**********************************create expense******************************** */
export interface CreateExpense {
  group_id: number;
  description: string;
  payment: boolean;
  cost: number;
  category_id: number;
  currency_code: string;
  creation_method:string;
  // users__0__user_id:number;
  // users__0__paid_share:number;
  // users__0__owed_share:number;
  // users__1__user_id?:number;
  // users__1__paid_share?:number;
  // users__1__owed_share?:number;
  users: ExpenseUser[];
}

export interface ExpenseUser {
  paid_share:number;
  owed_share:number;
  net_balance:number;
  user: User;
  user_id:number;
}
/**********************************create expense******************************** */

export class Category{
  public id:number;
  public name:string;
}

export class Group{
  public ID: number;
  public Name: string;
  constructor(){
    this.ID=0;
    this.Name="";
  }
}

export class Expense{
  category: string;
  user_id: number;
  owed_share: number;
  date: string;
}

export class User{
  public id: number;
  public first_name: string;
  public last_name?:string;
  public picture?:object;
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

  private __selectedGroup = new BehaviorSubject<Group>(new Group());
  public selectedGroup:Observable<Group> = this.__selectedGroup.asObservable();




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
  public set isAuthenticated(isAuthDone:boolean){
    this.__isAuthenticated=isAuthDone;
  }

  //constructor
  constructor(http: HttpClient) {
    this.__http = http;
    this.baseURL = environment.baseURL;
    this.__isAuthenticated = false;
  }

  changeGroupSelection(group: Group){
    this.__selectedGroup.next(group);
  }

  /*log out */
  logout() {
    this.__http.get(this.baseURL + 'logout', { withCredentials: true })
    .subscribe(() => {
      this.isAuthenticated=false;
    });
  }


  /*log in */
  login() {
    if(!this.isAuthenticated)
    {
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

    this.__http.get<Expense[]>(this.baseURL + 'GetGroupData', {withCredentials: true, params: params, responseType: 'json'})
    .subscribe((data: Expense[]) => {
      this.__expenseArr.next(data);

    });

  }
  /* getUsers - get users for a group*/
  getUsers(groupID: number) {
    const params: HttpParams = new HttpParams()
    .set('groupID', groupID.toString());

    console.log(params);

    this.__http.get(this.baseURL + 'GetGroupUsers', {withCredentials : true, params : params})
    .subscribe( (data: User[]) => {

      this.__userArr.next(data);
    });
  }

  getCategories(){
    this.__http.get(this.baseURL + 'GetCategories', {withCredentials:true})
    .subscribe((data: Category[]) => {
      this.__categoryArr.next(data);
    })
  }

  createTestExpense(expenseObj : CreateExpense) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      }),
      withCredentials: true,
    };

    this.__http.post(this.baseURL + 'CreateExpense', JSON.stringify(expenseObj), httpOptions)
    .subscribe((data) => {
      console.log(data);
    });
  }

}
