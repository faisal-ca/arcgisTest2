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
  Tdata: PeriodicElement[] = [];
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator | undefined;
  currentPage:number=1;
  pagesize:number=5;
  userName:any='';
  cu_id:any=-1;
  displayedColumns: string[] = ['objectid', 'name', 'latitude', 'longitude','zoom'];
  dataSource:PeriodicElement[] = [];
  tableExpandedFlag:boolean=false;
  search:any='';
  rowcount:any;
  constructor(public auth:AuthService,public router:Router, private homeAuth:HomeAuthService) { }

  ngOnInit(): void {
    this.auth.userInfo().subscribe((data:any)=>{
      this.userName=data.body.data.name;
      this.cu_id=data.body.data.id;
      this.search=AuthService.searchString;

    });
    this.dataSource= AuthService.dataSource;
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
    this.auth.tablecount().subscribe((data: any) => {

      this.rowcount = data
      

    });
    this.currentPage=1;
    this.auth.locationList(this.currentPage,this.pagesize,"").subscribe(async (data:any)=>{
      if(data.body && !this.tableExpandedFlag)
      {
        this.Tdata = data.body.list;
        
        this.tableExpandedFlag=true;
        await this.auth.reloadDatasource(AuthService.searchString);
        

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
  paginate(event: any) {
    
    this.auth.Page(event);
    var dtata = this.dataSource;
    
  }
  pageindex(event: any) {
    
    this.auth.PageInd(event);
    
  }
  
  // decreaseClick(){
  //   this.auth.decreasePage();
  // }
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
