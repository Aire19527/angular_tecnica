import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { CompanyModel } from '../../models/company.model';
import { TypeIdentificationModel } from 'src/app/models/typeIdentification.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  idEmpresa;
  company: CompanyModel;
  buscarCompany: boolean = true;
  visible: boolean = true;
  typeIdentification: TypeIdentificationModel[];
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  _keyUp(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  buscarEmpresa(form: NgForm) {
    console.log('ejecuta');
    if (form.invalid) { return; }
    Swal.fire({
      allowOutsideClick: false,
      title: 'Cargando información',
      text: 'Espere por favor ...',
      icon: 'info',
      confirmButtonText: 'OK'
    });

    Swal.showLoading();

    var consultarIdentificacion = this.auth.getAllTypeIdentification().subscribe((resp: TypeIdentificationModel[]) => {
      this.typeIdentification = resp;
      this.typeIdentification.unshift({
        description: '[Seleccione un tipo de Identificación]',
        idTypeIdentification: 0
      });
      this.auth.searchCompany(this.idEmpresa).subscribe((resp: CompanyModel) => {
        this.company = resp;
        this.buscarCompany = !this.buscarCompany;
        this.onChange(this.company.identificationType);
        Swal.close();
      }, (err) => {
        console.log(err);
        if (err.status == 400) {
          Swal.fire({
            allowOutsideClick: false,
            title: 'Alerta!',
            text: err.error.message,
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: 'Oops!',
            text: 'Ha ocurrido un error interno',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }, (err) => {
      console.log(err);
      if (err.status == 400) {
        Swal.fire({
          allowOutsideClick: false,
          title: 'Alerta!',
          text: err.error.message,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          allowOutsideClick: false,
          title: 'Oops!',
          text: 'Ha ocurrido un error interno',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

    });
  }

  actualizarEmpresa(form: NgForm) {
    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      title: 'Actualizando información',
      text: 'Espere por favor ...',
      icon: 'info',
      confirmButtonText: 'OK'
    });

    console.log(this.company);
  
    Swal.showLoading();
    this.auth.updateCompany(this.limpiarCampos(this.company)).subscribe((resp:any) => {
      console.log(resp);
      Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        title: 'Genial!',
        text: resp.message,
        icon: 'success',
        confirmButtonText: 'OK'
      });
     
    }, (err) => {
      console.log(err);
      console.log(err);
      if (err.status == 400) {
        Swal.fire({
          allowOutsideClick: false,
          title: 'Alerta!',
          text: err.error.message,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          allowOutsideClick: false,
          title: 'Oops!',
          text: 'Ha ocurrido un error interno',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

    });
  }

  onChange(value: number) {
    if (value == 1 || value == 3) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  limpiarCampos(company: CompanyModel) {
    if (this.visible) {
      company.firstName = "";
      company.secondName = "";
      company.fisrtLastName = "";
      company.secondLastName = "";
    }
    else {
      company.companyName = "";
    }
    company.identificationType=Number(company.identificationType);
    return company;
  }


}





