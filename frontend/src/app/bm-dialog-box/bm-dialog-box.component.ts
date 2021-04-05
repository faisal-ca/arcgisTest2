import { Component, OnInit,Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/authService';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms'
import { HomeAuthService } from '../services/homeAuth';




@Component({
  selector: 'app-bm-dialog-box',
  templateUrl: './bm-dialog-box.component.html',
  styleUrls: ['./bm-dialog-box.component.css']
})
export class BmDialogBoxComponent implements OnInit {
   dataSource:any=null;
  bmForm = new FormGroup({
    
    Name: new FormControl()
  });
  constructor(private httpS:AuthService,private homeAuthService:HomeAuthService,private authService:AuthService,private dialogRef:MatDialogRef<BmDialogBoxComponent>,
    @Inject( MAT_DIALOG_DATA)public updt:any) {}
     

    onNoClick(): void {
      this.dialogRef.close();
    }
    Updatebookmark()
    {
      debugger;
      
      var bm= {"id":this.updt.data1.Id,"name":this.bmForm.value.Name};
      this.authService.updatebookmark(bm).subscribe((data:any)=>{
        debugger;
        
          alert(data.body.Message)
          this.homeAuthService.reloadBMlist(this.updt.data2)
        
        debugger;
      })
      
    }
  
    
  

  ngOnInit(): void {
    this.bmForm.setValue({Name:this.updt.data1.name});
    debugger;
  }

}
