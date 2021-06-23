import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';
import { CompanyModel } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://apitechnique20210622070657.azurewebsites.net/api/';
  //private url = ' http://localhost:8081/api/';

  userToken: string;
  //login 
  //   http://localhost:8081/api/Login/Login
  

  constructor(private http: HttpClient) {
    this.readToken();
  }

  logout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
    }
  }

  login(user: UserModel) {
    return this.http.post(`${this.url}Login/Login`, user)
      .pipe(
        map(resp => {
          this.saveToeken(resp["result"].token, resp["result"].expiration);
          return resp;
        })
      );
  }

  searchCompany(idEmpresa: number) {
    this.userToken =`Bearer ${this.readToken()}`;  
    const headers = new HttpHeaders({'Authorization': this.userToken});
    
    return this.http.get(`${this.url}Company/GetCompany?identificacionNumber=${idEmpresa.toString()}`,{headers:headers})
    .pipe(
      map(resp => {
        return resp["result"];
      })
    );
  }

  getAllTypeIdentification()
  {
    this.userToken =`Bearer ${this.readToken()}`;  
    const headers = new HttpHeaders({'Authorization': this.userToken});
    
    return this.http.get(`${this.url}/Transversal/GetAllTypeIdentification`,{headers:headers})
    .pipe(
      map(resp => {
        console.log(resp);
        return resp["result"];
      })
    );
  }
  updateCompany(company: CompanyModel) {
    this.userToken =`Bearer ${this.readToken()}`;  
    const headers = new HttpHeaders({'Authorization': this.userToken});

    return this.http.post(`${this.url}Company/UpdateCompany`, company,{headers:headers})
      .pipe(
        map(resp => {
          console.log(resp);
          return resp;
        })
      );
  }

  private saveToeken(idToken: string, expiresIn: number) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let today = new Date();
    today.setSeconds(expiresIn);
    localStorage.setItem('expiresIn', today.getTime().toString());
  }

  readToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  isAuthenticated(): boolean {
    let response: boolean = false;
    if (this.userToken.length < 2) {
      response = false;
    } else {
      const expiraIn = Number(localStorage.getItem('expiresIn'));
      const todayExpira = new Date();

      todayExpira.setTime(expiraIn);
      if (todayExpira > new Date()) {
        response = true;
      }
    }
    return response;
  }
}
