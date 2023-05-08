import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/User';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  data :User[] = [];
  userEmailFound :any
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private user:UserService, private router: Router) { 
    
   }


  ngOnInit(): void {
    this.data = this.user.getData()
  }

  onSubmit(){
    const userEmailFound = this.data?.find(element=>element.email === this.email)
    if(userEmailFound && userEmailFound.password !== this.password){
        this.error = 'Password is incorrect'
    }
    if(userEmailFound && userEmailFound.password === this.password){
      this.error = ''
      this.router.navigate(['/dashboard'])
    }
    if(!userEmailFound){
        this.error = 'This Email is not registered. Please sign in'
    }
  }

}
