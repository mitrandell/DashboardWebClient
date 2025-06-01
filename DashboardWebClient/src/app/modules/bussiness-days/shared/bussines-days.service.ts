import { Injectable } from '@angular/core';
import { BussinessDay } from './interfaces/bussiness-day.interface';
import { Observable, Subject, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { multipleErrorHandler } from '../../utils/error-handlers';

@Injectable({
  providedIn: 'root'
})
export class BussinesDaysService {

  changeBussinessDayData$= new Subject<boolean>();

  constructor(private httpClient: HttpClient) { }


  getBussinessDays(year: number, month: number): Observable<BussinessDay[] | string> {
    return this.httpClient.get<BussinessDay[]>(environment.apiUrl + `/GetBussinessDays/year=${year}&month=${month}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  getBussinessYears(): Observable<number[] | string> {
    return this.httpClient.get<number[]>(environment.apiUrl + "/GetBussinessDaysYears")
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  editBussinessDay(data: any) {
    return this.httpClient.put(environment.apiUrl + "/EditBussinessDay", data)
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
