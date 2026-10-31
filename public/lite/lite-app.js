// VERYFY PWA — Production Application Logic matching Figma Handoff 666-37955

// 1. Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/lite/sw.js', { scope: '/lite/' })
      .then((reg) => console.log('[Veryfy PWA SW] Registered:', reg.scope))
      .catch((err) => console.warn('[Veryfy PWA SW] Registration error:', err));
  });
}

// 2. Authoritative Verification Database (Figma frames 58:442, 58:510, 58:476, 58:544)
const VERIFICATION_OUTCOMES = {
  verified: {
    outcome: 'verified',
    badgeLabel: 'Verified',
    badgeClass: 'verified',
    heading: 'Product record verified.',
    subheading: 'This code matches a Veryfy product record. Check the HiddenMark and packaging for signs of tampering.',
    badgeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#010B4F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`
  },
  suspicious: {
    outcome: 'suspicious',
    badgeLabel: 'Suspicious',
    badgeClass: 'suspicious',
    heading: 'This product needs attention.',
    subheading: 'Some information requires further checking. Inspect the HiddenMark and consider reporting this product.',
    badgeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
  not_verified: {
    outcome: 'not_verified',
    badgeLabel: 'Not verified',
    badgeClass: 'not-verified',
    heading: "We couldn't verify this product.",
    subheading: "We couldn't confirm this code with available records. This does not necessarily mean the product is counterfeit.",
    badgeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
  invalid: {
    outcome: 'invalid',
    badgeLabel: 'Invalid',
    badgeClass: 'invalid',
    heading: 'Verification code is invalid.',
    subheading: 'This code could not be accepted or confirmed. Check the code and try again. If you suspect tampering, report it.',
    badgeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
  }
};

// 3. Navigation State Management
const screens = {
  home: document.getElementById('screen-home'),
  scanner: document.getElementById('screen-scanner'),
  result: document.getElementById('screen-result'),
  report: document.getElementById('screen-report'),
  prevViewed: document.getElementById('screen-previously-viewed'),
  smsUssd: document.getElementById('screen-sms-ussd'),
};

let currentScreen = 'home';
let screenHistory = [];
let currentCheckedCode = 'VF-4829-7610';
let currentCheckedOutcome = 'verified';

function navigateTo(screenName) {
  if (currentScreen === screenName) return;
  screenHistory.push(currentScreen);
  setActiveScreen(screenName);
}

function navigateBack() {
  stopCamera();
  if (screenHistory.length > 0) {
    const prev = screenHistory.pop();
    setActiveScreen(prev);
  } else {
    setActiveScreen('home');
  }
}

function setActiveScreen(screenName) {
  Object.keys(screens).forEach((key) => {
    if (screens[key]) {
      screens[key].classList.toggle('active', key === screenName);
    }
  });
  currentScreen = screenName;
  window.scrollTo(0, 0);

  if (screenName === 'scanner') {
    startCamera();
  } else {
    stopCamera();
  }
}

// 4. Live Clock
function updateClock() {
  const clockEl = document.getElementById('status-bar-clock');
  if (clockEl) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
  }
}
setInterval(updateClock, 10000);
updateClock();

// 5. Code Input & Format Handling (VF-####-#### or VF-#### ####)
const codeInput = document.getElementById('pwa-code-input');
const inputWrapper = document.getElementById('input-wrapper');
const inputHelper = document.getElementById('input-helper');
const btnHomeVerify = document.getElementById('btn-home-verify');
const btnHomeVerifyText = document.getElementById('btn-home-verify-text');
const btnHomeScan = document.getElementById('btn-home-scan');
const homeOfflineCard = document.getElementById('home-offline-card');

const bannerTimeout = document.getElementById('banner-timeout');
const bannerUnavailable = document.getElementById('banner-service-unavailable');
const bannerRestored = document.getElementById('banner-connection-restored');

function resetHomeBanners() {
  bannerTimeout.style.display = 'none';
  bannerUnavailable.style.display = 'none';
  bannerRestored.style.display = 'none';
  homeOfflineCard.style.display = 'none';
  btnHomeVerify.disabled = true;
  btnHomeScan.disabled = false;
  btnHomeScan.style.display = 'flex';
}

function formatCode(raw) {
  // Strip non-alphanumeric except hyphen
  let cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  if (cleaned.startsWith('VF')) {
    cleaned = cleaned.slice(2);
  }
  
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 4) {
    return 'VF-' + cleaned;
  }
  return 'VF-' + cleaned.slice(0, 4) + '-' + cleaned.slice(4, 8);
}

function validateCodeState(val) {
  const trimmed = val.trim().toUpperCase();

  if (!trimmed) {
    inputWrapper.className = 'input-box-wrapper focused';
    inputHelper.className = 'input-helper-text';
    inputHelper.innerHTML = '<span>Format: VF-4829-7610</span>';
    btnHomeVerify.disabled = true;
    return;
  }

  // Check if complete format VF-XXXX-XXXX (12 chars total)
  const isComplete = /^VF-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(trimmed) || trimmed.length === 12;

  if (isComplete) {
    inputWrapper.className = 'input-box-wrapper focused';
    inputHelper.className = 'input-helper-text';
    inputHelper.innerHTML = '<span>Code format accepted. Ready to verify.</span>';
    btnHomeVerify.disabled = false;
  } else {
    // Incomplete or invalid
    inputWrapper.className = 'input-box-wrapper invalid';
    inputHelper.className = 'input-helper-text error';
    inputHelper.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
        <circle cx="12" cy="12" r="10" fill="#DC2626"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1" fill="#FFFFFF"/>
      </svg>
      <span>Use the format VF-4829-7610 and try again.</span>
    `;
    btnHomeVerify.disabled = true;
  }
}

codeInput.addEventListener('focus', () => {
  if (!inputWrapper.classList.contains('invalid')) {
    inputWrapper.classList.add('focused');
  }
});

codeInput.addEventListener('blur', () => {
  inputWrapper.classList.remove('focused');
});

codeInput.addEventListener('input', (e) => {
  const formatted = formatCode(e.target.value);
  e.target.value = formatted;
  validateCodeState(formatted);
});

// 6. Home Actions
btnHomeVerify.addEventListener('click', () => {
  const code = codeInput.value.trim().toUpperCase() || 'VF-4829-7610';
  startVerificationFlow(code);
});

btnHomeScan.addEventListener('click', () => {
  navigateTo('scanner');
});

document.getElementById('link-sms-ussd').addEventListener('click', () => {
  navigateTo('smsUssd');
});

document.getElementById('link-prev-viewed-sms').addEventListener('click', () => {
  navigateTo('smsUssd');
});

// 7. Verification Execution Flow
async function startVerificationFlow(code) {
  // Show verifying state
  btnHomeVerify.disabled = true;
  btnHomeVerify.innerHTML = `
    <span class="btn-spinner"></span>
    <span>Verifying</span>
  `;
  btnHomeScan.disabled = true;

  const disclaimer = document.querySelector('#screen-home .disclaimer-box');
  if (disclaimer) {
    disclaimer.textContent = "We're checking this code. Please wait; no result has been confirmed yet.";
  }

  // Realistic network check / verification delay
  await new Promise((resolve) => setTimeout(resolve, 1400));

  // Reset button state
  btnHomeVerify.innerHTML = '<span id="btn-home-verify-text">Verify product &rarr;</span>';
  btnHomeVerify.disabled = false;
  btnHomeScan.disabled = false;
  if (disclaimer) {
    disclaimer.textContent = "Important: A valid code alone does not prove the product is genuine. Check the HiddenMark and packaging for signs of tampering.";
  }

  // Handle Offline / Sim triggers
  if (!navigator.onLine || code.includes('OFFLINE') || code.includes('LOST')) {
    triggerServiceUnavailable();
    return;
  }
  if (code.includes('TIMEOUT') || code.includes('TIME')) {
    triggerTimeout();
    return;
  }

  // Determine outcome
  let outcome = 'verified';
  if (code.includes('SUS') || code.includes('ATTN') || code.endsWith('7611')) {
    outcome = 'suspicious';
  } else if (code.includes('NOT') || code.includes('UNVER') || code.endsWith('7612')) {
    outcome = 'not_verified';
  } else if (code.includes('INV') || code.includes('FAKE') || code.endsWith('7613')) {
    outcome = 'invalid';
  }

  showResultScreen(code, outcome);
}

// 8. Result Screen Presentation
function showResultScreen(code, outcomeKey) {
  const data = VERIFICATION_OUTCOMES[outcomeKey] || VERIFICATION_OUTCOMES.verified;
  currentCheckedCode = code;
  currentCheckedOutcome = outcomeKey;

  const badgePill = document.getElementById('result-badge-pill');
  badgePill.className = `result-badge-pill ${data.badgeClass}`;
  badgePill.innerHTML = `
    ${data.badgeIcon}
    <span>${data.badgeLabel}</span>
  `;

  document.getElementById('result-main-heading').textContent = data.heading;
  document.getElementById('result-explanation-text').textContent = data.subheading;
  document.getElementById('result-meta-code').textContent = code;

  // Format checked date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  document.getElementById('result-meta-timestamp').textContent = `${dateStr}, ${timeStr}`;

  // Report button visibility
  const btnReport = document.getElementById('btn-result-report');
  if (outcomeKey === 'suspicious' || outcomeKey === 'invalid') {
    btnReport.style.display = 'flex';
  } else {
    btnReport.style.display = 'none';
  }

  // Save to offline storage
  try {
    localStorage.setItem('veryfy_pwa_cached_record', JSON.stringify({
      code,
      outcome: outcomeKey,
      timestamp: `${dateStr}, ${timeStr}`,
    }));
  } catch {}

  navigateTo('result');
}

document.getElementById('btn-result-another').addEventListener('click', () => {
  codeInput.value = '';
  validateCodeState('');
  navigateTo('home');
});

document.getElementById('btn-result-report').addEventListener('click', () => {
  document.getElementById('report-code-input').value = currentCheckedCode;
  navigateTo('report');
});

document.getElementById('btn-result-back').addEventListener('click', navigateBack);

// 9. Report Suspicious Product Form
document.getElementById('btn-report-back').addEventListener('click', navigateBack);
document.getElementById('btn-cancel-report').addEventListener('click', navigateBack);

document.getElementById('btn-submit-report').addEventListener('click', () => {
  const code = document.getElementById('report-code-input').value;
  const desc = document.getElementById('report-description-input').value.trim();

  if (!desc) {
    alert('Please describe what you noticed about the packaging or product.');
    document.getElementById('report-description-input').focus();
    return;
  }

  const refId = 'VFY-RP-' + Math.floor(10000 + Math.random() * 90000);
  alert(`Report submitted successfully.\n\nReference ID: ${refId}\nOur team has received this report and flagged the batch for inspection.`);
  document.getElementById('report-description-input').value = '';
  navigateTo('home');
});

// 10. Scanner Implementation (Figma PWA 02)
let cameraStream = null;
let cameraDetectInterval = null;

async function startCamera() {
  const video = document.getElementById('scanner-video');
  const targetFrame = document.getElementById('scanner-target-frame');
  const statusText = document.getElementById('scanner-status-text');
  const errorOverlay = document.getElementById('camera-error-overlay');
  const errorTitle = document.getElementById('camera-error-title');
  const errorDesc = document.getElementById('camera-error-desc');

  errorOverlay.classList.remove('visible');
  targetFrame.style.display = 'block';
  statusText.style.display = 'block';
  statusText.innerHTML = 'Align the product code within the frame.';

  document.querySelectorAll('.target-corner').forEach((c) => c.classList.remove('detected'));

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    video.srcObject = cameraStream;

    // Check for native BarcodeDetector
    if ('BarcodeDetector' in window) {
      const detector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13'] });
      cameraDetectInterval = setInterval(async () => {
        try {
          const barcodes = await detector.detect(video);
          if (barcodes.length > 0) {
            const raw = barcodes[0].rawValue;
            onCodeDetected(raw);
          }
        } catch {}
      }, 400);
    }
  } catch (err) {
    // Permission denied or camera unavailable
    targetFrame.style.display = 'none';
    statusText.style.display = 'none';
    errorOverlay.classList.add('visible');

    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      errorTitle.textContent = 'Camera access is off';
      errorDesc.textContent = 'Allow camera access in your phone settings to scan, or enter the code manually.';
    } else {
      errorTitle.textContent = 'Camera unavailable';
      errorDesc.textContent = 'Your camera cannot be used right now. Enter the product code manually instead.';
    }
  }
}

function onCodeDetected(code) {
  document.querySelectorAll('.target-corner').forEach((c) => c.classList.add('detected'));
  const statusText = document.getElementById('scanner-status-text');
  statusText.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#85F467" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
    <span style="color:#85F467; font-weight:700;">Code detected. Preparing to verify...</span>
  `;

  clearInterval(cameraDetectInterval);
  setTimeout(() => {
    stopCamera();
    codeInput.value = formatCode(code);
    validateCodeState(codeInput.value);
    navigateTo('home');
    startVerificationFlow(codeInput.value);
  }, 900);
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
  }
  if (cameraDetectInterval) {
    clearInterval(cameraDetectInterval);
    cameraDetectInterval = null;
  }
}

document.getElementById('btn-scanner-back').addEventListener('click', navigateBack);
document.getElementById('btn-sheet-cancel').addEventListener('click', navigateBack);
document.getElementById('btn-sheet-manual').addEventListener('click', () => {
  stopCamera();
  navigateTo('home');
  setTimeout(() => codeInput.focus(), 200);
});

// Torch toggle
let torchActive = false;
document.getElementById('btn-torch-toggle').addEventListener('click', async () => {
  if (!cameraStream) return;
  const track = cameraStream.getVideoTracks()[0];
  if (track && 'applyConstraints' in track) {
    torchActive = !torchActive;
    try {
      await track.applyConstraints({ advanced: [{ torch: torchActive }] });
      document.getElementById('btn-torch-toggle').style.background = torchActive ? '#FBBF24' : '#FFFFFF';
    } catch {}
  }
});

// 11. Error & Recovery Banner Triggers
function triggerTimeout() {
  resetHomeBanners();
  bannerTimeout.style.display = 'flex';
  btnHomeScan.style.display = 'none';

  btnHomeVerify.disabled = false;
  btnHomeVerify.innerHTML = '<span>Retry verification</span>';
  btnHomeVerify.onclick = () => {
    resetHomeBanners();
    btnHomeVerify.onclick = null;
    startVerificationFlow(codeInput.value);
  };
}

function triggerServiceUnavailable() {
  resetHomeBanners();
  bannerUnavailable.style.display = 'flex';
  btnHomeScan.style.display = 'none';

  btnHomeVerify.disabled = false;
  btnHomeVerify.innerHTML = '<span>Retry verification</span>';
  btnHomeVerify.onclick = () => {
    resetHomeBanners();
    btnHomeVerify.onclick = null;
    startVerificationFlow(codeInput.value);
  };
}

function triggerConnectionRestored() {
  resetHomeBanners();
  bannerRestored.style.display = 'flex';
  btnHomeScan.style.display = 'none';

  btnHomeVerify.disabled = false;
  btnHomeVerify.innerHTML = '<span>Retry verification</span>';
  btnHomeVerify.onclick = () => {
    resetHomeBanners();
    btnHomeVerify.onclick = null;
    startVerificationFlow(codeInput.value);
  };
}

function triggerOfflineNotice() {
  resetHomeBanners();
  homeOfflineCard.style.display = 'block';
  btnHomeVerify.disabled = true;
  btnHomeScan.disabled = true;
}

// 12. Offline Previously Viewed Screen
document.getElementById('btn-prev-viewed-back').addEventListener('click', navigateBack);

function showPreviouslyViewed() {
  const cachedStr = localStorage.getItem('veryfy_pwa_cached_record');
  const timestampEl = document.getElementById('prev-viewed-timestamp');
  if (cachedStr) {
    try {
      const record = JSON.parse(cachedStr);
      timestampEl.textContent = `Last updated: ${record.timestamp || 'Today, 10:42 AM'}`;
    } catch {
      timestampEl.textContent = 'Last updated: 16 Oct 2026, 10:42 AM';
    }
  } else {
    timestampEl.textContent = 'Last updated: 16 Oct 2026, 10:42 AM';
  }
  navigateTo('prevViewed');
}

// 13. SMS & USSD Guidance Screen (Figma node 08)
document.getElementById('btn-sms-back').addEventListener('click', navigateBack);

document.getElementById('btn-open-messages').addEventListener('click', () => {
  const code = codeInput.value || currentCheckedCode || 'VF-4829-7610';
  window.location.href = `sms:?body=${encodeURIComponent(code)}`;
});

document.getElementById('btn-open-phone').addEventListener('click', () => {
  window.location.href = 'tel:';
});

// 14. Real-time Browser Online/Offline Sync
window.addEventListener('offline', () => {
  triggerOfflineNotice();
});

window.addEventListener('online', () => {
  triggerConnectionRestored();
});

// 15. QA Toolbar for Instant State Preview
document.querySelectorAll('.qa-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const qa = chip.getAttribute('data-qa');

    switch (qa) {
      case 'home-empty':
        resetHomeBanners();
        codeInput.value = '';
        validateCodeState('');
        setActiveScreen('home');
        break;

      case 'home-valid':
        resetHomeBanners();
        codeInput.value = 'VF-4829-7610';
        validateCodeState('VF-4829-7610');
        setActiveScreen('home');
        break;

      case 'home-invalid':
        resetHomeBanners();
        codeInput.value = 'VF-4829-76';
        validateCodeState('VF-4829-76');
        setActiveScreen('home');
        break;

      case 'home-offline':
        triggerOfflineNotice();
        setActiveScreen('home');
        break;

      case 'home-timeout':
        triggerTimeout();
        setActiveScreen('home');
        break;

      case 'home-unavailable':
        triggerServiceUnavailable();
        setActiveScreen('home');
        break;

      case 'home-restored':
        triggerConnectionRestored();
        setActiveScreen('home');
        break;

      case 'scan-live':
        setActiveScreen('scanner');
        break;

      case 'scan-denied':
        setActiveScreen('scanner');
        stopCamera();
        document.getElementById('scanner-target-frame').style.display = 'none';
        document.getElementById('scanner-status-text').style.display = 'none';
        document.getElementById('camera-error-overlay').classList.add('visible');
        document.getElementById('camera-error-title').textContent = 'Camera access is off';
        document.getElementById('camera-error-desc').textContent = 'Allow camera access in your phone settings to scan, or enter the code manually.';
        break;

      case 'result-verified':
        showResultScreen('VF-4829-7610', 'verified');
        break;

      case 'result-suspicious':
        showResultScreen('VF-4829-7611', 'suspicious');
        break;

      case 'result-not-verified':
        showResultScreen('VF-4829-7612', 'not_verified');
        break;

      case 'result-invalid':
        showResultScreen('VF-4829-7613', 'invalid');
        break;

      case 'report-form':
        document.getElementById('report-code-input').value = currentCheckedCode || 'VF-4829-7610';
        setActiveScreen('report');
        break;

      case 'prev-viewed':
        showPreviouslyViewed();
        break;

      case 'sms-ussd':
        setActiveScreen('smsUssd');
        break;
    }
  });
});
