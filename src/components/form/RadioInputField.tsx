import { type UseFormRegister } from "react-hook-form";

type Props = {
  value: string;
  name: string;
  label: string;
  register: UseFormRegister<any>;
};

export default function RadioInputField({
  name,
  value,
  label,
  register,
}: Props) {
  return (
    <label htmlFor={label} className="flex items-center">
      <input
        type="radio"
        id={label}
        value={value}
        {...register(name, { required: `${label} is required` })}
        className="radio border-1 border-primary checked:bg-white mr-3"
      />

      {label.charAt(0).toUpperCase() + label.slice(1)}
    </label>
  );
}
