import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar({ notificationCount }) {
  const location = useLocation();

  const links = [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/inventory', icon: '📦', label: 'Inventory' },
    { to: '/orders', icon: '🛒', label: 'Orders' },
  ];

  const systemLinks = [
    { to: '/notifications', icon: '🔔', label: 'Notifications', badge: notificationCount },
    { to: '/architecture', icon: '🏗️', label: 'Architecture' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">⚡</div>
        <span className="sidebar-brand-text">SupplyChain</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Main</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={link.to === '/'}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-title">System</div>
        {systemLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span>{link.label}</span>
            {link.badge > 0 && <span className="sidebar-badge">{link.badge}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
