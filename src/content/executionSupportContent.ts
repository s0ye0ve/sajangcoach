// S5 실행 지원 — 정적 안내 문구 (영업시간·휴무일·대표 사진 3개 항목).
// 카피 확정 문서는 S4까지만 다루므로, 여기는 §6 "정적 텍스트 경로 안내" 요구사항을
// 최소한으로 구현한 것이다. 등록/수정을 대행하지 않고 안내만 한다 (§6 확정).

// 새소식 카테고리 — 5개항목_화면설계_전체.md에서 언급된 형태(휴무 안내/이벤트/근황)를 사용.
export const NEWS_CATEGORIES = ['휴무 안내', '이벤트', '근황'] as const;

export const STATIC_GUIDE_CONTENT = {
  businessHours: {
    guideText: '네이버 플레이스 관리 화면의 영업시간 항목에서 등록할 수 있어요.',
    confirmLabel: '등록했어요',
  },
  holiday: {
    guideText: '네이버 플레이스 관리 화면의 휴무일 항목에서 반영할 수 있어요.',
    confirmLabel: '반영했어요',
  },
  photos: {
    guideText: '외관, 내부, 운동기구 사진이 있으면 좋아요. 네이버 플레이스 관리 화면에서 등록할 수 있어요.',
    confirmLabel: '등록했어요',
  },
} as const;
