// ========== 設定エリア ==========
// GTOWizard Solution browser用の設定

// 1. GTOWizardのSolution browserを対象
const TARGET_URL_PATTERN = /gtowizard\.com/;

// 2. ボタンを追加する場所のセレクター（複数の候補を試行）
// GTOWizardの実際のDOM構造に合わせて調整してください
const BUTTON_CONTAINER_SELECTORS = [
  '[class*="tpmen_right"]',           // headerを含むクラス
];

// 3. スクリーンショット対象要素のセレクター（複数の候補を試行）
// Solution browserのメインコンテンツエリアを指定
const SCREENSHOT_TARGET_SELECTORS = [
  '[class*="laytsttd_main"]',  // solution-browserを含むクラス
];

// ========== メインコード ==========

// デバッグモード（コンソールにログを出力）
const DEBUG_MODE = true;

function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log('[GTOWizard Screenshot]', ...args);
  }
}

// ページが条件を満たすかチェック
function shouldActivate() {
  const shouldRun = TARGET_URL_PATTERN.test(window.location.href);
  debugLog('Should activate:', shouldRun, 'URL:', window.location.href);
  return shouldRun;
}

// 複数のセレクターから最初に見つかった要素を返す
function findElement(selectors, description = 'element') {
  for (const selector of selectors) {
    try {
      const element = document.querySelector(selector);
      if (element) {
        debugLog(`Found ${description} with selector:`, selector);
        return element;
      }
    } catch (e) {
      debugLog(`Error with selector "${selector}":`, e.message);
    }
  }
  debugLog(`Could not find ${description} with any selector`);
  return null;
}

// html2canvasライブラリを動的に読み込む（不要になったので削除）
// manifest.jsonでhtml2canvas.min.jsが先に読み込まれます

// スクリーンショットを撮影してクリップボードに保存
async function captureAndCopyToClipboard() {
  try {
    // html2canvasが読み込まれているか確認
    if (typeof html2canvas === 'undefined') {
      console.error('html2canvas is not loaded');
      showNotification('✗ html2canvasライブラリが読み込まれていません', 'error');
      return;
    }

    // スクリーンショット対象の要素を取得
    const targetElement = findElement(
      SCREENSHOT_TARGET_SELECTORS,
      'screenshot target'
    );

    if (!targetElement) {
      const message = 'スクリーンショット対象の要素が見つかりませんでした。\n\n開発者ツール（F12）のコンソールで [GTOWizard Screenshot] のログを確認し、\ncontent.jsの SCREENSHOT_TARGET_SELECTORS を調整してください。';
      alert(message);
      debugLog('Available selectors tried:', SCREENSHOT_TARGET_SELECTORS);
      return;
    }

    debugLog('Capturing element:', targetElement);

    // スクリーンショットを撮影
    showNotification('スクリーンショット撮影中...', 'info');

    const canvas = await html2canvas(targetElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2,  // 高解像度化
      logging: DEBUG_MODE
    });

    debugLog('Screenshot captured, canvas size:', canvas.width, 'x', canvas.height);

    // CanvasをBlobに変換
    canvas.toBlob(async (blob) => {
      try {
        // クリップボードに書き込み
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);

        debugLog('Successfully copied to clipboard');
        showNotification('✓ クリップボードにコピーしました！', 'success');
      } catch (err) {
        console.error('クリップボードへのコピーに失敗:', err);
        showNotification('✗ クリップボードへのコピーに失敗しました', 'error');
      }
    }, 'image/png');

  } catch (error) {
    console.error('スクリーンショットの撮影に失敗:', error);
    showNotification('✗ スクリーンショットの撮影に失敗しました', 'error');
  }
}

// 通知メッセージを表示
function showNotification(message, type = 'success') {
  // 既存の通知を削除
  const existingNotification = document.querySelector('.gto-screenshot-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `gto-screenshot-notification gto-notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, type === 'info' ? 1000 : 2500);
}

// スクリーンショットボタンを作成して追加
function addScreenshotButton() {
  const container = findElement(
    BUTTON_CONTAINER_SELECTORS,
    'button container'
  );

  if (!container) {
    debugLog('Button container not found. Will retry...');
    return false;
  }

  // 既にボタンが追加されているかチェック
  if (document.querySelector('.gto-screenshot-button')) {
    debugLog('Button already exists');
    return true;
  }

  // ボタン要素を作成
  const button = document.createElement('button');
  button.className = 'gto-screenshot-button';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  `;
  button.title = 'スクリーンショットを撮影してクリップボードにコピー';

  // クリックイベント
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    captureAndCopyToClipboard();
  });

  // ボタンを追加
  container.appendChild(button);
  debugLog('Screenshot button added successfully');
  return true;
}

// 初期化
function init() {
  if (!shouldActivate()) {
    return;
  }

  debugLog('Initializing GTOWizard Screenshot Extension');

  // ボタンを追加する関数（リトライ機能付き）
  let retryCount = 0;
  const maxRetries = 20;
  const retryInterval = 500;

  function tryAddButton() {
    if (addScreenshotButton()) {
      debugLog('Initialization complete');
      return;
    }

    retryCount++;
    if (retryCount < maxRetries) {
      debugLog(`Retry ${retryCount}/${maxRetries} in ${retryInterval}ms...`);
      setTimeout(tryAddButton, retryInterval);
    } else {
      debugLog('Failed to add button after max retries');
      console.warn(
        'GTOWizard Screenshot: ボタンの追加に失敗しました。\n' +
        'content.jsのBUTTON_CONTAINER_SELECTORSを調整してください。\n' +
        'F12でコンソールを開き、DOM構造を確認してください。'
      );
    }
  }

  // ページ読み込み後にボタンを追加
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAddButton);
  } else {
    tryAddButton();
  }

  // 動的なコンテンツ変更を監視
  const observer = new MutationObserver(() => {
    if (!document.querySelector('.gto-screenshot-button')) {
      debugLog('Button removed, re-adding...');
      addScreenshotButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 実行
init();
