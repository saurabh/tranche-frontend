const required = (value) => (value ? undefined : 'Required');
const number = (value) =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;
const minValue = (min) => (value) =>
  value && value <= min ? `Must be at least ${min}` : undefined;
const minValue0 = minValue(0);
const maxValue = (max) => (value) =>
  value && value >= max ? `Must be at least ${max}` : undefined;
const maxValue100 = maxValue(100);

export { required, number, minValue0, maxValue100 };
