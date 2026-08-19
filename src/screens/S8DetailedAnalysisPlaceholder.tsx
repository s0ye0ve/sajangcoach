interface Props {
  onBack: () => void;
}

// 후속 상세 분석 서비스가 확정되면 이 화면을 실제 서비스 진입 경로로 교체한다.
export function S8DetailedAnalysisPlaceholder({ onBack }: Props) {
  return (
    <div className="screen detailed-analysis-placeholder">
      <div className="center-column">
        <h1 className="support-title">더 자세한 분석을<br />준비하고 있어요.</h1>
        <p className="intro-desc">
          플레이스 전체 상태와 개선할 부분을 더 깊게 살펴볼 수 있도록 준비 중이에요.
        </p>
      </div>
      <button className="btn-outline" type="button" onClick={onBack}>
        완료 화면으로 돌아가기
      </button>
    </div>
  );
}
