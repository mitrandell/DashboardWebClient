import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ScriptNote } from '../../shared/interfaces/script-note.interface';
import { ScriptsService } from '../../shared/scripts.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-edit-script',
  templateUrl: './edit-script.component.html',
  styleUrl: './edit-script.component.css'
})
export class EditScriptComponent {
  isCreating: boolean = false;
  editScriptForm!: FormGroup;

  @Input() scriptNote!: ScriptNote;
  @Input() isEditing: boolean = false;
  @Output() editState = new EventEmitter<ScriptNote>();
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private fb: FormBuilder, private scriptsService: ScriptsService) { }

  ngOnInit() {
    this.foramtionEditData(this.scriptNote);
  }

  create() {
    this.scriptsService.editScriptNote(this.editScriptForm.value).subscribe({
      next: result => {
        this.scriptsService.changeScriptData$.next(true);
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  editing() {
    this.isEditing = !this.isEditing;
    this.editState.emit(this.scriptNote);
  }

  removeField(id: number) {
    const descriptions = this.editScriptForm.get('descriptions') as FormArray;
    descriptions.removeAt(id);
  }

  get fields() {
    return this.editScriptForm.get('descriptions') as FormArray;
  }

  createField(): FormGroup {
    return this.fb.group({
      description: [''],
      position: this.lastPosition + 1
    })
  }

  get lastPosition() {
    const descriptions = this.editScriptForm.get('descriptions') as FormArray;
    return descriptions.length;
  }

  creating(isCreating: boolean) {
    this.isCreating = isCreating;
  }

  foramtionEditData(note: ScriptNote) {
    this.editScriptForm = this.fb.group({
      id: [note.id],
      title: [note.title],
      descriptions: this.fb.array(note.descriptions.map(x => this.fb.group({
        id: x.id,
        description: x.description,
        position: x.position 
      })))
    });
  }

  addField() {
    const formGroup = this.createField();
    const descriptions = this.editScriptForm.get('descriptions') as FormArray;
    descriptions.push(formGroup);
  }
}
