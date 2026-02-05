---
trigger: always_on
---

# [K-Destiny] Ultra-Simple Static Site Instructions

## 1. 프로젝트 핵심 (Core Concept)

- **목표:** 기술적 복잡도를 최소화하고, **콘텐츠(운세 결과)**와 **광고 수익**에 집중한다.
- **배포:** Cloudflare Pages (무료, 무제한 대역폭, 초고속).
- **구조:** 오직 `index.html`, `style.css`, `script.js` 만 사용. (빌드 과정 없음)

---

## 2. 기술 스택 (Tech Stack: Simple & Free)

### A. Core (순정 기술)

- **HTML5:** 시맨틱 태그 준수 (SEO 목적).
- **CSS3:** 라이브러리 없이 순수 CSS 사용 (또는 편의상 Tailwind CDN `<script src="https://cdn.tailwindcss.com"></script>` 한 줄 추가).
- **JavaScript:** Vanilla JS (ES6+). 프레임워크(React, Vue) 금지.

### B. Hosting & Domain

- **Cloudflare Pages:**
  - GitHub 레포지토리와 연동하여 자동 배포.
  - `_headers` 파일을 통해 캐싱 정책 및 보안 헤더 설정 가능.
  - HTTPS 자동 적용 및 전 세계 CDN 무료 제공.

### C. Recommended Free Tools (API 대용)

서버가 없는 정적 페이지이므로, API 키가 노출되는 외부 API 호출보다는 **"라이브러리 + 정적 데이터"** 방식을 추천합니다.

1.  **만세력/음력 변환 (Logic):**
    - **추천:** `korean-lunar-calendar` (오픈소스 JS 라이브러리)
    - **용도:** 양력 생일을 입력받아 음력/간지(갑자, 을축 등)로 변환하는 로직을 브라우저 내부에서 처리. (서버 API 불필요)
2.  **운세 데이터 (Data):**
    - **추천:** `Google Gemini (무료 버전)`을 이용해 미리 생성한 **JSON 파일**.
    - **방식:** 실시간 API 호출은 키 노출 위험이 있으므로, 개발 단계에서 Gemini에게 *"60갑자별 성격 운세 데이터를 JSON으로 만들어줘"*라고 요청하여 `fortune-data.json`으로 저장해두고 불러와서 사용.

---

## 3. SEO 및 애드센스 규칙 (Money Rules)

1.  **경량화 (Lightweight):**
    - 불필요한 애니메이션 라이브러리 금지. 오직 CSS `transition`만 사용.
    - 이미지는 tinypng.com 등을 통해 무조건 압축된 `WebP` 형식 사용.
2.  **광고 친화적 구조:**
    - 결과를 보여주기 전 `setTimeout`을 이용해 3초 정도 "분석 중..." 화면을 보여주고, 그 사이에 전면 광고나 중간 광고가 노출될 시간을 벌 것.
3.  **Cloudflare 최적화:**
    - Cloudflare 대시보드에서 `Auto Minify` (HTML, CSS, JS 압축) 기능을 켤 것.

---

## 4. 개발 프로세스 (Workflow)

1.  **폴더 구조:**
    ```text
    / (root)
    ├── index.html       (메인 + 입력폼)
    ├── result.html      (결과 페이지 + 광고)
    ├── style.css        (디자인)
    ├── script.js        (운세 로직)
    ├── data.json        (운세 DB)
    └── assets/          (이미지)
    ```
2.  **행동 지침:**
    - 복잡한 로직을 짜려고 하면 제지할 것. "하드코딩"이나 "단순 배열(Array)" 매칭이 가장 빠르고 안전함을 상기시킬 것.
    - 모든 설명 주석은 **한국어**로 작성.
