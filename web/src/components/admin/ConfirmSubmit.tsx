"use client";

export default function ConfirmSubmit({
  label,
  confirmText,
  className,
}: {
  label: string;
  confirmText: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className={className}
    >
      {label}
    </button>
  );
}
