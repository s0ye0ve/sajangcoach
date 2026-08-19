interface Props {
  className?: string;
}

export function CompletionCheck({ className = '' }: Props) {
  return (
    <div className={`completion-check ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 64 64" role="presentation">
        <circle className="completion-check-circle" cx="32" cy="32" r="29" />
        <path className="completion-check-mark" d="m19 33 8 8 18-19" />
      </svg>
    </div>
  );
}
