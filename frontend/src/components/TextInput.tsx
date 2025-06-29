/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
    type?: string;
    placeholder?: string;
    styles?: string;
    label?: string;
    labelStyles?: string;
    register?: UseFormRegisterReturn;
    name: string;
    error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  }


export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({type, placeholder, styles, label, labelStyles, register, name, error}, ref) => {
    return (
        <div className="w-full flex flex-col mt-2">
            {label && (
                <p className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}>{label}</p>
            )}

            <div>
                <input type={type}
                       placeholder={placeholder}
                       name={name}
                       ref={ref}
                       className={`bg-gray-400 rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] ${styles}`}
                       {...register}
                       aria-invalid={error ? "true" : "false"}
                 />
            </div>
            {error && (
                <span className="text-xs text-[#f64949fe] mt-0.5 ml-2">{String(error)}</span>
            )}
        </div>
    )
})