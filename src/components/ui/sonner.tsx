"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-status-success" />
        ),
        info: (
          <InfoIcon className="size-4 text-status-info" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-status-warning" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-status-danger" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-status-neutral" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-[var(--elevation-2)] glass-panel group-[.toaster]:font-sans",
          description: "group-[.toast]:text-muted group-[.toast]:font-body",
          actionButton:
            "group-[.toast]:btn-primary group-[.toast]:px-4 group-[.toast]:py-2",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-foreground group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-md group-[.toast]:border group-[.toast]:border-border group-[.toast]:font-medium",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
