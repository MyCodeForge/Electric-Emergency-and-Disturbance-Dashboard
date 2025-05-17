import type { DisturbanceEvent, SummaryMetrics } from '../types/api';

/**
 * Calculates summary metrics (min, max, average) for a numeric array
 * Filters out invalid values and infinities before calculation
 */
function calculateMetrics(values: (number | undefined)[]): SummaryMetrics {
  // Filter out undefined, NaN, and Infinity values
  const validValues = values.filter(val => 
    val !== undefined && !isNaN(val) && isFinite(val)
  ) as number[];

  if (validValues.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0
    };
  }

  return {
    min: Math.min(...validValues),
    max: Math.max(...validValues),
    average: Number((validValues.reduce((sum, val) => sum + val, 0) / validValues.length).toFixed(2))
  };
}

export const statisticsService = {
  /**
   * Calculate metrics for demand loss in MW
   */
  calculateDemandLossMetrics(events: DisturbanceEvent[]): SummaryMetrics {
    const demandLossValues = events.map(event => 
      event.demand_loss_in_mw ? parseFloat(event.demand_loss_in_mw) : undefined
    );
    return calculateMetrics(demandLossValues);
  },

  /**
   * Calculate metrics for customers affected
   */
  calculateCustomersAffectedMetrics(events: DisturbanceEvent[]): SummaryMetrics {
    const customerValues = events.map(event => event.customers_affected);
    return calculateMetrics(customerValues);
  },

  /**
   * Calculate all metrics for the given events
   */
  calculateAllMetrics(events: DisturbanceEvent[]) {
    return {
      demand_loss_in_mw: this.calculateDemandLossMetrics(events),
      customers_affected: this.calculateCustomersAffectedMetrics(events)
    };
  }
}; 