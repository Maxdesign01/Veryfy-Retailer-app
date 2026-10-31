// Veryfy Lite — High Performance PWA Application Logic (< 14 KB)

// 1. Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/lite/sw.js', { scope: '/lite/' })
      .then((reg) => console.log('[Veryfy Lite SW] Registered:', reg.scope))
      .catch((err) => console.warn('[Veryfy Lite SW] Registration failed:', err));
  });
}

// 2. Mock Database for Instant Low-Bandwidth Lookups
const PRODUCT_DATABASE = {
  'VFY-2849-1036': {
    outcome: 'verified',
    title: 'CeraVe Moisturizing Lotion',
    brand: 'CeraVe',
    nafdac: '01-5391',
    batch: 'VFY-2849-1036',
    mfg: '2024-01-30',
    exp: '2029-01-29',
    manufacturer: 'VitaCore Health Ltd.',
    notes: 'Cryptographic signature genuine. Tamper-evident seal confirmed intact.'
  },
  'LNT-2024-91': {
    outcome: 'suspicious',
    title: 'Lonart Forte Artemether/Lumefantrine',
    brand: 'Lonart',
    nafdac: 'B4-0239',
    batch: 'LNT-2024-91',
    mfg: '01/2026',
    exp: '01/2029',
    manufacturer: 'Bliss GVS Pharma Ltd',
    notes: 'Anomaly: QR code scanned across multiple non-adjacent locations. Isolate stock before dispensing.'
  },
  'FAKE-AMX-001': {
    outcome: 'counterfeit',
    title: 'Amoxil 500mg Amoxicillin Trihydrate',
    brand: 'Amoxil',
    nafdac: '04-9912 (Mismatch)',
    batch: 'FAKE-AMX-001',
    mfg: '03/2024',
    exp: '03/2027',
    manufacturer: 'Unverified Overseas Distributor',
    notes: 'CRITICAL: Counterfeit digital signature. Do not sell. Quarantine immediately and notify regulator.'
  }
};

// 3. Elements
const codeInput = document.getElementById('code-input');
const btnVerify = document.getElementById('btn-verify');
const btnClear = document.getElementById('btn-clear');
const btnPaste = document.getElementById('btn-paste');
const btnToggleCamera = document.getElementById('btn-toggle-camera');
const cameraContainer = document.getElementById('camera-view-container');
const cameraVideo = document.getElementById('camera-video');
const btnCloseCamera = document.getElementById('btn-close-camera');

const statusCard = document.getElementById('status-card');
const statusText = document.getElementById('status-text');
const statusBytes = document.getElementById('status-bytes');

const resultCard = document.getElementById('result-card');
const resultBadge = document.getElementById('result-badge');
const resultTitle = document.getElementById('result-title');
const resultGrid = document.getElementById('result-grid');
const resultNotes = document.getElementById('result-notes');
const offlineActions = document.getElementById('offline-actions');
const btnSms = document.getElementById('btn-sms');
const btnUssd = document.getElementById('btn-ussd');

const networkPill = document.getElementById('network-pill');
const networkStatusLabel = document.getElementById('network-status-label');

const historyList = document.getElementById('history-list');
const btnClearHistory = document.getElementById('btn-clear-history');

let cameraStream = null;
let cameraScanningInterval = null;

// 4. Network Status Monitoring
function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  networkPill.className = 'network-pill';

  if (!isOnline) {
    networkPill.classList.add('offline');
    networkStatusLabel.textContent = 'Offline';
  } else if (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || (conn.rtt && conn.rtt > 1000))) {
    networkPill.classList.add('low-data');
    networkStatusLabel.textContent = '2G Low Data';
  } else {
    networkPill.classList.add('online');
    networkStatusLabel.textContent = 'Online (Lite)';
  }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
if (navigator.connection) {
  navigator.connection.addEventListener('change', updateNetworkStatus);
}
updateNetworkStatus();

// 5. Input Auto-Formatting (VFY-XXXX-XXXX)
codeInput.addEventListener('input', (e) => {
  let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  e.target.value = val;
  hideResults();
});

btnClear.addEventListener('click', () => {
  codeInput.value = '';
  codeInput.focus();
  hideResults();
});

btnPaste.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      codeInput.value = text.trim().toUpperCase();
      hideResults();
    }
  } catch {
    alert('Please paste using keyboard or long-press.');
  }
});

// Sample quick-fill buttons
document.querySelectorAll('.chip-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    codeInput.value = btn.getAttribute('data-code');
    hideResults();
    verifyCode(codeInput.value);
  });
});

function hideResults() {
  statusCard.classList.remove('visible');
  resultCard.classList.remove('visible');
}

// 6. Verification Handler
async function verifyCode(rawCode) {
  const code = (rawCode || codeInput.value).trim().toUpperCase();
  if (!code) {
    alert('Please enter or scan a product code.');
    codeInput.focus();
    return;
  }

  hideResults();
  btnVerify.disabled = true;
  statusCard.classList.add('visible');
  statusText.textContent = 'Connecting via low-bandwidth channel...';
  statusBytes.textContent = 'Request: 118 bytes';

  // Check network
  const isOnline = navigator.onLine;
  const isForcedOffline = code.includes('OFFLINE') || code.includes('LOST');

  await new Promise((resolve) => setTimeout(resolve, 350));

  statusText.textContent = 'Evaluating cryptographic signature...';
  statusBytes.textContent = 'Payload: 246 bytes received';

  await new Promise((resolve) => setTimeout(resolve, 250));

  statusCard.classList.remove('visible');
  btnVerify.disabled = false;

  if (!isOnline || isForcedOffline) {
    renderConnectionLost(code);
    return;
  }

  // Lookup result
  let match = PRODUCT_DATABASE[code];
  if (!match) {
    if (code.includes('FAKE') || code.includes('COUNT') || code.includes('INV')) {
      match = PRODUCT_DATABASE['FAKE-AMX-001'];
    } else if (code.includes('SUS') || code.includes('EXP')) {
      match = PRODUCT_DATABASE['LNT-2024-91'];
    } else {
      // Default to genuine CeraVe verified product
      match = {
        ...PRODUCT_DATABASE['VFY-2849-1036'],
        batch: code
      };
    }
  }

  renderResult(code, match);
  saveToHistory(code, match.outcome, match.title);
}

btnVerify.addEventListener('click', () => verifyCode(codeInput.value));

codeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    verifyCode(codeInput.value);
  }
});

// 7. Render Result
function renderResult(code, data) {
  resultCard.className = 'result-card visible ' + data.outcome;
  offlineActions.style.display = 'none';

  if (data.outcome === 'verified') {
    resultBadge.className = 'status-badge badge-verified';
    resultBadge.textContent = 'GENUINE • VERIFIED';
  } else if (data.outcome === 'suspicious') {
    resultBadge.className = 'status-badge badge-suspicious';
    resultBadge.textContent = 'SUSPICIOUS • CAUTION';
  } else {
    resultBadge.className = 'status-badge badge-counterfeit';
    resultBadge.textContent = 'COUNTERFEIT • DO NOT DISPENSE';
  }

  resultTitle.textContent = data.title;

  resultGrid.innerHTML = `
    <div class="grid-item">
      <div class="grid-item-label">Brand / Mfr</div>
      <div class="grid-item-value">${data.brand || data.manufacturer}</div>
    </div>
    <div class="grid-item">
      <div class="grid-item-label">NAFDAC Reg</div>
      <div class="grid-item-value">${data.nafdac}</div>
    </div>
    <div class="grid-item">
      <div class="grid-item-label">Batch Code</div>
      <div class="grid-item-value">${data.batch}</div>
    </div>
    <div class="grid-item">
      <div class="grid-item-label">Expiry Date</div>
      <div class="grid-item-value">${data.exp}</div>
    </div>
  `;

  resultNotes.innerHTML = `
    <strong>Security Assessment:</strong> ${data.notes}<br>
    <span style="font-size:12px; color:#64748B; margin-top:4px; display:inline-block;">
      Check HiddenMark seal on carton before handing to customer.
    </span>
  `;

  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 8. Render Connection Lost
function renderConnectionLost(code) {
  resultCard.className = 'result-card visible connection-lost';
  resultBadge.className = 'status-badge badge-lost';
  resultBadge.textContent = 'CONNECTION LOST';

  resultTitle.textContent = 'No Internet Connection';

  resultGrid.innerHTML = `
    <div class="grid-item" style="grid-column: 1 / -1;">
      <div class="grid-item-label">Product Code Checked</div>
      <div class="grid-item-value">${code}</div>
    </div>
  `;

  resultNotes.innerHTML = `
    <strong>Low Signal / Offline:</strong> Connection lost during the check. No response was received.<br>
    Use SMS or USSD verification below to verify without internet.
  `;

  offlineActions.style.display = 'flex';
  btnSms.href = `sms:?body=${encodeURIComponent(code)}`;
  btnUssd.href = 'tel:';

  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 9. Camera Scanner
btnToggleCamera.addEventListener('click', async () => {
  if (cameraContainer.style.display === 'block') {
    closeCamera();
    return;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    cameraVideo.srcObject = cameraStream;
    cameraContainer.style.display = 'block';
    btnToggleCamera.textContent = '✕ Close Camera';

    if ('BarcodeDetector' in window) {
      const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13'] });
      cameraScanningInterval = setInterval(async () => {
        try {
          const barcodes = await barcodeDetector.detect(cameraVideo);
          if (barcodes.length > 0) {
            const rawVal = barcodes[0].rawValue;
            codeInput.value = rawVal.toUpperCase();
            closeCamera();
            verifyCode(rawVal);
          }
        } catch {}
      }, 500);
    }
  } catch (err) {
    alert('Camera permission denied or camera not available on this device. Please use code entry.');
  }
});

function closeCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  if (cameraScanningInterval) {
    clearInterval(cameraScanningInterval);
    cameraScanningInterval = null;
  }
  cameraContainer.style.display = 'none';
  btnToggleCamera.textContent = '📷 Scan Barcode / QR';
}

btnCloseCamera.addEventListener('click', closeCamera);

// 10. Local Offline Scans History
function loadHistory() {
  const stored = localStorage.getItem('veryfy_lite_history');
  const items = stored ? JSON.parse(stored) : [];

  if (items.length === 0) {
    historyList.innerHTML = '<div style="color:#94A3B8; font-size:13px; text-align:center; padding:12px;">No recent checks saved on this device.</div>';
    return;
  }

  historyList.innerHTML = items.map((item) => `
    <div class="history-item" data-code="${item.code}">
      <div>
        <span class="history-code">${item.code}</span>
        <div style="font-size:12px; color:#64748B;">${item.name}</div>
      </div>
      <span class="history-pill ${item.outcome}">${item.outcome}</span>
    </div>
  `).join('');

  document.querySelectorAll('.history-item').forEach((row) => {
    row.addEventListener('click', () => {
      const code = row.getAttribute('data-code');
      codeInput.value = code;
      verifyCode(code);
    });
  });
}

function saveToHistory(code, outcome, name) {
  try {
    const stored = localStorage.getItem('veryfy_lite_history');
    let items = stored ? JSON.parse(stored) : [];
    items = items.filter((x) => x.code !== code);
    items.unshift({ code, outcome, name, timestamp: Date.now() });
    if (items.length > 50) items = items.slice(0, 50);
    localStorage.setItem('veryfy_lite_history', JSON.stringify(items));
    loadHistory();
  } catch {}
}

btnClearHistory.addEventListener('click', () => {
  localStorage.removeItem('veryfy_lite_history');
  loadHistory();
});

loadHistory();
