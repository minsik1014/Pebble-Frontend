type ToastProps = {
  message: string;
  open?: boolean;
  className?: string;
  role?: "status" | "alert";
  "aria-live"?: "polite" | "assertive";
};

export const Toast = ({
  message,
  open = true,
  className = "",
  role = "status",
  "aria-live": ariaLive = "polite",
}: ToastProps): JSX.Element => (
  <div
    role={role}
    aria-live={ariaLive}
    className={[
      "pointer-events-none w-[376px] overflow-hidden rounded-token-s bg-fill-primary p-3 text-body-02-m text-text-onFill transition-all duration-[450ms] ease-in-out",
      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      className,
    ].join(" ")}
  >
    {message}
  </div>
);
