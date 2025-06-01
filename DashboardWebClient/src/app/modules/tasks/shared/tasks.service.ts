import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError } from 'rxjs';
import { TaskData } from './models/task-data.model';
import { CriticalTaskData } from '../shared/interfaces/critical-task-data.interface';
import { DeveloperTaskData } from './interfaces/developer-task-data.interface';
import { multipleErrorHandler } from '../../utils/error-handlers';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public changeTaskData$ = new Subject<boolean>();
  public changeCriticalTaskData$ = new Subject<boolean>();
  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }


  addTaskData(data: FormData){
    return this.httpClient.post(this.apiUrl + '/upload', data)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  getTasks(requestDate: any): Observable<TaskData[] | string> {
    return this.httpClient.get<TaskData[]>(this.apiUrl + `/GetTasks/${requestDate}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }


  addCriticalTask(data: any) {
    return this.httpClient.post(this.apiUrl + '/AddCriticalTask', data)
    .pipe(
      result => {
        return result;
      },
      catchError(error => {
        return error;
      })
    );
  }

  editCriticalTask(data: any) {
    return this.httpClient.put(this.apiUrl + '/EditCriticalTask', data)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  getCriticalTasks(): Observable<CriticalTaskData[] | string> {
    return this.httpClient.get<CriticalTaskData[]>(this.apiUrl + '/GetCriticalTasks')
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  addDeveloperTask(data: any) {
    return this.httpClient.post(this.apiUrl + '/AddDeveloperTask', data)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  getDeveloperTasks(): Observable<DeveloperTaskData[] | string> {
    return this.httpClient.get<DeveloperTaskData[]>(this.apiUrl + '/GetDeveloperTasks')
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  editDeveloperTask(data: any) {
    return this.httpClient.put(this.apiUrl + '/EditDeveloperTask', data)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }
}
