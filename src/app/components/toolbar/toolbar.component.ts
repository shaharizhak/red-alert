import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  currentDateTime: string = '';

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);// update every second
  }

  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString();
  }
}
