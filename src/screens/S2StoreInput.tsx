import { useRef, useState } from 'react';
import type { StoreCaptureInput } from '../services/storeInputService';
import { MOCK_DATASET_LABELS, type MockDatasetKey } from '../data/mockDiagnosisDatasets';

interface Props {
  onSubmit: (input: StoreCaptureInput) => void;
}

// 캡처 업로드 방식 (결정사항 §1). Phase 1~2는 실제 캡처 분석을 하지 않으므로,
// 어떤 mock 진단 결과를 시뮬레이션할지 선택하는 테스트용 UI를 함께 둔다.
// 실제 캡처 분석이 들어오면 이 선택 UI는 제거되고 storeInputService만 교체된다.
export function S2StoreInput({ onSubmit }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [datasetKey, setDatasetKey] = useState<MockDatasetKey>('partialFail');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilePick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  const handleSubmit = () => {
    onSubmit({ type: 'captureUpload', fileName, datasetKey });
  };

  return (
    <div className="screen">
      <h1 className="intro-title" style={{ fontSize: 20 }}>
        가게 화면을 캡처해서
        <br />
        올려주세요
      </h1>
      <p className="intro-desc" style={{ marginBottom: 24 }}>
        네이버 플레이스에서 우리 가게 페이지를
        <br />
        캡처해서 올려주시면 진단을 시작할게요.
      </p>

      <div
        className={`upload-box${fileName ? ' has-file' : ''}`}
        onClick={handleFilePick}
        role="button"
        tabIndex={0}
      >
        {fileName ? `선택됨: ${fileName}` : '탭해서 캡처 이미지 올리기'}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="field-label">(테스트용) 진단 결과 시뮬레이션</div>
      <select
        className="select"
        value={datasetKey}
        onChange={(e) => setDatasetKey(e.target.value as MockDatasetKey)}
      >
        {Object.entries(MOCK_DATASET_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <div className="spacer" />
      <button className="btn-primary" disabled={!fileName} onClick={handleSubmit}>
        진단 시작하기
      </button>
    </div>
  );
}
