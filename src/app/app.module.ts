import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';

import { LoginComponent } from './Modules/Authentication/login/login.component';
import { DashboardComponent } from './Modules/Dashboard/dashboard/dashboard.component';
import { HeaderComponent } from './Modules/Layout/header/header.component';
import { SidebarComponent } from './Modules/Layout/sidebar/sidebar.component';
import { FooterComponent } from './Modules/Layout/footer/footer.component';
import { LayoutComponent } from './Modules/Layout/layout/layout.component';
import { StoreVisitComponent } from './Modules/StoreVisit/store-visit/store-visit.component';
import { StoreVisitListComponent } from './Modules/StoreVisit/store-visit-list/store-visit-list.component';
import { ParseJsonDatePipe } from './Shared/Pipes/parse-json-date.pipe';
import { InputJsonDatePipe } from './Shared/Pipes/input-json-date.pipe';
import { RmVisitSchedularComponent } from './Modules/StoreVisit/rm-visit-schedular/rm-visit-schedular.component';
import { RmVisitScheduleConfigComponent } from './Modules/StoreVisit/rm-visit-schedule-config/rm-visit-schedule-config.component';
import { StoreVisitDetailsReportComponent } from './Modules/Report/store-visit-details-report/store-visit-details-report.component';
import { SafePipe } from './Shared/Pipes/safe.pipe';
import { GiftToRetailersComponent } from './Modules/StoreVisit/gift-to-retailers/gift-to-retailers.component';
import { GiftReceivedAtBranchComponent } from './Modules/StoreVisit/gift-received-at-branch/gift-received-at-branch.component';
import { GiftReceivedByRmComponent } from './Modules/StoreVisit/gift-received-by-rm/gift-received-by-rm.component';
import { RmWiseStoreVisitReportComponent } from './Modules/Report/rm-wise-store-visit-report/rm-wise-store-visit-report.component';
import { RoVisitRouteComponent } from './Modules/StoreVisit/ro-visit-route/ro-visit-route.component';
import { KmCalculationComponent } from './Modules/Report/km-calculation/km-calculation.component';
import { RetailershaktiSalesReportComponent } from './Modules/Report/retailershakti-sales-report/retailershakti-sales-report.component';
import { MemberPinAssociationComponent } from './Modules/StoreVisit/member-pin-association/member-pin-association.component';
import { ModeOfTransportComponent } from './Modules/StoreVisit/mode-of-transport/mode-of-transport.component';
import { ModeOfTransportRegularComponent } from './Modules/StoreVisit/mode-of-transport-regular/mode-of-transport-regular.component';

import { RetailerLeadComponent } from './Modules/LeadMgmt/retailer-lead/retailer-lead.component';
import { RetailerLeadListComponent } from './Modules/LeadMgmt/retailer-lead-list/retailer-lead-list.component';
import { TelecallingLeadListComponent } from './Modules/LeadMgmt/telecalling-lead-list/telecalling-lead-list.component';
import { TelecallingFollowupListComponent } from './Modules/LeadMgmt/telecalling-followup-list/telecalling-followup-list.component';
import { TelecallingLeadStatusListComponent } from './Modules/LeadMgmt/telecalling-lead-status-list/telecalling-lead-status-list.component';
import { TelecallingStatusReportComponent } from './Modules/Report/telecalling-status-report/telecalling-status-report.component';
import { RetailerLeadsForVisitComponent } from './Modules/StoreVisit/retailer-leads-for-visit/retailer-leads-for-visit.component';

import { CommunicationSettingComponent } from './Modules/LeadMgmt/communication-setting/communication-setting.component';
import { CommunicationSettingListComponent } from './Modules/LeadMgmt/communication-setting-list/communication-setting-list.component';
import { StoreCategoryConfigComponent } from './Modules/StoreVisit/store-category-config/store-category-config.component';

import { DailyHygieneComponent } from './Modules/Hygiene/daily-hygiene/daily-hygiene.component';
import { ViewHygieneReportComponent } from './Modules/Hygiene/view-hygiene-report/view-hygiene-report.component';


import { environment } from '../environments/environment';
import { NewRmSalesTargetComponent } from './Modules/StoreVisit/new-rm-sales-target/new-rm-sales-target.component';
import { ExistingRmSalesTargetComponent } from './Modules/StoreVisit/existing-rm-sales-target/existing-rm-sales-target.component';
import { NewRmSalesTargetListComponent } from './Modules/StoreVisit/new-rm-sales-target-list/new-rm-sales-target-list.component';
import { ExistingRmSalesTargetListComponent } from './Modules/StoreVisit/existing-rm-sales-target-list/existing-rm-sales-target-list.component';
import { RmDashboardComponent } from './Modules/Dashboard/rm-dashboard/rm-dashboard.component';
import { PotentialRetailerLeadsComponent } from './Modules/StoreVisit/potential-retailer-leads/potential-retailer-leads.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LayoutComponent,
    StoreVisitComponent,
    StoreVisitListComponent,
    ParseJsonDatePipe,
    InputJsonDatePipe,
    RmVisitSchedularComponent,
    RmVisitScheduleConfigComponent,
    StoreVisitDetailsReportComponent,
    SafePipe,
    GiftToRetailersComponent,
    GiftReceivedAtBranchComponent,
    GiftReceivedByRmComponent,
    RmWiseStoreVisitReportComponent,
    RoVisitRouteComponent,
    KmCalculationComponent,
    RetailershaktiSalesReportComponent,
    MemberPinAssociationComponent,
    ModeOfTransportComponent,
    ModeOfTransportRegularComponent,
    RetailerLeadComponent,
    RetailerLeadListComponent,
    TelecallingLeadListComponent,
    TelecallingFollowupListComponent,
    TelecallingLeadStatusListComponent,
    TelecallingStatusReportComponent,
    RetailerLeadsForVisitComponent,
    CommunicationSettingComponent,
    CommunicationSettingListComponent,
    StoreCategoryConfigComponent,
    DailyHygieneComponent,
    ViewHygieneReportComponent,
    NewRmSalesTargetComponent,
    NewRmSalesTargetListComponent,
    ExistingRmSalesTargetComponent,
    ExistingRmSalesTargetListComponent,
    RmDashboardComponent,
    PotentialRetailerLeadsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ChartsModule   
  ],
  providers: [DatePipe, InputJsonDatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
