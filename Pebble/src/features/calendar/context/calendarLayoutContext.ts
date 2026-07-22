import { createContext } from "react";

import type { CalendarLayoutContextValue } from "@/features/calendar/context/CalendarLayoutProvider";

export const CalendarLayoutContext =
  createContext<CalendarLayoutContextValue | null>(null);
