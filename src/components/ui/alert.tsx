import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>div]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300 [&>svg]:text-green-500",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 [&>svg]:text-red-500",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 [&>svg]:text-yellow-500",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300 [&>svg]:text-blue-500",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const icons = {
  default: Info,
  error: XCircle,
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
  icon?: boolean;
}

export function Alert({
  className,
  variant,
  title,
  description,
  icon = true,
  children,
  ...props
}: AlertProps) {
  const Icon = icons[variant || "default"];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon && <Icon className="h-4 w-4" />}
      <div className="flex flex-col gap-1">
        {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
        {description && <div className="text-sm [&_p]:leading-relaxed">{description}</div>}
        {children}
      </div>
    </div>
  );
} 