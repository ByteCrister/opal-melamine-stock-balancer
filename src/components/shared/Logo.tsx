import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string; // For the outer container (optional)
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  // Determine styles based on size
  let gapClass = "gap-3";
  let iconSizeClass = "h-8 w-8 rounded-[10px]";
  let iconTextClass = "text-[15px]";
  let wordmarkClass = "text-[15.5px]";

  if (size === "sm") {
    gapClass = "gap-2.5";
    iconSizeClass = "h-7 w-7 rounded-[8px]";
    iconTextClass = "text-[13px]";
    wordmarkClass = "text-[14.5px]";
  } else if (size === "lg") {
    gapClass = "gap-3";
    iconSizeClass = "h-10 w-10 rounded-[12px]";
    iconTextClass = "text-[18px]";
    wordmarkClass = "text-[20px]";
  }

  return (
    <div className={cn("flex items-center", gapClass, className)}>
      <div
        className={cn(
          "flex items-center justify-center relative overflow-hidden shrink-0 transition-shadow duration-200",
          iconSizeClass
        )}
        style={{
          backgroundImage: "var(--gradient-primary-button)",
          boxShadow: "var(--glow-primary-cta)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)",
            borderRadius: "inherit",
          }}
        />
        <span
          className={cn("relative font-sans font-bold text-white tracking-tight", iconTextClass)}
        >
          O
        </span>
      </div>
      <span
        className={cn("font-sans font-medium tracking-[-0.01em] transition-colors", wordmarkClass)}
        style={{ color: "var(--text-primary)" }}
      >
        Opal
        <span className="font-semibold" style={{ color: "var(--color-crimson-400)" }}>
          Melamine
        </span>
      </span>
    </div>
  );
}
