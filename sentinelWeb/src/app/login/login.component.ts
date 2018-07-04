import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public error: any; 
  constructor(private router: Router) { }

  onSubmit(formData){
    if(formData.value.email === "sentinelwater@outlook.com" && formData.value.password === "Imagine18"){
        this.router.navigate(['/pages/dashboard']);
    }
    else{
      this.error = "Incorrect login";
    }
  }
  ngOnInit() {
  }

}
