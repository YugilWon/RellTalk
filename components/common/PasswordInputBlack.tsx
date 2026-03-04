"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}

export default function PasswordInputBlack({
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full
          pr-12
          h-12 sm:h-14
          px-4
          rounded-xl
          border border-gray-600
          bg-gray-800
          text-white
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-indigo-500
          transition
        "
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        disabled={disabled}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          w-8 h-8 flex items-center justify-center
          text-gray-400 hover:text-indigo-500
          bg-gray-700 hover:bg-gray-600
          rounded-full
          transition
        "
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
