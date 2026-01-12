// API Base URL
const API_BASE = window.location.origin + '/api/v1';

// DOM Elements
const authModal = document.getElementById('authModal');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleAuth = document.getElementById('toggleAuth');
const toggleText = document.getElementById('toggleText');
const authTitle = document.getElementById('authTitle');
const logoutBtn = document.getElementById('logoutBtn');
const generateKeyBtn = document.getElementById('generateKeyBtn');
const generateModal = document.getElementById('generateModal');
const generateForm = document.getElementById('generateForm');
const successModal = document.getElementById('successModal');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    setupTabSwitching();
    setupButtonEventListeners();
});

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && user.username) {
        showDashboard(user);
        loadApiKeys();
    } else {
        showAuthModal();
    }
}

// Show Dashboard
function showDashboard(user) {
    authModal.style.display = 'none';
    dashboardSection.style.display = 'block';
    document.getElementById('userName').textContent = user.username;
    document.getElementById('userEmail').textContent = user.email;

    // Load categories when dashboard is shown
    loadCategories();

    // Populate category dropdowns in product forms
    populateCategoryDropdowns();
}

// Show Auth Modal
function showAuthModal() {
    authModal.style.display = 'flex';
    dashboardSection.style.display = 'none';
}

// Setup Event Listeners
function setupEventListeners() {
    // Toggle between login and register
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        const isLogin = loginForm.style.display !== 'none';

        if (isLogin) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            toggleText.textContent = 'Already have an account?';
            toggleAuth.textContent = 'Sign in';
            authTitle.textContent = 'Create Account';
        } else {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            toggleText.textContent = "Don't have an account?";
            toggleAuth.textContent = 'Sign up';
            authTitle.textContent = 'Welcome to SmartRetail API';
        }
    });

    // Login form submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        await login(username, password);
    });

    // Register form submit
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const store_name = document.getElementById('registerStoreName').value;
        await register(email, username, password, store_name);
    });

    // Logout
    logoutBtn.addEventListener('click', logout);

    // Generate API Key
    generateKeyBtn.addEventListener('click', () => {
        generateModal.style.display = 'flex';
    });

    // Generate form submit
    generateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const key_name = document.getElementById('keyName').value;
        const expires_in_days = document.getElementById('expiresInDays').value;
        await generateApiKey(key_name, expires_in_days);
    });
}

// Login
async function login(username, password) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        hideLoading();

        if (data.success) {
            localStorage.setItem('token', data.data.tokens.access_token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            showDashboard(data.data.user);
            loadApiKeys();
        } else {
            showError('loginError', data.error?.message || 'Login failed');
        }
    } catch (error) {
        hideLoading();
        showError('loginError', 'Network error. Please try again.');
    }
}

// Register
async function register(email, username, password, store_name) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password, store_name })
        });

        const data = await response.json();
        hideLoading();

        if (data.success) {
            localStorage.setItem('token', data.data.tokens.access_token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            showDashboard(data.data.user);
            loadApiKeys();
        } else {
            showError('registerError', data.error?.message || 'Registration failed');
        }
    } catch (error) {
        hideLoading();
        showError('registerError', 'Network error. Please try again.');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
}

// Load API Keys
async function loadApiKeys() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/auth/api-keys`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
            displayApiKeys(data.data);
            // Cache API keys for testing
            localStorage.setItem('apiKeys', JSON.stringify(data.data));
            // Populate API key selector
            populateApiKeySelector(data.data);
            // Update auth display
            updateAuthDisplay();
        }
    } catch (error) {
        console.error('Failed to load API keys:', error);
    }
}

// Display API Keys
function displayApiKeys(apiKeys) {
    const container = document.getElementById('apiKeysContainer');
    const emptyState = document.getElementById('emptyState');
    const totalKeys = document.getElementById('totalKeys');

    totalKeys.textContent = apiKeys.length;

    if (apiKeys.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = apiKeys.map(key => `
        <div class="api-key-card">
            <div class="api-key-header">
                <h3 class="api-key-name">${escapeHtml(key.key_name)}</h3>
                <span class="api-key-badge">${key.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div class="api-key-value">
                <code>${escapeHtml(key.api_key)}</code>
                <button class="btn-copy" onclick="copyToClipboard('${key.api_key}', this)">Copy</button>
            </div>
            <div class="api-key-meta">
                <div>
                    <small>Created: ${formatDate(key.created_at)}</small>
                    ${key.expires_at ? `<br><small>Expires: ${formatDate(key.expires_at)}</small>` : ''}
                </div>
                <div class="api-key-actions">
                    <button class="btn-revoke" onclick="revokeApiKey(${key.key_id})">Revoke</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate API Key
async function generateApiKey(key_name, expires_in_days) {
    try {
        showLoading();
        const token = localStorage.getItem('token');
        const body = { key_name };
        if (expires_in_days) {
            body.expires_in_days = parseInt(expires_in_days);
        }

        const response = await fetch(`${API_BASE}/auth/api-keys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        hideLoading();

        if (data.success) {
            closeGenerateModal();
            showSuccessModal(data.data.api_key);
            loadApiKeys();
        } else {
            showError('generateError', data.error?.message || 'Failed to generate API key');
        }
    } catch (error) {
        hideLoading();
        showError('generateError', 'Network error. Please try again.');
    }
}

// Revoke API Key
async function revokeApiKey(keyId) {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
        return;
    }

    try {
        showLoading();
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/auth/api-keys/${keyId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        hideLoading();

        if (data.success) {
            loadApiKeys();
        } else {
            alert('Failed to revoke API key');
        }
    } catch (error) {
        hideLoading();
        alert('Network error. Please try again.');
    }
}

// Copy to Clipboard
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    });
}

// Copy New Key
function copyNewKey() {
    const apiKey = document.getElementById('newApiKey').textContent;
    navigator.clipboard.writeText(apiKey).then(() => {
        alert('API key copied to clipboard!');
    });
}

// Show Success Modal
function showSuccessModal(apiKey) {
    document.getElementById('newApiKey').textContent = apiKey;
    successModal.style.display = 'flex';
}

// Close Modals
function closeGenerateModal() {
    generateModal.style.display = 'none';
    generateForm.reset();
    document.getElementById('generateError').classList.remove('show');
}

function closeSuccessModal() {
    successModal.style.display = 'none';
}

// Show/Hide Loading
function showLoading() {
    loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Show Error
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');

    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 5000);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === generateModal) {
        closeGenerateModal();
    }
    if (e.target === successModal) {
        closeSuccessModal();
    }
});

// ============================================
// API TESTING FUNCTIONS
// ============================================

// Setup Tab Switching
function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            btn.classList.add('active');
            const tabName = btn.getAttribute('data-tab');
            document.getElementById(`${tabName}Tab`).classList.add('active');

            // Clear response area to avoid confusion
            document.getElementById('responseDisplay').textContent = '// Select an endpoint and click Test to see response';
            document.getElementById('responseStatus').textContent = '';
            document.getElementById('responseStatus').className = 'status-badge';
            document.querySelector('.btn-copy-small').style.display = 'none';
        });
    });
}

// Setup Button Event Listeners
function setupButtonEventListeners() {
    // Use event delegation for better performance and CSP compliance
    document.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');

        // Map of action names to functions
        const actions = {
            // Products
            listProducts,
            createProduct,
            searchProducts,
            getProduct,
            updateProduct,
            updateStock,
            deleteProduct,
            getLowStockProducts,
            // Transactions
            listTransactions,
            createTransaction,
            getTransaction,
            getDailySummary,
            // Response
            copyResponse,
            // Modals
            openGenerateModal: () => generateModal.style.display = 'flex',
            closeGenerateModal,
            closeSuccessModal,
            copyNewKey,
            // Categories
            openAddCategoryModal,
            closeCategoryModal,
            editCategory: () => {
                const categoryId = button.getAttribute('data-category-id');
                if (categoryId) editCategory(parseInt(categoryId));
            },
            deleteCategory: () => {
                const categoryId = button.getAttribute('data-category-id');
                if (categoryId) deleteCategory(parseInt(categoryId));
            }
        };

        // Call the appropriate function
        if (actions[action]) {
            e.preventDefault();
            actions[action]();
        }
    });
}

// Populate API Key Selector
function populateApiKeySelector(apiKeys) {
    const selector = document.getElementById('selectedApiKey');
    if (!selector) return;

    // Clear existing options except default ones
    while (selector.options.length > 2) {
        selector.remove(2);
    }

    // Add API keys as options
    apiKeys.forEach(key => {
        if (key.is_active) {
            const option = document.createElement('option');
            option.value = key.key_id;
            option.textContent = `${key.key_name} (${key.api_key.substring(0, 20)}...)`;
            selector.appendChild(option);
        }
    });

    // Select first API key by default if available
    if (apiKeys.length > 0 && apiKeys[0].is_active) {
        selector.value = apiKeys[0].key_id;
    }
}

// Update Auth Display
function updateAuthDisplay() {
    const token = localStorage.getItem('token');
    const apiKeys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
    const selector = document.getElementById('selectedApiKey');
    const indicator = document.getElementById('authIndicator');

    if (!indicator) return;

    const selectedValue = selector?.value || 'auto';
    let selectedKey = null;

    if (selectedValue === 'jwt') {
        // Use JWT token
        if (token) {
            indicator.innerHTML = `
                <span class="auth-method">Using:</span>
                <code>JWT Token</code>
                <span class="auth-status warning">⚠ Temporary</span>
            `;
            indicator.className = 'auth-indicator jwt';
        } else {
            indicator.innerHTML = `
                <span class="auth-status error">✗ No Token Available</span>
            `;
            indicator.className = 'auth-indicator error';
        }
    } else if (selectedValue === 'auto') {
        // Use first active API key
        selectedKey = apiKeys.find(k => k.is_active);
        if (selectedKey) {
            indicator.innerHTML = `
                <span class="auth-method">Using:</span>
                <code>${selectedKey.key_name}</code>
                <span class="auth-status success">✓ API Key</span>
            `;
            indicator.className = 'auth-indicator active';
        } else if (token) {
            indicator.innerHTML = `
                <span class="auth-method">Using:</span>
                <code>JWT Token</code>
                <span class="auth-status warning">⚠ No API Keys</span>
            `;
            indicator.className = 'auth-indicator jwt';
        } else {
            indicator.innerHTML = `
                <span class="auth-status error">✗ No Authentication</span>
            `;
            indicator.className = 'auth-indicator error';
        }
    } else {
        // Use specific API key
        selectedKey = apiKeys.find(k => k.key_id == selectedValue);
        if (selectedKey && selectedKey.is_active) {
            indicator.innerHTML = `
                <span class="auth-method">Using:</span>
                <code>${selectedKey.key_name}</code>
                <span class="auth-status success">✓ API Key</span>
            `;
            indicator.className = 'auth-indicator active';
        } else {
            indicator.innerHTML = `
                <span class="auth-status error">✗ Invalid Key</span>
            `;
            indicator.className = 'auth-indicator error';
        }
    }
}

// Get Auth Headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    const apiKeys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
    const selector = document.getElementById('selectedApiKey');
    const selectedValue = selector?.value || 'auto';

    // If JWT is explicitly selected
    if (selectedValue === 'jwt') {
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // If auto or specific key is selected
    let selectedKey = null;
    if (selectedValue === 'auto') {
        selectedKey = apiKeys.find(k => k.is_active);
    } else {
        selectedKey = apiKeys.find(k => k.key_id == selectedValue);
    }

    // Use API key if available and active
    if (selectedKey && selectedKey.is_active) {
        return { 'X-API-Key': selectedKey.api_key };
    }

    // Fallback to JWT token
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }

    return {};
}

// Display Response
function displayResponse(response, status) {
    const responseDisplay = document.getElementById('responseDisplay');
    const responseStatus = document.getElementById('responseStatus');
    const copyBtn = document.querySelector('.btn-copy-small');

    // Format JSON
    const formatted = JSON.stringify(response, null, 2);
    responseDisplay.innerHTML = `<code>${formatted}</code>`;

    // Update status badge
    responseStatus.textContent = `${status}`;
    responseStatus.className = 'status-badge';
    if (status >= 200 && status < 300) {
        responseStatus.classList.add('success');
    } else if (status >= 400 && status < 500) {
        responseStatus.classList.add('warning');
    } else {
        responseStatus.classList.add('error');
    }

    copyBtn.style.display = 'block';

    // Scroll to response
    responseDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Copy Response
function copyResponse() {
    const responseText = document.getElementById('responseDisplay').textContent;
    navigator.clipboard.writeText(responseText).then(() => {
        alert('Response copied to clipboard!');
    });
}

// ============================================
// PRODUCTS API FUNCTIONS
// ============================================

// List Products
async function listProducts() {
    try {
        showLoading();
        const page = document.getElementById('listProductsPage').value || 1;
        const perPage = document.getElementById('listProductsPerPage').value || 20;

        const response = await fetch(`${API_BASE}/products?page=${page}&per_page=${perPage}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Create Product
async function createProduct() {
    try {
        showLoading();
        const body = {
            sku: document.getElementById('createProductSku').value,
            name: document.getElementById('createProductName').value,
            description: document.getElementById('createProductDescription').value,
            price: parseFloat(document.getElementById('createProductPrice').value),
            stock: parseInt(document.getElementById('createProductStock').value) || 0
        };

        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);

        // Clear form on success
        if (response.ok) {
            document.getElementById('createProductSku').value = '';
            document.getElementById('createProductName').value = '';
            document.getElementById('createProductDescription').value = '';
            document.getElementById('createProductPrice').value = '';
            document.getElementById('createProductStock').value = '0';
        }
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Search Products
async function searchProducts() {
    try {
        showLoading();
        const query = document.getElementById('searchProductsQuery').value;

        const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Get Product
async function getProduct() {
    try {
        showLoading();
        const id = document.getElementById('getProductId').value;

        const response = await fetch(`${API_BASE}/products/${id}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Update Product
async function updateProduct() {
    try {
        showLoading();
        const id = document.getElementById('updateProductId').value;
        const body = {};

        const name = document.getElementById('updateProductName').value;
        const price = document.getElementById('updateProductPrice').value;

        if (name) body.name = name;
        if (price) body.price = parseFloat(price);

        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Update Stock
async function updateStock() {
    try {
        showLoading();
        const id = document.getElementById('updateStockId').value;
        const stock = parseInt(document.getElementById('updateStockQuantity').value);

        const response = await fetch(`${API_BASE}/products/${id}/stock`, {
            method: 'PATCH',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stock })
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Delete Product
async function deleteProduct() {
    const id = document.getElementById('deleteProductId').value;

    if (!confirm(`Are you sure you want to delete product #${id}?`)) {
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Get Low Stock Products
async function getLowStockProducts() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/products/low-stock`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// ============================================
// TRANSACTIONS API FUNCTIONS
// ============================================

// List Transactions
async function listTransactions() {
    try {
        showLoading();
        const page = document.getElementById('listTransactionsPage').value || 1;
        const perPage = document.getElementById('listTransactionsPerPage').value || 20;

        const response = await fetch(`${API_BASE}/transactions?page=${page}&per_page=${perPage}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Create Transaction
async function createTransaction() {
    try {
        showLoading();
        const itemsText = document.getElementById('createTransactionItems').value;
        const items = JSON.parse(itemsText);

        const body = {
            items,
            payment_method: document.getElementById('createTransactionPayment').value,
            notes: document.getElementById('createTransactionNotes').value || undefined
        };

        const response = await fetch(`${API_BASE}/transactions`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);

        // Clear form on success
        if (response.ok) {
            document.getElementById('createTransactionItems').value = '';
            document.getElementById('createTransactionNotes').value = '';
        }
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Get Transaction
async function getTransaction() {
    try {
        showLoading();
        const id = document.getElementById('getTransactionId').value;

        const response = await fetch(`${API_BASE}/transactions/${id}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// Get Daily Summary
async function getDailySummary() {
    try {
        showLoading();
        const date = document.getElementById('dailySummaryDate').value;
        const url = date
            ? `${API_BASE}/transactions/daily-summary?date=${date}`
            : `${API_BASE}/transactions/daily-summary`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();
        displayResponse(data, response.status);
    } catch (error) {
        hideLoading();
        displayResponse({ error: error.message }, 500);
    }
}

// ========================================
// CATEGORIES MANAGEMENT
// ========================================

// Populate Category Dropdowns in Product Forms
async function populateCategoryDropdowns() {
    try {
        const response = await fetch(`${API_BASE}/categories`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success && data.data) {
            const categories = data.data;

            // Populate Create Product dropdown
            const createSelect = document.getElementById('createProductCategory');
            if (createSelect) {
                createSelect.innerHTML = '<option value="">-- No Category --</option>';
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.category_id;
                    option.textContent = cat.name;
                    createSelect.appendChild(option);
                });
            }

            // Populate Update Product dropdown
            const updateSelect = document.getElementById('updateProductCategory');
            if (updateSelect) {
                updateSelect.innerHTML = '<option value="">-- No Category --</option>';
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.category_id;
                    option.textContent = cat.name;
                    updateSelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading categories for dropdowns:', error);
    }
}

// Load Categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success && data.data) {
            displayCategories(data.data);
        } else {
            showCategoriesEmptyState();
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        showCategoriesEmptyState();
    }
}

// Display Categories
function displayCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    const emptyState = document.getElementById('categoriesEmptyState');

    if (!categories || categories.length === 0) {
        showCategoriesEmptyState();
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = categories.map(category => `
        <div class="category-card">
            <div class="category-header">
                <div class="category-info">
                    <h3>${escapeHtml(category.name)}</h3>
                    ${category.description ? `<p>${escapeHtml(category.description)}</p>` : ''}
                </div>
                <div class="category-actions">
                    <button class="btn-icon" data-action="editCategory" data-category-id="${category.category_id}" title="Edit">
                        ✏️
                    </button>
                    <button class="btn-icon danger" data-action="deleteCategory" data-category-id="${category.category_id}" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
            <div class="category-meta">
                <div class="category-count">
                    📦 <span>${category.product_count || 0}</span> products
                </div>
                <small>${new Date(category.created_at).toLocaleDateString()}</small>
            </div>
        </div>
    `).join('');
}

// Show Categories Empty State
function showCategoriesEmptyState() {
    const container = document.getElementById('categoriesContainer');
    const emptyState = document.getElementById('categoriesEmptyState');
    container.innerHTML = '';
    emptyState.style.display = 'block';
}

// Open Add Category Modal
function openAddCategoryModal() {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    const form = document.getElementById('categoryForm');

    title.textContent = 'Add Category';
    form.reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryError').textContent = '';
    document.getElementById('categoryError').classList.remove('show');

    modal.style.display = 'flex';
}

// Close Category Modal
function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    modal.style.display = 'none';
}

// Edit Category
async function editCategory(categoryId) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();

        if (data.success && data.data) {
            const category = data.data;
            const modal = document.getElementById('categoryModal');
            const title = document.getElementById('categoryModalTitle');

            title.textContent = 'Edit Category';
            document.getElementById('categoryId').value = category.category_id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryDescription').value = category.description || '';
            document.getElementById('categoryImage').value = category.image_url || '';
            document.getElementById('categoryError').textContent = '';
            document.getElementById('categoryError').classList.remove('show');

            modal.style.display = 'flex';
        } else {
            alert('Failed to load category details');
        }
    } catch (error) {
        hideLoading();
        console.error('Error loading category:', error);
        alert('Error loading category');
    }
}

// Delete Category
async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category? This cannot be undone.')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();
        hideLoading();

        if (data.success) {
            alert('Category deleted successfully');
            loadCategories();
        } else {
            alert(data.error?.message || 'Failed to delete category');
        }
    } catch (error) {
        hideLoading();
        console.error('Error deleting category:', error);
        alert('Error deleting category');
    }
}

// Handle Category Form Submit
document.addEventListener('DOMContentLoaded', () => {
    const categoryForm = document.getElementById('categoryForm');
    const addCategoryBtn = document.getElementById('addCategoryBtn');

    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const categoryId = document.getElementById('categoryId').value;
            const name = document.getElementById('categoryName').value.trim();
            const description = document.getElementById('categoryDescription').value.trim();
            const imageUrl = document.getElementById('categoryImage').value.trim();
            const errorDiv = document.getElementById('categoryError');

            if (!name) {
                errorDiv.textContent = 'Category name is required';
                errorDiv.classList.add('show');
                return;
            }

            const categoryData = {
                name,
                description: description || null,
                image_url: imageUrl || null
            };

            try {
                showLoading();
                const url = categoryId
                    ? `${API_BASE}/categories/${categoryId}`
                    : `${API_BASE}/categories`;

                const method = categoryId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify(categoryData)
                });

                const data = await response.json();
                hideLoading();

                if (data.success) {
                    closeCategoryModal();
                    loadCategories();
                    alert(categoryId ? 'Category updated successfully' : 'Category created successfully');
                } else {
                    errorDiv.textContent = data.error?.message || 'Failed to save category';
                    errorDiv.classList.add('show');
                }
            } catch (error) {
                hideLoading();
                console.error('Error saving category:', error);
                errorDiv.textContent = 'Error saving category';
                errorDiv.classList.add('show');
            }
        });
    }

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', openAddCategoryModal);
    }
});

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
