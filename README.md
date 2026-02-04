🎬 Temp-Movie

Temp-Movie는 좋아하는 영화 정보를 확인하고, 트레일러 시청과 댓글 작성까지 가능한 개인 영화 허브입니다.

🚀 Features

🏆 Popular Movies: TMDB API로 인기 영화 가져오기

🎥 Movie Details & Trailers:클릭으로 YouTube 트레일러 시청

🔑 Authentication:

이메일/비밀번호 회원가입 및 로그인

Google OAuth 로그인

프로필 사진 업로드

닉네임 중복 방지

💬 Comments: 영화별 댓글 작성 가능

📱 Responsive Design: 모바일 & 데스크톱 지원

🛠 Tech Stack
Frontend Backend/Auth Storage API
Next.js Supabase Supabase Storage TMDB & YouTube

UI: Tailwind CSS
State/Auth hooks: React Context + Custom hooks

📂 Project Structure

├─ components/
│ ├─ AuthModal.tsx # Login / Signup modal
│ ├─ MovieCard.tsx # Movie card with hover trailer
│ └─ ...
├─ pages/ # Next.js pages
├─ utils/ # API calls, Supabase client, auth services
├─ styles/ # Tailwind/custom styles
└─ public/assets/ # Images, banner, screenshots

⚡ Setup (Local)

Clone the repo:

git clone https://github.com/YugilWon/Temp-Movie-.git

cd Temp-Movie-

Install dependencies:

npm install

or

yarn install

Add environment variables in .env.local:

NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
TMDB_API_KEY=<YOUR_TMDB_API_KEY>

Run development server:

npm run dev

or

yarn dev

Open http://localhost:3000

🔑 Authentication

Sign up / Login with email or Google OAuth

Profile picture upload (stored in Supabase Storage)

Nickname uniqueness enforced

💡 Notes

트레일러는 YouTube API를 통해 iframe으로 재생

댓글은 Supabase DB에 영화 ID와 함께 저장

Tailwind로 반응형 UI 구현

📸 Screenshots

public/assets 폴더에 스크린샷 넣으면 이렇게 표시 가능:

📄 License

MIT License
