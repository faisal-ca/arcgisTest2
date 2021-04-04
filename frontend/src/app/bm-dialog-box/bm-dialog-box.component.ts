import { Component, OnInit,Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/authService';

export interface DialogData {
  
  name: string;
}



@Component({
  selector: 'app-bm-dialog-box',
  templateUrl: './bm-dialog-box.component.html',
  styleUrls: ['./bm-dialog-box.component.css']
})
export class BmDialogBoxComponent implements OnInit {

  Edit: string | undefined;
  local_data:any;
  constructor(private authService:AuthService,private dialogRef:MatDialogRef<BmDialogBoxComponent>,
    @Inject( MAT_DIALOG_DATA)public data:DialogData) {}
     

    onNoClick(): void {
      this.dialogRef.close();
    }
    
  

  ngOnInit(): void {
  }

}
