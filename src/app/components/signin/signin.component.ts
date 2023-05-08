import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/User';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  data : User[] = []
  email = ''
  password = ''
  emailError = ''
  passwordError = ''
  confirmPassword = ''

  constructor(private user:UserService, private router:Router) { }

  ngOnInit(): void {
     this.data = this.user.getData()
  }

  onSubmit(){
    this.emailError = ''
    this.passwordError = ''
    const userDetails = {email:this.email,password:this.password}
    var emailFound = this.data?.find(element=>element.email === this.email)
      if(emailFound){
        this.passwordError = '';
        this.emailError = 'User is registered. Please Login'
      }
      if(this.password !== this.confirmPassword){
        this.emailError='';
        this.passwordError='Your passwords are not the same'
      }
      if(this.password === this.confirmPassword && !emailFound){
        this.data.push(userDetails)
        localStorage.setItem('data',JSON.stringify(this.data))
        this.user.updateData(this.data)
        // toast('Sign In Successful!')
        this.router.navigate(['/'])
        
      }
  }
  

}
