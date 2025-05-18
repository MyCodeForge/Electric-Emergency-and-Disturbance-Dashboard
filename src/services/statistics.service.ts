import type { DisturbanceEvent, SummaryMetrics } from '../types/api';

/**
 * Validates and normalizes a numeric value, filtering out invalid and zero values
 * @param value The value to validate
 * @returns A valid number or undefined if the value should be excluded
 */
function validateNumericValue(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || !isFinite(numValue) || numValue === 0) {
    return undefined;
  }

  return numValue;
}

/**
 * Calculates summary metrics (min, max, average) for a numeric array
 * Filters out invalid values, infinities, and zeros before calculation
 */
function calculateMetrics(values: (number | undefined)[]): SummaryMetrics {
  // Filter out undefined, NaN, Infinity, and zero values
  const validValues = values.filter(val => 
    val !== undefined && !isNaN(val) && isFinite(val) && val !== 0
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
      event.demand_loss_in_mw ? validateNumericValue(event.demand_loss_in_mw) : undefined
    );
    return calculateMetrics(demandLossValues);
  },

  /**
   * Calculate metrics for customers affected
   */
  calculateCustomersAffectedMetrics(events: DisturbanceEvent[]): SummaryMetrics {
    const customerValues = events.map(event => validateNumericValue(event.customers_affected));
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