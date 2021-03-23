import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit {
  userName: string='';
  cu_id:any=-1;
  displayedColumns: string[] = ['objectid', 'name', 'latitude', 'longitude','zoom'];
  dataSource:any = [];
  tableExpandedFlag:boolean=false;
  search:any='';
  constructor(public auth:AuthService,public router:Router) { }

  ngOnInit(): void {
    this.auth.userInfo().subscribe((data:any)=>{
      this.userName=data.body.data.name;
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

  homeClick()
  {
    this.auth.userInfo().subscribe((data:any)=>{
      if(data.body.data.id>0)
      {
        this.router.navigate(['home']);
      }
    });
  }

}
