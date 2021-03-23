import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class HomeAuthService implements  CanActivate{
    private API_URL="http://127.0.0.1:5000";
    panRequest = new Subject<void>();
     panComplete = new Subject<void>();
    wonderCoordinates!:any;
    view:any=null;

    constructor(private http: HttpClient,private router:Router) {
    }

    panToWonder(wonderCoordinates1:any) {
      this.wonderCoordinates = wonderCoordinates1;
      this.panRequest.next();
    }

    panToWonderComplete() {
      this.panComplete.next();
    }
    
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean>|Promise<boolean>|boolean {
      
      return this.isLogged().pipe(map((data:any)=>{
        if(data.body.userid <0)
        {
          this.router.navigate(['login']);
          return false
        }
        else{
          return true
        }
      }));
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
    
    erroHandler(error: HttpErrorResponse | any) {
      return throwError(error.message || 'server Error');
    }
    setView(v:any){
      this.view=v;
    }
    panMap(coordinates:any) {
      this.view.goTo(coordinates)
      .then(() => {
        this.view.zoom = 18;
        setTimeout(() => {
          this.panToWonderComplete();
        }, 2000);
      });
    }
  }