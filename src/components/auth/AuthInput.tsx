import { AuthInputProps } from "@/types/auth";
import { forwardRef} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, type, showPassword, onToggle, id, glass, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="relative mb-2">
        <label htmlFor={inputId} className={`block text-sm font-bold ${
        glass ? "text-white/90" : "text-slate-700"
        }`}>
          {label}
        </label>

        <input
          {...props}
          id={inputId}
          ref={ref}
          type={showPassword ? "text" : type}
          title={label}
          className={`w-full p-3 mt-1 rounded-xl outline-none transition focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${
          glass
          ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50"
          : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
          }`}
        />

        {type === "password" && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
            className={`absolute right-3 top-9 transition ${
            glass
            ? "text-white/60 hover:text-orange-400"
            : "text-slate-400 hover:text-orange-500"
            }`}
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