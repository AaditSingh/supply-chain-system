const API_BASE_URL = 'http://localhost:8080';

// ============ INVENTORY API ============

export async function addProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/api/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to add product');
  }
  return response.json();
}

export async function checkInventory(skuCode) {
  const response = await fetch(`${API_BASE_URL}/api/inventory/${skuCode}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Product with SKU "${skuCode}" not found`);
    }
    throw new Error('Failed to check inventory');
  }
  return response.json();
}

export async function reduceStock(skuCode, quantity) {
  const response = await fetch(`${API_BASE_URL}/api/inventory/reduce`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skuCode, quantity }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to reduce stock');
  }
  return response.json();
}

// ============ ORDER API ============

export async function placeOrder(orderData) {
  const response = await fetch(`${API_BASE_URL}/api/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to place order');
  }
  return response.json();
}

export async function getAllOrders() {
  const response = await fetch(`${API_BASE_URL}/api/order`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

// ============ NOTIFICATION API ============

export async function getNotifications() {
  const response = await fetch(`${API_BASE_URL}/api/notifications`);
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
}

export async function getNotificationCount() {
  const response = await fetch(`${API_BASE_URL}/api/notifications/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch notification count');
  }
  return response.json();
}
