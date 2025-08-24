import { Component, OnInit, ViewChild } from '@angular/core';
import { ScriptNote } from '../../shared/interfaces/script-note.interface';
import { ScriptsService } from '../../shared/scripts.service';
import { Subscription } from 'rxjs';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-scripts-board',
  templateUrl: './scripts-board.component.html',
  styleUrl: './scripts-board.component.css',
})
export class ScriptsBoardComponent implements OnInit {
  scriptNotes: ScriptNote[] = [];
  changeScriptDataSubscribtion!: Subscription;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private scriptsService: ScriptsService) { }

  ngOnInit() {
    this.getScriptsData(); 
    this.changeScriptDataSubscribtion = this.scriptsService.changeScriptData$.subscribe(result => {
      if (result) {
        this.getScriptsData();
      }
    })
  }

  copyToClipboard(element: any) {
    element.select();
    document.execCommand('copy');
    element.setSelectionRange(0, 0);
  }

  deleteScriptNote(note: ScriptNote) {
    if (note.id) {
      this.scriptsService.deleteScriptNote(note.id).subscribe({
        next: result => {
          this.scriptsService.changeScriptData$.next(true);
        },
        error: err => {
          this.errorModal.openModal(err);
        }
      });
    }
  }

  getScriptsData() {
    this.scriptsService.getScriptNotes().subscribe({
      next: result => {
        if (Array.isArray(result)) {
          result.forEach(x => { x.isCollapsed = true, x.isEditing = false });
          this.scriptNotes = result;
        }
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    })
  }

  editing(note: ScriptNote) {
    note.isEditing = !note.isEditing;
  }

  collapseNote(index: number) {
    this.scriptNotes[index].isCollapsed = !this.scriptNotes[index].isCollapsed;
  }

  ngOnDestroy() {
    this.changeScriptDataSubscribtion.unsubscribe();
  }
}
