export default function Notifications({ notifications }) {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kafka Notifications</h1>
        <p className="page-subtitle">Real-time events consumed from Kafka topic "notificationTopic"</p>
      </div>

      {/* Kafka Pipeline Explanation */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">⚡ How Kafka Notifications Work</h3>
        </div>
        <div className="workflow-container">
          <div className="workflow-step active">
            <div className="workflow-step-icon">🛒</div>
            <div className="workflow-step-content">
              <div className="workflow-step-title">1. Order Placed</div>
              <div className="workflow-step-desc">User places an order via POST /api/order through the API Gateway</div>
              <span className="workflow-step-tag tag-rest">REST API</span>
            </div>
            <div className="workflow-step-connector"></div>
          </div>

          <div className="workflow-step active">
            <div className="workflow-step-icon">📦</div>
            <div className="workflow-step-content">
              <div className="workflow-step-title">2. Inventory Checked</div>
              <div className="workflow-step-desc">Order Service calls Inventory Service via Feign Client (service discovery via Eureka)</div>
              <span className="workflow-step-tag tag-feign">Feign Client</span>
              {' '}
              <span className="workflow-step-tag tag-eureka">Eureka</span>
            </div>
            <div className="workflow-step-connector"></div>
          </div>

          <div className="workflow-step active">
            <div className="workflow-step-icon">💾</div>
            <div className="workflow-step-content">
              <div className="workflow-step-title">3. Order Saved</div>
              <div className="workflow-step-desc">Order is persisted to PostgreSQL database (order_db on port 5433)</div>
              <span className="workflow-step-tag tag-postgres">PostgreSQL</span>
            </div>
            <div className="workflow-step-connector"></div>
          </div>

          <div className="workflow-step active">
            <div className="workflow-step-icon">📤</div>
            <div className="workflow-step-content">
              <div className="workflow-step-title">4. Kafka Event Published</div>
              <div className="workflow-step-desc">
                Order Service publishes <code style={{ background: 'rgba(245,158,11,0.15)', padding: '2px 6px', borderRadius: 4, fontSize: '0.8rem' }}>OrderPlacedEvent</code> to Kafka topic "notificationTopic"
              </div>
              <span className="workflow-step-tag tag-kafka">Kafka Producer</span>
            </div>
            <div className="workflow-step-connector"></div>
          </div>

          <div className="workflow-step active">
            <div className="workflow-step-icon">📥</div>
            <div className="workflow-step-content">
              <div className="workflow-step-title">5. Notification Service Consumes</div>
              <div className="workflow-step-desc">
                Notification Service (Kafka Consumer, group: "notification-group") receives the event asynchronously
              </div>
              <span className="workflow-step-tag tag-kafka">Kafka Consumer</span>
            </div>
            <div className="workflow-step-connector"></div>
          </div>

          <div className="workflow-step active">
            <div className="workflow-step-icon">✉️</div>
            <div className="workflow-step-content">
              <div className="workflow-step-title">6. Email Notification Sent</div>
              <div className="workflow-step-desc">Notification is processed, stored, and the event appears below proving delivery</div>
              <span className="workflow-step-tag tag-rest">GET /api/notifications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Feed */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🔔 Received Notifications</h3>
          <span className="badge badge-success">{notifications.length} consumed from Kafka</span>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No Kafka events received yet</div>
            <div className="empty-state-hint">Place an order to trigger the Kafka pipeline</div>
          </div>
        ) : (
          <div className="notification-list">
            {[...notifications].reverse().map((n, i) => (
              <div className="notification-item" key={i}>
                <div className="notification-dot"></div>
                <div className="notification-content">
                  <div className="notification-message">
                    <strong>📧 {n.userEmail}</strong> — Order #{n.orderNumber ? n.orderNumber.slice(0, 8) : '?'}...
                  </div>
                  <div className="notification-message" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {n.message}
                  </div>
                  <div className="notification-time">
                    🕐 Received at: {n.receivedAt ? new Date(n.receivedAt).toLocaleString() : 'Just now'}
                  </div>
                </div>
                <span className="badge tag-kafka" style={{ flexShrink: 0 }}>Kafka</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
