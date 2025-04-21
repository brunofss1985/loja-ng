import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-default-login',
  templateUrl: './default-login.component.html',
  styleUrls: ['./default-login.component.scss']
})
export class DefaultLoginComponent implements OnInit {

  constructor() { }

  // @Input() showInpuText: boolean = true;
  @Input() labelName: string = '';

  @Input() tittleMain: string = '';
  @Input() imageMain: string = '';
  @Input() textMain: string = '';
  
  @Input() OneInputLabelName: string = '';
  @Input() placeHolderName: string = '';

  
  ngOnInit(): void {
  }

}
