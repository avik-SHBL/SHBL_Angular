import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StoreVisitService } from '../store-visit.service';
import { AuthorizeService } from '../../../Shared/authorize.service';
import { Constants } from '../../../Shared/constants';
import { ParseJsonDatePipe } from '../../../Shared/Pipes/parse-json-date.pipe';
import { CommonFunc } from '../../../Shared/commonFunc';

@Component({
  selector: 'app-mode-of-transport',
  templateUrl: './mode-of-transport.component.html',
  styleUrls: ['./mode-of-transport.component.css'],
  providers: [ParseJsonDatePipe]
})
export class ModeOfTransportComponent implements OnInit {


  ModeOfTransport:string='Public';
  dt = new Date();
  page: number = 1;
  TravelDate:any;
  ModeOfTransportList:any=[];



  constructor(private storeVisitService: StoreVisitService,
    private datePipe: DatePipe,
    private parseJsonDatePipe: ParseJsonDatePipe,
    private authorizeService: AuthorizeService) { }

    ngOnInit(): void {

      this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitAdmin').subscribe(
        (res  ) => {
          // console.log(res);
          if(!res){
            this.authorizeService.AuthorizeUserByRole('RetailerShaktiStoreVisitRM').subscribe(
              (res1) => {
                // console.log(res1);
                if(!res1){
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
            }
          }, (err: any) => {
            CommonFunc.handleError(err);
          }
        );

        this.TravelDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');

        this.PopulateGrid();

      }

      Save() {
        this.storeVisitService.TransportationMode_Insert(this.ModeOfTransport,this.TravelDate).subscribe(
          (res) => {
            this.PopulateGrid();
          });
        }

        PopulateGrid() {
          this.storeVisitService.TransportationMode_List().subscribe(
            (res) => {
              // console.log(res);
              for(var i in res) {
                res[i].TravelDate = this.parseJsonDatePipe.transform(res[i].TravelDate);
              }
              this.ModeOfTransportList = res;

            }, (err: any) => {
              CommonFunc.handleError(err);
            }
          );

        }

      }
