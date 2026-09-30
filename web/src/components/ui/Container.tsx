import clsx from "clsx";

export default function Container({
  children,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <As className={clsx("mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </As>
  );
}
