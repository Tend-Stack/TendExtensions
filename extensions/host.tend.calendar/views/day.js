import { createTimeGridView } from './time-grid.js';

export function createDayView(ctx) {
  return createTimeGridView(ctx, { dayCount: 1 });
}
