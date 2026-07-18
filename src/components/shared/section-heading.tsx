import { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
  action,
}: SectionHeadingProps) {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`mx-auto flex max-w-3xl flex-col gap-4 ${alignClass} ${className ?? ""}`}>
      {eyebrow ? (
        <span className="inline-flex w-fit rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
          {eyebrow}
        </span>
      ) : null}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className={`flex-1 ${align === "left" ? "text-left" : "text-center"}`}>
          <h2 className={`font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl ${titleClassName ?? ""}`}>
            {title}
          </h2>
          {description ? (
            <p className={`mt-3 text-base text-gray-600 sm:text-lg ${descriptionClassName ?? ""}`}>
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
