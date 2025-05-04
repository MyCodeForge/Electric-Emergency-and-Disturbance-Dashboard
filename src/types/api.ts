export interface DisturbanceEvent {
    month?: string;
    date_event_began?: string;
    time_event_began?: string;
    date_of_restoration?: string;
    time_of_restoration?: string;
    area_affected?: string;
    nerc_region?: string;
    alert_criteria?: string;
    event_type?: string;
    demand_loss_in_mw?: string;
    customers_affected?: number;
    year?: number; 
  }
  
  export interface ErrorResponse {
    code: string;
    message: string;
  }
  
  export interface SummaryMetrics {
    average?: number;
    min?: number;
    max?: number;
  }
  
  export interface AffectedAreaSummary {
    area?: string;
    event_count?: number;
  }
  
  export interface RegionSummary {
    from_date?: string;
    to_date?: string;
    total_events?: number;
    demand_loss_in_mw?: SummaryMetrics;
    customers_affected?: SummaryMetrics;
    event_types?: string[];
    average_downtime?: number;
    downtime_unit?: string;
    affected_areas?: AffectedAreaSummary[];
    no_events?: boolean;
  }