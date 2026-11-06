-- 운영 대시보드용 이벤트 로그.
-- 개인 식별 정보(이메일, 휴대폰 번호, 계정 ID, IP)는 저장하지 않습니다.
-- session_id는 브라우저에서 만든 무작위 값이며 로그인 계정과 연결하지 않습니다.

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  event_name text NOT NULL,
  session_id text,
  path text,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device text,
  program_id text,
  search_query text,
  result_count integer,
  props jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx
  ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_name_created_at_idx
  ON public.analytics_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_program_idx
  ON public.analytics_events (program_id)
  WHERE program_id IS NOT NULL;

-- 브라우저(anon 키)에서 직접 읽거나 쓰지 못하게 막습니다.
-- 기록은 서버(/api/track, service role 키)에서만 합니다.
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 대시보드에서 쓸 일별 집계 예시
CREATE OR REPLACE VIEW public.analytics_daily AS
SELECT
  (created_at AT TIME ZONE 'Asia/Seoul')::date AS day,
  event_name,
  COUNT(*) AS events,
  COUNT(DISTINCT session_id) AS sessions
FROM public.analytics_events
GROUP BY 1, 2;
