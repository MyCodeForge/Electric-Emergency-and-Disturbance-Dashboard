import type { DisturbanceEvent } from '../types/api';

/**
 * Validates and normalizes a numeric value, returning 0 for invalid values
 * @param value The value to validate
 * @returns A valid number or 0
 */
function validateNumericValue(value: string | number | undefined): number {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || !isFinite(numValue)) {
    return 0;
  }

  return numValue;
}

export const validationService = {
  /**
   * Validates and normalizes a DisturbanceEvent object
   * @param event The event to validate
   * @returns A validated and normalized event
   */
  validateEvent(event: DisturbanceEvent): DisturbanceEvent {
    return {
      ...event,
      demand_loss_in_mw: validateNumericValue(event.demand_loss_in_mw).toString(),
      customers_affected: validateNumericValue(event.customers_affected)
    };
  },

  /**
   * Validates and normalizes an array of DisturbanceEvent objects
   * @param events The array of events to validate
   * @returns An array of validated and normalized events
   */
  validateEvents(events: DisturbanceEvent[]): DisturbanceEvent[] {
    return events.map(event => this.validateEvent(event));
  }
}; 