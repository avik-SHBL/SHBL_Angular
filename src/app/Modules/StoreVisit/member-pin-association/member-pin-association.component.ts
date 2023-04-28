import { Component, OnInit } from '@angular/core';
import { StoreVisitService } from '../store-visit.service';
import { DatePipe } from '@angular/common';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-member-pin-association',
  templateUrl: './member-pin-association.component.html',
  styleUrls: ['./member-pin-association.component.css']
})
export class MemberPinAssociationComponent implements OnInit {

  RevenueOfficerList : any = [];
  RMWisePincodeList:any=[];

  Keyword : string = '';
  MemberID:any;
  Name:string='';
  PinCode:string='';
  ModalForRM: string = 'none';

  EffectDate:any;
  dt = new Date();
  Fday = new Date(this.dt.getFullYear(), 3, 1);

  constructor(private storeVisitService: StoreVisitService,
    private datePipe: DatePipe,
    private authorizeService: AuthorizeService) { }

    ngOnInit(): void {

      this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
        (res) => {
          // console.log(res);
          if(!res){
            alert('Warning! You do not have authorisation priviledges to access this page.');
            this.authorizeService.LogoutUser().subscribe(
              (res) => {
                // console.log(res);
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

        this.EffectDate = this.datePipe.transform(this.Fday,'yyyy-MM-dd');
      }

      GetRMList() {
        this.storeVisitService.GetRMList(this.Keyword).subscribe(
          (res) => {
            this.RevenueOfficerList = res;
          }, (err: any) => {
            CommonFunc.handleError(err);
          }
        );
      }

      openModalPopup() {
        this.ModalForRM = 'block';
        this.GetRMList();
      }

      closeModalPopup() {
        this.ModalForRM = 'none';
      }

      GetSelectedItem(MemberID,Name){
        this.MemberID=  MemberID;
        this.Name=Name;
        this.ModalForRM = "none";
        this.PopulateGrid();
      }

      Save() {
        if(this.Validation()) {
          this.storeVisitService.MemberPinAssociation_Insert(this.MemberID,this.PinCode,this.EffectDate).subscribe(
            (res) => {
              alert("Data saved sucessfully.");
              this.PinCode='';
              this.PopulateGrid();
            }, (err: any) => {
              CommonFunc.handleError(err);
            });
          }
        }

        PopulateGrid() {
          this.storeVisitService.GetRMWisePincodeList(this.MemberID).subscribe(
            (res) => {
              this.RMWisePincodeList = res;
            }, (err: any) => {
              CommonFunc.handleError(err);
            }
          );
        }

        Delete(PinAsssociateID: number) {

          if(confirm('Are you sure that you want to delete this record?')) {
            this.storeVisitService.DeletePinAsssociateById(PinAsssociateID).subscribe(
              (res) => {
                this.PopulateGrid();
              }, (err: any) => {
                CommonFunc.handleError(err);
              });
            }
          }

        Validation() {

          if(this.Name == '') {

            return false;
          }
          if(this.PinCode == '') {

            return false;
          }
          if(this.EffectDate == '') {

            return false;
          }
          return true;
        }


      }
