/* Offline unit conversion tables.
 *
 * Every category except temperature is a pure scale factor to a base
 * unit, so conversion is one multiply and one divide and the table is
 * the whole implementation. Temperature carries an offset as well, so
 * those two units get explicit to/from functions instead of a factor.
 *
 * Factors are exact where the definition is exact (an inch IS 0.0254 m
 * by international agreement, 1 lb IS 0.45359237 kg). Where the unit is
 * defined by measurement the value is the CODATA/NIST figure.
 */

const LENGTH = {
  id: 'length',
  label: 'Length',
  base: 'm',
  units: [
    { id: 'nm', label: 'Nanometre', factor: 1e-9 },
    { id: 'um', label: 'Micrometre', factor: 1e-6 },
    { id: 'mm', label: 'Millimetre', factor: 1e-3 },
    { id: 'cm', label: 'Centimetre', factor: 1e-2 },
    { id: 'm', label: 'Metre', factor: 1 },
    { id: 'km', label: 'Kilometre', factor: 1000 },
    { id: 'in', label: 'Inch', factor: 0.0254 },
    { id: 'ft', label: 'Foot', factor: 0.3048 },
    { id: 'yd', label: 'Yard', factor: 0.9144 },
    { id: 'mi', label: 'Mile', factor: 1609.344 },
    { id: 'nmi', label: 'Nautical mile', factor: 1852 },
    { id: 'ly', label: 'Light year', factor: 9.4607304725808e15 },
  ],
};

const MASS = {
  id: 'mass',
  label: 'Mass',
  base: 'kg',
  units: [
    { id: 'mg', label: 'Milligram', factor: 1e-6 },
    { id: 'g', label: 'Gram', factor: 1e-3 },
    { id: 'kg', label: 'Kilogram', factor: 1 },
    { id: 't', label: 'Tonne', factor: 1000 },
    { id: 'oz', label: 'Ounce', factor: 0.028349523125 },
    { id: 'lb', label: 'Pound', factor: 0.45359237 },
    { id: 'st', label: 'Stone', factor: 6.35029318 },
    { id: 'ton_us', label: 'Short ton (US)', factor: 907.18474 },
    { id: 'ton_uk', label: 'Long ton (UK)', factor: 1016.0469088 },
  ],
};

const AREA = {
  id: 'area',
  label: 'Area',
  base: 'm2',
  units: [
    { id: 'mm2', label: 'Square millimetre', factor: 1e-6 },
    { id: 'cm2', label: 'Square centimetre', factor: 1e-4 },
    { id: 'm2', label: 'Square metre', factor: 1 },
    { id: 'ha', label: 'Hectare', factor: 10000 },
    { id: 'km2', label: 'Square kilometre', factor: 1e6 },
    { id: 'in2', label: 'Square inch', factor: 0.00064516 },
    { id: 'ft2', label: 'Square foot', factor: 0.09290304 },
    { id: 'yd2', label: 'Square yard', factor: 0.83612736 },
    { id: 'acre', label: 'Acre', factor: 4046.8564224 },
    { id: 'mi2', label: 'Square mile', factor: 2589988.110336 },
  ],
};

const VOLUME = {
  id: 'volume',
  label: 'Volume',
  base: 'l',
  units: [
    { id: 'ml', label: 'Millilitre', factor: 1e-3 },
    { id: 'l', label: 'Litre', factor: 1 },
    { id: 'm3', label: 'Cubic metre', factor: 1000 },
    { id: 'tsp_us', label: 'Teaspoon (US)', factor: 0.00492892159375 },
    { id: 'tbsp_us', label: 'Tablespoon (US)', factor: 0.01478676478125 },
    { id: 'floz_us', label: 'Fluid ounce (US)', factor: 0.0295735295625 },
    { id: 'cup_us', label: 'Cup (US)', factor: 0.2365882365 },
    { id: 'pt_us', label: 'Pint (US)', factor: 0.473176473 },
    { id: 'qt_us', label: 'Quart (US)', factor: 0.946352946 },
    { id: 'gal_us', label: 'Gallon (US)', factor: 3.785411784 },
    { id: 'floz_uk', label: 'Fluid ounce (UK)', factor: 0.0284130625 },
    { id: 'pt_uk', label: 'Pint (UK)', factor: 0.56826125 },
    { id: 'gal_uk', label: 'Gallon (UK)', factor: 4.54609 },
  ],
};

const SPEED = {
  id: 'speed',
  label: 'Speed',
  base: 'mps',
  units: [
    { id: 'mps', label: 'Metres / second', factor: 1 },
    { id: 'kph', label: 'Kilometres / hour', factor: 1 / 3.6 },
    { id: 'mph', label: 'Miles / hour', factor: 0.44704 },
    { id: 'fps', label: 'Feet / second', factor: 0.3048 },
    { id: 'kn', label: 'Knot', factor: 1852 / 3600 },
    { id: 'mach', label: 'Mach (sea level)', factor: 340.29 },
  ],
};

const DATA = {
  id: 'data',
  label: 'Data',
  base: 'B',
  units: [
    { id: 'bit', label: 'Bit', factor: 1 / 8 },
    { id: 'B', label: 'Byte', factor: 1 },
    { id: 'kB', label: 'Kilobyte (1000)', factor: 1e3 },
    { id: 'MB', label: 'Megabyte (1000)', factor: 1e6 },
    { id: 'GB', label: 'Gigabyte (1000)', factor: 1e9 },
    { id: 'TB', label: 'Terabyte (1000)', factor: 1e12 },
    { id: 'KiB', label: 'Kibibyte (1024)', factor: 1024 },
    { id: 'MiB', label: 'Mebibyte (1024)', factor: 1024 ** 2 },
    { id: 'GiB', label: 'Gibibyte (1024)', factor: 1024 ** 3 },
    { id: 'TiB', label: 'Tebibyte (1024)', factor: 1024 ** 4 },
  ],
};

const TIME = {
  id: 'time',
  label: 'Time',
  base: 's',
  units: [
    { id: 'ms', label: 'Millisecond', factor: 1e-3 },
    { id: 's', label: 'Second', factor: 1 },
    { id: 'min', label: 'Minute', factor: 60 },
    { id: 'h', label: 'Hour', factor: 3600 },
    { id: 'd', label: 'Day', factor: 86400 },
    { id: 'wk', label: 'Week', factor: 604800 },
    { id: 'mo', label: 'Month (30 d)', factor: 2592000 },
    { id: 'yr', label: 'Year (365 d)', factor: 31536000 },
  ],
};

const ENERGY = {
  id: 'energy',
  label: 'Energy',
  base: 'J',
  units: [
    { id: 'J', label: 'Joule', factor: 1 },
    { id: 'kJ', label: 'Kilojoule', factor: 1000 },
    { id: 'cal', label: 'Calorie', factor: 4.184 },
    { id: 'kcal', label: 'Kilocalorie', factor: 4184 },
    { id: 'Wh', label: 'Watt hour', factor: 3600 },
    { id: 'kWh', label: 'Kilowatt hour', factor: 3.6e6 },
    { id: 'BTU', label: 'BTU', factor: 1055.05585262 },
  ],
};

/** Temperature is affine, not linear, so each unit converts through an
 *  explicit pair of functions with kelvin as the pivot. */
const TEMPERATURE = {
  id: 'temperature',
  label: 'Temperature',
  base: 'K',
  units: [
    { id: 'C', label: 'Celsius', toBase: (v) => v + 273.15, fromBase: (v) => v - 273.15 },
    { id: 'F', label: 'Fahrenheit', toBase: (v) => (v - 32) * (5 / 9) + 273.15, fromBase: (v) => (v - 273.15) * (9 / 5) + 32 },
    { id: 'K', label: 'Kelvin', toBase: (v) => v, fromBase: (v) => v },
    { id: 'R', label: 'Rankine', toBase: (v) => v * (5 / 9), fromBase: (v) => v * (9 / 5) },
  ],
};

export const CATEGORIES = [
  LENGTH, MASS, TEMPERATURE, AREA, VOLUME, SPEED, DATA, TIME, ENERGY,
];

export function getCategory(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? null;
}

export function getUnit(categoryId, unitId) {
  const category = getCategory(categoryId);
  return category ? category.units.find((unit) => unit.id === unitId) ?? null : null;
}

/** Convert `value` between two units of one category. Returns NaN when
 *  either unit is unknown — the caller shows "select a unit" rather
 *  than a wrong number. */
export function convert(categoryId, fromId, toId, value) {
  const from = getUnit(categoryId, fromId);
  const to = getUnit(categoryId, toId);
  if (!from || !to || !Number.isFinite(value)) return NaN;
  const base = from.toBase ? from.toBase(value) : value * from.factor;
  return to.fromBase ? to.fromBase(base) : base / to.factor;
}
