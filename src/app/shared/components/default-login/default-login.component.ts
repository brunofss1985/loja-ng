import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/authService/auth.service';

@Component({
  selector: 'app-default-login',
  templateUrl: './default-login.component.html',
  styleUrls: ['./default-login.component.scss'],
})
export class DefaultLoginComponent implements OnInit {
  showMain!: boolean;

  constructor(public auth: AuthService) {
    this.showMain = this.auth.isAuthenticated();
  }

  @Input() showInpuText: boolean = true;
  @Input() labelName: string = '';

  @Input() tittleMain: string = '';
  @Input() textMain: string = '';

  @Input() OneInputLabelName: string = '';
  @Input() placeHolderName: string = '';

  ngOnInit(): void {}
}
