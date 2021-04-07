import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent implements OnInit {
  form!:FormGroup;
  usernameBlock:any;
  passwordBlock:any;
  optBlock:any;
  changedBlock:any;
  errorFlag:any=false;
  usernameFlag:boolean=false;
  public UserSubmitted:boolean=false;
  errorMessage: any;
  invalidPasswordFlag: boolean=false;

  constructor(public auth:AuthService,
    public fb:FormBuilder,
    public router:Router) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      passkey: ['', Validators.required],
      username: ['', Validators.required],
      confpassword: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.usernameBlock=document.getElementById("username-block");
    this.optBlock=document.getElementById("otp-block");
    this.passwordBlock=document.getElementById("password-block");
    this.changedBlock=document.getElementById("changed-block");

    this.optBlock.style.display="none";
    this.usernameBlock.style.display="block";
    this.passwordBlock.style.display="none";
    this.changedBlock.style.display="none";

    this.invalidPasswordFlag=false;

  }

  get f():any{return this.form.controls}

  onClickOTP(){
    this.UserSubmitted=true;
    if(this.form.controls.username.hasError('required'))
    {
      return;
    }
    
    this.auth.forgotPassword(this.form.value.username).subscribe((data:any)=>{
      if(data.body){
        if(data.body.success){
          this.errorFlag=false;
          this.UserSubmitted=false;

          this.optBlock.style.display="block";
          this.usernameBlock.style.display="none";
          this.passwordBlock.style.display="none";
        }
        else{
          this.errorMessage=data.body.Message
          this.errorFlag=true;
        }
      }
    });

    

  }
  onClickCheck(){
    this.UserSubmitted=true;
    if(this.form.controls.passkey.hasError('required'))
    {
      return;
    }

    this.auth.checkPasskey(this.form.value.username, this.form.value.passkey).subscribe((data:any)=>{
      if(data.body){
        if(data.body.success){
          this.errorFlag=false;
          this.UserSubmitted=false;

          this.optBlock.style.display="none";
          this.usernameBlock.style.display="none";
          this.passwordBlock.style.display="block";
        }
        else{
          this.errorMessage=data.body.Message
          this.errorFlag=true;
        }
      }
    });

    

  }

  onClickPassword(){
    this.UserSubmitted=true;
    if(this.form.controls.passkey.hasError('required'))
    {
      return;
    }
    if(this.form.value.password != this.form.value.confpassword)
    {
      this.invalidPasswordFlag=true;
      return
    }
    this.invalidPasswordFlag=false;

    this.auth.resetPassword(this.form.value.username, this.form.value.password).subscribe((data:any)=>{
      if(data.body){
        if(data.body.success){
          this.errorFlag=false;
          this.UserSubmitted=false;

          this.optBlock.style.display="none";
          this.usernameBlock.style.display="none";
          this.passwordBlock.style.display="none";
          this.changedBlock.style.display="block";
        }
        else{
          this.errorMessage=data.body.Message
          this.errorFlag=true;
        }
      }
    });
  }

}
