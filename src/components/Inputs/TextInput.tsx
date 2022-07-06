import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useState,
} from "react";

interface InputProps {
  label?: string;
  desc?: string;
  error?: string;
  id: string;
  className?: string;
}

const TextInput = forwardRef<
  HTMLInputElement,
  InputProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>((props, ref) => {
  return (
    <div className="my-4">
      {props.label && (
        <label
          htmlFor={props.id}
          className="block text-md font-medium text-white"
        >
          {props.label}
        </label>
      )}
      {props.desc && (
        <p className="text-gray-500 dark:text-gray-400 text-xs">{props.desc}</p>
      )}

      <div className="mt-2 flex rounded-md shadow-sm">
        <input {...props} ref={ref} id={props.id} className={props.className} />
      </div>

      {props.error && (
        <p className="mt-2 text-sm text-red-600">{props.error}</p>
      )}
    </div>
  );
});

TextInput.displayName = "@components/TextInput";

export default TextInput;
