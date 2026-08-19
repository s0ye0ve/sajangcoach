interface Props {
  onStart: () => void;
}

export function S1Intro({ onStart }: Props) {
  return (
    <div className="screen">
      <div className="spacer" />
      <h1 className="intro-title">
        우리 가게, 지금
        <br />
        무엇부터 하면 될까요?
      </h1>
      <p className="intro-desc">
        가게 정보를 자동으로 진단해서
        <br />
        지금 바로 할 수 있는 일을 알려드려요.
      </p>
      <div className="spacer" />
      <button className="btn-primary" onClick={onStart}>
        진단 시작하기
      </button>
    </div>
  );
}
