import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // login
  login(email: string, password: string) {
    // HTTP POST request
  
      // HTTP POST request
      const body = new URLSearchParams();
      body.set('username', email);
      body.set('password', password);
  
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

    return this.http.post('http://localhost:5000/app/login', body, {headers: headers, withCredentials: true});
  }

  register(user: User) {
    // HTTP POST request
    
    const body = {
      email: user.email,
      name: user.name,
      address: user.address,
      nickname: user.nickname,
      password: user.password
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post('http://localhost:5000/app/register', body, {headers: headers});
  }

  logout() {
    return this.http.post('http://localhost:5000/app/logout', {}, {withCredentials: true, responseType: 'text'});
  }

  checkAuth() {
    return this.http.get<boolean>('http://localhost:5000/app/checkAuth', {withCredentials: true});
  }
}
