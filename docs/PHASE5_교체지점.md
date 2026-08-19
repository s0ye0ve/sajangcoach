# Phase 5 — 실제 데이터 연결 지점

MVP_구현스펙.md §11 Phase 5. 구현하지 않고 **식별만** 한다.

| 연결 지점 | 위치 | 현재 상태 | 교체 시 할 일 |
|---|---|---|---|
| 가게 정보 수집 방식 | [src/services/storeInputService.ts](../src/services/storeInputService.ts) | 캡처 파일을 보관만 하고, mock 데이터셋 키(`datasetKey`)로 진단 결과를 대체 | `submitCapture`의 mock 구현을 실제 캡처 업로드·저장 로직으로 교체. `StoreCaptureInput`에서 `datasetKey`(테스트용) 제거 |
| 판정 규칙 실제화 | [src/domain/diagnosisRules.ts](../src/domain/diagnosisRules.ts) | `judgeDiagnosisItems`가 `mockDiagnosisDatasets`에서 고정 결과 반환 | 실제 캡처 분석/판정 로직으로 내부 구현 교체. 함수 시그니처(`StoreCaptureInput → DiagnosisItem[]`)는 유지 가능 |
| Mock 진단 데이터셋 | [src/data/mockDiagnosisDatasets.ts](../src/data/mockDiagnosisDatasets.ts) | 전부 fail / 일부 fail / 전부 pass 3벌 고정 | 판정 규칙이 실제화되면 이 파일은 테스트용으로만 남기거나 제거 |
| 우선순위 정렬 알고리즘 | [src/domain/provisionalPriority.ts](../src/domain/provisionalPriority.ts) | `PROVISIONAL_ORDER` 임시 고정 순서(개발용) | 우선순위 기준이 확정되면 정렬 로직만 교체. 다른 코드는 이 함수를 호출하기만 함 |
| 사례 데이터 | [src/content/cases.ts](../src/content/cases.ts) | `isMock: true`, "실제 사례를 준비하고 있어요." placeholder | 항목별 실제 사례 문구로 `body`만 교체하고 `isMock: false`로 변경 |
| AI 초안 생성 (새소식) | [src/services/aiDraftService.ts](../src/services/aiDraftService.ts) `generateNewsDraft` | 고정 문자열 반환 | 실제 모델/API 호출로 내부 구현 교체. 인터페이스(`AiDraftService`)는 유지 |
| AI 초안 생성 (리뷰 답글) | [src/services/aiDraftService.ts](../src/services/aiDraftService.ts) `generateReviewReplyDraft` | 고정 문자열 반환 | 위와 동일. 실제 리뷰 데이터 연동도 함께 필요 (현재는 `src/data/mockReviews.ts` 고정값 사용) |
| 리뷰 데이터 | [src/data/mockReviews.ts](../src/data/mockReviews.ts) | 리뷰 본문 1건 고정 | 실제 리뷰 목록/최신 미답변 리뷰 조회 로직으로 교체 |
| 영업시간·휴무일·사진 등록 경로 안내 문구 | [src/content/executionSupportContent.ts](../src/content/executionSupportContent.ts) | 정적 안내 텍스트 (대행 아님, 안내만) | 실제 등록 경로가 바뀌거나 대행 방식이 도입되면 문구·플로우 교체 |
| 일회성/반복형 매핑 | [src/domain/recurrenceMap.ts](../src/domain/recurrenceMap.ts) | PRD 기준 고정 매핑 | 항목이 추가/변경되면 이 표만 수정 |

## 원칙
- 위 표의 "위치" 파일들은 각각 **하나의 교체 지점**으로 격리되어 있다. 화면(`src/screens/`)과 상태 관리(`src/state/`)는 이 파일들의 구현 내용을 직접 알지 못하고, 인터페이스/함수 시그니처를 통해서만 호출한다.
- 교체 시 시그니처(입출력 타입)를 유지하면 화면·플로우 코드는 수정할 필요가 없다.
