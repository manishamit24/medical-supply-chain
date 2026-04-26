const API_BASE = '/api/medicines';

let allMedicines = [];

// ─── DOM helpers ────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

const form         = $('medicine-form');
const formTitle    = $('form-title');
const submitBtn    = $('submit-btn');
const cancelBtn    = $('cancel-btn');
const medicineIdEl = $('medicine-id');
const nameEl       = $('name');
const manufacturerEl = $('manufacturer');
const batchEl      = $('batchNumber');
const expiryEl     = $('expiryDate');
const quantityEl   = $('quantity');
const locationEl   = $('location');
const statusEl     = $('status');
const alertEl      = $('alert');
const listEl       = $('medicine-list');
const countEl      = $('medicine-count');
const searchEl     = $('search');

// ─── Notifications ───────────────────────────────────────────────────────────
function showAlert(message, type = 'success') {
  alertEl.textContent = message;
  alertEl.className = `alert alert-${type}`;
  alertEl.classList.remove('hidden');
  setTimeout(() => alertEl.classList.add('hidden'), 3500);
}

// ─── Status CSS class helper ─────────────────────────────────────────────────
function statusClass(status) {
  const map = {
    'In Stock':     'status-in-stock',
    'In Transit':   'status-in-transit',
    'Delivered':    'status-delivered',
    'Out of Stock': 'status-out-of-stock',
    'Recalled':     'status-recalled',
  };
  return map[status] || 'status-in-stock';
}

// ─── Render medicines ────────────────────────────────────────────────────────
function renderMedicines(medicines) {
  if (medicines.length === 0) {
    listEl.innerHTML = '<p class="empty-state">No medicines found.</p>';
    countEl.textContent = '0 items';
    return;
  }

  countEl.textContent = `${medicines.length} item${medicines.length !== 1 ? 's' : ''}`;

  listEl.innerHTML = medicines.map((m) => `
    <div class="medicine-card" data-id="${m.id}">
      <h3>
        ${escapeHtml(m.name)}
        <span class="status-badge ${statusClass(m.status)}">${escapeHtml(m.status)}</span>
      </h3>
      <div class="detail"><strong>Manufacturer:</strong> ${escapeHtml(m.manufacturer)}</div>
      <div class="detail"><strong>Batch No.:</strong> ${escapeHtml(m.batchNumber)}</div>
      <div class="detail"><strong>Expiry Date:</strong> ${escapeHtml(m.expiryDate)}</div>
      <div class="detail"><strong>Quantity:</strong> ${m.quantity}</div>
      <div class="detail"><strong>Location:</strong> ${escapeHtml(m.location)}</div>
      <div class="detail"><strong>Last Updated:</strong> ${new Date(m.updatedAt).toLocaleString()}</div>
      <div class="card-actions">
        <button class="btn btn-edit" onclick="editMedicine('${m.id}')">Edit</button>
        <button class="btn btn-delete" onclick="deleteMedicine('${m.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// ─── Fetch & display all medicines ───────────────────────────────────────────
async function fetchMedicines() {
  try {
    const res = await fetch(API_BASE);
    allMedicines = await res.json();
    applySearch();
  } catch {
    showAlert('Failed to load medicines.', 'error');
  }
}

// ─── Search / filter ─────────────────────────────────────────────────────────
function applySearch() {
  const term = searchEl.value.toLowerCase().trim();
  if (!term) {
    renderMedicines(allMedicines);
    return;
  }
  const filtered = allMedicines.filter((m) =>
    m.name.toLowerCase().includes(term) ||
    m.batchNumber.toLowerCase().includes(term) ||
    m.location.toLowerCase().includes(term)
  );
  renderMedicines(filtered);
}

searchEl.addEventListener('input', applySearch);

// ─── Form submission (add or update) ─────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name: nameEl.value.trim(),
    manufacturer: manufacturerEl.value.trim(),
    batchNumber: batchEl.value.trim(),
    expiryDate: expiryEl.value,
    quantity: Number(quantityEl.value),
    location: locationEl.value.trim(),
    status: statusEl.value,
  };

  const id = medicineIdEl.value;
  const isEdit = Boolean(id);

  try {
    const res = await fetch(isEdit ? `${API_BASE}/${id}` : API_BASE, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      showAlert(data.error || 'An error occurred.', 'error');
      return;
    }

    showAlert(isEdit ? 'Medicine updated successfully!' : 'Medicine added successfully!');
    resetForm();
    fetchMedicines();
  } catch {
    showAlert('Network error. Please try again.', 'error');
  }
});

// ─── Edit ────────────────────────────────────────────────────────────────────
function editMedicine(id) {
  const m = allMedicines.find((med) => med.id === id);
  if (!m) return;

  formTitle.textContent   = 'Edit Medicine';
  submitBtn.textContent   = 'Update Medicine';
  cancelBtn.classList.remove('hidden');
  medicineIdEl.value      = m.id;
  nameEl.value            = m.name;
  manufacturerEl.value    = m.manufacturer;
  batchEl.value           = m.batchNumber;
  expiryEl.value          = m.expiryDate;
  quantityEl.value        = m.quantity;
  locationEl.value        = m.location;
  statusEl.value          = m.status;

  form.scrollIntoView({ behavior: 'smooth' });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
async function deleteMedicine(id) {
  if (!confirm('Are you sure you want to delete this medicine entry?')) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      showAlert('Failed to delete medicine.', 'error');
      return;
    }
    showAlert('Medicine deleted successfully!');
    fetchMedicines();
  } catch {
    showAlert('Network error. Please try again.', 'error');
  }
}

// ─── Cancel edit ─────────────────────────────────────────────────────────────
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  medicineIdEl.value      = '';
  formTitle.textContent   = 'Add New Medicine';
  submitBtn.textContent   = 'Add Medicine';
  cancelBtn.classList.add('hidden');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
fetchMedicines();
