import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from './interfaces/note.interface';
import { environment } from '../../../../environments/environment';
import { Subject, catchError } from 'rxjs';
import { multipleErrorHandler } from '../../utils/error-handlers';
 
@Injectable({
  providedIn: 'root'
})
export class NotesBoardService {
  changeNoteData$ = new Subject<boolean>();

  constructor(private httpClient: HttpClient) { }

  addNote(note: Note) {
    return this.httpClient.post(environment.apiUrl + "/notes/AddNote", note).pipe(
      result => {
        return result;
      },
      catchError(error => {
        return multipleErrorHandler(error);
      })
    );
  }

  getNotes() {
    return this.httpClient.get<Note[]>(environment.apiUrl + "/notes/GetNotes").pipe(
      result => {
        return result;
      },
      catchError(error => {
        return multipleErrorHandler(error);
      })
    );
  }

  putNotes(note: Note) {
    return this.httpClient.put(environment.apiUrl + "/notes/EditNote", note).pipe(
      result => {
        return result;
      },
      catchError(error => {
        return multipleErrorHandler(error);
      })
    );
  }

  deleteNote(id: number) {
    return this.httpClient.delete(environment.apiUrl + `/notes/DeleteNote/noteId=${id}`).pipe(
      result => {
        return result;
      },
      catchError(error => {
        return multipleErrorHandler(error);
      })
    );
  }
}
