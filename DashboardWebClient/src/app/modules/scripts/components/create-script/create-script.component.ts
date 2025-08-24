import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ScriptsService } from '../../shared/scripts.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-create-script',
  templateUrl: './create-script.component.html',
  styleUrl: './create-script.component.css'
})
export class CreateScriptComponent implements OnInit {
  createScriptForm!: FormGroup;
  isCreating: boolean = false;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private fb: FormBuilder, private scriptsService: ScriptsService) { }

  ngOnInit() {
    this.defaultCreateScriptForm();
  }

  create() {
    this.scriptsService.addScriptNote(this.createScriptForm.value).subscribe({
      next: result => {
        this.creating(false);
        this.scriptsService.changeScriptData$.next(true);
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  removeField(id: number) {
    const exercises = this.createScriptForm.get('descriptions') as FormArray;
    exercises.removeAt(id);
  }

  get fields() {
    return this.createScriptForm.get('descriptions') as FormArray;
  }

  createField(): FormGroup {
    return this.fb.group({
      description: [''],
      position: this.lastPosition + 1
    })
  }

  get lastPosition() {
    const descriptions = this.createScriptForm.get('descriptions') as FormArray;
    return descriptions.length;
  }

  creating(isCreating: boolean) {
    this.isCreating = isCreating;
  }

  defaultCreateScriptForm() {
    this.createScriptForm = this.fb.group({
      title: [''],
      descriptions: this.fb.array([])
    })
  }

  addField() {
    const formGroup = this.createField();
    const exercises = this.createScriptForm.get('descriptions') as FormArray;
    exercises.push(formGroup);
  }
}
