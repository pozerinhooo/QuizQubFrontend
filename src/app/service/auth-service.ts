import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppComponent} from "../app.component";
import {LoginPayloadRequestModel} from "../model/auth/login-payload-request-model";
import {UserPayloadResponseModel} from "../model/user/user-payload-response-model";
import {Observable} from "rxjs";
import {RegisterPayloadRequestModel} from "../model/auth/register-payload-request-model";
import {RegisterPayloadResponseMode} from "../model/auth/register-payload-response-mode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL : string = AppComponent.API_URL;
  constructor(private httpClient : HttpClient) {
  }

  public setRole(role : string) {
    localStorage.setItem("role", role);
  }

  public getRole() : string | null {
    return localStorage.getItem('role');
  }

  public setToken(jwtToken : string) {
    localStorage.setItem("JwtToken", jwtToken);
  }

  public getToken() : string | null {
    return localStorage.getItem('JwtToken');
  }

  public getCurrentUser() : UserPayloadResponseModel | null {
    // @ts-ignore
    return JSON.parse(localStorage.getItem('user'));
  }

  public setLoggedUser(user : UserPayloadResponseModel) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  public logout() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getToken() && this.getRole();
  }

  public authenticateUser(loginRequest : LoginPayloadRequestModel) : Observable<LoginPayloadResponseInterface> {
    return this.httpClient.post<LoginPayloadResponseInterface>(`${this.API_URL}/api/v1/auth/login`, loginRequest);
  }

  registerUser(registerPayloadRequestModel: RegisterPayloadRequestModel) : Observable<RegisterPayloadResponseMode> {
    return this.httpClient.post<RegisterPayloadResponseMode>(`${this.API_URL}/api/v1/auth/registration`, registerPayloadRequestModel);
  }
}

interface LoginPayloadResponseInterface {
  jwtToken : string,
  userPayloadResponse : UserPayloadResponseModel
}
