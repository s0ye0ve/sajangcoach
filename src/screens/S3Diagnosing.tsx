interface Props {
  storeName: string;
}

export function S3Diagnosing({ storeName }: Props) {
  return (
    <div className="screen">
      <div className="center-column">
        <div className="spinner" />
        <p className="todo-text" style={{ margin: 0 }}>
          {storeName}을 진단하고 있어요
        </p>
      </div>
    </div>
  );
}
