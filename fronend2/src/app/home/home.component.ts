import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EsriMapComponent } from '../esri-map/esri-map.component';
import { AuthService} from '../services/authService'
import { HomeAuthService } from '../services/homeAuth';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userName:any='';
  cu_id:any=-1;
  displayedColumns: string[] = ['objectid', 'name', 'latitude', 'longitude','zoom'];
  dataSource:any = [];
  tableExpandedFlag:boolean=false;
  search:any='';
  constructor(public auth:AuthService,public router:Router, private homeAuth:HomeAuthService) { }

  ngOnInit(): void {
    this.auth.userInfo().subscribe((data:any)=>{
      this.userName=data.body.data.name;
      this.cu_id=data.body.data.id;
    });
  }
  logoutClick()
  {
    this.auth.logout().subscribe((data:any)=>{
      if(!data.body.logged)
      {
        this.router.navigate(['login']);
      }
      else{
      }
    });
  }
  tableClick(){
    this.auth.locationList().subscribe((data:any)=>{
      if(data.body && !this.tableExpandedFlag)
      {
        this.tableExpandedFlag=true;
        this.dataSource=new MatTableDataSource(data.body);
        document.getElementById("mapDiv")!.style.width='70%';
        document.getElementById("tableDiv")!.style.width='30%';
      }
      else{
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
export interface PeriodicElement {
  objectid:number;
  name: string;
  userid: number;
  logitude: number;
  latitude: number;
  
}
