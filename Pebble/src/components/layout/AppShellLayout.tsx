import { type ReactNode } from "react";

import {
  APP_SHELL_GAP_CLASS,
  APP_SHELL_MAX_HEIGHT_CLASS,
  APP_SHELL_MAX_WIDTH_CLASS,
  APP_SHELL_PADDING_CLASS,
} from "@/components/layout/layoutTokens";

type AppShellLayoutProps = {
  sidePanel: ReactNode;
  children: ReactNode;
};

export const AppShellLayout = ({
  sidePanel,
  children,
}: AppShellLayoutProps): JSX.Element => (
  <main
    className={`flex h-screen w-screen items-center justify-center overflow-hidden bg-fill-surface ${APP_SHELL_PADDING_CLASS}`}
  >
    <div
      className={`flex h-full ${APP_SHELL_MAX_HEIGHT_CLASS} min-h-0 w-full ${APP_SHELL_MAX_WIDTH_CLASS} min-w-0 ${APP_SHELL_GAP_CLASS}`}
    >
      {sidePanel}

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  </main>
);
