const required = (value) => (value ? undefined : 'Required');
const number = (value) =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;


export { required, number };
