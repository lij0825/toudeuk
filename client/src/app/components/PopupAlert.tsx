import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PopupAlertProps {
  title: ReactNode;
  description: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const PopupAlert = ({
  title,
  description,
  className = "",
  children,
}: PopupAlertProps) => {
  return (
    <div
      className={`
          rounded-lg p-6 
          ${className}
        `}
    >
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        {title}
      </h2>
      <p className="text-lg font-medium">{description}</p>
      {children}
    </div>
  );
};
