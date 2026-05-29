# Dexter 🤖

Dexter는 작업하면서 스스로 사고하고, 계획하고, 학습하는 자율형 금융 리서치 에이전트입니다. 작업 계획(task planning), 자기 점검(self-reflection), 실시간 시장 데이터를 활용해 분석을 수행합니다. Claude Code를 떠올리되, 금융 리서치에 특화되도록 만들어진 도구라고 생각하면 됩니다.

<img width="665" height="452" alt="Screenshot 2026-04-02 at 4 16 57 PM" src="https://github.com/user-attachments/assets/02418111-5f48-4a66-be5d-dc9bf9806284" />

## 목차

- [👋 개요](#-개요)
- [🇰🇷 한국 주식 리서치](#-한국-주식-리서치)
- [✅ 사전 준비](#-사전-준비)
- [💻 설치 방법](#-설치-방법)
- [🚀 실행 방법](#-실행-방법)
- [📊 평가 방법](#-평가-방법)
- [🐛 디버깅 방법](#-디버깅-방법)
- [📱 WhatsApp으로 사용하기](#-whatsapp으로-사용하기)
- [🤝 기여 방법](#-기여-방법)
- [📄 라이선스](#-라이선스)

## ⚠️ 면책 조항

이 프로젝트는 **교육·오락·정보 제공 목적으로만** 제공됩니다. 실제 거래나 투자를 위한 것이 아닙니다.

- 금융·투자·세무·법률 자문이 아닙니다
- 정확성·완전성·특정 목적 적합성을 보장하지 않습니다
- 출력 결과가 부정확하거나 불완전하거나 시점이 지난 것일 수 있습니다
- 제작자와 기여자는 어떠한 금전적 손실이나 손해에 대해서도 책임지지 않습니다
- 투자 결정을 내리기 전에 면허를 보유한 금융 전문가와 상담하세요
- 과거 성과가 미래 수익을 보장하지 않습니다

이 소프트웨어를 사용함으로써, 귀하는 학습 및 정보 제공 목적으로만 사용할 것에 동의하며 사용에 따른 모든 위험을 감수합니다.

## 👋 개요

Dexter는 복잡한 금융 질문을 받아 명확한 단계별 리서치 계획으로 바꿉니다. 그 작업을 실시간 시장 데이터로 실행하고, 자신의 작업을 점검하며, 데이터로 뒷받침되는 확신 있는 답에 이를 때까지 결과를 다듬습니다.

**핵심 역량:**
- **지능형 작업 계획**: 복잡한 쿼리를 구조화된 리서치 단계로 자동 분해
- **자율 실행**: 금융 데이터를 수집할 알맞은 툴을 선택해 실행
- **자기 검증**: 자신의 작업을 점검하고 작업이 완료될 때까지 반복
- **실시간 금융 데이터**: 손익계산서·재무상태표·현금흐름표 접근
- **안전장치**: 무한 루프 감지와 단계 제한을 내장해 폭주 실행 방지

[![Twitter Follow](https://img.shields.io/twitter/follow/virattt?style=social)](https://twitter.com/virattt) [![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?style=social&logo=discord)](https://discord.gg/jpGHv2XB6T)

<img width="1042" height="638" alt="Screenshot 2026-02-18 at 12 21 25 PM" src="https://github.com/user-attachments/assets/2a6334f9-863f-4bd2-a56f-923e42f4711e" />


## 🇰🇷 한국 주식 리서치

Dexter는 미국 주식과 한국 주식을 **하나의 에이전트에서 동시에** 다룰 수 있습니다. 사용자가 시장을 명시할 필요 없이, LLM이 티커 형태와 회사명 언어를 보고 알맞은 데이터 소스를 골라 호출합니다.

### 동작 방식

```mermaid
flowchart TB
    Q[사용자 쿼리] --> LLM{LLM 라우팅}

    LLM -->|6자리 숫자 티커<br/>한국어 회사명| KR[KR 툴]
    LLM -->|알파벳 티커<br/>영문 회사명| US[US 툴]
    LLM -->|크로스마켓 비교| Both[양쪽 모두 호출]

    KR --> DART[(DART API<br/>공시·재무)]
    KR --> KRX[(KRX<br/>시세·공매도)]

    US --> FD[(Financial Datasets<br/>재무·시세)]
    US --> SEC[(SEC EDGAR<br/>공시)]

    Both --> DART
    Both --> FD

    DART --> Out[종합 답변]
    KRX --> Out
    FD --> Out
    SEC --> Out
```

### 신규 툴 (DART 기반)

`DART_API_KEY`가 설정되면 자동 등록됩니다.

| 툴 | 대응되는 미국 개념 | 데이터 소스 |
|---|---|---|
| `get_financials_kr` | `get_financials` (10-K/10-Q) | DART 사업·반기·분기보고서 |
| `get_filings_kr` | SEC EDGAR | DART 공시 검색 |
| `get_large_holders_kr` | 13F (5% 이상 보유) | DART 대량보유상황보고서 |
| `get_insider_trades_kr` | Form 4 (내부자 거래) | DART 임원·주요주주 보고 |

### 신규 툴 (Korea-specific, 소스별 키)

DART에 없는 한국 특화 데이터. 툴마다 소스·키가 다릅니다.

| 툴 | 대응되는 미국 개념 | 데이터 소스 | 활성화 조건 |
|---|---|---|---|
| `get_foreign_ownership_kr` | (미국엔 없음) | 외국인 지분율 (Naver) | 항상 (키 불필요) |
| `get_short_balance_kr` | Short interest | KRX 공매도 순보유잔고 | `KRX_ID`+`KRX_PW` 또는 `KRX_COOKIE` |
| `get_nps_holdings` | (미국엔 없음) | 국민연금 국내주식 투자정보 (data.go.kr) | `DATA_GO_KR_SERVICE_KEY` |

### 종목 코드 해결 흐름

LLM이 "삼성전자" 같은 자연어 입력을 받으면, 툴 내부에서 **티커 → corp_code** 변환을 거쳐 DART API를 호출합니다.

```mermaid
sequenceDiagram
    participant U as 사용자
    participant L as LLM
    participant T as get_financials_kr
    participant R as TickerRegistry<br/>(캐시)
    participant D as DART API

    U->>L: "삼성전자 재무 어때?"
    L->>L: 한국 종목 인식<br/>→ 005930으로 정규화
    L->>T: get_financials_kr({ticker: "005930"})
    T->>R: resolve("005930")
    R-->>T: corp_code: "00126380"
    T->>D: 사업보고서 조회 (corp_code)
    D-->>T: 재무 데이터
    T-->>L: 정형화된 결과
    L-->>U: 분석 답변 작성
```

`TickerRegistry`는 DART의 마스터 파일(`corpCode.xml`)을 **첫 실행 시 한 번 다운로드**해 `.dexter/cache/`에 저장하고, 7일마다 백그라운드에서 갱신합니다. 신규 상장·사명 변경·물적분할이 자동 반영됩니다.

### 설정

`.env`에 다음 항목 추가:

```bash
# 한국 주식 (필수)
OPEN_DART_KEY=your-dart-api-key
```

DART API 키는 [opendart.fss.or.kr](https://opendart.fss.or.kr/uss/umt/cmm/EgovMberInsertView.do)에서 무료 발급. 일 10,000건 호출 한도.

### 한국 시장 고유 처리

- **K-IFRS 재무제표** — 연결/별도 둘 다 조회. 영업이익 정의가 미국 GAAP와 미묘하게 다름
- **단위** — 원(KRW), 백만원/억/조 단위로 자동 포맷팅
- **거래시간** — 09:00–15:30 KST 기준
- **상하한가** — ±30% 일간 변동 제한 고려
- **DCF 자동 분기** — 6자리 티커면 DCF 스킬이 한국 경로로 전환(한국 법인세율·국고채 무위험금리·KRW). 거래세·배당세는 투자자 세후 실현수익률 주의사항으로 표기
- **재벌 그룹 구조** — 삼성·현대차·SK·LG 등 그룹 내 지분 관계 분석 가능
- **물적분할 분석** — LG화학→LG에너지솔루션 같은 분할 이벤트를 모회사 주주 관점(희석·지주사 디스카운트)에서 평가하는 전용 스킬

### 크로스마켓 쿼리 예시

```
> TSMC와 삼성전자 파운드리 사업 비교해줘
```

LLM이 `get_financials` (TSMC, US) + `get_financials_kr` (삼성전자, KR)를 모두 호출하고, 단위·회계기준 차이를 보정해서 비교 표를 생성합니다.


## ✅ 사전 준비

- [Bun](https://bun.com) 런타임 (v1.0 이상)
- OpenAI API 키 ([여기서](https://platform.openai.com/api-keys) 발급)
- Financial Datasets API 키 ([여기서](https://financialdatasets.ai) 발급)
- Exa API 키 ([여기서](https://exa.ai) 발급) — 선택, 웹 검색용

#### Bun 설치

Bun이 설치돼 있지 않다면 curl로 설치할 수 있습니다:

**macOS/Linux:**
```bash
curl -fsSL https://bun.com/install | bash
```

**Windows:**
```bash
powershell -c "irm bun.sh/install.ps1|iex"
```

설치 후 터미널을 재시작하고 Bun이 설치됐는지 확인하세요:
```bash
bun --version
```

## 💻 설치 방법

1. 저장소 클론:
```bash
git clone https://github.com/virattt/dexter.git
cd dexter
```

2. Bun으로 의존성 설치:
```bash
bun install
```

3. 환경 변수 설정:
```bash
# 예제 환경 파일 복사
cp env.example .env

# .env를 편집해 API 키 추가 (클라우드 제공자를 쓰는 경우)
# OPENAI_API_KEY=your-openai-api-key
# ANTHROPIC_API_KEY=your-anthropic-api-key (선택)
# GOOGLE_API_KEY=your-google-api-key (선택)
# XAI_API_KEY=your-xai-api-key (선택)
# OPENROUTER_API_KEY=your-openrouter-api-key (선택)

# 에이전트용 기관급 시장 데이터
# FINANCIAL_DATASETS_API_KEY=your-financial-datasets-api-key

# (선택) 로컬에서 Ollama를 쓰는 경우
# OLLAMA_BASE_URL=http://127.0.0.1:11434

# 웹 검색 (Exa 우선, Tavily 폴백)
# EXASEARCH_API_KEY=your-exa-api-key
# TAVILY_API_KEY=your-tavily-api-key
```

## 🚀 실행 방법

대화형 모드로 Dexter 실행:
```bash
bun start
```

개발용 watch 모드로 실행:
```bash
bun dev
```

## 📊 평가 방법

Dexter에는 금융 질문 데이터셋으로 에이전트를 테스트하는 평가(eval) 스위트가 포함돼 있습니다. 평가는 추적에 LangSmith를, 정답 채점에 LLM-as-judge 방식을 사용합니다.

**전체 질문에 대해 실행:**
```bash
bun run src/evals/run.ts
```

**데이터의 무작위 샘플에 대해 실행:**
```bash
bun run src/evals/run.ts --sample 10
```

평가 러너는 진행 상황, 현재 질문, 실시간 정확도 통계를 보여주는 UI를 실시간으로 표시합니다. 결과는 분석을 위해 LangSmith에 기록됩니다.

## 🐛 디버깅 방법

Dexter는 디버깅과 이력 추적을 위해 모든 툴 호출을 스크래치패드(scratchpad) 파일에 기록합니다. 각 쿼리는 `.dexter/scratchpad/`에 새 JSONL 파일을 생성합니다.

**스크래치패드 위치:**
```
.dexter/scratchpad/
├── 2026-01-30-111400_9a8f10723f79.jsonl
├── 2026-01-30-143022_a1b2c3d4e5f6.jsonl
└── ...
```

각 파일은 다음을 추적하는 줄바꿈 구분(JSONL) 항목을 담습니다:
- **init**: 원본 쿼리
- **tool_result**: 인자·원시 결과·LLM 요약을 포함한 각 툴 호출
- **thinking**: 에이전트의 추론 단계

**스크래치패드 항목 예시:**
```json
{"type":"tool_result","timestamp":"2026-01-30T11:14:05.123Z","toolName":"get_income_statements","args":{"ticker":"AAPL","period":"annual","limit":5},"result":{...},"llmSummary":"Retrieved 5 years of Apple annual income statements showing revenue growth from $274B to $394B"}
```

덕분에 에이전트가 정확히 어떤 데이터를 수집했고 결과를 어떻게 해석했는지 손쉽게 확인할 수 있습니다.

## 📱 WhatsApp으로 사용하기

휴대폰을 게이트웨이에 연결해 WhatsApp으로 Dexter와 대화할 수 있습니다. 자기 자신에게 보낸 메시지가 Dexter에 의해 처리되고 응답이 같은 채팅으로 돌아옵니다.

**빠른 시작:**
```bash
# WhatsApp 계정 연결 (QR 코드 스캔)
bun run gateway:login

# 게이트웨이 시작
bun run gateway
```

그런 다음 WhatsApp을 열고 본인과의 채팅(자기 자신에게 메시지)으로 이동해 Dexter에게 질문하세요.

자세한 설정 방법, 구성 옵션, 문제 해결은 [WhatsApp 게이트웨이 README](src/gateway/channels/whatsapp/README.md)를 참고하세요.

## 🤝 기여 방법

1. 저장소 포크
2. 기능 브랜치 생성
3. 변경 사항 커밋
4. 브랜치에 푸시
5. Pull Request 생성

**중요**: PR은 작고 집중되게 유지해 주세요. 리뷰와 머지가 더 쉬워집니다.


## 📄 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다.
