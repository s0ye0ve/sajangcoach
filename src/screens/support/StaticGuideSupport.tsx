import { STATIC_GUIDE_CONTENT } from '../../content/executionSupportContent';

interface Props {
  itemKey: keyof typeof STATIC_GUIDE_CONTENT;
  onConfirm: () => void;
}

// 영업시간·휴무일·대표 사진 — 경로 안내만 제공, AI 사용 안 함 (§6 확정)
export function StaticGuideSupport({ itemKey, onConfirm }: Props) {
  const content = STATIC_GUIDE_CONTENT[itemKey];

  return (
    <div className="screen">
      <div className="section-heading">지금 할 일</div>
      <p className="reason-text" style={{ fontSize: 16, marginBottom: 24 }}>
        {content.guideText}
      </p>
      <div className="spacer" />
      <button className="btn-primary" onClick={onConfirm}>
        {content.confirmLabel}
      </button>
    </div>
  );
}
