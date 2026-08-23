import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f3f6' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar />
        <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
