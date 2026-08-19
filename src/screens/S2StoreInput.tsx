import { useEffect, useRef, useState } from 'react';
import { CAPTURE_GUIDE_ITEMS, type CaptureGuideItem } from '../content/captureGuideContent';
import type { CaptureImage } from '../domain/types';
import type { StoreCaptureInput } from '../services/storeInputService';
import type { OnboardingState, OnboardingStep } from '../state/useDiagnosisFlow';

interface Props {
  onboarding: OnboardingState;
  onUpdate: (update: Partial<OnboardingState>) => void;
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
        resolve({ name: `${file.name.replace(/\.[^.]+$/, '')}.jpg`, dataUrl: canvas.toDataURL('image/jpeg', 0.72) });
      };
      image.onerror = () => reject(new Error('이미지를 읽지 못했어요. 다시 선택해 주세요.'));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('이미지를 읽지 못했어요. 다시 선택해 주세요.'));
    reader.readAsDataURL(file);
  });
}

export function S2StoreInput({ onboarding, onUpdate, onSubmit, error }: Props) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<CaptureGuideItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { step, gymName, captures } = onboarding;

  useEffect(() => {
    if (window.history.state?.onboardingStep == null) {
      window.history.replaceState({ ...window.history.state, onboardingStep: step }, '');
    }
    const handlePopState = (event: PopStateEvent) => {
      const previousStep = event.state?.onboardingStep;
      if (previousStep === 1 || previousStep === 2 || previousStep === 3 || previousStep === 4) {
        onUpdate({ step: previousStep });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onUpdate, step]);

  const goToStep = (nextStep: OnboardingStep) => {
    window.history.pushState({ ...window.history.state, onboardingStep: nextStep }, '');
    onUpdate({ step: nextStep });
  };

  const goBack = () => {
    if (step > 1) window.history.back();
  };

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
      onUpdate({ captures: [...captures, ...added] });
      setUploadError(files.length > available ? `캡처는 최대 ${MAX_CAPTURES}장까지 올릴 수 있어요.` : null);
    } catch (fileError) {
      setUploadError(fileError instanceof Error ? fileError.message : '이미지를 읽지 못했어요.');
    }
  };

  return (
    <div className="screen input-flow">
      <div className="onboarding-topbar">
        {step > 1 && <button className="back-action" type="button" onClick={goBack}>← 이전</button>}
        <div className="progress">{step} / 4</div>
      </div>

      {step === 1 && <>
        <h1 className="intro-title" style={{ fontSize: 24 }}>헬스장 이름을<br />알려주세요</h1>
        <p className="intro-desc">진단 결과에 헬스장 이름을 표시해드릴게요.</p>
        <div className="input-stage">
          <label className="field-label" htmlFor="store-name">헬스장 이름</label>
          <input id="store-name" type="text" value={gymName} onChange={(event) => onUpdate({ gymName: event.target.value })} placeholder="예: 우리동네 헬스장" onKeyDown={(event) => event.key === 'Enter' && gymName.trim() && goToStep(2)} />
          <button className="btn-primary" disabled={!gymName.trim()} onClick={() => goToStep(2)}>다음</button>
        </div>
      </>}

      {step === 2 && <>
        <h1 className="intro-title guide-title">캡처할 화면을 확인해 주세요</h1>
        <p className="intro-desc guide-header-desc">네이버 지도에 들어가기 전에<br />아래 4개 화면을 확인해 주세요.</p>
        <div className="guide-list">
          {CAPTURE_GUIDE_ITEMS.map((item) => <article className="guide-card" key={item.title}>
            <button className="guide-image-button" type="button" onClick={() => setExpandedGuide(item)} aria-label={`${item.title} 예시 이미지 확대하기`}>
              <img src={item.imageSrc} alt={`${item.title} 캡처 예시`} />
              <span className="guide-expand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M9 4H4v5M4 4l6 6M15 20h5v-5M20 20l-6-6" /></svg>
              </span>
            </button>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>)}
        </div>
        {expandedGuide && (
          <div className="guide-image-modal" role="dialog" aria-modal="true" aria-labelledby="guide-image-modal-title" onClick={() => setExpandedGuide(null)}>
            <div className="guide-image-modal-content" onClick={(event) => event.stopPropagation()}>
              <div className="guide-image-modal-header">
                <h2 id="guide-image-modal-title">{expandedGuide.title} 예시</h2>
                <button type="button" onClick={() => setExpandedGuide(null)} aria-label="예시 이미지 닫기">×</button>
              </div>
              <img src={expandedGuide.imageSrc} alt={`${expandedGuide.title} 캡처 예시 확대`} />
            </div>
          </div>
        )}
        <button className="btn-primary guide-next-button" type="button" onClick={() => goToStep(3)}>내 헬스장 찾으러 가기</button>
      </>}

      {step === 3 && <>
        <h1 className="intro-title" style={{ fontSize: 24 }}>내 헬스장을<br />찾아 주세요</h1>
        <p className="intro-desc">가이드에서 본 화면들을 캡처한 뒤<br />다시 돌아와 주세요.</p>
        <div className="input-summary"><span>헬스장 이름</span><strong>{gymName}</strong></div>
        <div className="map-action">
          <a className="map-find-button" href="https://map.naver.com/" target="_blank" rel="noreferrer">네이버 지도에서 내 헬스장 찾기 ↗</a>
        </div>
        <button className="btn-primary map-next-button" type="button" onClick={() => goToStep(4)}>캡처 이미지 올리기</button>
      </>}

      {step === 4 && <>
        <h1 className="intro-title" style={{ fontSize: 24 }}>캡처한 화면을<br />올려주세요</h1>
        <p className="intro-desc">여러 장의 이미지를 올리면<br />헬스장 관리 상태를 진단해드려요.</p>
        <div className="upload-section">
          <div className="section-heading">캡처한 화면을 올려주세요</div>
          <button className="upload-box" type="button" onClick={() => inputRef.current?.click()}>
            {captures.length > 0 ? `${captures.length}장 선택됨 — 탭해서 더 올리기` : '탭해서 캡처 이미지 올리기'}
          </button>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple style={{ display: 'none' }} onChange={handleFileChange} />
          {captures.length > 0 && <div className="capture-preview-list">
            {captures.map((capture, index) => <div className="capture-preview" key={`${capture.name}-${index}`}>
              <img src={capture.dataUrl} alt={`${index + 1}번째 업로드 캡처`} />
              <button type="button" onClick={() => onUpdate({ captures: captures.filter((_, itemIndex) => itemIndex !== index) })}>삭제</button>
            </div>)}
          </div>}
          {(uploadError || error) && <p className="error-text">{uploadError ?? error}</p>}
          <button className="btn-primary" disabled={captures.length === 0} onClick={() => onSubmit({ type: 'captureUpload', storeName: gymName.trim(), captures })}>진단 시작하기</button>
        </div>
      </>}
    </div>
  );
}
