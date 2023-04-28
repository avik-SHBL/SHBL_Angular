import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HygieneService } from '../hygiene.service';
import { CommonFunc } from '../../../Shared/commonFunc';
import { CompressImageService } from 'src/app/Shared/compress-image.service';
import { take } from 'rxjs/operators';
import { AuthorizeService } from 'src/app/Shared/authorize.service';
import { Constants } from 'src/app/Shared/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-hygiene',
  templateUrl: './daily-hygiene.component.html',
  styleUrls: ['./daily-hygiene.component.css']
})
export class DailyHygieneComponent implements OnInit {

  displaycontent: boolean = true;
  recordExist : boolean = false;
  userRole: any;

  form: FormGroup;
  submitted = false;
  imageSrc: string;
  image: File;
  aftercomprssedImg: File;
  isloading: boolean = false;
  file: any;
  imgLoading: boolean = false;
  finalstate: boolean = false;

  constructor(private fb: FormBuilder,
    private hygieneService: HygieneService,
    private compressImage: CompressImageService,
    private authorizeService: AuthorizeService,
    private router: Router) {

    var gettoken = localStorage.getItem("token");
    if (!gettoken) {
      this.displaycontent = false;
      return
    }
  }

  ngOnInit(): void {
    this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
      (res) => {
        // console.log("res", res);
        if (!res) {
          this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitRM').subscribe(
            (res1) => {
              // console.log("res1", res1);
              if (!res1) {
                // alert('Warning! You do not have authorisation priviledges to access this page.');
                this.authorizeService.LogoutUser().subscribe(
                  (res) => {
                    console.log(res);
                  }, (err: any) => {
                    CommonFunc.handleError(err);
                  });
                localStorage.removeItem('token');
                location.href = Constants.siteURL;
              }
            }, (err: any) => {
              CommonFunc.handleError(err);
            }
          );
        }
      }, (err: any) => {
        CommonFunc.handleError(err);
      }
    );

    this.checkDuplicate();

    this.form = this.fb.group({
      Teeth_Brushed: ['', Validators.required],
      Beard_ShavedTrimmed: ['', Validators.required],
      MorningBath_Taken: ['', Validators.required],
      Hair_Combed: ['', Validators.required],
      Nails_Cleaned: ['', Validators.required],
      Deodorant_Applied: ['', Validators.required],
      CleanDress_Worn: ['', Validators.required],
      CleanShoes_worn: ['', Validators.required],
    });
  }

  checkDuplicate(){
    this.hygieneService.duplicateEntry().subscribe((res)=>{
      // console.log("res dup", res);
      if(res==1){
        this.recordExist = true;
        // this.router.navigate(['/Home/RMWiseStoreVisitReport']);
        setTimeout(() => { this.router.navigate(['/Home/RMWiseStoreVisitReport']); }, 2000);
      }else{
        if(res==0){
          this.recordExist = false;
        }
      }
    })
  }

  generateBody(){
    this.form = this.fb.group({
      Teeth_Brushed: ['', Validators.required],
      Beard_ShavedTrimmed: ['', Validators.required],
      MorningBath_Taken: ['', Validators.required],
      Hair_Combed: ['', Validators.required],
      Nails_Cleaned: ['', Validators.required],
      Deodorant_Applied: ['', Validators.required],
      CleanDress_Worn: ['', Validators.required],
      CleanShoes_worn: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.imgLoading = true;
      const [file] = event.target.files;
      this.image = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;;
        this.compressImg();
        this.imgLoading = false;
      };
    }
  }

  compressImg() {
    this.compressImage.compress(this.image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        this.aftercomprssedImg = compressedImage;
        // console.log(`Image size after compressed: ${compressedImage.size} bytes.`, this.aftercomprssedImg);
      });
  }

  submit() {
    this.finalstate = true;
    this.isloading = true;
    this.hygieneService.CapturePic(this.aftercomprssedImg).subscribe((img) => {
      // console.log(imgres.body);
      if (img.statusText == 'OK' && (img.body != null && img.body != undefined && img.body != '')) {
        let sessionstoken = localStorage.getItem('token');
        let data = { ...this.form.value, ImageUrl: img.body, SessionToken: sessionstoken };
        // console.log("final data", data);
        this.hygieneService.AddDailyHygiene(data).subscribe(
          (res: any) => {
            // console.log(res);
            // if (res) {
              alert('Record saved successfully !');
              this.form.reset();
              this.imageSrc = "";
              this.router.navigate(['/Home/RMWiseStoreVisitReport']);
            // }
            this.isloading = false;
            this.finalstate = false;
          }, (err: any) => {
            CommonFunc.handleError(err);
          }
        );
      }
    }, (err: any) => {
      CommonFunc.handleError(err);
    });

  }

}
