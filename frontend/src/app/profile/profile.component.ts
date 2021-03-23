import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userName:string='';
  cu_id:number=-1;
  email:string="";
  name:string="";
  constructor(public auth:AuthService) { }

  ngOnInit(): void {
    this.auth.userInfo().subscribe((data:any)=>{
      this.userName=data.body.data.username;
      this.cu_id=data.body.data.id;
      this.name=data.body.data.name;
      this.email=data.body.data.email;
    });
  }

}
