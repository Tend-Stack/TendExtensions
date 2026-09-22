import { createTimeGridView } from './time-grid.js';

export function createWeekView(ctx) {
  return createTimeGridView(ctx, { dayCount: 7 });
}
