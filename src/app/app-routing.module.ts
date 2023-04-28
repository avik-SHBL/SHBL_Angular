import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './Modules/Authentication/login/login.component';
import { LayoutComponent } from './Modules/Layout/layout/layout.component';
import { DashboardComponent } from './Modules/Dashboard/dashboard/dashboard.component';
import { StoreVisitComponent } from './Modules/StoreVisit/store-visit/store-visit.component';
import { StoreVisitListComponent } from './Modules/StoreVisit/store-visit-list/store-visit-list.component';
import { RmVisitSchedularComponent } from './Modules/StoreVisit/rm-visit-schedular/rm-visit-schedular.component';
import { RmVisitScheduleConfigComponent } from './Modules/StoreVisit/rm-visit-schedule-config/rm-visit-schedule-config.component';
import { StoreVisitDetailsReportComponent } from './Modules/Report/store-visit-details-report/store-visit-details-report.component';
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
import { CanDeactivateGuard } from './Shared/candeactivate.guard';
import { StoreCategoryConfigComponent } from './Modules/StoreVisit/store-category-config/store-category-config.component';

import { DailyHygieneComponent } from './Modules/Hygiene/daily-hygiene/daily-hygiene.component';
import { ViewHygieneReportComponent } from './Modules/Hygiene/view-hygiene-report/view-hygiene-report.component';

import { NewRmSalesTargetComponent } from './Modules/StoreVisit/new-rm-sales-target/new-rm-sales-target.component';

import { ExistingRmSalesTargetComponent } from './Modules/StoreVisit/existing-rm-sales-target/existing-rm-sales-target.component';
import { NewRmSalesTargetListComponent } from './Modules/StoreVisit/new-rm-sales-target-list/new-rm-sales-target-list.component';
import { ExistingRmSalesTargetListComponent } from './Modules/StoreVisit/existing-rm-sales-target-list/existing-rm-sales-target-list.component';
import { RmDashboardComponent } from './Modules/Dashboard/rm-dashboard/rm-dashboard.component';
import { PotentialRetailerLeadsComponent } from './Modules/StoreVisit/potential-retailer-leads/potential-retailer-leads.component';


const routes: Routes = [ 
{ path: '', component:LoginComponent }, 
{ path: 'Home', component:LayoutComponent,  
children: [
{ path: 'Dashboard', component:DashboardComponent },
//---Deactivation---//
{ path: 'StoreVisit', component:StoreVisitComponent, canDeactivate: [CanDeactivateGuard] },
{ path: 'StoreVisit/:StoreVisitID', component:StoreVisitComponent, canDeactivate: [CanDeactivateGuard] },
{ path: 'StoreVisit/:StoreVisitID/:LeadID', component:StoreVisitComponent, canDeactivate: [CanDeactivateGuard] },
//---Deactivation---//
{ path: 'StoreVisit', component:StoreVisitComponent },
{ path: 'StoreVisit/:StoreVisitID', component:StoreVisitComponent },
{ path: 'StoreVisit/:StoreVisitID/:LeadID', component:StoreVisitComponent },
{ path: 'StoreVisitList', component:StoreVisitListComponent },
{ path: 'RMVisitCalendar', component:RmVisitSchedularComponent },
{ path: 'RMVisitScheduleConfig/Popup/:ROID/:ROName/:Schedule/:ScheduleDate', component:RmVisitScheduleConfigComponent },
{ path: 'GiftToRetailers', component:GiftToRetailersComponent },
{ path: 'GiftReceivedAtBranch', component:GiftReceivedAtBranchComponent },
{ path: 'GiftReceivedByRM', component:GiftReceivedByRmComponent },
{ path: 'RMWiseStoreVisitReport', component:RmWiseStoreVisitReportComponent },
{ path: 'RoVisitRouteList', component:RoVisitRouteComponent },
{ path: 'KmCalculationReport', component:KmCalculationComponent},
{ path: 'RetailershaktiSalesReport', component:RetailershaktiSalesReportComponent },
{ path: 'MemberPinAssociation', component:MemberPinAssociationComponent},
{ path: 'ModeOfTransport', component:ModeOfTransportComponent},
{ path: 'ModeOfTransportRegular', component:ModeOfTransportRegularComponent},
{ path: 'RetailerLead', component:RetailerLeadComponent},
{ path: 'RetailerLeadList', component:RetailerLeadListComponent},
{ path: 'TelecallingLeadList', component:TelecallingLeadListComponent},
{ path: 'TelecallingFollowUpList', component:TelecallingFollowupListComponent},
{ path: 'TelecallingLeadStatusList', component:TelecallingLeadStatusListComponent},
{ path: 'TelecallingStatusReport', component:TelecallingStatusReportComponent},
{ path: 'RetailerLeadsForVisit', component:RetailerLeadsForVisitComponent},
{ path: 'CommunicationSettings', component:CommunicationSettingComponent},
{ path: 'CommunicationSettings/:SettingID', component:CommunicationSettingComponent},
{ path: 'CommunicationSettingsList', component:CommunicationSettingListComponent},
{ path: 'StoreCategoryConfiguration', component:StoreCategoryConfigComponent},
{ path: 'HygieneTracker', component:DailyHygieneComponent},
{ path: 'HygieneReport', component:ViewHygieneReportComponent},
{ path: 'NewRmSalesTarget', component:NewRmSalesTargetComponent},
{ path: 'NewRmSalesTargetList', component:NewRmSalesTargetListComponent},
{ path: 'ExistingRmSalesTarget', component:ExistingRmSalesTargetComponent},
{ path: 'ExistingRmSalesTargetList', component:ExistingRmSalesTargetListComponent},
// { path: 'RM-Dashboard', component:RmDashboardComponent},
{ path: 'PotentialRetailerLeads', component:PotentialRetailerLeadsComponent}
]},
{ path: 'Report', component:LayoutComponent,  
children: [
{ path: 'StoreVisitDetailsReport', component:StoreVisitDetailsReportComponent }
]}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
