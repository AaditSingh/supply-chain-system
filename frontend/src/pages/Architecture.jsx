export default function Architecture() {
  const services = [
    {
      icon: '🌐',
      name: 'API Gateway',
      port: ':8080',
      desc: 'Routes all requests to microservices',
      tech: 'Spring Cloud Gateway (WebMVC)',
      tags: [{ label: 'Gateway', className: 'tag-rest' }],
    },
    {
      icon: '🔍',
      name: 'Discovery Server',
      port: ':8761',
      desc: 'Service registry for all microservices',
      tech: 'Netflix Eureka',
      tags: [{ label: 'Eureka', className: 'tag-eureka' }],
    },
    {
      icon: '📦',
      name: 'Inventory Service',
      port: ':8081',
      desc: 'Manages products and stock levels',
      tech: 'Spring Boot + PostgreSQL',
      tags: [{ label: 'REST', className: 'tag-rest' }, { label: 'PostgreSQL', className: 'tag-postgres' }],
    },
    {
      icon: '🛒',
      name: 'Order Service',
      port: ':8082',
      desc: 'Handles order placement and history',
      tech: 'Spring Boot + PostgreSQL + Kafka',
      tags: [{ label: 'REST', className: 'tag-rest' }, { label: 'Kafka', className: 'tag-kafka' }, { label: 'Feign', className: 'tag-feign' }],
    },
    {
      icon: '🔔',
      name: 'Notification Service',
      port: ':8083',
      desc: 'Consumes order events from Kafka',
      tech: 'Spring Boot + Kafka Consumer',
      tags: [{ label: 'Kafka', className: 'tag-kafka' }],
    },
    {
      icon: '📨',
      name: 'Kafka Broker',
      port: ':9092',
      desc: 'Message broker for async events',
      tech: 'Confluent Kafka + Zookeeper',
      tags: [{ label: 'Docker', className: 'tag-kafka' }],
    },
  ];

  const databases = [
    { icon: '🗄️', name: 'Inventory DB', port: ':5432', tech: 'PostgreSQL (inventory_db)', className: 'tag-postgres' },
    { icon: '🗄️', name: 'Order DB', port: ':5433', tech: 'PostgreSQL (order_db)', className: 'tag-postgres' },
  ];

  const connections = [
    { from: 'Client (React)', to: 'API Gateway', type: 'HTTP', color: 'var(--accent-blue)' },
    { from: 'API Gateway', to: 'All Services', type: 'Eureka Discovery', color: 'var(--accent-emerald)' },
    { from: 'Order Service', to: 'Inventory Service', type: 'Feign (sync)', color: 'var(--accent-purple)' },
    { from: 'Order Service', to: 'Kafka', type: 'Producer (async)', color: 'var(--accent-amber)' },
    { from: 'Kafka', to: 'Notification Service', type: 'Consumer (async)', color: 'var(--accent-amber)' },
    { from: 'Inventory Service', to: 'Inventory DB', type: 'JPA/Hibernate', color: 'var(--accent-cyan)' },
    { from: 'Order Service', to: 'Order DB', type: 'JPA/Hibernate', color: 'var(--accent-cyan)' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">System Architecture</h1>
        <p className="page-subtitle">Microservices architecture with Spring Boot, Eureka, Kafka & PostgreSQL</p>
      </div>

      {/* Services Grid */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">🏗️ Microservices</h3>
          <span className="badge badge-info">{services.length} services</span>
        </div>
        <div className="arch-grid">
          {services.map((svc, i) => (
            <div className="arch-node" key={i}>
              <div className="arch-node-icon">{svc.icon}</div>
              <div className="arch-node-name">{svc.name}</div>
              <div className="arch-node-port">{svc.port}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{svc.desc}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{svc.tech}</div>
              <div className="arch-node-type" style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                {svc.tags.map((tag, j) => (
                  <span key={j} className={`badge ${tag.className}`}>{tag.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Databases */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">🗄️ Databases</h3>
          <span className="badge badge-info">Docker Compose</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {databases.map((db, i) => (
            <div className="arch-node" key={i}>
              <div className="arch-node-icon">{db.icon}</div>
              <div className="arch-node-name">{db.name}</div>
              <div className="arch-node-port">{db.port}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{db.tech}</div>
              <div className="arch-node-type">
                <span className={`badge ${db.className}`}>PostgreSQL</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Map */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🔗 Service Communication</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Protocol</th>
                <th>Pattern</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((conn, i) => (
                <tr key={i}>
                  <td><strong>{conn.from}</strong></td>
                  <td>{conn.to}</td>
                  <td>{conn.type}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: conn.color,
                      marginRight: 6,
                      boxShadow: `0 0 6px ${conn.color}`,
                    }}></span>
                    {conn.type.includes('async') ? 'Asynchronous' : 'Synchronous'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
