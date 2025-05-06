import * as React from "react"
import { DayPicker, DayPickerSingleProps } from "react-day-picker"
import { tr } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, isBefore, isAfter, startOfDay, Locale } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type CalendarProps = {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  initialFocus?: boolean;
  disabled?: (date: Date) => boolean;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: "single";
  locale?: Locale;
  fromDate?: Date;
  toDate?: Date;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  initialFocus,
  disabled,
  selected,
  onSelect,
  mode = "single",
  locale = tr,
  fromDate,
  toDate,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      mode={mode}
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 w-full",
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
        className
      )}
      disabled={disabled}
      selected={selected}
      onSelect={onSelect}
      locale={locale}
      fromDate={fromDate}
      toDate={toDate}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-1",
        caption_label: "text-sm font-medium text-gray-900 dark:text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-between",
        head_cell: "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2 justify-between",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700"
        ),
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-gray-400 dark:text-gray-500 opacity-50",
        day_disabled: "text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed hover:bg-transparent",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      weekStartsOn={1}
      formatters={{
        formatWeekdayName: (date) => {
          const day = date.toLocaleDateString('tr-TR', { weekday: 'short' });
          return day.charAt(0).toUpperCase() + day.slice(1, 3);
        },
        formatCaption: (date) => {
          const month = date.toLocaleDateString('tr-TR', { month: 'long' });
          return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + date.getFullYear();
        }
      }}
      modifiersClassNames={{
        selected: "bg-primary text-white",
        disabled: "text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed",
        today: "bg-accent text-accent-foreground font-semibold"
      }}
      initialFocus={initialFocus}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 