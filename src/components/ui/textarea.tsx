import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className="block w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm text-gray-900 shadow-sm placeholder:text-muted-foreground focus:border-violet-500 focus:ring-violet-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder:text-muted-foreground dark:focus:border-violet-500 dark:focus:ring-violet-500"
      {...props}
    />
  );
};