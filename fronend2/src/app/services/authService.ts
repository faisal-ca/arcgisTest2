import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders,HttpParams,HttpParamsOptions } from '@angular/common/http';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class AuthService implements  CanActivate{
    private API_URL="http://127.0.0.1:5000";
    constructor(private http: HttpClient,private router:Router) {
    }
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean>|Promise<boolean>|boolean {
      
      return this.isLogged().pipe(map((data:any)=>{
        if(data.body.userid >0)
        {
          this.router.navigate(['home']);
          return false
        }
        else{
          return true
        }
      }));
    }
    authPassword(user:string,pass:string)
    {
      
    }
    addPerson(person:any): Observable<any> {
      const head = new HttpHeaders({ 'content-type': 'application/json'} ); 
      const body=JSON.stringify(person);
      const httpOptions = {
        
        headers: head,
        observe: 'response'
      };
      return this.http.post(`${this.API_URL}/login`, body, {headers: head, observe: 'response'})
              .pipe(catchError(this.erroHandler));
    }
    logout(): Observable<any> {
      const head = new HttpHeaders({ 'content-type': 'application/json'} ); 
      const body="";
      const httpOptions = {
        
        headers: head,
        observe: 'response'
      };
      return this.http.post(`${this.API_URL}/logout`, body, {headers: head, observe: 'response'})
              .pipe(catchError(this.erroHandler));
    }
    

    isLogged(): Observable<any> {
      const head = new HttpHeaders({ 'content-type': 'application/json'} ); 
      const body="";
      const httpOptions = {
        
        headers: head,
        observe: 'response'
      };
      return this.http.post(`${this.API_URL}/user_id`, body, {headers: head, observe: 'response'})
              .pipe(catchError(this.erroHandler));
    }
    userInfo(): Observable<any> {
      const head = new HttpHeaders({ 'content-type': 'application/json'} ); 
      const body="";
      const httpOptions = ({
        
        headers: head,
        observe: 'response'
      });
      return this.http.post(`${this.API_URL}/user_info`, body, {headers: head, observe: 'response'})
              .pipe(catchError(this.erroHandler));
    }
    locationList(): Observable<any> {
      const head = new HttpHeaders({ 'content-type': 'application/json'} ); 
      const body="";
      const httpOptions = {
        
        headers: head,
        observe: 'response'
      };
      return this.http.post(`${this.API_URL}/viewuserloc`, body, {headers: head, observe: 'response'})
              .pipe(catchError(this.erroHandler));
    }
    erroHandler(error: HttpErrorResponse | any) {
      return throwError(error.message || 'server Error');
    }
  
  }