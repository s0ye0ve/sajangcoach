import { useRef, useState } from 'react';
import { CAPTURE_GUIDE_ITEMS } from '../content/captureGuideContent';
import type { CaptureImage } from '../domain/types';
import type { StoreCaptureInput } from '../services/storeInputService';

interface Props {
  onSubmit: (input: StoreCaptureInput) => void;
  error: string | null;
}

const MAX_CAPTURES = 5;
const MAX_FILE_SIZE = 12 * 1024 * 1024;

function readFile(file: File): Promise<CaptureImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxDimension = 1280;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve({
          name: `${file.name.replace(/\.[^.]+$/, '')}.jpg`,
          dataUrl: canvas.toDataURL('image/jpeg', 0.72),
        });
      };
      image.onerror = () => reject(new Error('이미지를 읽지 못했어요. 다시 선택해 주세요.'));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('이미지를 읽지 못했어요. 다시 선택해 주세요.'));
    reader.readAsDataURL(file);
  });
}

export function S2StoreInput({ onSubmit, error }: Props) {
  const [storeName, setStoreName] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [captures, setCaptures] = useState<CaptureImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      setUploadError('이미지 한 장은 12MB 이하로 올려주세요.');
      return;
    }

    const available = MAX_CAPTURES - captures.length;
    if (available <= 0) {
      setUploadError(`캡처는 최대 ${MAX_CAPTURES}장까지 올릴 수 있어요.`);
      return;
    }

    try {
      const added = await Promise.all(files.slice(0, available).map(readFile));
      setCaptures((previous) => [...previous, ...added]);
      setUploadError(files.length > available ? `캡처는 최대 ${MAX_CAPTURES}장까지 올릴 수 있어요.` : null);
    } catch (fileError) {
      setUploadError(fileError instanceof Error ? fileError.message : '이미지를 읽지 못했어요.');
    }
  };

  return (
    <div className="screen input-flow">
      {step === 1 && (
        <>
          <div className="progress">1 / 3</div>
          <h1 className="intro-title" style={{ fontSize: 24 }}>
            헬스장 이름을<br />알려주세요
          </h1>
          <p className="intro-desc">진단 결과에 헬스장 이름을 표시해드릴게요.</p>
          <div className="input-stage">
            <label className="field-label" htmlFor="store-name">헬스장 이름</label>
            <input
              id="store-name"
              type="text"
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
              placeholder="예: 우리동네 헬스장"
              onKeyDown={(event) => event.key === 'Enter' && storeName.trim() && setStep(2)}
            />
            <button className="btn-primary" disabled={!storeName.trim()} onClick={() => setStep(2)}>다음</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="progress">2 / 3</div>
          <h1 className="intro-title" style={{ fontSize: 24 }}>
            헬스장을<br />확인해 주세요
          </h1>
          <div className="input-summary">
            <span>헬스장 이름</span>
            <strong>{storeName}</strong>
          </div>
          <div className="input-stage">
            <a className="map-find-button" href="https://map.naver.com/" target="_blank" rel="noreferrer">
              네이버 지도에서 내 헬스장 찾기 ↗
            </a>
            <button className="btn-primary" onClick={() => setStep(3)}>캡처 가이드 보기</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="progress">3 / 3</div>
          <h1 className="intro-title" style={{ fontSize: 24 }}>
            이 화면들을<br />캡처해 주세요
          </h1>
          <p className="intro-desc">진단에 필요한 화면을 예시처럼 캡처해 주세요.</p>
          <div className="guide-list">
            {CAPTURE_GUIDE_ITEMS.map((item) => (
              <article className="guide-card" key={item.title}>
                <div className="guide-placeholder" aria-label={`${item.title} 캡처 예시 이미지 자리 표시`}>
                  {item.placeholderLabel.split('\n').map((line) => <span key={line}>{line}</span>)}
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="upload-section">
            <div className="section-heading">캡처한 화면을 올려주세요</div>
            <button className="upload-box" type="button" onClick={() => inputRef.current?.click()}>
              {captures.length > 0 ? `${captures.length}장 선택됨 — 탭해서 더 올리기` : '탭해서 캡처 이미지 올리기'}
            </button>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple style={{ display: 'none' }} onChange={handleFileChange} />
            {captures.length > 0 && (
              <div className="capture-preview-list">
                {captures.map((capture, index) => (
                  <div className="capture-preview" key={`${capture.name}-${index}`}>
                    <img src={capture.dataUrl} alt={`${index + 1}번째 업로드 캡처`} />
                    <button type="button" onClick={() => setCaptures((items) => items.filter((_, itemIndex) => itemIndex !== index))}>삭제</button>
                  </div>
                ))}
              </div>
            )}
            {(uploadError || error) && <p className="error-text">{uploadError ?? error}</p>}
            <button
              className="btn-primary"
              disabled={captures.length === 0}
              onClick={() => onSubmit({ type: 'captureUpload', storeName: storeName.trim(), captures })}
            >
              진단 시작하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
