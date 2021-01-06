import React from 'react';

const InputField = ({ input, type, className, meta: { touched, error } }) => (
    <div>
      {touched && error ? (
        <input {...input} type={type} className={`${className} InputStylingError`} />
      ) : (
        <input {...input} type={type} className={`${className} InputStyling`} />
      )}
      {touched && error && <span></span>}
    </div>
);

export default InputField;