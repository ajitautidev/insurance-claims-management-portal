import { Component } from '@angular/core';
import { RiskDashboard } from './components/risk-dashboard/risk-dashboard';
import { ClaimsAnalytics } from './components/claims-analytics/claims-analytics';
import { RiskOverview } from './components/risk-overview/risk-overview';
import { AdminReports } from './components/admin-reports/admin-reports';

@Component({
  selector: 'app-risk-admin',
  standalone: true,
  imports: [
    RiskDashboard,
    ClaimsAnalytics,
    RiskOverview,
    AdminReports
  ],
  templateUrl: './risk-admin.html',
  styleUrl: './risk-admin.css'
})
export class RiskAdmin {}