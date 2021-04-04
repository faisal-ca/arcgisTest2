import { Component, OnInit,Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface UsersData {
  id: number;
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
  constructor(public dialogRef: MatDialogRef<BmDialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData) {
      console.log(data);
    this.local_data = {...data};
    this.Edit = this.local_data.action;
     }

     doAction(){
      this.dialogRef.close({event:this.Edit,data:this.local_data});
    }
  
    closeDialog(){
      this.dialogRef.close({event:'Cancel'});
    }
  

  ngOnInit(): void {
  }

}
