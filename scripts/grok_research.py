#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
은둔고립청년 세부탐구주제 자동 조사 스크립트 (xAI Grok API 사용)

사용법:
    python3 grok_research.py            # 목록을 보여주고 번호를 입력받음
    python3 grok_research.py 5-5        # 번호를 바로 인자로 전달

동작 방식:
    1. 1-1 ~ 6-6 중 번호를 입력하면 해당 세부탐구주제를 불러옵니다.
    2. Grok에게 그 주제를 조사하되, 관련된 소주제를 스스로 2~4개 더 찾아
       함께 조사하도록 프롬프트를 구성해 요청합니다.
    3. 결과는 "제목:"으로 시작하고 "결론:"으로 끝나는 형식으로 받아
       화면에 출력하고 results/ 폴더에 마크다운 파일로 저장합니다.

필요 패키지:
    pip install openai
"""

import os
import sys
from datetime import datetime

try:
    from openai import OpenAI
except ImportError:
    print("openai 패키지가 필요합니다. 다음 명령으로 설치하세요:\n  pip install openai")
    sys.exit(1)

# ── API 설정 ──────────────────────────────────────────────────────────
API_KEY = os.environ.get("XAI_API_KEY")
BASE_URL = "https://api.x.ai/v1"
MODEL = os.environ.get("XAI_MODEL", "grok-4.6")  # 필요시 환경변수 XAI_MODEL로 다른 모델 지정 가능

OUTPUT_DIR = "results"

# ── 대주제 ────────────────────────────────────────────────────────────
MAIN_THEMES = {
    "1": "국가별 은둔고립청년 연구",
    "2": "치료방법과 치료수기",
    "3": "어떤 아픔과 어떤 일상을 보내는지",
    "4": "고립은둔청년들은 어떤 특징이나 통계의 사람들인지",
    "5": "국가정책지원소개",
    "6": "은둔고립 관련 국내 센터활동소개",
}

# ── 36개 세부탐구주제 ─────────────────────────────────────────────────
TOPICS = {
    "1-1": "일본 히키코모리 개념의 기원과 정립 과정 (사이토 다마키 등 초기 연구자들의 정의)",
    "1-2": "한국 고립은둔청년 실태조사의 변천 (보건복지부·서울시 조사 방식과 정의 변화)",
    "1-3": "영국의 외로움(loneliness) 문제 인식과 '외로움 담당 장관' 신설 배경",
    "1-4": "이탈리아·스페인 등 남유럽의 니트족·은둔청년 문제와 청년실업의 관계",
    "1-5": "미국의 '독립 지연(failure to launch)' 현상과 은둔형 청년 연구",
    "1-6": "국가별 은둔고립 정의·기준 비교 (은둔 판정 기간, 연령 범위, 진단 기준의 차이)",
    "2-1": "인지행동치료(CBT) 기반 은둔청년 치료 프로그램의 구조와 사례",
    "2-2": "방문형 지원(아웃리치)과 방문상담사의 역할 및 접근 방식",
    "2-3": "또래 지지모임·자조모임을 통한 회복 과정 사례",
    "2-4": "일본의 '거처(居場所)' 지원 모델 등 은둔 회복 지원 프로그램",
    "2-5": "은둔 경험 당사자가 쓴 치료수기·에세이 분석 (국내외 출간 사례 비교)",
    "2-6": "가족치료 및 부모교육 프로그램이 회복에 미치는 영향",
    "3-1": "은둔고립청년의 하루 일과와 생활 패턴 (수면 주기, 인터넷·게임 이용 시간 등)",
    "3-2": "은둔의 계기가 되는 사건 유형 (취업 실패, 따돌림, 가족 갈등 등)",
    "3-3": "고립 기간에 따른 심리 변화 단계 (초기 위축기-만성화기-회복 준비기)",
    "3-4": "온라인 공간(게임, SNS)이 은둔청년의 일상과 정체성에서 갖는 의미",
    "3-5": "은둔청년이 겪는 신체적 건강 문제 (수면장애, 체력 저하, 불규칙한 식습관)",
    "3-6": "가족과의 관계 단절 경험과 재구축 과정",
    "4-1": "국내 고립은둔청년 규모 추정 통계 (실태조사 수치와 추정 방식)",
    "4-2": "성별·연령별 은둔고립 특성 차이",
    "4-3": "은둔 계기별 유형 분류 (취업실패형, 관계단절형, 정신건강형 등)",
    "4-4": "은둔 지속 기간과 재고립(반복적 은둔) 경향",
    "4-5": "학력·경제적 배경과 고립은둔 발생의 상관관계",
    "4-6": "OECD NEET(니트족) 통계와 은둔고립청년 개념의 관계 및 차이점",
    "5-1": "한국 보건복지부의 고립은둔청년 지원사업 개요와 추진 경과",
    "5-2": "서울시 등 지자체의 은둔형외톨이 지원사업·지원센터 정책",
    "5-3": "일본의 히키코모리 지원 추진사업과 지역 정착지원센터 체계",
    "5-4": "청년수당·구직촉진수당 등 경제적 지원정책과 은둔청년 연계 방안",
    "5-5": "정신건강복지센터를 통한 국가 정신건강 지원 체계와 은둔청년 접점",
    "5-6": "해외 선진국의 사회적 처방(Social Prescribing) 등 정책 사례",
    "6-1": "서울시 고립은둔청년 지원센터의 프로그램 구성과 운영 방식",
    "6-2": "광역·기초 지자체별 은둔형외톨이 지원센터 사례 비교",
    "6-3": "청소년상담복지센터 등 청소년 대상 은둔 지원 활동",
    "6-4": "민간단체(사회적기업, 비영리단체 등)의 자립준비 프로그램",
    "6-5": "온라인 기반 비대면 상담·커뮤니티 활동 사례",
    "6-6": "은둔청년 당사자 자조모임 및 활동가 네트워크 사례",
}


def print_topic_list():
    print("=== 은둔고립청년 세부탐구주제 목록 (36개) ===")
    for main_num, main_theme in MAIN_THEMES.items():
        print(f"\n[{main_num}] {main_theme}")
        for key in sorted(k for k in TOPICS if k.startswith(f"{main_num}-")):
            print(f"  {key}. {TOPICS[key]}")


def build_prompt(number: str, topic: str) -> str:
    main_num = number.split("-")[0]
    main_theme = MAIN_THEMES.get(main_num, "")
    return f"""너는 청년 고립·은둔 문제를 다루는 전문 리서처야. 아래 세부탐구주제에 대해 깊이 있게 조사하고 정리해줘.

[대주제] {main_theme}
[세부탐구주제 번호] {number}
[세부탐구주제] {topic}

작성 지침:
1. 위 세부탐구주제를 중심으로 조사하되, 이 주제와 밀접하게 연관되지만 아직 다루지 않은 소주제를 너 스스로 2~4개 더 찾아내어 함께 조사에 포함시켜줘. (예: 관련 통계, 구체적 사례, 최근 동향, 비교 대상 등)
2. 가능한 한 구체적인 수치, 기관명, 연도, 사례, 연구자·보고서명을 포함해줘. 다만 확실하지 않은 정보는 반드시 "추정" 또는 "확인 필요"라고 명시해줘.
3. 결과물은 반드시 아래 형식을 지켜서 작성해줘. 다른 형식은 사용하지 마.

[출력 형식]
제목: (이 조사 전체를 아우르는 제목 한 줄)

(본문 - 조사 내용을 소제목과 함께 단락별로 상세히 서술. 1번 지침에 따라 추가한 소주제들도 소제목을 붙여 본문에 포함할 것)

결론: (조사 내용을 종합한 결론 및 시사점을 3~5문장으로 정리)
"""


def call_grok(prompt: str) -> str:
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "너는 청년 고립·은둔 문제를 전문적으로 조사하는 리서처다. 한국어로 답변한다.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )
    return resp.choices[0].message.content


def save_result(number: str, topic: str, content: str) -> str:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    safe_topic = "".join(c for c in topic[:30] if c not in '/\\:*?"<>|').replace(" ", "_")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(OUTPUT_DIR, f"{number}_{safe_topic}_{timestamp}.md")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    return filename


def main():
    if len(sys.argv) > 1:
        number = sys.argv[1].strip()
    else:
        print_topic_list()
        number = input("\n조사할 세부탐구주제 번호를 입력하세요 (예: 5-5): ").strip()

    if number not in TOPICS:
        print(f"\n'{number}'는 목록에 없는 번호입니다. 1-1 ~ 6-6 사이의 번호를 입력하세요.")
        sys.exit(1)

    if not API_KEY or not API_KEY.startswith("xai-"):
        print("유효한 xAI API 키가 설정되어 있지 않습니다. XAI_API_KEY 환경변수를 확인하세요.")
        sys.exit(1)

    topic = TOPICS[number]
    prompt = build_prompt(number, topic)

    print(f"\n[{number}] {topic}\n에 대해 Grok으로 조사 중입니다... (모델: {MODEL})\n")

    try:
        result = call_grok(prompt)
    except Exception as e:
        print(f"API 호출 중 오류가 발생했습니다: {e}")
        sys.exit(1)

    print(result)
    saved_path = save_result(number, topic, result)
    print(f"\n[결과가 저장되었습니다: {saved_path}]")


if __name__ == "__main__":
    main()
