import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  user: UserModel;
  recordarme: boolean = false;

  constructor(private auth: AuthService,
    private route: Router) { }

  ngOnInit() {
    this.user = new UserModel();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) { return; }
    Swal.fire({
      allowOutsideClick: false,
      title: 'Registrando información',
      text: 'Espere por favor ...',
      icon: 'info',
      confirmButtonText: 'OK'
    });
    Swal.showLoading();

    // this.auth.newRegister(this.user).subscribe(resp => {
    //   console.log(resp);
    //   Swal.close();
    //   if (this.recordarme) {
    //     localStorage.setItem('email', this.user.email);
    //   }
    //   this.route.navigateByUrl('/home');
    // }, (err) => {
    //   Swal.fire({
    //     allowOutsideClick: false,
    //     title: 'Error!',
    //     text: err.error.error.message,
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
    // });
  }
}
