import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders,HttpParams,HttpParamsOptions } from '@angular/common/http';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Injectable({
  providedIn: 'root'
})

export class AuthService implements  CanActivate{
  
    private API_URL="http://127.0.0.1:5000";
    static dataSource:any=null;
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
    signUpUser(person:any): Observable<any> {
      const head = new HttpHeaders({ 'content-type': 'application/json'} ); 
      const body=JSON.stringify(person);
      const httpOptions = {
        
        headers: head,
        observe: 'response'
      };
      return this.http.post(`${this.API_URL}/signup`, body, {headers: head, observe: 'response'})
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
    tablecount(): Observable<any> {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    headers.append('Access-Control-Allow-Origin', 'http://localhost:5000');
    headers.append('Access-Control-Allow-Credentials', 'true');
    return this.http.get(this.API_URL + '/getcount', { headers: headers }).pipe(map(data => data))
    }
    locationList(currentpage: number): Observable<any> {
      
      var pagesize = 5;
      var skip = (currentpage - 1) * pagesize;
      
    
      const head = new HttpHeaders({ 'content-type': 'application/json'} ); 
      const body={"skip":skip,"take":pagesize};
      const httpOptions = {
        
        headers: head,
        observe: 'response'
      };
      return this.http.post(`${this.API_URL}/viewuserloc`, body, {headers: head, observe: 'response'})
              .pipe(catchError(this.erroHandler));
    }

    // reloadDatasource():any{
    //   return this.locationList().subscribe((data:any)=>{
    //     if(data.body)
    //     {
    //       if(AuthService.dataSource){
    //         AuthService.dataSource.data=data.body;
    //       }
    //       else{
    //         AuthService.dataSource=new MatTableDataSource(data.body);
    //       }
          
    //     }
    //   });
    // }
    erroHandler(error: HttpErrorResponse | any) {
      return throwError(error.message || 'server Error');
    }
  
  }