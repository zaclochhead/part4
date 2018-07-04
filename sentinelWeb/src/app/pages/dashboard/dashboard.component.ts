import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @ViewChild("multiChart") multiChart; 
  public topOne = 33.2;
  public heightTwo = 54.2;
  public topTwo = 47;
  public year;
  public endYear;
  public month;
  public endMonth;
  public DateMetric = "Weekly";
  public date;
  public weekCount = 0;
  public endDate;
  public fullDate;
  public endFullDate; 
  public fullCurrentDate;
  public currentDate;
  public currentMonth;
  public currentYear; 
  public dayCount = 0;
  public yearCount = 0;
  public tankPercentage = 100;
  public remainingWater = 5000;
  public totalWater = 5000;
  type = 'week';
  types = ['day', 'week', 'year'];
  // 1 for day, 2 for week and 3 for month
  public dateSetting = 2; 
  constructor(){
      this.getPreviousMonday();
      this.getNextSunday();
      this.getCurrentDate();
      this.fullDate = this.date + "-" + this.month + "-" + this.year;
      this.endFullDate = this.endDate + "-" + this.endMonth + "-" + this.endYear;  
      this.fullCurrentDate = this.currentDate + "-" + this.currentMonth + "-" + this.currentYear; 
  }


  public getPreviousMonday()
  {
      var date = new Date();
      var day = date.getDay();
      var prevMonday;
      var offset;
      // if the current date is a monday
      if(date.getDay() == 1){
        prevMonday  =  new Date(date.getFullYear(), date.getMonth(), date.getDate() - this.weekCount*7);  
        this.year = prevMonday.getFullYear();
          this.month = prevMonday.getMonth()+1;
          this.month = (("0" + this.month).slice(-2));
          this.date = prevMonday.getDate();
          this.date = (("0" + this.date).slice(-2));
      }
      else{
          if(day!=0){
            offset = 1-day;
          }
          else{
            offset = 6;
          }
          prevMonday  =  new Date(date.getFullYear(), date.getMonth(), date.getDate() - this.weekCount*7 - offset);  
          this.year = prevMonday.getFullYear();
          this.month = prevMonday.getMonth()+1;
          this.month = (("0" + this.month).slice(-2));
          this.date = prevMonday.getDate();
          this.date = (("0" + this.date).slice(-2));
      }  
  }

  public getNextSunday()
  {
      var date = new Date();
      var nextSunday;
      var day = date.getDay();
      
      //if the current date is a sunday
      if(date.getDay() === 0){
        nextSunday =  new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7*this.weekCount);         
        this.endYear = nextSunday.getFullYear();
        this.endMonth = nextSunday.getMonth()+1;
        this.endMonth = (("0" + this.endMonth).slice(-2));
        this.endDate = nextSunday.getDate();
        this.endDate = (("0" + this.endDate).slice(-2));       
      }
      else{
        nextSunday  =  new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7-day) - 7*this.weekCount);  
        this.endYear = nextSunday.getFullYear();
        this.endMonth = nextSunday.getMonth()+1;
        this.endMonth = (("0" + this.endMonth).slice(-2));
        this.endDate = nextSunday.getDate();
        this.endDate = (("0" + this.endDate).slice(-2));   
      }
  }

  public getCurrentDate()
  {
      var date = new Date();
      var current;
      //if the current date is a sunday
        current =  new Date(date.getFullYear(), date.getMonth(), date.getDate() - this.dayCount);   
        this.currentYear = current.getFullYear();
        this.currentMonth = current.getMonth()+1;
        this.currentMonth = (("0" + this.currentMonth).slice(-2));
        this.currentDate = current.getDate();
        this.currentDate = (("0" + this.currentDate).slice(-2));      
  }

  public onLeft(){
    if(this.dateSetting ===1){
      this.dayCount++; 
      this.getCurrentDate();
      this.fullCurrentDate = this.currentDate + "-" + this.currentMonth + "-" + this.currentYear;       
      if(this.dayCount === 0){ 
        this.multiChart.setCurrentDailyWaterLevels();
      }
      else{
        this.multiChart.setDailyWaterLevels(this.dayCount);
      }  
    }
    else if(this.dateSetting ===2){
      this.weekCount++; 
      this.getPreviousMonday();
      this.getNextSunday();
      this.fullDate = this.date + "-" + this.month + "-" + this.year;
      this.endFullDate = this.endDate + "-" + this.endMonth + "-" + this.endYear; 
      if(this.weekCount === 0){
        this.multiChart.setCurrentWeeklyWaterLevels();
      }
      else{
        this.multiChart.setWeeklyWaterLevels(this.weekCount);
      }
    }
    else{
      this.yearCount++; 
      this.currentYear--; 
      if(this.yearCount === 0){
        this.multiChart.setCurrentYearlyWaterLevels();
      }
      else{
        this.multiChart.setYearlyWaterLevels(this.yearCount);
      }
    }
  }


  public onRight(){
    if(this.dateSetting ===1){
      this.dayCount--; 
      this.getCurrentDate();
      this.fullCurrentDate = this.currentDate + "-" + this.currentMonth + "-" + this.currentYear;      
      if(this.dayCount === 0){ 
        this.multiChart.setCurrentDailyWaterLevels();
      }
      else{
        this.multiChart.setDailyWaterLevels(this.dayCount);
      }
    }
    else if(this.dateSetting ===2){
      this.weekCount--; 
      this.getPreviousMonday();
      this.getNextSunday();
      this.fullDate = this.date + "-" + this.month + "-" + this.year;
      this.endFullDate = this.endDate + "-" + this.endMonth + "-" + this.endYear; 
      if(this.weekCount === 0){
        this.multiChart.setCurrentWeeklyWaterLevels();
      }
      else{
        this.multiChart.setWeeklyWaterLevels(this.weekCount);
      }
    }
    else{
      this.yearCount--; 
      this.currentYear++; 
      if(this.yearCount === 0){
        this.multiChart.setCurrentYearlyWaterLevels();
      }
      else{
        this.multiChart.setYearlyWaterLevels(this.yearCount);
      }
    }   
  }

  public changeUnits(unit){
    this.type = unit;
    if(unit==='day'){
      this.dateSetting = 1;
      this.dayCount = 0;
      this.weekCount = 0;
      this.yearCount = 0;    
      this.getCurrentDate();  
      this.fullCurrentDate = this.currentDate + "-" + this.currentMonth + "-" + this.currentYear;            
      this.DateMetric = "Daily";
      this.multiChart.setCurrentDailyWaterLevels();
    }
    else if(unit==='week'){
      this.dateSetting = 2;
      this.weekCount = 0;
      this.dayCount = 0;
      this.yearCount = 0;      
      this.getNextSunday();
      this.getPreviousMonday();
      this.fullDate = this.date + "-" + this.month + "-" + this.year;
      this.endFullDate = this.endDate + "-" + this.endMonth + "-" + this.endYear;  
      this.DateMetric = "Weekly";
      this.multiChart.setCurrentWeeklyWaterLevels();      
    }
    else{
      this.dateSetting = 3;
      var current;
      var date = new Date();      
      //if the current date is a sunday
      current =  new Date(date.getFullYear(), date.getMonth(), date.getDate());         
      this.currentYear = current.getFullYear();

      this.yearCount = 0;
      this.weekCount = 0;
      this.dayCount = 0;      
      this.DateMetric = "Yearly";
      this.multiChart.setCurrentYearlyWaterLevels();      
    }
  }

  public updateWaterUsage(evt){
    this.tankPercentage = evt;
    this.heightTwo = (evt/100)*54.2;
    const heightChange = 54.2-this.heightTwo;
    this.topOne = 33.2+heightChange;
    this.topTwo = 47+heightChange;
    this.remainingWater = (evt/100) * this.totalWater;
  }
}
