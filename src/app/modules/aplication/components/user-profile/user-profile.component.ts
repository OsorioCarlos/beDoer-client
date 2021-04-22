import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

// Services
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../../../services/authentication/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const id = Number(this.authService.getIdentification());
    this.userService.get(12).subscribe(user => {
      this.user = user['data']
      console.log(this.user)
    });
  }

}
