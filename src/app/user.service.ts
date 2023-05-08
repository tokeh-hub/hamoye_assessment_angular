import { Injectable } from '@angular/core';
import { User } from './User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userJson = localStorage.getItem('data');
  currentUser : User[] = []

  getData() {
    this.currentUser = this.userJson !== null ? JSON.parse(this.userJson) : [];
    return this.currentUser
  }
  updateData( data: User[] ) {
    this.currentUser = data;
}
  // this.currentUser = userJson !== null ? JSON.parse(userJson) : new User();
  constructor() { }

}
