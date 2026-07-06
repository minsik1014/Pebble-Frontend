import React from "react";
import PlusIcon from "@/assets/icons/plus.svg?react";

type AddButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const AddButton = ({
  label,
  variant = "primary",
  className = "",
  onClick,
}: AddButtonProps) => {
  const baseClass = "h-12 flex items-center justify-center rounded-token-s shrink-0 transition-all";
  
  const variantClass = 
    variant === "primary"
      ? "bg-fill-primary hover:opacity-90 text-text-onFill"
      : "bg-btn-quaternary hover:bg-btn-pressed text-text-secondary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${className}`}
      aria-label={label}
    >
      {variant === "primary" && (
        <PlusIcon className="w-4 h-4 text-text-onFill mr-2" />
      )}
      <span className={variant === "primary" ? "text-body-02-m" : "text-body-02-m"}>
        {label}
      </span>
    </button>
  );
};
