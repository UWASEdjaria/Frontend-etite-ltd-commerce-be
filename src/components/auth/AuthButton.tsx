interface AuthButtonProps {
  text: string;
  isLoading?: boolean;
}

export default function AuthButton({ text, isLoading }: AuthButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-2.5 rounded-lg font-bold transition duration-200 ${
        isLoading
          ? 'bg-orange-400 cursor-not-allowed text-white'
          : 'bg-orange-700 text-white hover:bg-orange-800 focus:ring-4 focus:ring-orange-200'
      }`}
    >
      {isLoading ? "LOADING..." : text}
    </button>
  );
}