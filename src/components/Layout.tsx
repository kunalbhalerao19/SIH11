import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[#f1f3f6] text-[#1a1a2e]">
      <Sidebar />
      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-5 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
