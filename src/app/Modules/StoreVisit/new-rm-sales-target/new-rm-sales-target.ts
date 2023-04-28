export interface NewRMSalesTarget{
    IsDefault:number;
    MemberID:number;
    VisitType:number;
    DaysOfWork:number;
    DailyVisit:number;
    MonthlyVisit:number;
    DailyNewOrderMinimum:number;
    MonthlyNewOrderMinimum:number;
    RetailerCount5Lakh:number;
    MonthlyOnBoard:number;
    ExpectedMonthlySale:number;
    WithEffectFrom: Date;
    SessionToken: string;
    SalesTargetID:number;
}