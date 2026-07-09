type SidebarDividerProps = {
  visible: boolean;
};

export const SidebarDivider = ({ visible }: SidebarDividerProps): JSX.Element | null => {
  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="absolute left-[84px] top-[100px] z-20 h-[888px] w-px bg-btn-quaternary"
    />
  );
};
