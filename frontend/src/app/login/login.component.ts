import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService} from '../services/authService'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!:FormGroup;
  errorFlag:boolean=false;
 //git testing 3
 //git testing 11-priya
 
  constructor(public auth:AuthService,
              public fb:FormBuilder,
              public router:Router) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.auth.isLogged().subscribe((data:any)=>{
      if(data.body.userid >0)
      {
        this.router.navigate(['home']);
        this.errorFlag=false;
      }
    });
  }

  async onSubmit() {
    const username = this.form.value.username;
    const password = this.form.value.password;
    var js={"username":username,"password":password};
      this.auth.addPerson(js).subscribe((data:any)=>{
        if(data.body.logged)
        {
          this.router.navigate(['home']);
          this.errorFlag=false;
        }
        else{
          this.errorFlag=true;
        }
      });
   
  }    
}
