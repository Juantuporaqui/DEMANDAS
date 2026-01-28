import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '../ui/layout/AppLayout';

type AppShellProps = {
  children?: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return <AppLayout>{children ?? <Outlet />}</AppLayout>;
}

export { AppShell };
