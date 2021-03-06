import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Output()
  public emitCancel = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onCancel() {
    this.emitCancel.emit();
  }
}
