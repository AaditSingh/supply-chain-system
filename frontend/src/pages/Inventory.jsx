import { useState } from 'react';
import { addProduct, checkInventory, reduceStock } from '../services/api';

export default function Inventory({ addToast }) {
  const [addForm, setAddForm] = useState({ skuCode: '', name: '', price: '', stockQuantity: '' });
  const [checkSku, setCheckSku] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [reduceForm, setReduceForm] = useState({ skuCode: '', quantity: '' });
  const [loading, setLoading] = useState({ add: false, check: false, reduce: false });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, add: true }));
    try {
      const product = await addProduct({
        skuCode: addForm.skuCode,
        name: addForm.name,
        price: parseFloat(addForm.price),
        stockQuantity: parseInt(addForm.stockQuantity),
      });
      addToast(`Product "${product.name}" (${product.skuCode}) added successfully!`, 'success');
      setAddForm({ skuCode: '', name: '', price: '', stockQuantity: '' });
    } catch (err) {
      addToast(err.message || 'Failed to add product', 'error');
    }
    setLoading(prev => ({ ...prev, add: false }));
  };

  const handleCheckInventory = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, check: true }));
    setCheckResult(null);
    try {
      const result = await checkInventory(checkSku);
      setCheckResult(result);
      addToast(`Inventory checked for ${checkSku}`, 'info');
    } catch (err) {
      addToast(err.message || 'Failed to check inventory', 'error');
      setCheckResult(null);
    }
    setLoading(prev => ({ ...prev, check: false }));
  };

  const handleReduceStock = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, reduce: true }));
    try {
      const result = await reduceStock(reduceForm.skuCode, parseInt(reduceForm.quantity));
      addToast(`Stock reduced! ${reduceForm.skuCode} now has ${result.availableQuantity} units`, 'success');
      setReduceForm({ skuCode: '', quantity: '' });
    } catch (err) {
      addToast(err.message || 'Failed to reduce stock', 'error');
    }
    setLoading(prev => ({ ...prev, reduce: false }));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-subtitle">Add products, check stock levels, and manage inventory</p>
      </div>

      {/* Add Product */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">📦 Add New Product</h3>
          <span className="badge tag-rest">POST /api/inventory</span>
        </div>
        <form onSubmit={handleAddProduct}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">SKU Code</label>
              <input
                className="form-input"
                placeholder="e.g. SKU-100"
                value={addForm.skuCode}
                onChange={e => setAddForm({ ...addForm, skuCode: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                className="form-input"
                placeholder="e.g. Camera"
                value={addForm.name}
                onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 199.99"
                value={addForm.price}
                onChange={e => setAddForm({ ...addForm, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="e.g. 20"
                value={addForm.stockQuantity}
                onChange={e => setAddForm({ ...addForm, stockQuantity: e.target.value })}
                required
              />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" type="submit" disabled={loading.add}>
              {loading.add ? <span className="spinner"></span> : '➕'} Add Product
            </button>
          </div>
        </form>
      </div>

      <div className="two-col-grid">
        {/* Check Inventory */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔍 Check Inventory</h3>
            <span className="badge tag-rest">GET /api/inventory/{'{'} sku {'}'}</span>
          </div>
          <form onSubmit={handleCheckInventory}>
            <div className="form-group">
              <label className="form-label">SKU Code</label>
              <input
                className="form-input"
                placeholder="e.g. SKU-100"
                value={checkSku}
                onChange={e => setCheckSku(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-secondary" type="submit" disabled={loading.check}>
                {loading.check ? <span className="spinner"></span> : '🔍'} Check Stock
              </button>
            </div>
          </form>
          {checkResult && (
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(124, 58, 237, 0.05)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong>{checkResult.skuCode}</strong>
                <span className={`badge ${checkResult.inStock ? 'badge-success' : 'badge-danger'}`}>
                  {checkResult.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Available Quantity: <strong style={{ color: 'var(--text-primary)' }}>{checkResult.availableQuantity}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Reduce Stock */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📉 Reduce Stock</h3>
            <span className="badge tag-rest">PUT /api/inventory/reduce</span>
          </div>
          <form onSubmit={handleReduceStock}>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">SKU Code</label>
              <input
                className="form-input"
                placeholder="e.g. SKU-100"
                value={reduceForm.skuCode}
                onChange={e => setReduceForm({ ...reduceForm, skuCode: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity to Reduce</label>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={reduceForm.quantity}
                onChange={e => setReduceForm({ ...reduceForm, quantity: e.target.value })}
                required
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-danger" type="submit" disabled={loading.reduce}>
                {loading.reduce ? <span className="spinner"></span> : '📉'} Reduce Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
