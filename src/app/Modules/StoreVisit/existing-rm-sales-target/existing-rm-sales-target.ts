export interface ExistingRMSalesTarget{
    IsDefault:number;
    MemberID:number;
    VisitType:number;
    DaysOfWork:number;
    DailyVisit:number;
    MonthlyVisit:number;
    DailyNewOrderMinimum:number;
    MonthlyNewOrderMinimum:number;
    MonthlyNewVisitCount: number;
    MonthlyExistingVisitCount: number;
    NewVisitPercentage: number;
    ExistingVisitPercentage: number;
    InactiveToActiveCount: number;
    MonthlyOnBoard:number;
    ExpectedMonthlySale:number;
    AllowPotentialRetailerVisit: number;
    AllowCategoryWiseVisit: number;
    AllowLostSale: number;
    Allow3MonthInactiveVisit: number;
    WithEffectFrom: Date;
    SessionToken: string;
    SalesTargetID:number;
}