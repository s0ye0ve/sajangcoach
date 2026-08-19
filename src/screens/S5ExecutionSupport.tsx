import type { DiagnosisItem, ExecutionDraft } from '../domain/types';
import { StaticGuideSupport } from './support/StaticGuideSupport';
import { NewsDraftSupport } from './support/NewsDraftSupport';
import { ReviewReplyDraftSupport } from './support/ReviewReplyDraftSupport';

interface Props {
  item: DiagnosisItem;
  onConfirm: (draft?: ExecutionDraft) => void;
}

// 항목별 실행 지원 라우팅.
export function S5ExecutionSupport({ item, onConfirm }: Props) {
  switch (item.itemKey) {
    case 'businessHours':
    case 'holiday':
    case 'photos':
      return <StaticGuideSupport itemKey={item.itemKey} onConfirm={() => onConfirm()} />;
    case 'news':
      return <NewsDraftSupport onConfirm={onConfirm} />;
    case 'reviewReply':
      return <ReviewReplyDraftSupport onConfirm={onConfirm} />;
  }
}
