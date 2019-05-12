import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import {
  HTTPControllerService,
  CreateExpense,
  Category,
  Group
} from '../httpcontroller.service';
import { Observable } from 'rxjs';
import { Expense, User } from '../httpcontroller.service';

class DrillDownExpense {
  userName: string;
  owedShare: number;
  date: Date;
  category: string;

  constructor() {
    this.userName = '';
    this.owedShare = 0;
    this.date = undefined;
    this.category = '';
  }
}

@Component({
  selector: 'app-monthly-graph',
  templateUrl: './monthly-graph.component.html',
  styleUrls: ['./monthly-graph.component.css']
})
export class MonthlyGraphComponent implements OnInit {
  httpService: HTTPControllerService;

  // expenses by category
  public categoryExpenseMap: Map<string, DrillDownExpense[]>;

  // expenses by month
  public monthExpenseMap: Map<string, DrillDownExpense[]>;

  public drillExpenseArr: DrillDownExpense[];

  // user arr
  public userArr: User[];

  // expense
  public expenseArr: Observable<Expense[]>;

  // date
  public dateArr: Date[];

  // date with month start date
  public monthArr: string[];

  // expense
  public expenseValArr: Number[];

  // expense category arr
  public expenseCatArr: Category[];

  // selected category
  public selectedCategory: Category;

  // description
  public description: string;

  // amount
  public amount: number;

  // graph category
  public categoryArr: string[];

  // monthNames
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // selected group obs
  public selectedGroupObs: Observable<Group>;
  public selectedGroup: Group;

  public expenseByCategory = {
    data: [
      {
        x: [],
        y: [],
        type: 'bar',
        marker: { color: 'cornflowerblue' },
        transforms: [
          {
            type: 'aggregate',
            groups: [],
            aggregations: [
              {
                target: 'y',
                func: 'sum',
                enabled: true
              }
            ]
          }
        ]
      }
    ],
    layout: { title: 'Expenses by category' }
  };

  public expenseByMonth = {
    data: [
      {
        x: [],
        y: [],
        type: 'bar',
        marker: { color: 'cornflowerblue' },
        transforms: [
          {
            type: 'aggregate',
            groups: [],
            aggregations: [
              {
                target: 'y',
                func: 'sum',
                enabled: true
              }
            ]
          }
        ]
      }
    ],
    layout: { title: 'Expenses by month' }
  };

  constructor(httpService: HTTPControllerService) {
    this.httpService = httpService;
    // this.expenseCatArrObs = this.httpService.categoryArr;
    this.expenseArr = httpService.expenseArr;
    this.categoryExpenseMap = new Map<string, DrillDownExpense[]>();
    this.monthExpenseMap = new Map<string, DrillDownExpense[]>();
    this.description = '';
    this.amount = 0.0;
    this.clearProperties();
  }

  clearProperties() {
    this.dateArr = [];
    this.expenseValArr = [];
    this.categoryArr = [];
    this.monthArr = [];
    this.categoryExpenseMap.clear();
    this.monthExpenseMap.clear();
    this.drillExpenseArr = [];
  }

  ngOnInit() {
    // subscribe expenseArr
    this.httpService.expenseArr.subscribe((data: Expense[]) => {
      let tempDate: Date;
      let monthStr: string;
      this.clearProperties();
      data.forEach(element => {
        tempDate = new Date(element.date);
        monthStr =
          tempDate.getFullYear() + ' ' + this.monthNames[tempDate.getMonth()];
        this.dateArr.push(tempDate);
        this.expenseValArr.push(element.owed_share);
        this.categoryArr.push(element.category);
        this.monthArr.push(monthStr);

        // setup map for drill down
        const drillDownExpense = new DrillDownExpense();
        drillDownExpense.userName = this.getUserName(element.user_id);
        drillDownExpense.owedShare = element.owed_share;
        drillDownExpense.date = tempDate;
        drillDownExpense.category = element.category;

        const catExpenseArr = this.categoryExpenseMap.get(element.category);
        if (!catExpenseArr) {
          this.categoryExpenseMap.set(element.category, [drillDownExpense]);
        } else {
          catExpenseArr.push(drillDownExpense);
        }

        const monthExpenseArr = this.monthExpenseMap.get(monthStr);
        if (!monthExpenseArr) {
          this.monthExpenseMap.set(monthStr, [drillDownExpense]);
        } else {
          monthExpenseArr.push(drillDownExpense);
        }
      });

      this.expenseByCategory.data[0].x = this.categoryArr;
      this.expenseByCategory.data[0].y = this.expenseValArr;
      this.expenseByCategory.data[0].transforms[0].groups = this.categoryArr;

      this.expenseByMonth.data[0].x = this.monthArr;
      this.expenseByMonth.data[0].y = this.expenseValArr;
      this.expenseByMonth.data[0].transforms[0].groups = this.monthArr;
    });

    // subscribe userArr
    this.httpService.userArr.subscribe((data: User[]) => {
      this.userArr = data;
    });

    // subscribe expenseCatArr;
    this.httpService.categoryArr.subscribe((data: Category[]) => {
      this.expenseCatArr = data;
    });

    // subscribe selected group
    this.httpService.selectedGroup.subscribe((data: Group) => {
      this.selectedGroup = data;
    });
  }

  getUserName(userID: number): string {
    if (!userID) {
      return '';
    }
    for (const user of this.userArr) {
      if (user.id === userID) {
        return user.first_name;
      }
    }
    return '';
  }

  /**
   * graph click event
   * @param data from click event
   */
  categoryGraphDrillDown(data) {
    if (!data) {
      return;
    }
    if (Array.isArray(data.points) && data.points[0].x !== '') {
      this.drillExpenseArr = this.categoryExpenseMap.get(data.points[0].x);
    }
  }

  /**
   *
   * @param data from click event
   */
  monthGraphDrillDown(data) {
    if (!data) {
      return;
    }
    if (Array.isArray(data.points) && data.points[0].x !== '') {
      this.drillExpenseArr = this.monthExpenseMap.get(data.points[0].x);
    }
  }


}
