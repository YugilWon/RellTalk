# RillTalk

영화 정보를 탐색하고 트레일러를 감상하며 사용자 간 의견을 나눌 수 있는
영화 커뮤니티 웹 애플리케이션입니다.

영화 정보는 TMDB API를 통해 제공되며,
YouTube Data API를 활용해 영화 트레일러를 검색하고 재생할 수 있습니다.

커뮤니티 기능은 Supabase 기반으로 구현하여
사용자 인증, 게시글, 댓글, 좋아요, 알림 기능을 제공합니다.

---

## 🔗 Live Demo

https://relltalk.vercel.app/

---

## Demo Account (테스트용)

ID: [test@naver.com](mailto:test@naver.com)
PW: 11111111

---

## 🛠 Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query

### Infra

- Supabase (Auth, PostgreSQL, Storage)
- Vercel

### External API

- TMDB API
- YouTube Data API

---

## 📌 Features

### Movie

- 인기 영화 조회
- 장르별 영화 탐색
- 영화 검색 기능
- 무한 스크롤 기반 영화 목록

### Trailer Preview

- 영화 카드 hover 시 트레일러 자동 재생
- YouTube Data API 기반 트레일러 검색

### Community

- 게시글 CRUD
- 댓글 / 대댓글 기능
- 좋아요 기능

### Notification

- 댓글 작성 시 게시글 작성자에게 알림 생성
- 대댓글 작성 시 댓글 작성자에게 알림 생성
- 읽지 않은 알림 표시
- 알림 읽음 처리

---

## 🏗 Architecture

### Directory-Based Structure

이 프로젝트는 Next.js App Router의 파일 기반 라우팅을 중심으로 구성했습니다.
UI 라우트와 API 라우트를 명확히 분리하고 서버 로직과 클라이언트 로직의 책임을 구분했습니다.

```
📦 movie
 ┣ 📂 app
 ┃ ┣ 📂 (with-sidebar)
 ┃ ┃ ┣ 📂 detail
 ┃ ┃ ┃ ┗ 📂 [id]
 ┃ ┃ ┣ 📂 genres
 ┃ ┃ ┗ 📂 recommend
 ┃ ┣ 📂 api
 ┃ ┗ 📂 auth
 ┣ 📂 components
 ┣ 📂 hooks
 ┣ 📂 utils
 ┗ 📂 types
```

---

### Layered Architecture

프로젝트는 다음과 같은 계층 구조로 구성했습니다.

1️⃣ Presentation Layer

- app/(with-sidebar)
- components/

2️⃣ API Layer

- app/api

3️⃣ Service Layer

- app/server
- app/lib

4️⃣ Data Layer

- Supabase (Auth / Database / Storage)

각 레이어의 역할을 분리하여 유지보수성과 확장성을 고려했습니다.

---

## ⚙️ Rendering Strategy

### Server Component

다음 페이지는 Server Component 기반으로 구성했습니다.

- 영화 목록 페이지
- 장르별 영화 페이지
- 인기 영화 페이지

사용 이유

- 초기 로딩 속도 개선
- 번들 크기 감소
- SEO 개선

---

### Client Component

다음 기능은 사용자 인터랙션이 많아 Client Component로 분리했습니다.

- 댓글 작성
- 좋아요 버튼
- 무한 스크롤
- 사용자 인터랙션 UI

---

## 🔌 API Design

Route Handler를 활용하여 서버 전용 API를 구성했습니다.

주요 API 기능

- 사용자 정보 조회
- 게시글 CRUD
- 비밀번호 변경
- 영화 검색
- 인증 보호 API

클라이언트에서 직접 데이터베이스에 접근하지 않도록 하고
모든 민감 로직은 서버 단에서 처리하도록 설계했습니다.

---

## 🔐 Data Access & RLS

Supabase Row Level Security를 적용하여 데이터 접근을 제어했습니다.

- 본인 데이터만 수정 가능
- 로그인 사용자만 댓글 작성 가능
- 좋아요 중복 방지

권한 제어를 애플리케이션 레벨이 아닌
데이터베이스 레벨에서도 보장하도록 구성했습니다.

---

## 🔔 Notification System

사용자의 게시글이나 댓글에 새로운 활동이 발생했을 때
알림을 받을 수 있는 기능을 구현했습니다.

알림 생성 흐름

1. 사용자가 댓글 작성
2. 서버에서 notification 레코드 생성
3. 대상 사용자에게 알림 저장
4. 사용자는 알림 목록에서 확인 가능

주요 기능

- 댓글 알림
- 대댓글 알림
- 읽지 않은 알림 표시
- 알림 읽음 처리

---

## 🚀 Deployment

이 프로젝트는 Vercel을 통해 배포되었습니다.

https://relltalk.vercel.app/

---

## 📚 What I Learned

이 프로젝트를 통해 다음과 같은 경험을 얻을 수 있었습니다.

- Next.js App Router 기반 아키텍처 설계
- Server Component와 Client Component 역할 분리
- Supabase Auth 및 Row Level Security 적용
- 알림 시스템 설계
- 외부 API 사용 시 캐싱 전략
