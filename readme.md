# GTOWizard Screenshot Tool

GTOWizard Solution browser用のChrome拡張機能です。ワンクリックでスクリーンショットを撮影し、クリップボードに保存できます。

## ⚡ クイックスタート

**最も重要：html2canvas.min.jsのダウンロードを忘れずに！**

1. フォルダを作成し、4つのファイルを配置：
    - `manifest.json` ✓
    - `content.js` ✓
    - `styles.css` ✓
    - `html2canvas.min.js` ⚠️ **← これをダウンロード！**

2. html2canvas.min.jsのダウンロード：
   ```bash
   # ブラウザで以下のURLを開いて保存（Ctrl+S）
   https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
   ```

3. Chromeで `chrome://extensions/` を開いて読み込み

## 📋 機能

- ✨ GTOWizardのUIに統合されたスクリーンショットボタン
- 📸 Solution browserのメインコンテンツを自動検出してキャプチャ
- 📋 スクリーンショットを自動的にクリップボードに保存
- 🎨 GTOWizardのダークテーマに合わせたデザイン
- 🔍 複数のセレクターで柔軟に要素を検出
- 🐛 デバッグモードでトラブルシューティングが簡単

## 📦 インストール方法

1. **フォルダの作成**
   ```bash
   mkdir gtowizard-screenshot
   cd gtowizard-screenshot
   ```

2. **ファイルの準備**

   **必須ファイル（3つ）：**
    - `manifest.json`
    - `content.js`
    - `styles.css`

   **html2canvasライブラリのダウンロード：**
    - https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js にアクセス
    - ページ全体を保存（Ctrl+S / Cmd+S）
    - `html2canvas.min.js` という名前で同じフォルダに保存

   または、以下のコマンドでダウンロード：
   ```bash
   # Windowsの場合（PowerShell）
   Invoke-WebRequest -Uri "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" -OutFile "html2canvas.min.js"
   
   # macOS/Linuxの場合
   curl -o html2canvas.min.js https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
   ```

   **最終的なフォルダ構成：**
   ```
   gtowizard-screenshot/
   ├── manifest.json
   ├── content.js
   ├── styles.css
   └── html2canvas.min.js  ← 重要！
   ```

3. **Chromeに読み込み**
    - Chrome で `chrome://extensions/` を開く
    - 右上の「デベロッパーモード」をON
    - 「パッケージ化されていない拡張機能を読み込む」をクリック
    - 作成したフォルダを選択

4. **GTOWizardで確認**
    - `app.gtowizard.com` にアクセス
    - Solution browserを開く
    - Screenshotボタンが表示されることを確認

## 🔧 トラブルシューティング

### html2canvasが読み込まれていないエラー

**エラーメッセージ：** `html2canvas is not loaded` または CSP violation

**原因：** `html2canvas.min.js` ファイルが見つからないか、manifest.jsonで正しく読み込まれていない

**解決方法：**
1. フォルダに `html2canvas.min.js` があることを確認
2. ファイル名が正確に `html2canvas.min.js` であることを確認（大文字小文字も含む）
3. Chrome拡張機能のページで「再読み込み」ボタンをクリック

### ボタンが表示されない場合

1. **F12を押して開発者ツールを開く**
2. **コンソールタブを確認**
3. **`[GTOWizard Screenshot]` のログを探す**
4. **適切なセレクターを見つける**

#### ボタン配置場所の調整

`content.js`の`BUTTON_CONTAINER_SELECTORS`配列を編集：

```javascript
const BUTTON_CONTAINER_SELECTORS = [
  '[class*="あなたが見つけたクラス名"]',
  // 他のセレクター...
];
```

#### スクリーンショット対象の調整

`content.js`の`SCREENSHOT_TARGET_SELECTORS`配列を編集：

```javascript
const SCREENSHOT_TARGET_SELECTORS = [
  '[class*="あなたが見つけたクラス名"]',
  // 他のセレクター...
];
```

### セレクターの見つけ方

1. 開発者ツール（F12）を開く
2. 要素選択ツール（左上の矢印アイコン）をクリック
3. 対象の要素をクリック
4. Elementsタブで要素のclass名やid、構造を確認
5. 見つけたセレクターを`content.js`に追加

## 🎨 スタイルのカスタマイズ

`styles.css`を編集してボタンのデザインを変更できます：

```css
.gto-screenshot-button {
  /* ボタンの色を変更 */
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
  
  /* ボタンのサイズを変更 */
  padding: 8px 14px;
  font-size: 13px;
}
```

## 🐛 デバッグモード

`content.js`の`DEBUG_MODE`を`true`に設定すると、詳細なログがコンソールに出力されます：

```javascript
const DEBUG_MODE = true;
```

## 💡 使用方法

1. GTOWizardのSolution browserを開く
2. Screenshotボタンをクリック
3. スクリーンショットが自動的にクリップボードに保存される
4. お好みのアプリケーション（Discord、Slack、メモ帳など）に貼り付け（Ctrl+V / Cmd+V）

## 📝 技術仕様

- **Manifest Version**: 3
- **対応サイト**: `app.gtowizard.com`、`*.gtowizard.com`
- **権限**: `activeTab`, `clipboardWrite`
- **依存ライブラリ**: html2canvas v1.4.1（ローカルファイルとして含める）
- **CSP対策**: 外部CDNではなくローカルファイルとして読み込み

## ⚠️ 注意事項

- この拡張機能はGTOWizardの公式ツールではありません
- GTOWizardのUIが更新された場合、セレクターの調整が必要になる場合があります
- スクリーンショットは個人利用の範囲でご使用ください

## 🔄 更新履歴

### v1.0.0 (2025)
- 初回リリース
- GTOWizard Solution browser対応
- 複数セレクターによる柔軟な要素検出
- デバッグモード実装
- CSP対策：html2canvasをローカルに含める方式に変更
