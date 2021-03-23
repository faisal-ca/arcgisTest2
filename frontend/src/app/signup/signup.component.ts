import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  usernameFlag:boolean=false;
  form!:FormGroup;
  errorFlag:boolean=false;
  successFlag:boolean=false;
  public submitted:boolean=false;

  constructor(public auth:AuthService,
              public fb:FormBuilder,
              public router:Router) {  }

  ngOnInit(): void {
    this.form=this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      confpassword: ['', Validators.required],
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
  get f():any{return this.form.controls}

  onClickSignUp(){
    this.submitted=true;
    if(this.form.invalid)
    {
      return;
    }
    
    if(this.form.value.password == this.form.value.confpassword){
      var js={"name":this.form.value.name,"email":this.form.value.email,"username":this.form.value.username,"password":this.form.value.password };
      this.auth.signUpUser(js).subscribe((data:any)=>{
        this.errorFlag=false;
        if(data.body.username)
        {
          this.usernameFlag=true;
          this.successFlag=false;
        }
        else{
          this.successFlag=true;
          this.usernameFlag=false;
        }
      });
    }
    else{
      this.errorFlag=true;
    }

  }

}
