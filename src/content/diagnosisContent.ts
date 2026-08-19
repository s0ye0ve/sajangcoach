// 5개화면_카피확정.md 문서의 확정 카피를 그대로 옮김. 임의로 재작성하지 않는다.

import type { DiagnosisContent, ItemKey } from '../domain/types';

export const DIAGNOSIS_CONTENT: Record<ItemKey, DiagnosisContent> = {
  businessHours: {
    itemKey: 'businessHours',
    problemText: '영업시간이 등록돼 있지 않아요',
    reasonText: '언제 갈 수 있는지 알려주면\n더 쉽게 찾아올 수 있어요',
    todoText: '영업시간, 지금 등록해요',
    ctaLabel: '영업시간 등록하기',
    completionText: '영업시간, 등록했어요',
  },
  holiday: {
    itemKey: 'holiday',
    problemText: '다가오는 휴무일이 반영돼 있지 않아요',
    reasonText: '미리 알려주면\n방문 전에 휴무일을 확인할 수 있어요',
    todoText: '이번 휴무, 지금 반영해요',
    ctaLabel: '휴무일 갱신하기',
    completionText: '휴무일, 반영했어요',
  },
  photos: {
    itemKey: 'photos',
    problemText: '대표 사진이 부족해요',
    reasonText: '헬스장 분위기를 미리 보여주면\n방문 결정에 도움이 돼요',
    todoText: '사진 한 장, 지금 찍어볼까요?',
    ctaLabel: '사진 등록하기',
    completionText: '사진, 등록했어요',
  },
  news: {
    itemKey: 'news',
    problemText: '새소식이 오래 업데이트되지 않았어요',
    reasonText: '헬스장이 지금도 잘 운영되고 있다는 걸\n자연스럽게 보여줄 수 있어요',
    todoText: '새소식 하나, 지금 올려볼까요?',
    ctaLabel: '새소식 작성하기',
    completionText: '새소식, 올렸어요',
  },
  reviewReply: {
    itemKey: 'reviewReply',
    problemText: '답글이 없는 리뷰가 있어요',
    reasonText: '사장님이 신경 쓰고 있다는 걸\n보여줄 수 있어요',
    todoText: '답글 하나, 지금 남겨볼까요?',
    ctaLabel: '답글 작성하기',
    completionText: '답글, 남겼어요',
  },
};

// 공통 레이아웃 상수 (항목별로 달라지지 않는 카피)
export const SCREEN_LABELS = {
  resultHeading: '[진단 결과]',
  caseHeading: '다른 헬스장은 이렇게 해요',
  todoHeading: '지금 할 일',
  skipLabel: '나중에 할게요',
};
