import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-array-number',
  templateUrl: './array-number.component.html',
  styleUrls: ['./array-number.component.css']
})
export class ArrayNumberComponent implements OnInit {

  @Input() value;

  constructor() { }

  ngOnInit(): void {
  }

}
