import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EsriMapComponent } from '../esri-map/esri-map.component';
import { AuthService} from '../services/authService'
import { HomeAuthService } from '../services/homeAuth';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator | undefined;
  userName:any='';
  cu_id:any=-1;
  displayedColumns: string[] = ['objectid', 'name', 'latitude', 'longitude','zoom'];
  dataSource:any = [];
  tableExpandedFlag:boolean=false;
  search:any='';
  currentpage: number = 1;
  pagesize: number = 5;
  totalpage:any;
  rowcount:any;
  constructor(public auth:AuthService,public router:Router, private homeAuth:HomeAuthService) { }

  ngOnInit(): void {
    this.auth.userInfo().subscribe((data:any)=>{
      this.userName=data.body.data.name;
      this.cu_id=data.body.data.id;
    });
    this.auth.tablecount().subscribe((data:any)=>{
      
      this.rowcount=data;
      
      
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
    this.auth.locationList(this.currentpage).subscribe((data:any)=>{
      if(data.body && !this.tableExpandedFlag)
      {
        
        this.tableExpandedFlag=true;
        // await this.auth.reloadDatasource();
        this.dataSource=new MatTableDataSource(data.body);
        //this.dataSource.paginator=this.paginator;
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
  first() {
    debugger;
    this.auth.locationList(this.currentpage).subscribe((data:any)=>{
      if(data.body){
        
        this.dataSource = new MatTableDataSource(data.body);
        
      }
    
  });
    this.currentpage = 1;
  }
  previous() {
    
    if (this.currentpage > 0) {
      this.currentpage = this.currentpage - 1;
      this.auth.locationList(this.currentpage).subscribe((data:any)=>{
        if(data.body){
          
          this.dataSource = new MatTableDataSource(data.body);
          
        }
      
    });
    }

  }
  next() {
    
    debugger;
    this.calcultepages();
    if (this.currentpage < this.totalpage) {

      this.currentpage = this.currentpage + 1;
      this.auth.locationList(this.currentpage).subscribe((data:any)=>{
        if(data.body){
          
          this.dataSource = new MatTableDataSource(data.body);
          
        }
      
    });
      

    }
  }
  last() {
    debugger;
    this.calcultepages();
    if (this.currentpage < this.totalpage) {
      this.currentpage = this.totalpage;
      this.auth.locationList(this.currentpage).subscribe((data:any)=>{
        if(data.body){
          
          this.dataSource = new MatTableDataSource(data.body);
          
        }
      
    });
    }

  }
  calcultepages() {

    if (this.rowcount % this.pagesize == 0) {
      this.totalpage = Math.floor(this.rowcount / this.pagesize);

    }
    else {
      this.totalpage = Math.floor((this.rowcount / this.pagesize) + 1);
    }

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
