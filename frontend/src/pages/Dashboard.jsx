import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/api';

export default function Dashboard({ notifications }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + order.orderLineItems.reduce((s, item) => s + item.price * item.quantity, 0);
  }, 0);

  const stats = [
    {
      icon: '📦',
      label: 'Inventory Endpoint',
      value: 'Active',
      color: 'rgba(16, 185, 129, 0.15)',
    },
    {
      icon: '🛒',
      label: 'Total Orders',
      value: loading ? '...' : orders.length,
      color: 'rgba(59, 130, 246, 0.15)',
    },
    {
      icon: '💰',
      label: 'Total Revenue',
      value: loading ? '...' : `$${totalRevenue.toFixed(2)}`,
      color: 'rgba(124, 58, 237, 0.15)',
    },
    {
      icon: '🔔',
      label: 'Kafka Notifications',
      value: notifications.length,
      color: 'rgba(245, 158, 11, 0.15)',
    },
  ];

  const recentOrders = orders.slice(-5).reverse();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Supply Chain Management System Overview</p>
      </div>

      <div className="stat-grid">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="two-col-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <span className="badge badge-info">{orders.length} total</span>
          </div>
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <div className="empty-state-text">No orders yet</div>
              <div className="empty-state-hint">Place your first order from the Orders page</div>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {order.orderNumber.slice(0, 8)}...
                      </td>
                      <td>{order.userEmail}</td>
                      <td>
                        <span className={`badge ${order.status === 'PENDING' ? 'badge-warning' : 'badge-success'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Kafka Notifications</h3>
            <span className="badge badge-warning">{notifications.length} received</span>
          </div>
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔔</div>
              <div className="empty-state-text">No notifications yet</div>
              <div className="empty-state-hint">Notifications appear here when orders are placed via Kafka</div>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.slice(-5).reverse().map((n, i) => (
                <div className="notification-item" key={i}>
                  <div className="notification-dot"></div>
                  <div className="notification-content">
                    <div className="notification-message">{n.message}</div>
                    <div className="notification-time">
                      {n.receivedAt ? new Date(n.receivedAt).toLocaleTimeString() : 'Just now'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
