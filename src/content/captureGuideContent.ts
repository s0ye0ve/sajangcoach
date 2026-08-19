export interface CaptureGuideItem {
  title: string;
  description: string;
  placeholderLabel: string;
}

// 실제 네이버 플레이스 가이드 이미지를 확보하면 이 데이터와 연결된 asset만 교체한다.
// 실제 헬스장 화면을 임의로 만들거나 사용하지 않는다.
export const CAPTURE_GUIDE_ITEMS: CaptureGuideItem[] = [
  {
    title: '기본 정보',
    description: '영업시간과 휴무일이 보이는 화면',
    placeholderLabel: '기본 정보\n예시 이미지 준비 중',
  },
  {
    title: '사진',
    description: '플레이스의 사진 영역이 보이는 화면',
    placeholderLabel: '사진 영역\n예시 이미지 준비 중',
  },
  {
    title: '새소식',
    description: '최근 새소식 목록이 보이는 화면',
    placeholderLabel: '새소식 목록\n예시 이미지 준비 중',
  },
  {
    title: '리뷰',
    description: '리뷰와 사장님 답글 여부를 확인할 수 있는 화면',
    placeholderLabel: '리뷰 영역\n예시 이미지 준비 중',
  },
];
