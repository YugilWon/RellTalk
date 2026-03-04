---

Demo Account (테스트용)

- ID: test@naver.com
- PW: 11111111

## Tech Stack

Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

Infra
- Supabase (Auth, PostgreSQL, Storage)
- Vercel

External API
- TMDB API
- YouTube Data API

## Architecture

### Directory-Based Structure

이 프로젝트는 Next.js App Router의 파일 기반 라우팅을 중심으로 구성했습니다.  
UI 라우트와 API 라우트를 명확히 분리하고, 서버 로직과 클라이언트 로직의 책임을 구분하는 것을 목표로 했습니다.

```
app
├── (with-sidebar)        # 사용자 페이지 그룹
│   ├── detail/[id]       # 영화 상세
│   ├── genres/[genreId]  # 장르별 영화 목록
│   ├── post              # 게시판
│   ├── mypage            # 마이페이지
│   └── recommend         # 추천 기능
│
├── api                   # Route Handler (Server Only)
│   ├── auth
│   ├── post
│   ├── popular
│   ├── search
│   └── change-password
│
├── auth/callback         # 이메일 인증 처리
├── server                # 서버 전용 비즈니스 로직
└── lib                   # 외부 API 유틸 함수
```

### Layered Architecture

프로젝트는 다음과 같은 계층 구조를 따릅니다.

1. Presentation Layer  
   - app/(with-sidebar)  
   - components/

2. API Layer  
   - app/api

3. Service Layer  
   - app/server  
   - app/lib

4. Data Layer  
   - Supabase (Auth, Database, Storage)

각 레이어의 역할을 분리하여 유지보수성과 확장성을 고려했습니다.

---

### 기본 원칙

- 데이터 패칭이 필요한 페이지는 Server Component를 기본으로 사용
- 사용자 인터랙션이 필요한 부분만 Client Component로 분리
- 인증 및 권한 검증은 서버에서 처리

### Server Component 사용 이유

- 초기 로딩 속도 개선
- 번들 크기 감소
- API Key 노출 방지
- SEO 개선

영화 목록, 장르 페이지, 인기 영화 페이지는 Server Component 기반으로 구성했습니다.

### Client Component 사용 영역

- 댓글 작성
- 좋아요 버튼
- 무한 스크롤
- 사용자 인터랙션이 많은 UI

### Dynamic Rendering 처리

`cookies()` 사용으로 인해 정적 렌더링이 불가능해지는 문제가 발생했습니다.

이를 해결하기 위해:

- 인증이 필요한 페이지는 동적 렌더링으로 명시적 분리
- 공개 페이지는 정적 렌더링 유지
- 서버/클라이언트 경계를 의도적으로 설계

---

## Authentication Flow

```
회원가입
→ Supabase auth.users 생성
→ 구글 로그인 시 profiles 테이블 생성을 위해 SQL문을 통한 profiles 테이블 생성
---

## API Design

Route Handler를 활용하여 서버 전용 API를 구성했으며

- 사용자 정보 조회
- 게시글 CRUD
- 비밀번호 변경
- 검색 기능
- 인증 보호 API

클라이언트에서 직접 데이터베이스에 접근하지 않도록 하고,
모든 민감 로직은 서버 단에서 처리하도록 설계했습니다.

---

## Data Access and RLS

Supabase의 Row Level Security를 적용하여 데이터 접근을 제어했습니다.

- 본인 데이터만 수정 가능
- 로그인 사용자만 댓글 작성 가능
- 좋아요 중복 방지

권한 제어를 애플리케이션 레벨이 아닌 데이터베이스 레벨에서도 보장하도록 구성했습니다.

---
```
