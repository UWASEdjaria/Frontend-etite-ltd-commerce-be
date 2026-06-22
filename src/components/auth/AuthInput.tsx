import { AuthInputProps } from "@/types/auth";
import { forwardRef} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, type, showPassword, onToggle, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="relative mb-2">
        <label htmlFor={inputId} className="block text-sm font-bold text-gray-700">
          {label}
        </label>

        <input
          {...props}
          id={inputId}
          ref={ref}
          type={showPassword ? "text" : type}
          title={label}
          className="w-full p-2 border rounded-lg border-slate-200 mt-1 text-slate-900 outline-none focus:ring-2 focus:ring-orange-700 focus:border-orange-700"
        />

        {type === "password" && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
export default AuthInput;