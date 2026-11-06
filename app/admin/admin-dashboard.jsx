'use client';

import { useMemo, useState } from 'react';
import { FUNNEL_STEPS, KEY_FUNNEL_STEP, getDummyData } from './dummy-data';

const fmt = (n) => Math.round(n).toLocaleString('ko-KR');

const card = {
  background: '#fff',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius-card)',
  padding: 24,
};
const h2 = { margin: 0, fontSize: 16, fontWeight: 700 };
const sub = { fontSize: 13, color: 'var(--ink-500)' };
const row = { display: 'flex', flexWrap: 'wrap', gap: 16 };
const th = {
  padding: '10px 8px',
  fontWeight: 600,
  borderBottom: '1px solid var(--line)',
  color: 'var(--ink-500)',
  textAlign: 'left',
};
const td = { padding: '12px 8px', borderBottom: '1px solid var(--line-2)' };

function Badge({ good, children }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        color: good ? 'var(--success-700)' : 'var(--warn-700)',
        background: good ? 'var(--success-50)' : 'var(--warn-50)',
      }}
    >
      {children}
    </span>
  );
}

function SectionHead({ id, title, note }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
      <h2 id={id} style={h2}>{title}</h2>
      {note && <div style={sub}>{note}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState('7d');
  const data = useMemo(() => getDummyData(period), [period]);
  const periodLabel = period === '7d' ? '최근 7일' : '최근 30일';

  const { visitors, days, total, funnelCounts } = data;
  const n = visitors.length;
  const max = Math.max(...visitors);
  const peakIdx = visitors.indexOf(max);
  const clickRate = (funnelCounts[KEY_FUNNEL_STEP] / funnelCounts[0]) * 100;

  let worst = 1;
  let worstRate = 1;
  funnelCounts.forEach((c, k) => {
    if (k === 0) return;
    const r = c / funnelCounts[k - 1];
    if (r < worstRate) {
      worstRate = r;
      worst = k;
    }
  });

  const up = { color: 'var(--success-700)', fontWeight: 700 };
  const down = { color: 'var(--danger-500)', fontWeight: 700 };
  const kpis = [
    { label: '방문자', value: `${fmt(total)}명`, delta: data.kpiDeltas.visitors, deltaStyle: up, hint: '익명 세션 기준, 같은 날 재방문은 1회로 셈' },
    { label: '신청 링크 클릭률', value: `${clickRate.toFixed(1)}%`, delta: data.kpiDeltas.click, deltaStyle: up, hint: '방문자 중 지원사업 신청 페이지로 넘어간 비율', key: true },
    { label: '가입 완료', value: `${fmt(funnelCounts[6])}명`, delta: data.kpiDeltas.signup, deltaStyle: up, hint: '휴대폰 인증과 프로필 입력까지 마친 사람' },
    { label: '결과 0건 검색 비율', value: `${data.zeroRate}%`, delta: data.kpiDeltas.zero, deltaStyle: data.kpiDeltas.zeroGood ? up : down, hint: '낮을수록 좋아요. 찾는 사업이 없었던 검색의 비율' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-soft)', color: 'var(--ink-900)' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a href="/" style={{ fontSize: 18, fontWeight: 800 }}>나와, 나왕</a>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-600)', padding: '4px 10px', borderRadius: 999, background: 'var(--brand-50)', border: '1px solid var(--brand-100)' }}>운영 대시보드</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--warn-700)', padding: '4px 10px', borderRadius: 999, background: 'var(--warn-50)' }}>더미 데이터 · 실제 수치 아님</span>
          </div>
          <nav aria-label="기간 선택" style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 999 }}>
            {[['7d', '최근 7일'], ['30d', '최근 30일']].map(([key, label]) => {
              const on = period === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPeriod(key)}
                  style={{ height: 36, minWidth: 72, padding: '0 16px', borderRadius: 999, border: 0, fontSize: 13, fontWeight: 700, background: on ? 'var(--brand-600)' : 'transparent', color: on ? '#fff' : 'var(--ink-600)' }}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{periodLabel} 한눈에 보기</h1>
          <div style={sub}>데이터 기준 {data.asOf} · 출처: 더미 데이터 (연동 예정: Supabase events, Google Search Console)</div>
        </div>

        <section aria-label="핵심 지표" style={row}>
          {kpis.map((k) => (
            <div key={k.label} style={{ flex: '1 1 220px', background: '#fff', borderRadius: 16, padding: 20, border: k.key ? '2px solid var(--brand-600)' : '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-600)' }}>{k.label}</div>
                {k.key && <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: 'var(--brand-600)', padding: '3px 8px', borderRadius: 999 }}>핵심 지표</span>}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>{k.value}</div>
              <div style={{ fontSize: 13, marginTop: 6, color: 'var(--ink-500)' }}>
                <span style={k.deltaStyle}>{k.delta}</span> 직전 기간 대비
              </div>
              <div style={{ fontSize: 12, marginTop: 10, color: 'var(--ink-500)', lineHeight: 1.5 }}>{k.hint}</div>
            </div>
          ))}
        </section>

        <div style={row}>
          <section aria-labelledby="t-traffic" style={{ ...card, flex: '2 1 560px', minWidth: 0 }}>
            <SectionHead id="t-traffic" title="일별 방문자" note={`하루 평균 ${fmt(total / n)}명 · 최고 ${days[peakIdx]} ${fmt(max)}명`} />
            <div
              role="img"
              aria-label={`일별 방문자 막대그래프, ${days[0]}부터 ${days[n - 1]}까지, 최고 ${days[peakIdx]} ${fmt(max)}명`}
              style={{ marginTop: 20, height: 220, display: 'flex', alignItems: 'flex-end', gap: n <= 7 ? 14 : 4, borderBottom: '1px solid var(--line)' }}
            >
              {visitors.map((v, k) => (
                <div key={k} style={{ flex: '1 1 0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                  {n <= 7 && <div style={{ fontSize: 11, color: 'var(--ink-600)', fontWeight: 600 }}>{fmt(v)}</div>}
                  <div style={{ width: '100%', maxWidth: 56, height: `${Math.round((v / max) * 82)}%`, background: k === n - 1 ? 'var(--brand-600)' : 'var(--brand-400)', borderRadius: '6px 6px 0 0' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: n <= 7 ? 14 : 4, marginTop: 8 }}>
              {days.map((d, k) => (
                <div key={k} style={{ flex: '1 1 0', textAlign: 'center', fontSize: 11, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>
                  {n <= 7 || (n - 1 - k) % 5 === 0 ? d : ''}
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="t-source" style={{ ...card, flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 id="t-source" style={h2}>유입 경로</h2>
            {data.sources.map(([label, pct]) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-700)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ marginTop: 6, height: 8, background: 'var(--line-2)', borderRadius: 999 }}>
                  <div style={{ height: 8, width: `${Math.min(pct * 2, 100)}%`, background: 'var(--brand-500)', borderRadius: 999 }} />
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 14, display: 'flex', gap: 12, fontSize: 13, color: 'var(--ink-600)' }}>
              <div style={{ flex: '1 1 0' }}>모바일 <strong style={{ color: 'var(--ink-900)' }}>{data.devices.mobile}%</strong></div>
              <div style={{ flex: '1 1 0' }}>데스크톱 <strong style={{ color: 'var(--ink-900)' }}>{data.devices.desktop}%</strong></div>
            </div>
          </section>
        </div>

        <section aria-labelledby="t-funnel" style={card}>
          <SectionHead id="t-funnel" title="전환 퍼널" note="오른쪽 숫자는 바로 앞 단계에서 넘어온 비율" />
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FUNNEL_STEPS.map((label, k) => {
              const c = funnelCounts[k];
              const key = k === KEY_FUNNEL_STEP;
              const rate = k === 0 ? null : (c / funnelCounts[k - 1]) * 100;
              return (
                <div key={label} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: '0 0 150px', fontSize: 13, fontWeight: key ? 800 : 500, color: 'var(--ink-700)' }}>{label}</div>
                  <div style={{ flex: '1 1 300px', minWidth: 0, height: 30, background: 'var(--bg-soft)', borderRadius: 8 }}>
                    <div style={{ height: '100%', width: `${Math.max((c / funnelCounts[0]) * 100, 9).toFixed(1)}%`, background: key ? 'var(--brand-600)' : 'var(--brand-400)', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{fmt(c)}</span>
                    </div>
                  </div>
                  <div style={{ flex: '0 0 120px', textAlign: 'right', fontSize: 13, color: 'var(--ink-600)' }}>
                    {rate === null ? '전체 기준' : `${rate.toFixed(1)}% 이어짐`}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, padding: '14px 16px', borderRadius: 10, background: 'var(--brand-50)', fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.6 }}>
            가장 많이 빠지는 구간은 <strong>{FUNNEL_STEPS[worst - 1]} → {FUNNEL_STEPS[worst]} ({(worstRate * 100).toFixed(0)}%만 이어짐)</strong>이에요.
          </div>
        </section>

        <div style={row}>
          <section aria-labelledby="t-programs" style={{ ...card, flex: '2 1 560px', minWidth: 0 }}>
            <h2 id="t-programs" style={h2}>많이 본 지원사업</h2>
            <div style={{ marginTop: 14, overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 520, borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th scope="col" style={th}>사업명</th>
                    <th scope="col" style={th}>지역</th>
                    <th scope="col" style={{ ...th, textAlign: 'right' }}>상세 조회</th>
                    <th scope="col" style={{ ...th, textAlign: 'right' }}>신청 클릭</th>
                    <th scope="col" style={{ ...th, textAlign: 'right' }}>클릭률</th>
                  </tr>
                </thead>
                <tbody>
                  {data.programs.map((p) => (
                    <tr key={p.name}>
                      <td style={{ ...td, fontWeight: 600 }}>{p.name}</td>
                      <td style={{ ...td, color: 'var(--ink-600)' }}>{p.region}</td>
                      <td style={{ ...td, textAlign: 'right' }}>{fmt(p.views)}</td>
                      <td style={{ ...td, textAlign: 'right' }}>{fmt(p.clicks)}</td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{p.rate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="t-zero" style={{ ...card, flex: '1 1 320px', minWidth: 0 }}>
            <h2 id="t-zero" style={h2}>결과 0건 검색어</h2>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.5 }}>찾았지만 없던 것들이에요. 다음에 모을 사업의 후보예요.</p>
            <ol style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.zeroQueries.map((z) => (
                <li key={z.q} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'var(--bg-soft)', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-700)', fontWeight: 500 }}>{z.q}</span>
                  <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{fmt(z.n)}회</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section aria-labelledby="t-seo" style={card}>
          <SectionHead id="t-seo" title="검색 노출 (SEO)" note="Google Search Console · 최근 28일 · 2~3일 지연" />
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              ['검색 노출', `${fmt(data.seo.impressions)}회`],
              ['검색 클릭', `${fmt(data.seo.clicks)}회`],
              ['클릭률 (CTR)', `${data.seo.ctr}%`],
              ['평균 순위', `${data.seo.position}위`],
            ].map(([label, value]) => (
              <div key={label} style={{ flex: '1 1 180px', padding: '14px 16px', borderRadius: 12, background: 'var(--bg-soft)' }}>
                <div style={{ fontSize: 12, color: 'var(--ink-600)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ flex: '2 1 420px', minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>유입 검색어 상위</h3>
              <div style={{ marginTop: 10, overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 420, borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th scope="col" style={th}>검색어</th>
                      <th scope="col" style={{ ...th, textAlign: 'right' }}>노출</th>
                      <th scope="col" style={{ ...th, textAlign: 'right' }}>클릭</th>
                      <th scope="col" style={{ ...th, textAlign: 'right' }}>평균 순위</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.seo.queries.map(([q, imp, clk, pos]) => (
                      <tr key={q}>
                        <td style={{ ...td, fontWeight: 500 }}>{q}</td>
                        <td style={{ ...td, textAlign: 'right' }}>{fmt(imp)}</td>
                        <td style={{ ...td, textAlign: 'right' }}>{fmt(clk)}</td>
                        <td style={{ ...td, textAlign: 'right' }}>{pos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>페이지 속도 (Core Web Vitals)</h3>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.seo.vitals.map((v) => (
                  <div key={v.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid var(--line-2)', borderRadius: 10, fontSize: 13 }}>
                    <span style={{ color: 'var(--ink-700)' }}><strong>{v.name}</strong> {v.desc}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong>{v.value}</strong>
                      <Badge good={v.good}>{v.good ? '좋음' : '개선 필요'}</Badge>
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-600)' }}>
                색인된 페이지 <strong style={{ color: 'var(--ink-900)' }}>{data.seo.indexed} / {data.seo.submitted}</strong> · 사이트맵 제출 완료
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="t-ops" style={card}>
          <h2 id="t-ops" style={h2}>운영 상태</h2>
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {data.ops.map((o) => (
              <div key={o.label} style={{ flex: '1 1 220px', padding: 16, borderRadius: 12, background: o.good ? 'var(--bg-soft)' : 'var(--warn-50)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-600)', fontWeight: 600 }}>{o.label}</div>
                  <Badge good={o.good}>{o.good ? '정상' : '확인 필요'}</Badge>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{o.value}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-600)', marginTop: 4, lineHeight: 1.5 }}>{o.note}</div>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center' }}>
          /admin · 검색엔진 비노출(noindex) · 개인 식별 정보 없이 익명 세션 단위로 집계 예정
        </footer>
      </main>
    </div>
  );
}
