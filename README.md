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

영화 상세 조회 (TMDB API 연동)

댓글 작성 / 수정 / 삭제

좋아요 기능 (영화 / 댓글 확장 가능)

로그인 기반 사용자 인증

🧠 기술적 설계 포인트
1️⃣ 범용 좋아요 시스템 설계

좋아요 기능을 특정 도메인(movie, comment)에 종속시키지 않고,
targetType 기반으로 일반화하여 재사용 가능하도록 설계했습니다.

useToggleLike(targetId, targetType, userId)
useLikeSummary(targetId, targetType, userId)

이를 통해 향후 post, review 등 다른 도메인이 추가되더라도
로직 수정 없이 확장할 수 있도록 구조를 설계했습니다.

또한 likes 테이블에 다음 복합 unique 제약을 설정했습니다.

(user_id, target_id, target_type)

→ 동일 사용자의 중복 좋아요를 DB 레벨에서 방지하여 데이터 무결성을 보장했습니다.

2️⃣ React Query 캐시 전략

queryKey를 컴포넌트에서 제거하고 hook 내부로 캡슐화

Optimistic Update 적용

최소 범위 invalidate 전략 사용

UI와 데이터 로직 분리

이를 통해 컴포넌트는 UI에만 집중하도록 구성하고,
데이터 로직은 hook 내부에서 일관되게 관리하도록 구조를 정리했습니다.

3️⃣ 외부 API + 캐싱 전략

TMDB 요청: revalidate: 86400 (ISR 적용)

YouTube fallback 구조

외부 API 호출 최소화

상세 페이지는 ISR 기반으로 캐싱하여
외부 API 호출이 반복적으로 발생하지 않도록 설계했습니다.

실서비스 환경에서는 외부 API를 요청 시점에 매번 호출하는 대신,
캐싱 또는 DB 저장 전략을 사용하는 것이 안정적이라고 판단했습니다.

🚀 성능 테스트 (Production 환경)
테스트 환경

실행 모드: Production

npm run build
npm start

테스트 도구: autocannon

테스트 시간: 15초

대상 엔드포인트: /detail

모든 테스트에서 에러 0건

1️⃣ 100 Connections (외부 API 포함, 캐시 사용)

조건

TMDB 요청: revalidate: 86400

YouTube fallback 활성화

Production 빌드 환경

결과

평균 응답 시간: 75ms

p99: 125ms

처리량: 약 1,317 req/sec

에러: 0

해석

ISR 캐싱이 적용된 상태에서는 외부 API 호출이 반복적으로 발생하지 않아
응답 시간에 거의 영향을 주지 않았다. 분포 또한 안정적으로 유지되었다.

2️⃣ 300 Connections (외부 API 포함, 캐시 사용)

결과

평균 응답 시간: 211ms

p99: 275ms

처리량: 약 1,406 req/sec

에러: 0

해석

동시 접속 수 증가에 따라 지연 시간은 자연스럽게 증가했으나
처리량은 안정적으로 유지되었다.

외부 API로 인한 병목은 관찰되지 않았으며,
Node.js 단일 프로세스의 CPU 처리 한계에 가까운 패턴을 보였다.

3️⃣ 100 Connections (캐시 비활성화)

조건

TMDB 요청: cache: "no-store"

YouTube fallback 활성화

결과

평균 응답 시간: 73ms

p99: 123ms

p99.9: 824ms

최대 응답 시간: 836ms

처리량: 약 1,343 req/sec

에러: 0

해석

평균 응답 시간은 큰 차이가 없었지만, 일부 요청에서 지연 시간이 크게 증가했다.
이는 외부 API 호출 시 발생하는 네트워크 지연의 영향으로 판단된다.

즉, 외부 API는 평균 성능보다는 tail latency에 영향을 준다.

4️⃣ 300 Connections (캐시 비활성화)

결과

평균 응답 시간: 211ms

p99: 302ms

최대 응답 시간: 411ms

처리량: 약 1,408 req/sec

에러: 0

해석

동시 접속 300 환경에서도 안정적으로 동작했다.
응답 시간 증가 패턴은 CPU 부하 증가에 따른 것으로 보이며,
외부 API로 인한 급격한 성능 저하는 확인되지 않았다.

📊 최종 정리

ISR 기반 캐싱 전략이 외부 API 호출 부담을 효과적으로 완화함

300 동시 접속 환경에서도 안정적인 처리량 유지

평균 성능에 가장 큰 영향을 주는 요소는 외부 API가 아닌 서버 CPU 처리 한계

외부 API는 일부 요청의 tail latency에 영향을 줄 수 있으므로,
실서비스에서는 캐싱 또는 DB 저장 전략이 필요함

💡 추가로 고려한 부분

외부 API(YouTube Search API)는 요청당 quota 비용이 크기 때문에
대량 부하 테스트를 직접 수행하지 않음

🧩 트러블슈팅 및 성능 분석 과정
1️⃣ 외부 API가 병목인지에 대한 검증
문제 인식

영화 상세 페이지에서 TMDB API와 YouTube API를 함께 사용하고 있었기 때문에,
동시 접속 환경에서 외부 API가 병목이 될 가능성을 고려했다.

특히 YouTube Search API는 요청당 quota 비용이 크기 때문에
실서비스 환경에서 반복 호출은 위험 요소가 될 수 있다고 판단했다.

가설

캐싱이 적용된 상태에서는 외부 API가 성능에 큰 영향을 주지 않을 것이다.

캐시를 제거하면 외부 API 호출로 인해 응답 시간이 급격히 증가할 것이다.

실험 방법

Production 모드에서 빌드 후 테스트 진행

autocannon으로 100 / 300 connections 부하 테스트

다음 두 가지 조건 비교

ISR 캐싱 적용 (revalidate: 86400)

캐시 제거 (cache: "no-store")

관찰 결과

캐싱이 적용된 상태에서는 외부 API 호출이 반복되지 않아 평균 응답 시간이 매우 안정적으로 유지되었다.

캐시를 제거했을 경우 평균 응답 시간은 크게 변하지 않았지만,
일부 요청에서 응답 시간이 크게 증가(p99.9 상승)하는 현상이 발생했다.

이는 네트워크 지연에 따른 tail latency 증가로 판단했다.

결론

외부 API는 평균 응답 시간의 주요 병목이 아니었다.

대신, 극소수 요청에서 tail latency에 영향을 줄 수 있다.

실제 서비스에서는 요청 시점마다 외부 API를 호출하는 구조보다,
최초 1회 조회 후 캐싱 또는 DB 저장 전략이 더 적절하다고 판단했다.

2️⃣ 서버 병목 분석

300 connections 환경에서도 처리량은 약 1,400 req/sec 수준을 유지했다.
응답 시간 증가는 선형적인 패턴을 보였으며, 급격한 폭증은 발생하지 않았다.

이를 통해 병목 지점은 외부 API가 아니라
Node.js 단일 프로세스의 CPU 처리 한계에 가까운 것으로 분석했다.

확장 시에는 다음과 같은 전략을 고려할 수 있다.

PM2 cluster 모드 적용

서버 인스턴스 수평 확장

외부 API 결과 사전 수집 및 DB 저장

🔍 회고

이번 성능 테스트를 통해 단순히 기능 구현을 넘어서,

외부 API 의존성이 서비스에 어떤 영향을 미치는지

평균 latency와 tail latency의 차이

캐싱 전략이 실제 트래픽 환경에서 얼마나 중요한지

를 직접 검증해볼 수 있었다.

기능 구현 이후 실제 부하 상황을 가정하고 검증하는 과정을 통해
구조적인 안정성을 한 번 더 점검하는 계기가 되었다.
