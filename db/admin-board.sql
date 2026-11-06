-- 운영 대시보드(/admin)에서 편집하는 표 데이터.
-- key 하나에 목록 하나(JSON)를 저장합니다. 예: crawl_sites, priorities, links, contacts, community, feedback, inquiries
-- version은 동시에 두 사람이 고쳤을 때 덮어쓰기를 막는 용도입니다.

CREATE TABLE IF NOT EXISTS public.admin_board (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{"items": []}'::jsonb,
  version integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  updated_by text
);

-- 브라우저(anon 키)에서 직접 접근하지 못하게 막습니다. 읽기/쓰기는 서버 API(관리자 확인 후)에서만 합니다.
ALTER TABLE public.admin_board ENABLE ROW LEVEL SECURITY;
