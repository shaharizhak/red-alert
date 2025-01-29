import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alarm-dialog',
  templateUrl: './alarm-dialog.component.html',
  styleUrls: ['./alarm-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule,CommonModule]
})
export class AlarmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { key: string, timestamps: string[] }) { }

}
