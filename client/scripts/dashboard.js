/**
 * Brajwasi's Coders - Protected Dashboard API Handler & CRM Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. GATEKEEPING / AUTHENTICATION GUARD
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect to login if credentials are missing
  if (!token || !user) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  // 2. PRELOADER ACTION
  const preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 300);
    }
  }

  // 3. RENDER PROFILE
  const headerAvatar = document.getElementById('header-avatar');
  const headerUsername = document.getElementById('header-username');

  if (headerUsername && user.name) {
    headerUsername.innerText = user.name;
  }
  if (headerAvatar && user.name) {
    headerAvatar.innerText = user.name.charAt(0).toUpperCase();
  }

  // 4. METRIC AND TABLE VARIABLES
  let activeTab = 'contacts'; // 'contacts' or 'careers'
  let contactsData = [];
  let careersData = [];
  let currentFilter = 'all';

  const tableBody = document.getElementById('leads-table-body');
  const categoryTitle = document.getElementById('table-category-title');

  // 5. FETCH ALL LEADS FROM BACKEND
  async function fetchAllData() {
    try {
      // Fetch Contact leads
      const contactRes = await fetch('/api/contact', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contactJson = await contactRes.json();
      if (contactRes.status === 401) {
        handleLogout('Session expired. Please log in again.');
        return;
      }
      if (contactRes.ok && contactJson.success) {
        contactsData = contactJson.contacts;
      }

      // Fetch Career applications
      const careerRes = await fetch('/api/career', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const careerJson = await careerRes.json();
      if (careerRes.ok && careerJson.success) {
        careersData = careerJson.applications;
      }

      updateMetrics();
      renderFilters();
      renderTableHeader();
      renderTableBody();
    } catch (err) {
      console.error('Fetch CRM data error:', err);
      showTableError('Server database connection offline.');
    } finally {
      hidePreloader();
    }
  }

  // 6. UPDATE ANALYTICS DISPLAY METRICS
  function updateMetrics() {
    const contactTotalEl = document.getElementById('metric-contact-total');
    const contactNewEl = document.getElementById('metric-contact-new');
    const careerTotalEl = document.getElementById('metric-career-total');
    const careerNewEl = document.getElementById('metric-career-new');

    if (contactTotalEl) contactTotalEl.innerText = contactsData.length;
    if (contactNewEl) contactNewEl.innerText = contactsData.filter(c => c.status === 'new').length;
    if (careerTotalEl) careerTotalEl.innerText = careersData.length;
    if (careerNewEl) careerNewEl.innerText = careersData.filter(c => c.status === 'new').length;
  }

  // 7. RENDER STATUS FILTERS DYNAMICALLY
  function renderFilters() {
    const filterContainer = document.getElementById('leads-filter-container');
    if (!filterContainer) return;

    let filters = [];
    if (activeTab === 'contacts') {
      filters = [
        { label: 'All Leads', val: 'all' },
        { label: 'New', val: 'new' },
        { label: 'In-Progress', val: 'in-progress' },
        { label: 'Resolved', val: 'resolved' }
      ];
    } else {
      filters = [
        { label: 'All Apps', val: 'all' },
        { label: 'New', val: 'new' },
        { label: 'Reviewing', val: 'reviewing' },
        { label: 'Shortlisted', val: 'shortlisted' },
        { label: 'Rejected', val: 'rejected' },
        { label: 'Hired', val: 'hired' }
      ];
    }

    filterContainer.innerHTML = '';
    filters.forEach(f => {
      const btn = document.createElement('button');
      btn.className = `filter-btn ${currentFilter === f.val ? 'active' : ''}`;
      btn.setAttribute('data-filter', f.val);
      btn.innerText = f.label;
      btn.addEventListener('click', (e) => {
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = f.val;
        renderTableBody();
      });
      filterContainer.appendChild(btn);
    });
  }

  // 8. RENDER TABLE HEADERS
  function renderTableHeader() {
    const headerRow = document.getElementById('leads-table-header');
    if (!headerRow) return;

    if (activeTab === 'contacts') {
      headerRow.innerHTML = `
        <th>Submission Date</th>
        <th>Client Info</th>
        <th>Subject &amp; Requirements</th>
        <th>Status</th>
        <th>CRM Action</th>
      `;
    } else {
      headerRow.innerHTML = `
        <th>Submission Date</th>
        <th>Candidate Info</th>
        <th>Role &amp; Details</th>
        <th>Status</th>
        <th>CRM Action</th>
      `;
    }
  }

  // 9. RENDER THE LEADS TABLE BODY
  function renderTableBody() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const data = activeTab === 'contacts' ? contactsData : careersData;

    // Filter leads/applications
    const filteredData = data.filter(item => {
      if (currentFilter === 'all') return true;
      return item.status === currentFilter;
    });

    if (filteredData.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-folder-open"></i></div>
            <h3>No entries found</h3>
            <p>Records matching status "${currentFilter}" will appear here.</p>
          </td>
        </tr>
      `;
      return;
    }

    filteredData.forEach(item => {
      const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const row = document.createElement('tr');

      if (activeTab === 'contacts') {
        row.innerHTML = `
          <td style="font-weight: 500; font-size: 0.85rem; color: var(--text-secondary); white-space: nowrap;">
            <i class="far fa-calendar-alt" style="margin-right: 5px;"></i> ${dateStr}
          </td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${escapeHTML(item.name)}</div>
            <a href="mailto:${item.email}" style="font-size: 0.8rem; color: var(--primary-blue);" class="glow-hover">
              <i class="far fa-envelope" style="margin-right: 4px;"></i> ${escapeHTML(item.email)}
            </a>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--gold-accent); margin-bottom: 8px;">${escapeHTML(item.subject)}</div>
            <div class="lead-message">${escapeHTML(item.message)}</div>
          </td>
          <td style="vertical-align: middle;">
            <span class="status-badge ${item.status}" id="badge-${item._id}">${item.status}</span>
          </td>
          <td style="vertical-align: middle; white-space: nowrap;">
            <select class="status-select" data-id="${item._id}">
              <option value="new" ${item.status === 'new' ? 'selected' : ''}>New</option>
              <option value="in-progress" ${item.status === 'in-progress' ? 'selected' : ''}>In-Progress</option>
              <option value="resolved" ${item.status === 'resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </td>
        `;
      } else {
        // Careers applications list
        row.innerHTML = `
          <td style="font-weight: 500; font-size: 0.85rem; color: var(--text-secondary); white-space: nowrap;">
            <i class="far fa-calendar-alt" style="margin-right: 5px;"></i> ${dateStr}
          </td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${escapeHTML(item.name)}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">
              <i class="fas fa-phone-alt" style="margin-right: 4px;"></i> ${escapeHTML(item.phone)}
            </div>
            <a href="mailto:${item.email}" style="font-size: 0.8rem; color: var(--primary-blue);" class="glow-hover">
              <i class="far fa-envelope" style="margin-right: 4px;"></i> ${escapeHTML(item.email)}
            </a>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--gold-accent); margin-bottom: 4px;">
              ${escapeHTML(item.role)} <span style="font-size:0.75rem; font-weight:normal; color:var(--text-muted);">(${item.type === 'full-time' ? 'Full-Time' : 'Part-Time'})</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px;">
              <strong>Experience:</strong> ${escapeHTML(item.experience)}
            </div>
            <div style="font-size: 0.8rem; margin-bottom: 8px;">
              <a href="${escapeHTML(item.resumeLink)}" target="_blank" style="color:var(--gold); text-decoration:underline;">
                <i class="fas fa-external-link-alt" style="font-size:0.75rem; margin-right:2px;"></i> View Resume / Portfolio
              </a>
            </div>
            <div class="lead-message" style="font-style:italic;">"${escapeHTML(item.message || 'No description provided.')}"</div>
          </td>
          <td style="vertical-align: middle;">
            <span class="status-badge ${item.status}" id="badge-${item._id}">${item.status}</span>
          </td>
          <td style="vertical-align: middle; white-space: nowrap;">
            <select class="status-select" data-id="${item._id}">
              <option value="new" ${item.status === 'new' ? 'selected' : ''}>New</option>
              <option value="reviewing" ${item.status === 'reviewing' ? 'selected' : ''}>Reviewing</option>
              <option value="shortlisted" ${item.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
              <option value="rejected" ${item.status === 'rejected' ? 'selected' : ''}>Rejected</option>
              <option value="hired" ${item.status === 'hired' ? 'selected' : ''}>Hired</option>
            </select>
          </td>
        `;
      }

      tableBody.appendChild(row);
    });

    // Bind dropdown change triggers
    const selectElements = tableBody.querySelectorAll('.status-select');
    selectElements.forEach(select => {
      select.addEventListener('change', async (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        await updateStatus(id, newStatus);
      });
    });
  }

  // 10. UPDATE STATUS (PUT API CALL)
  async function updateStatus(id, newStatus) {
    const apiPath = activeTab === 'contacts' ? `/api/contact/${id}` : `/api/career/${id}`;
    try {
      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local data arrays
        if (activeTab === 'contacts') {
          const idx = contactsData.findIndex(c => c._id === id);
          if (idx !== -1) contactsData[idx].status = newStatus;
        } else {
          const idx = careersData.findIndex(c => c._id === id);
          if (idx !== -1) careersData[idx].status = newStatus;
        }

        // Dynamically update badge & metrics
        const badge = document.getElementById(`badge-${id}`);
        if (badge) {
          badge.innerText = newStatus;
          badge.className = `status-badge ${newStatus}`;
        }
        updateMetrics();

        // If filtering is active, re-render to filter out updated records
        if (currentFilter !== 'all') {
          setTimeout(renderTableBody, 400);
        }
      } else {
        alert(data.error || 'Failed to update record status.');
      }
    } catch (err) {
      console.error('Update status fetch error:', err);
      alert('Error updating status. Please verify server connection.');
    }
  }

  // 11. CATEGORY TAB EVENTS
  const tabContacts = document.getElementById('tab-contacts');
  const tabCareers = document.getElementById('tab-careers');

  if (tabContacts && tabCareers) {
    tabContacts.addEventListener('click', () => {
      if (activeTab === 'contacts') return;
      activeTab = 'contacts';
      currentFilter = 'all';

      // Style active contacts tab button
      tabContacts.style.background = 'var(--gold)';
      tabContacts.style.color = '#000';
      tabContacts.style.borderColor = 'var(--gold)';

      // Style inactive careers tab button
      tabCareers.style.background = 'rgba(255,255,255,0.03)';
      tabCareers.style.color = 'var(--text-white)';
      tabCareers.style.borderColor = 'rgba(255,255,255,0.1)';

      if (categoryTitle) categoryTitle.innerText = 'Customer Enquiries';

      renderFilters();
      renderTableHeader();
      renderTableBody();
    });

    tabCareers.addEventListener('click', () => {
      if (activeTab === 'careers') return;
      activeTab = 'careers';
      currentFilter = 'all';

      // Style active careers tab button
      tabCareers.style.background = 'var(--gold)';
      tabCareers.style.color = '#000';
      tabCareers.style.borderColor = 'var(--gold)';

      // Style inactive contacts tab button
      tabContacts.style.background = 'rgba(255,255,255,0.03)';
      tabContacts.style.color = 'var(--text-white)';
      tabContacts.style.borderColor = 'rgba(255,255,255,0.1)';

      if (categoryTitle) categoryTitle.innerText = 'Career Applications';

      renderFilters();
      renderTableHeader();
      renderTableBody();
    });
  }

  // 12. ERROR & LOGOUT CONTROLS
  function showTableError(message) {
    if (!tableBody) return;
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <div class="empty-state-icon" style="color: var(--error-color);"><i class="fas fa-exclamation-triangle"></i></div>
          <h3>Inquiry Retrieval Error</h3>
          <p>${message}</p>
        </td>
      </tr>
    `;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => handleLogout());
  }

  function handleLogout(message) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (message) {
      console.warn(message);
    }
    window.location.href = '/login';
  }

  // 13. INITIALIZE FETCH
  fetchAllData();
});
