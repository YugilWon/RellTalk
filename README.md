🎬 Movie Review Platform

Supabase 기반의 영화 리뷰 플랫폼입니다.
단순 CRUD 구현을 넘어서, 좋아요 기능을 범용적으로 설계하여 확장성과 유지보수를 고려한 구조로 구현했습니다.

🖥️ Demo

🔗 배포 링크: https://relltalk.vercel.app/
🔗 GitHub: https://github.com/YugilWon/RellTalk

🛠 Tech Stack
Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

State Management

TanStack Query (React Query)

Backend / Database

Supabase (PostgreSQL)

Supabase Auth

✨ 주요 기능

영화 상세 조회

댓글 작성 / 수정 / 삭제

좋아요 기능 (영화 / 댓글 확장 가능)

로그인 기반 사용자 인증

🧠 기술적 설계 포인트
1️⃣ 범용 좋아요 시스템 설계

좋아요 기능을 특정 도메인(movie, comment)에 종속시키지 않고,
targetType 기반으로 일반화하여 재사용 가능하도록 설계했습니다.

useToggleLike(targetId, targetType, userId)
useLikeSummary(targetId, targetType, userId)

이를 통해 post 기능 추가 시 로직 수정 없이 확장 가능하도록 구조를 개선했습니다.

2️⃣ React Query 캐시 전략

queryKey를 UI 컴포넌트에서 제거

hook 내부에서 캐시 관리

Optimistic Update 적용

최소한의 invalidate 전략 사용

UI와 데이터 로직을 분리하여 유지보수성을 향상시켰습니다.

3️⃣ 데이터 무결성 설계

likes 테이블에 다음 복합 unique 제약을 설정:

(user_id, target_id, target_type)

→ 중복 좋아요 방지

📂 폴더 구조
hooks/
useToggleLike.ts
useLikeSummary.ts

components/
like/
LikeButton.tsx
comment/
CommentCard.tsx

기능 단위로 구조를 분리하여 책임을 명확히 했습니다.

잠시 확인용
