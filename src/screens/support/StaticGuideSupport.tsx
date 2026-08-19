import { STATIC_GUIDE_CONTENT } from '../../content/executionSupportContent';

interface Props {
  itemKey: keyof typeof STATIC_GUIDE_CONTENT;
  onConfirm: () => void;
}

// 영업시간·휴무일·대표 사진 — 경로 안내만 제공, AI 사용 안 함 (§6 확정)
export function StaticGuideSupport({ itemKey, onConfirm }: Props) {
  const content = STATIC_GUIDE_CONTENT[itemKey];
  const isHolidayGuide = itemKey === 'holiday';

  return (
    <div className="screen">
      <h1 className="support-title">지금 할 일</h1>
      <p className="reason-text support-guide-text">
        {content.guideText}
      </p>
      {isHolidayGuide && <>
        <div className="video-guide">
          <iframe
            src="https://www.youtube.com/embed/J7f11NX0GpU?start=82"
            title="네이버 플레이스 휴무일 반영 가이드"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="video-guide-caption">영상을 보면서 그대로 따라 해보세요.</p>
      </>}
      {!isHolidayGuide && <div className="spacer" />}
      <button className="btn-primary" onClick={onConfirm}>
        {content.confirmLabel}
      </button>
    </div>
  );
}
