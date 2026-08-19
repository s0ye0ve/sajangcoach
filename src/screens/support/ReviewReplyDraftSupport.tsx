import { useState } from 'react';
import type { ExecutionDraft } from '../../domain/types';
import { mockAiDraftService } from '../../services/aiDraftService';
import { MOCK_REVIEW_BODY } from '../../data/mockReviews';

interface Props {
  onConfirm: (draft: ExecutionDraft) => void;
}

// 리뷰 답글 작성 지원: 리뷰 표시 → AI 답글 초안 → 확인/재생성 (§6, §7)
export function ReviewReplyDraftSupport({ onConfirm }: Props) {
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mockAiDraftService.generateReviewReplyDraft({ reviewBody: MOCK_REVIEW_BODY });
      setDraft(result);
      setHasGenerated(true);
    } catch {
      setError('답글 생성에 실패했어요. 직접 입력해도 괜찮아요.');
      setHasGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!draft.trim()) return;
    onConfirm({ itemKey: 'reviewReply', input: { reviewBody: MOCK_REVIEW_BODY }, draft, accepted: true });
  };

  return (
    <div className="screen">
      <div className="section-heading">리뷰 내용</div>
      <div className="review-box">{MOCK_REVIEW_BODY}</div>

      {!hasGenerated && (
        <button className="btn-primary" onClick={generate} disabled={loading}>
          {loading ? '만드는 중...' : '답글 초안 만들기'}
        </button>
      )}

      {error && <p className="error-text">{error}</p>}

      {hasGenerated && (
        <>
          <div className="field-label">초안 (수정할 수 있어요)</div>
          <textarea
            className="textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="spacer" />
          <button className="btn-outline" onClick={generate} disabled={loading}>
            {loading ? '다시 만드는 중...' : '다시 만들기'}
          </button>
          <button className="btn-primary" style={{ marginTop: 10 }} onClick={handleConfirm}>
            확정하고 다음으로
          </button>
        </>
      )}
    </div>
  );
}
