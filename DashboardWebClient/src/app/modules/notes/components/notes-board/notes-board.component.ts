import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { NotesBoardService } from '../../shared/notes-board.service';
import { Note } from '../../shared/interfaces/note.interface';
import { isObject } from 'chart.js/dist/helpers/helpers.core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-notes-board',
  templateUrl: './notes-board.component.html',
  styleUrl: './notes-board.component.css'
})
export class NotesBoardComponent {
  isCreating: boolean = false;

  positionX: number = 0;
  positionY: number = 0;
 
  content: string = '';
  notes: Note[] = [];
  changeNoteDataSubscribtion!: Subscription;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private notesBoardService: NotesBoardService) { }

  ngOnInit() {
    this.getNotes();
    this.changeNoteDataSubscribtion = this.notesBoardService.changeNoteData$.subscribe(isChangeData => {
      if (isChangeData) {
        this.getNotes();
      }
    })
  }

  creatingNote(state: boolean) {
    this.setDafultNewNoteValues();
    this.isCreating = state;
  }

  getNewPosition(event: CdkDragEnd) {
    const dragPosition = event.source.getFreeDragPosition();
    this.positionX = dragPosition.x;
    this.positionY = dragPosition.y;
  }

  getNotes() {
    this.notesBoardService.getNotes().subscribe({
      next: result => {
        if (Array.isArray(result)) {
          this.notes = result;
        }
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    })
  }

  changeNotePosition(event: CdkDragEnd, note: Note) {
    const dragPosition = event.source.getFreeDragPosition();
    note.positionX = dragPosition.x;
    note.positionY = dragPosition.y;
  }

  editNote(note: Note) {
    this.notesBoardService.putNotes(note).subscribe({
      next: result => {
        this.notesBoardService.changeNoteData$.next(true);
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    })
  }

  createNote() {
    const note: Note = {
      id: 0,
      content: this.content,
      positionX: this.positionX,
      positionY: this.positionY
    }

    this.notesBoardService.addNote(note).subscribe({
      next: result => {
        this.notesBoardService.changeNoteData$.next(true);
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    })
  }

  setDafultNewNoteValues() {
    this.positionX = 0;
    this.positionY = 0;
    this.content = '';
  }

  deleteNote(id: number) {
    this.notesBoardService.deleteNote(id).subscribe({
      next: result => {
        this.notesBoardService.changeNoteData$.next(true);
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    })
  }

}
