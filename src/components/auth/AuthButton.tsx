import { ReactNode } from "react";

interface AuthButtonProps {
  children?: ReactNode;
  text?: string;
  isLoading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function AuthButton({
  children,
  text,
  isLoading = false,
  onClick,
  type = "submit",
  disabled = false,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-2.5 rounded-lg font-bold transition duration-200 ${
        disabled || isLoading
          ? "bg-orange-400 cursor-not-allowed text-white"
          : "bg-orange-500 text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-200"
      }`}
    >
      {isLoading ? "LOADING..." : (children ?? text)}
    </button>
  );
}