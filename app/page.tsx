'use client';

import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';

type Screen = 'input' | 'analyzing' | 'results';

type Candidate = {
  id: number;
  productName: string;
  manufacturer: string;
  modelNumber: string;
  price: string;
  confidence: number;
  searchWord: string;
};

const dummyCandidates: Candidate[] = [
  {
    id: 1,
    productName: 'ノイズキャンセリングヘッドホン WH-1000XM5',
    manufacturer: 'SONY',
    modelNumber: 'WH-1000XM5',
    price: '¥29,800',
    confidence: 96,
    searchWord: 'SONY WH-1000XM5 ヘッドホン ブラック',
  },
  {
    id: 2,
    productName: '完全ワイヤレスイヤホン QuietComfort Ultra Earbuds',
    manufacturer: 'Bose',
    modelNumber: 'QC Ultra Earbuds',
    price: '¥24,500',
    confidence: 91,
    searchWord: 'Bose QuietComfort Ultra Earbuds',
  },
  {
    id: 3,
    productName: 'Bluetoothスピーカー SoundLink Flex',
    manufacturer: 'Bose',
    modelNumber: 'SoundLink Flex',
    price: '¥11,000',
    confidence: 88,
    searchWord: 'Bose SoundLink Flex portable speaker',
  },
  {
    id: 4,
    productName: 'ポータブルゲーミングPC Legion Go',
    manufacturer: 'Lenovo',
    modelNumber: '83E10027JP',
    price: '¥78,000',
    confidence: 84,
    searchWord: 'Lenovo Legion Go 83E10027JP',
  },
  {
    id: 5,
    productName: 'ミラーレス一眼カメラ EOS R10 ボディ',
    manufacturer: 'Canon',
    modelNumber: 'EOS R10',
    price: '¥98,000',
    confidence: 81,
    searchWord: 'Canon EOS R10 body',
  },
];

const analyzingMessages = [
  '画像の特徴を抽出しています…',
  'メーカーと型番を推定しています…',
  'ハードオフ掲載候補を検索しています…',
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>('input');
  const [query, setQuery] = useState('SONYの黒いヘッドホンを撮影');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const headerTitle = useMemo(() => {
    if (screen === 'input') return '入力画面';
    if (screen === 'analyzing') return '解析中';
    return '候補結果';
  }, [screen]);

  const startAnalysis = () => {
    setScreen('analyzing');
    window.setTimeout(() => {
      setScreen('results');
    }, 1800);
  };

  const resetFlow = () => {
    setCopiedId(null);
    setScreen('input');
  };

  const handleCopy = async (candidate: Candidate) => {
    const text = `${candidate.productName} / ${candidate.manufacturer} / ${candidate.modelNumber} / ${candidate.searchWord}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(candidate.id);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      setCopiedId(candidate.id);
      window.setTimeout(() => setCopiedId(null), 1400);
    }
  };

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <div className="status-bar">
          <span>9:41</span>
          <span>MVP Preview</span>
        </div>

        <header className="screen-header">
          <div>
            <p className="eyebrow">HardOff Searcher</p>
            <h1>{headerTitle}</h1>
          </div>
          <button className="ghost-button" onClick={resetFlow}>
            最初に戻る
          </button>
        </header>

        {screen === 'input' && (
          <div className="screen-body input-screen">
            <div className="hero-card">
              <p className="hero-label">MVPフロー</p>
              <h2>写真・メモから商品候補を探す</h2>
              <p>
                スマホ縦画面専用の試作です。まずはダミーデータで、入力 → 解析中 → 結果確認の流れを体験できます。
              </p>
            </div>

            <label className="field-card">
              <span className="field-label">入力メモ</span>
              <textarea
                value={query}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setQuery(event.target.value)}
                rows={5}
                placeholder="例: SONYのヘッドホン。側面ロゴあり。黒色。"
              />
            </label>

            <div className="upload-card">
              <div>
                <p className="field-label">画像アップロード枠</p>
                <p className="upload-note">MVPではダミー表示です。将来的に写真選択とOCRを接続予定。</p>
              </div>
              <div className="upload-placeholder">IMG</div>
            </div>

            <button className="primary-button" onClick={startAnalysis}>
              解析を開始する
            </button>
          </div>
        )}

        {screen === 'analyzing' && (
          <div className="screen-body analyzing-screen">
            <div className="loader-ring" aria-hidden="true" />
            <h2>候補を解析しています</h2>
            <p className="analyzing-query">「{query || '入力内容なし'}」をもとに検索候補を生成中です。</p>
            <div className="message-stack">
              {analyzingMessages.map((message, index) => (
                <div className="message-chip" key={message} style={{ animationDelay: `${index * 0.2}s` }}>
                  {message}
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'results' && (
          <div className="screen-body results-screen">
            <div className="results-summary">
              <div>
                <p className="hero-label">候補 5件</p>
                <h2>一致度の高い順に表示</h2>
              </div>
              <button className="secondary-button" onClick={startAnalysis}>
                再解析
              </button>
            </div>

            <div className="candidate-list">
              {dummyCandidates.map((candidate) => (
                <article className="candidate-card" key={candidate.id}>
                  <div className="candidate-topline">
                    <span className="rank-badge">#{candidate.id}</span>
                    <span className="confidence-badge">確信度 {candidate.confidence}%</span>
                  </div>

                  <div className="candidate-grid">
                    <InfoRow label="商品名" value={candidate.productName} />
                    <InfoRow label="メーカー" value={candidate.manufacturer} />
                    <InfoRow label="型番" value={candidate.modelNumber} />
                    <InfoRow label="価格" value={candidate.price} />
                    <InfoRow label="検索ワード" value={candidate.searchWord} />
                  </div>

                  <button className="copy-button" onClick={() => void handleCopy(candidate)}>
                    {copiedId === candidate.id ? 'コピー済み' : '検索ワードをコピー'}
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}

        <nav className="bottom-nav" aria-label="画面切り替えデモ">
          <button className={screen === 'input' ? 'nav-chip active' : 'nav-chip'} onClick={() => setScreen('input')}>
            入力
          </button>
          <button
            className={screen === 'analyzing' ? 'nav-chip active' : 'nav-chip'}
            onClick={() => setScreen('analyzing')}
          >
            解析中
          </button>
          <button className={screen === 'results' ? 'nav-chip active' : 'nav-chip'} onClick={() => setScreen('results')}>
            結果
          </button>
        </nav>
      </section>
    </main>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <dl className="info-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}
