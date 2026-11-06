// VERYFY PWA — Production Application Logic matching Figma Handoff 666-37955

// 1. Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/lite/sw.js', { scope: '/lite/' })
      .then((reg) => console.log('[Veryfy PWA SW] Registered:', reg.scope))
      .catch((err) => console.warn('[Veryfy PWA SW] Registration error:', err));
  });
}

// 2. Authoritative Verification Database (Exact 4 Outcomes)
const VERIFICATION_OUTCOMES = {
  verified: {
    outcome: 'verified',
    badgeLabel: 'Verified',
    badgeClass: 'verified',
    heading: 'Product Successfully Verified',
    subheading:
      'This product has been successfully authenticated. It has passed the verification check and is recognized as a verified item.',
    badgeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#010B4F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`
  },
  not_verified: {
    outcome: 'not_verified',
    badgeLabel: 'Not Verified',
    badgeClass: 'not-verified',
    heading: 'Product Not Verified',
    subheading:
      'We could not verify the authenticity of this product. Please exercise caution and contact the manufacturer or authorized retailer for further assistance.',
    badgeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
  invalid: {
    outcome: 'invalid',
    badgeLabel: 'Invalid Code',
    badgeClass: 'invalid',
    heading: 'Invalid Verification Code',
    subheading:
      'The verification code you entered is invalid or does not exist in our verification records. Please check the code and try again.',
    badgeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
  },
  suspicious: {
    outcome: 'suspicious',
    badgeLabel: 'Suspicious',
    badgeClass: 'suspicious',
    heading: 'Suspicious Product Detected',
    subheading:
      'This product has been flagged as suspicious and may be counterfeit. We strongly recommend that you do not purchase, use, or distribute this item until its authenticity has been confirmed. Please contact the manufacturer or relevant verification authority.',
    badgeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
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
  if (!raw) return '';
  // Normalize uppercase and preserve letters, numbers, and hyphens
  return raw.toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

function validateCodeState(val) {
  const trimmed = val ? val.trim().toUpperCase() : '';

  if (!trimmed) {
    inputWrapper.className = 'input-box-wrapper';
    inputHelper.className = 'input-helper-text';
    inputHelper.innerHTML = '<span>Format: e.g. VF-2026-0001</span>';
    btnHomeVerify.disabled = true;
    return;
  }

  // Any non-empty code of at least 3 characters is accepted for verification
  if (trimmed.length >= 3) {
    inputWrapper.className = 'input-box-wrapper focused';
    inputHelper.className = 'input-helper-text';
    inputHelper.innerHTML = '<span>Code entered. Ready to verify.</span>';
    btnHomeVerify.disabled = false;
  } else {
    inputWrapper.className = 'input-box-wrapper invalid';
    inputHelper.className = 'input-helper-text error';
    inputHelper.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
        <circle cx="12" cy="12" r="10" fill="#DC2626"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1" fill="#FFFFFF"/>
      </svg>
      <span>Please enter a product verification code.</span>
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

// Quick Demo Code Buttons
document.querySelectorAll('.demo-quick-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const code = btn.getAttribute('data-code');
    if (code) {
      codeInput.value = code;
      validateCodeState(code);
    }
  });
});

// 6. Home Actions
btnHomeVerify.addEventListener('click', () => {
  const code = codeInput.value.trim().toUpperCase() || 'VF-2026-0001';
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
  const normalized = (code || '').trim().toUpperCase();

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
  if (!navigator.onLine || normalized.includes('OFFLINE') || normalized.includes('LOST')) {
    triggerServiceUnavailable();
    return;
  }
  if (normalized.includes('TIMEOUT') || normalized.includes('TIME')) {
    triggerTimeout();
    return;
  }

  // Determine outcome based on authoritative demo codes:
  // VF-2026-0001 -> Verified
  // VF-2026-0002 -> Not Verified / Unverified
  // VF-2026-0003 -> Invalid Code
  // VF-2026-0004 -> Suspicious / Counterfeit
  // Any unrecognized code (e.g. RANDOM-CODE-123) -> Invalid Code!
  let outcome = 'invalid';

  if (
    normalized === 'VF-2026-0001' ||
    normalized === 'VERIFY-2026-001' ||
    normalized === 'VF-4829-7610' ||
    normalized === 'VFY-2849-1036'
  ) {
    outcome = 'verified';
  } else if (
    normalized === 'VF-2026-0002' ||
    normalized === 'VERIFY-2026-002' ||
    normalized === 'VF-4829-7612'
  ) {
    outcome = 'not_verified';
  } else if (
    normalized === 'VF-2026-0003' ||
    normalized === 'VERIFY-2026-003' ||
    normalized === 'VF-4829-7613'
  ) {
    outcome = 'invalid';
  } else if (
    normalized === 'VF-2026-0004' ||
    normalized === 'VERIFY-2026-004' ||
    normalized === 'VF-4829-7611'
  ) {
    outcome = 'suspicious';
  } else if (
    normalized.includes('SUS') ||
    normalized.includes('ATTN') ||
    normalized.includes('FAKE') ||
    normalized.includes('COUNT')
  ) {
    outcome = 'suspicious';
  } else if (
    normalized.includes('NOT') ||
    normalized.includes('UNVER')
  ) {
    outcome = 'not_verified';
  } else if (
    (normalized.includes('VER') || normalized.startsWith('VF-2026-')) &&
    (normalized.endsWith('0001') || normalized.endsWith('001') || normalized.includes('CERAVE'))
  ) {
    outcome = 'verified';
  } else {
    // Unknown or unrecognized codes (e.g. RANDOM-CODE-123) ALWAYS map to Invalid Code!
    outcome = 'invalid';
  }

  showResultScreen(normalized, outcome);
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
