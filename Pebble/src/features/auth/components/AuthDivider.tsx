export const AuthDivider = (): JSX.Element => {
  return (
    <div className="flex w-full items-center justify-center gap-[16px]">
      <div className="h-px flex-1 bg-[#D4D4D4]" />
      <span className="text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3]">
        또는
      </span>
      <div className="h-px flex-1 bg-[#D4D4D4]" />
    </div>
  );
};
