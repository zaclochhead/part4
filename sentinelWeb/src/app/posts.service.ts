import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
const SERVER_URL = 'localhost:1337';//'https://sentinelbeta.azurewebsites.net';
import { Event } from './event';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class PostsService {
  private socket;
  constructor(private http: Http) { }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }


  public send(message): void {
    this.socket.emit('message', message);
  }

public onMessage(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('message', (data: any) => observer.next(data));
      });
  }

  public onLevel(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('level', (data: any) => observer.next(data));
    });
}

  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }

  public onWeek(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('weeklyWaterLevels', (data: any) => observer.next(data));
        });
    }

    public onDay(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('dailyWaterLevels', (data: any) => observer.next(data));
        });
    }

    public onYear(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('yearlyWaterLevels', (data: any) => observer.next(data));
        });
    }

  // Get all posts from the API
public getAllPosts() {
    return this.http.get('/api/posts')
      .map(res => res.json());
  }

public updateElectricity() {
    return this.http.get('/api/electricity')
      .map(res => res.json()); 
  }

public getData(){
return this.http.get('/api/get')
      .map(res => res.json());
  }
  
public storeData(level){ 
    return this.http.get('/api/store', {params: {level: level, timeID:this.getTimeID(), dateID:this.getDateID()}})
      .map(res => res.json());
  }

   
public getWeek(week){ 
    return this.http.get('/api/getWeek', {params: {week: week, dateID:this.getDateID(), daysUntilSunday:this.getDaysUntilSunday()}})
    .map(res => res.json());
  } 

  public getYear(month){ 
    return this.http.get('/api/getYear', {params: {month: month}})
    .map(res => res.json());
  } 

  public getDay(hour){ 
    return this.http.get('/api/getDay', {params: {hour: hour, timeID:this.getTimeID(), timeFormat:this.getTimeFormat(),currentTime:this.getCurrentTime()}})
    .map(res => res.json());
  } 

  public getCurrentWeek(){ 
    return this.http.get('/api/getCurrentWeek', {params:{dateID:this.getDateID()}})
    .map(res => res.json());
  } 

  public getCurrentYear(){ 
    return this.http.get('/api/getCurrentYear', {params:{timeID:this.getTimeID()}})
    .map(res => res.json());
  } 

  public getCurrentDay(){ 
    return this.http.get('/api/getCurrentDay', {params:{timeID:this.getTimeID(), timeFormat:this.getTimeFormat()}})
    .map(res => res.json());
  } 

  public getTimeID(){
    var year = new Date().getFullYear();
    var month = new Date().getMonth()+1;
    var extendedMonth = (("0" + month).slice(-2));
    var date = new Date().getDate();
    var extendedDate = (("0" + date).slice(-2));
    var hours = new Date().getHours();
    var extendedHours = (("0" + hours).slice(-2));
    var minutes = new Date().getMinutes();
    var extendedMinutes = (("0" + minutes).slice(-2));
    var seconds = new Date().getSeconds();
    var extendedSeconds = (("0" + seconds).slice(-2));
    var time = extendedHours + ':' + extendedMinutes + ':' + extendedSeconds;
    var dateID = (year + "-" + extendedMonth + "-" + extendedDate);
    var timeID = dateID + " " + time + ".000"; 
    return timeID; 
  }


  public getDateID(){
    var year = new Date().getFullYear();
    var month = new Date().getMonth()+1;
    var extendedMonth = (("0" + month).slice(-2));
    var date = new Date().getDate();
    var extendedDate = (("0" + date).slice(-2));
    var dateID = (year + "-" + extendedMonth + "-" + extendedDate);
    return dateID; 
  }

  //get the number of hours until midnight
  public getCurrentTime(){
    var currentTime = new Date().getHours()-24;
    return currentTime;
  }

  public getTimeFormat(){
    var date = new Date();
    if(date.getHours()>=12){
      return "PM";
    }
    else{
      return "AM";
    }
  }

  public getDaysUntilSunday(){
    var dayOfWeek = new Date().getDay();
    if(dayOfWeek === 0){
        dayOfWeek = 7;
    }
    const daysUntilSunday = 7-dayOfWeek;
    return daysUntilSunday;
  }
}
