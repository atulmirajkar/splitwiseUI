import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {BehaviorSubject, Observable, config} from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';

export class Group{
  private ID: number;
  private name: string;
}

export class Expense{
  category: string;
  user_id: number;
  owed_share: number;
  date: string;
}

class User{
  private id: number;
  private first_name: string;
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

  //users
  private __userArr = new BehaviorSubject<User[]>([]);
  public userArr: Observable<any> = this.__userArr.asObservable();

  //expenses
  private __expenseArr = new BehaviorSubject<Expense[]>([]);
  public expenseArr: Observable<Expense[]> = this.__expenseArr.asObservable();

  //baseURL
  private baseURL: string;

  //constructor
  constructor(http: HttpClient) {
    this.__http = http;
    this.baseURL = environment.baseURL;

  }

  /*log out */
  logout() {
    this.__http.get(this.baseURL + 'logout', { withCredentials: true })
    .subscribe();
  }


  /*log in */
  login() {
    this.__http.get(this.baseURL, { withCredentials: true })
    .subscribe();
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
  getUsers(groupID: number){
    const params: HttpParams = new HttpParams()
    .set('groupID', groupID.toString());

    console.log(params);

    this.__http.get(this.baseURL + 'GetGroupUsers', {withCredentials : true, params : params})
    .subscribe( (data: User[]) => {

      this.__userArr.next(data);
    });
  }
}
