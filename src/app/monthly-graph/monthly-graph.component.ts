import { Component, OnInit } from '@angular/core';
import { HTTPControllerService } from '../httpcontroller.service';
import { Observable } from 'rxjs';
import { Expense} from '../httpcontroller.service';


@Component({
  selector: 'app-monthly-graph',
  templateUrl: './monthly-graph.component.html',
  styleUrls: ['./monthly-graph.component.css']
})
export class MonthlyGraphComponent implements OnInit {
  httpService: HTTPControllerService;

  //expense
  public expenseArr: Observable<Expense[]>;

  //date
  public dateArr: Date[];

  //date with month start date
  public monthArr: string[];

  //expense
  public expenseValArr: Number[];

  //category
  public categoryArr: string[];

  //monthNames
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

  public expenseByCategory = {
    data: [
        { x: [], y: [], type: 'bar', marker: {color: 'cornflowerblue'} ,
          transforms: [{
            type: 'aggregate',
            groups: [],
            aggregations: [{
              target: 'y', func: 'sum', enabled: true
            }]
          }]
      },
    ],
    layout: { title: 'Expenses by category'}
  };


  public expenseByMonth = {
    data: [
        { x: [], y: [], type: 'bar', marker: {color: 'cornflowerblue'} ,
          transforms: [{
            type: 'aggregate',
            groups: [],
            aggregations: [{
              target: 'y', func: 'sum', enabled: true
            }]
          }]
      },
    ],
    layout: { title: 'Expenses by month'}
  };



  constructor(httpService: HTTPControllerService) {
    this.httpService = httpService;
    this.expenseArr = httpService.expenseArr;
    this.clearProperties();
  }

  clearProperties(){
    this.dateArr = [];
    this.expenseValArr = [];
    this.categoryArr = [];
    this.monthArr = [];
  }

  ngOnInit() {
    this.httpService.expenseArr.subscribe((data: Expense[]) => {
      let tempDate: Date;
      this.clearProperties();
      data.forEach(element => {
        tempDate = new Date(element.date);
        this.dateArr.push(tempDate);
        this.expenseValArr.push(element.owed_share);
        this.categoryArr.push(element.category);
        this.monthArr.push(tempDate.getFullYear() + ' ' + this.monthNames[tempDate.getMonth()]);
      });


      this.expenseByCategory.data[0].x = this.categoryArr;
      this.expenseByCategory.data[0].y = this.expenseValArr;
      this.expenseByCategory.data[0].transforms[0].groups = this.categoryArr;

      this.expenseByMonth.data[0].x = this.monthArr;
      this.expenseByMonth.data[0].y = this.expenseValArr;
      this.expenseByMonth.data[0].transforms[0].groups = this.monthArr;

    });


  }



}
