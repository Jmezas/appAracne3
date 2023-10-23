import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-pv',
  templateUrl: './registrar-pv.page.html',
  styleUrls: ['./registrar-pv.page.scss'],
})
export class RegistrarPvPage implements OnInit {
  registerPVForm: FormGroup

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registerPVForm = this.formBuilder.group({
      razonSocial: [null, [Validators.required]],
      direccion: [null, [Validators.required]]
    });
  }

  submitRegisterForm() {
    
  }

}
