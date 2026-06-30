"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="form-field flex flex-col gap-2">
      <label className="form-field-label text-sm font-medium text-gray-700">
        {label}

        {required && (
          <span className="form-field-required ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}