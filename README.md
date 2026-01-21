## 프로젝트 시작 순서입니다
프로젝트를 시작하실 위치에서 터미널에 아래 명령어를 순서대로 입력해주세요

### 1. 노드 버전 확인

```bash
# 현재 Node 버전 확인
node -v
# Node >= 22.0.0 필요하므로 버전이 낮다면 nvm으로 전환해주세요
# nvm install 22
# nvm use 22
```

### 2-1. 레포지토리 클론
```bash
git clone https://github.com/Fire404-team3/FS11-TheSwampOfStudying-Fire404-BE.git
cd FS11-TheSwampOfStudying-Fire404-BE
```

### 2-2. 개발시 브랜치 흐름
⚠️ develop 브랜치는 공용 기준 브랜치입니다.
직접 커밋하지 말고 반드시 feature 브랜치에서 작업해주세요.  

1️⃣ develop에서 feature 브랜치 생성
```bash
git switch develop
git pull origin develop
git switch -c feature/기능명
```

2️⃣ 작업 + 커밋
```bash
git add .
git commit -m "feat: 뭐뭐 구현"
```

3️⃣ feature 브랜치 푸시
```bash
git push origin feature/기능명
```

4️⃣ GitHub에서 PR 생성
- base: develop
- compare: feature/기능명


### 2-3. 브랜치 분기 후 의존성 파일 설치
```bash
npm install
```

### 3. PrismaDB 및 환경변수 설정
각자 로컬에서 PostgreSQL 접속 후 DB 생성
  
```bash
psql -U postgres
CREATE DATABASE swamp_of_studying;
\q
```
`.env.example` 파일을 복사하여 `.env.development` 파일 생성  
`PORT`, `DATABASE_URL` 값 채우기

### 4. 서버 실행 확인
```bash
npm run dev
```
각자 터미널에 아래 문구가 뜨는지 확인해주세요

[nodemon] starting 'node --env-file=./env/.env.development src/server.js'  
🚀 Server running on http://localhost:5001

<br><br>

### 5. 라우터 시작 안내
각 routes.js 파일의 헬스체크 부분 삭제하시고 api 작성하시면 됩니다.

아래는 예시입니다.  
users.routes.js
```js
import express from 'express';
import { studyRouter } from '../studies/index.js';

export const usersRouter = express.Router();

// ❌ 팀 작업 시작 시 헬스체크 삭제
// usersRouter.get('/', (req, res) => {
//   res.send('/users 헬스체크 ok');
// });

// 계층 연결
usersRouter.use('/:id/studies', studyRouter);

// API 만들기

```

작성되어 있지 않은 라우터가 필요한 경우, 현재 레포의 `routes/` 폴더 구조를 참고하여 적절한 계층과 라우터를 추가해주세요.

<br>



### 아래는 대략적인 폴더 구조입니다.
```
src/
├─ server.js
├─ config/
│  └─ config.js
├─ db/
│  └─ prisma.js
├─ routes/
│  ├─ index.js
│  ├─ studies/
│  │  ├─ index.js
│  │  └─ studies.routes.js
│  ├─ habits/
  │  │  ├─ index.js
  │  │  └─ habits.routes.js
  │  └─ emojis/
  │     ├─ index.js
  │     └─ emojis.routes.js

```
