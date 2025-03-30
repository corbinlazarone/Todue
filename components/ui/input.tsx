import { ChangeEventHandler } from "react";

interface FormInputProps {
  id: string;
  required: boolean;
  labelText: string;
  placeHolderText: string;
  type: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export function FormInput({
  id,
  required,
  labelText,
  placeHolderText,
  type,
  name,
  onChange,
}: FormInputProps) {
  return (
    <div>
      <label
        id={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {labelText}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeHolderText}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required={required}
      />
    </div>
  );
}
