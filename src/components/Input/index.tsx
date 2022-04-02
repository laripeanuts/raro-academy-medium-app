import React, { HTMLInputTypeAttribute } from "react";

export type InputProps = {
  name: string;
  label: string;
  placeholder?: string;
  type: HTMLInputTypeAttribute | 'textarea';
  required?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
}

export const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder = '',
  type,
  required = false,
  value,
  onChange,
}) => {
  const inputClassNames = `
    rounded-lg border border-gray-300 px-4 py-2 w-full
    block w-full p-3 mt-2
    text-gray-700 bg-gray-100 focus:bg-gray-150 focus:shadow-inner
    appearance-none focus:outline-none
  `;

  return (
    <>
      <label
        htmlFor={ name }
        className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
      >{ label }</label>
      {
        type === 'textarea' ?
          (
            <textarea
              id={ name }
              rows={ 2 }
              name={ name }
              placeholder={ placeholder }
              required={ required }
              className={ inputClassNames }
              value={ value }
              onChange={ onChange }
            /> 
          ) :
          (
            <input
              id={ name }
              type={ type }
              name={ name }
              placeholder={ placeholder }
              className={ `${inputClassNames} resize-none` }
              required={ required }
              value={ value }
              onChange={ onChange }
            />
          )
      }
    </>
  );
};