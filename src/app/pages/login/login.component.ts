import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserModel } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel;
  recordarme: boolean = false;
  constructor(private auth: AuthService,
    private route: Router) { }

  ngOnInit() {
    this.user = new UserModel();
    if (localStorage.getItem('username')) {
      this.user.userName = localStorage.getItem('username');
      this.recordarme = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) { return; }
    Swal.fire({
      allowOutsideClick: false,
      title: 'Cargando información',
      text: 'Espere por favor ...',
      icon: 'info',
      confirmButtonText: 'OK'
    });
    Swal.showLoading();

    var result= this.auth.login(this.user).subscribe(resp => {
      console.log('Resultado');
      console.log(result);

      Swal.close();
      if (this.recordarme) {
        localStorage.setItem('username', this.user.userName);
      }
      this.route.navigateByUrl('/home');
    }, (err) => {
      console.log(err);
      if(err.status==400)
      {
        Swal.fire({
          allowOutsideClick: false,
          title: 'Alerta!',
          text: err.error.message,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }else  {
        Swal.fire({
          allowOutsideClick: false,
          title: 'Error',
          text: 'Ha ocurrido un error interno',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }   
    
    });
  }
}
