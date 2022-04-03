import React from "react";
import { ArticleThumbnailProps } from "../ArticleThumbnail/ArticleThumbnail.types";

export type ButtonProps = {
  type: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  addStyle?: string;
  onClickButton?: (article: ArticleThumbnailProps) => void;
};

export const Button: React.FC<ButtonProps> = ({
  type,
  children,
  addStyle,
}) => {
  const styleDefault = `
        w-full mt-6 tracking-widest
        border-b-blue-600 bg-blue-500 py-3 text-white font-bold
        hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400
      `;
  const newStyle = styleDefault + addStyle;
  return (
    <button type={type} disabled={false} className={newStyle}>
      {children}
    </button>
  );
};