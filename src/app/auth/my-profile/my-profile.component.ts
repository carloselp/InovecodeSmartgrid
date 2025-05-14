import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/administrator/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
standalone: false,

  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  iduserLogado = parseInt(localStorage.getItem('userId')!);

  user!: any;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = '';

  @Input() name!: string;

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ){

  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  imageSelect(image: string | undefined){
    if(image != ""){
      return 'http://' + image;
    }else if(this.imagePreview != undefined && this.imagePreview != null && this.imagePreview != ''){
      return this.imagePreview;
    }else{
      return "https://cdn.icon-icons.com/icons2/692/PNG/512/seo-social-web-network-internet_106_icon-icons.com_61526.png";
    }
  }

  save() {

  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.save();
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }


  getUserInfo(){
    this.spinner.show();
    this.userService.get(this.iduserLogado).subscribe(
      (response: any) => {
        this.user = response;
      }
    )
  }

  toggleClick() {

  }

  editUser(){

  }
}
