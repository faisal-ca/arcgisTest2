import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EsriMapComponent } from '../esri-map/esri-map.component';
import { AuthService} from '../services/authService'
import { HomeAuthService } from '../services/homeAuth';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { browser } from 'protractor';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator | undefined;
  currentPage:number=1;
  userName:any='';
  cu_id:any=-1;
  displayedColumns: string[] = ['objectid', 'name', 'latitude', 'longitude','zoom'];
  dataSource:any = [];
  tableExpandedFlag:boolean=false;
  search:any='';
  checked:boolean=false;
  constructor(public auth:AuthService,public router:Router, private homeAuth:HomeAuthService, private cookieService: CookieService ) { }

  ngOnInit(): void {
    
    this.auth.userInfo().subscribe((data:any)=>{
      this.userName=data.body.data.name;
      this.cu_id=data.body.data.id;
      this.search=AuthService.searchString;
    });
  }
  logoutClick()
  {
    this.auth.logout().subscribe((data:any)=>{
      if(!data.body.logged)
      {
        var cc=this.cookieService.getAll();
        var dd=document.cookie;
        this.cookieService.deleteAll('/', '127.0.0.1');
        
        this.router.navigate(['login']);
      }
      else{
      }
    });
  }

  profileClick()
  {
    this.auth.userInfo().subscribe((data:any)=>{
      if(data.body.data.id>0)
      {
        this.router.navigate(['profile']);
      }
    });
  }
  tableClick(){
    this.currentPage=1;
    this.auth.locationList("").subscribe(async (data:any)=>{
      if(data.body && !this.tableExpandedFlag)
      {
        
        this.checked=true;
        this.tableExpandedFlag=true;
        await this.auth.reloadDatasource(AuthService.searchString);
        this.dataSource=AuthService.dataSource;
        document.getElementById("mapDiv")!.style.width='70%';
        document.getElementById("tableDiv")!.style.width='30%';
        
        
        
      }
      else{
        this.checked=false;
        document.getElementById("tableDiv")!.style.width='0%';
        document.getElementById("mapDiv")!.style.width='100%';
        this.tableExpandedFlag=false;
        
      }
    });
  }
  decimalChecker(ele:any){
    return (Math.round(ele * 100) / 100).toFixed(2);
  }
  zoomLocation(ele:any){
    var c=[ele.longitude, ele.latitude];
    this.homeAuth.panMap(c);
  }
  decreaseClick(){
    this.auth.decreasePage();
  }
  increaseClick(){
    this.auth.increasePage();
  }
  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    AuthService.searchString=filterValue.trim().toLowerCase()
    await this.auth.reloadDatasource(AuthService.searchString);
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
export interface PeriodicElement {
  objectid:number;
  name: string;
  userid: number;
  logitude: number;
  latitude: number;
  
}
