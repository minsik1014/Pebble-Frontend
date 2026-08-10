import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  children: ReactNode;
  dataId?: string;
}

export const AuthCard = ({
  title,
  children,
  dataId,
}: AuthCardProps): JSX.Element => {
  return (
    <div
      className="flex w-full max-w-[570px] flex-col gap-[40px] rounded-[20px] bg-white p-[24px] sm:p-[32px]"
      data-id={dataId}
    >
      <h1 className="text-[24px] font-semibold leading-[130%] tracking-[-0.24px] text-[#404040]">
        {title}
      </h1>
      {children}
    </div>
  );
};
