const ITEM_KEYS = ['businessHours', 'holiday', 'photos', 'news', 'reviewReply'];

const RECURRENCE = {
  businessHours: 'oneTime',
  holiday: 'recurring',
  photos: 'oneTime',
  news: 'recurring',
  reviewReply: 'recurring',
};

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['itemKey', 'status'],
        properties: {
          itemKey: { type: 'string', enum: ITEM_KEYS },
          status: { type: 'string', enum: ['pass', 'fail'] },
        },
      },
    },
  },
};

function outputText(response) {
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === 'output_text' && typeof content.text === 'string') return content.text;
    }
  }
  return null;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'POST 요청만 사용할 수 있어요.' });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    response.status(503).json({ error: '이미지 분석 설정이 아직 완료되지 않았어요.' });
    return;
  }

  const { storeName, captures } = request.body ?? {};
  if (typeof storeName !== 'string' || !Array.isArray(captures) || captures.length === 0 || captures.length > 5) {
    response.status(400).json({ error: '가게 이름과 1~5장의 캡처를 올려주세요.' });
    return;
  }

  const imageInputs = captures
    .filter((capture) => typeof capture?.dataUrl === 'string' && capture.dataUrl.startsWith('data:image/'))
    .map((capture) => ({ type: 'input_image', image_url: capture.dataUrl, detail: 'high' }));

  if (imageInputs.length === 0) {
    response.status(400).json({ error: 'PNG, JPG, WEBP 형식의 캡처를 올려주세요.' });
    return;
  }

  const instructions = `당신은 한국 헬스장 네이버 플레이스 화면을 읽는 진단 도우미입니다.
업로드된 캡처에서만 판단하고, 보이지 않는 내용을 추측하거나 기준 수치를 만들어내지 마세요.
각 항목은 화면에서 문제가 명확할 때만 fail, 그렇지 않으면 pass로 반환하세요.
판정 항목은 영업시간(businessHours), 휴무일(holiday), 대표 사진(photos), 네이버 플레이스 새소식(news), 리뷰 답글(reviewReply) 다섯 개뿐입니다.
반드시 다섯 항목을 각각 한 번씩 반환하세요.`;

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL ?? 'gpt-5.6-luna',
        instructions,
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: `${storeName}의 네이버 플레이스 캡처를 진단해 주세요.` },
              ...imageInputs,
            ],
          },
        ],
        text: { format: { type: 'json_schema', name: 'place_diagnosis', strict: true, schema } },
        store: false,
      }),
    });

    if (!aiResponse.ok) {
      response.status(502).json({ error: '이미지 분석 요청에 실패했어요. 잠시 후 다시 시도해 주세요.' });
      return;
    }

    const parsed = JSON.parse(outputText(await aiResponse.json()) ?? '{}');
    const byKey = new Map(parsed.items?.map((item) => [item.itemKey, item.status]));
    if (ITEM_KEYS.some((key) => !['pass', 'fail'].includes(byKey.get(key)))) throw new Error('Invalid analysis');

    response.status(200).json({
      items: ITEM_KEYS.map((itemKey) => ({
        itemKey,
        status: byKey.get(itemKey),
        recurrence: RECURRENCE[itemKey],
        resolvedAt: null,
      })),
    });
  } catch {
    response.status(502).json({ error: '이미지 분석 결과를 읽지 못했어요. 다시 시도해 주세요.' });
  }
}
