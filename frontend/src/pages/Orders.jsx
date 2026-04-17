import { useState, useEffect } from 'react';
import { placeOrder, getAllOrders } from '../services/api';

export default function Orders({ addToast, onOrderPlaced }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    userEmail: '',
    skuCode: '',
    quantity: '',
    price: '',
  });

  const fetchOrders = () => {
    getAllOrders()
      .then(setOrders)
      .catch(() => addToast('Failed to fetch orders', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const order = await placeOrder({
        userEmail: form.userEmail,
        orderLineItems: [{
          skuCode: form.skuCode,
          quantity: parseInt(form.quantity),
          price: parseFloat(form.price),
        }],
      });
      addToast(`Order placed! #${order.orderNumber.slice(0, 8)}... → Kafka event sent!`, 'success');
      setForm({ userEmail: '', skuCode: '', quantity: '', price: '' });
      fetchOrders();
      if (onOrderPlaced) onOrderPlaced();
    } catch (err) {
      addToast(err.message || 'Failed to place order', 'error');
    }
    setPlacing(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <p className="page-subtitle">Place new orders and view order history</p>
      </div>

      {/* Place Order */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">🛒 Place New Order</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge tag-rest">POST /api/order</span>
            <span className="badge tag-kafka">→ Kafka</span>
          </div>
        </div>
        <form onSubmit={handlePlaceOrder}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">User Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="e.g. alice@example.com"
                value={form.userEmail}
                onChange={e => setForm({ ...form, userEmail: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">SKU Code</label>
              <input
                className="form-input"
                placeholder="e.g. SKU-100"
                value={form.skuCode}
                onChange={e => setForm({ ...form, skuCode: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="e.g. 2"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price ($)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 199.99"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-success btn-lg" type="submit" disabled={placing}>
              {placing ? <span className="spinner"></span> : '🛒'} Place Order
            </button>
          </div>
        </form>

        {/* Workflow preview */}
        <div style={{
          marginTop: 20,
          padding: 16,
          background: 'rgba(245, 158, 11, 0.05)',
          borderRadius: 12,
          border: '1px solid rgba(245, 158, 11, 0.15)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
        }}>
          <strong style={{ color: 'var(--accent-amber)' }}>⚡ Workflow:</strong>{' '}
          API Gateway → Order Service → <span className="badge tag-feign" style={{ fontSize: '0.7rem' }}>Feign</span> Inventory Check →{' '}
          <span className="badge tag-postgres" style={{ fontSize: '0.7rem' }}>PostgreSQL</span> Save →{' '}
          <span className="badge tag-kafka" style={{ fontSize: '0.7rem' }}>Kafka</span> Publish → Notification Service
        </div>
      </div>

      {/* Order List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📋 Order History</h3>
          <button className="btn btn-secondary btn-sm" onClick={fetchOrders}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ width: 30, height: 30, borderWidth: 3, borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-purple)' }}></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <div className="empty-state-text">No orders placed yet</div>
            <div className="empty-state-hint">Use the form above to place your first order</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {[...orders].reverse().map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {order.orderNumber.slice(0, 13)}...
                    </td>
                    <td>{order.userEmail}</td>
                    <td>
                      {order.orderLineItems.map((item, i) => (
                        <div key={i} style={{ fontSize: '0.85rem' }}>
                          {item.skuCode} × {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ${order.orderLineItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${order.status === 'PENDING' ? 'badge-warning' : 'badge-success'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
