# ⚠️ 아래 명령어들은 처음 프로젝트를 만든 사람 기준 설명이며, 팀원들은 저장소를 클론한 뒤 npm install만 실행하면 됩니다.


## 초기 세팅

```bash
## package.json 생성
npm init -y

npm install express

npm install -D prettier eslint @eslint/js
npm install -D nodemon

## env 검증을 위함
npm install zod

## prisma
npm install @prisma/client @prisma/adapter-pg pg dotenv dotenv-cli
npm install -D prisma

## 가짜 데이터 생성
npm install -D @faker-js/faker

## JWT, 비밀번호 해싱, 쿠키 읽기
npm install jsonwebtoken bcrypt cookie-parser

```

eslint.config.js

```js
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
```

### warn
- _로 시작하는 변수는 eslint 경고를 무시하도록 설정되어 있습니다.


.prettierrc

```js
{
  "printWidth": 80,
  "bracketSpacing": true,
  "trailingComma": "all",
  "semi": true,
  "singleQuote": true
}
```

package.json

```json
{
  "name": "project-name",       <-------
  "description": "팀 프로젝트 '프로젝트 이름' 백엔드 서버",   <-------
  "version": "0.0.1",
  "main": "src/server.js",    <-------
  "type": "module",           <-------
  "engines": {                <-------
    "node": ">=22.0.0"
  },
  "imports": {    <-------
    "#generated/*": "./generated/*",
    "#config": "./src/config/config.js",
    "#db/*": "./src/db/*",
    "#constants": "./src/constants/index.js",
    "#middlewares": "./src/middlewares/index.js",
    "#exceptions": "./src/exceptions/index.js",
    "#models": "./src/models/index.js"
  },
  "scripts": {           <-------
    "dev": "nodemon --env-file=./env/.env.development src/server.js",
    "prod": "node --env-file=./env/.env.production src/server.js",
    "prisma:migrate": "dotenv -e ./env/.env.development -- npx prisma migrate dev",
    "prisma:studio": "dotenv -e ./env/.env.development -- npx prisma studio",
    "prisma:generate": "dotenv -e ./env/.env.development -- npx prisma generate",
    "seed": "node --env-file=./env/.env.development scripts/seed.js",
    "format": "prettier --write src/**/*.js",
    "format:check": "prettier --check src/**/*.js"
  },
  "contributors": [     <-------
    { "name": "백은결" },
    { "name": "박도담" },
    { "name": "박수훈" },
    { "name": "윤숙희" },
    { "name": "이석우" },
    { "name": "최우진" }
  ],
  "license": "MIT",
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.35.0",
    "eslint": "^9.35.0",
    "prettier": "^3.6.2"
  }
}
```

## 환경변수 폴더 설정
env/.env.example
```
# 환경 변수 예시 파일
# 환경 설정
NODE_ENV=

# 서버 포트
PORT=

# PostgreSQL 연결 URL
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/prisma_blog"

# ✅ JWT 시크릿 키 추가 (최소 32자 이상)
JWT_ACCESS_SECRET="your-super-secret-access-key-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-chars"
```

.gitignore
```
node_modules
env/*
!env/.env.example
.DS_Store
generated/
```