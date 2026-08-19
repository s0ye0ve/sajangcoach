// AI 초안 생성 인터페이스. 어떤 모델·API를 쓸지는 이 인터페이스 뒤에서 교체 가능해야 한다
// (MVP_구현스펙.md §7). Phase 3 이전까지는 고정 문자열을 반환한다.

export interface NewsDraftInput {
  category: string;
  note?: string;
}

export interface ReviewReplyDraftInput {
  reviewBody: string;
}

export interface AiDraftService {
  generateNewsDraft(input: NewsDraftInput): Promise<string>;
  generateReviewReplyDraft(input: ReviewReplyDraftInput): Promise<string>;
}

export const mockAiDraftService: AiDraftService = {
  async generateNewsDraft(input) {
    return `[${input.category}] 오늘도 회원님들을 위해 항상 열심히 준비하고 있어요. 편하게 방문해 주세요!`;
  },
  async generateReviewReplyDraft() {
    return '소중한 후기 남겨주셔서 감사해요. 앞으로도 신경 써서 운영하겠습니다!';
  },
};
