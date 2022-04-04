import React from "react";

export type ButtonProps = {
  type: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
  type,
  children,
  className,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={false}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};