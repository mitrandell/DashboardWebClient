import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ScriptNote } from './interfaces/script-note.interface';
import { catchError, Subject } from 'rxjs';
import { multipleErrorHandler } from '../../utils/error-handlers';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  changeScriptData$ = new Subject<boolean>();
  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  addScriptNote(scriptNote: ScriptNote) {
    return this.httpClient.post(this.apiUrl + "/scriptNotes/AddScriptNote", scriptNote)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  editScriptNote(scriptNote: ScriptNote) {
    return this.httpClient.put(this.apiUrl + "/scriptNotes/EditScriptNote", scriptNote)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  getScriptNotes() {
    return this.httpClient.get<ScriptNote[]>(this.apiUrl + "/scriptNotes/GetScriptNotes")
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  deleteScriptNote(id: number) {
    return this.httpClient.delete(environment.apiUrl + `/scriptNotes/DeleteScriptNote/noteId=${id}`).pipe(
      result => {
        return result;
      },
      catchError(error => {
        return multipleErrorHandler(error);
      })
    );
  }
}
