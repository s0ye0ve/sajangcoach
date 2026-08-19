import { useRef, useState } from 'react';
import type { CaptureImage } from '../domain/types';
import type { StoreCaptureInput } from '../services/storeInputService';

interface Props {
  onSubmit: (input: StoreCaptureInput) => void;
  error: string | null;
}

const MAX_CAPTURES = 5;
const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_TOTAL_PAYLOAD = 3.5 * 1024 * 1024;

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
          name: file.name.replace(/\.[^.]+$/, '') + '.jpg',
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
  const [placeUrl, setPlaceUrl] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [captures, setCaptures] = useState<CaptureImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilePick = () => inputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) return;
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      setUploadError('이미지 한 장은 8MB 이하로 올려주세요.');
      return;
    }

    const available = MAX_CAPTURES - captures.length;
    if (available <= 0) {
      setUploadError(`캡처는 최대 ${MAX_CAPTURES}장까지 올릴 수 있어요.`);
      return;
    }

    try {
      const added = await Promise.all(files.slice(0, available).map(readFile));
      const payloadSize = [...captures, ...added].reduce(
        (total, capture) => total + Math.ceil(capture.dataUrl.length * 0.75),
        0,
      );
      if (payloadSize > MAX_TOTAL_PAYLOAD) {
        setUploadError('캡처 용량이 커요. 화면을 나눠서 더 선명하게 캡처해 올려주세요.');
        return;
      }
      setCaptures((previous) => [...previous, ...added]);
      setUploadError(
        files.length > available ? `캡처는 최대 ${MAX_CAPTURES}장까지 올릴 수 있어요.` : null,
      );
    } catch (fileError) {
      setUploadError(fileError instanceof Error ? fileError.message : '이미지를 읽지 못했어요.');
    }
  };

  return (
    <div className="screen input-flow">
      <div className="input-flow-header">
        <div className="progress">{step} / 3</div>
        <h1 className="intro-title" style={{ fontSize: 24 }}>
          {step === 1 && <>가게 이름을<br />알려주세요</>}
          {step === 2 && <>{storeName}의<br />주소를 알려주세요</>}
          {step === 3 && <>{storeName}의<br />화면을 올려주세요</>}
        </h1>
        <p className="intro-desc">
          {step === 1 && '진단 결과에 가게 이름을 표시해드릴게요.'}
          {step === 2 && '네이버 플레이스 주소를 붙여넣어 주세요.'}
          {step === 3 && '영업시간, 휴무일, 사진, 새소식, 리뷰가 보이도록 캡처해 주세요.'}
        </p>
        {step > 1 && <div className="input-summary">가게 이름 · {storeName}</div>}
        {step === 3 && <div className="input-summary">플레이스 주소가 입력됐어요</div>}
      </div>

      <div className="input-sheet" key={step}>
        {step === 1 && <>
          <label className="field-label" htmlFor="store-name">가게 이름</label>
          <input id="store-name" type="text" value={storeName} onChange={(event) => setStoreName(event.target.value)} placeholder="예: 우리동네 헬스장" onKeyDown={(event) => event.key === 'Enter' && storeName.trim() && setStep(2)} />
          <button className="btn-primary" disabled={!storeName.trim()} onClick={() => setStep(2)}>다음</button>
        </>}

        {step === 2 && <>
          <label className="field-label" htmlFor="place-url">네이버 플레이스 주소</label>
          <input id="place-url" type="url" value={placeUrl} onChange={(event) => setPlaceUrl(event.target.value)} placeholder="https://m.place.naver.com/..." onKeyDown={(event) => event.key === 'Enter' && placeUrl.trim() && setStep(3)} />
          <button className="btn-primary" disabled={!placeUrl.trim()} onClick={() => setStep(3)}>다음</button>
        </>}

        {step === 3 && <>
          <button className="upload-box" type="button" onClick={handleFilePick}>
            {captures.length > 0 ? `${captures.length}장 선택됨 — 탭해서 더 올리기` : '탭해서 네이버 플레이스 캡처 올리기'}
          </button>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple style={{ display: 'none' }} onChange={handleFileChange} />
          {captures.length > 0 && <ul className="capture-list">
            {captures.map((capture, index) => <li key={`${capture.name}-${index}`}>
              <span>{capture.name}</span>
              <button type="button" onClick={() => setCaptures((items) => items.filter((_, i) => i !== index))}>삭제</button>
            </li>)}
          </ul>}
          {(uploadError || error) && <p className="error-text">{uploadError ?? error}</p>}
          <button className="btn-primary" disabled={captures.length === 0} onClick={() => onSubmit({ type: 'captureUpload', storeName: storeName.trim(), placeUrl: placeUrl.trim(), captures })}>실제 진단 시작하기</button>
        </>}
      </div>
    </div>
  );
}
