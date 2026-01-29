import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import swaggerUi from 'swagger-ui-express';
import z from 'zod';

// Zod에 openapi 기능을 확장
extendZodWithOpenApi(z);

// 레지스트리 생성
export const registry = new OpenAPIRegistry();

// Zod 스키마들을 등록하는 코드
// import 여기서 해야함
import {
  createStudySchema,
  updateStudySchema,
  paramsIdSchema,
  passwordCheckSchema,
} from './routes/studies/study.schema.js';

// 1. 스터디 관련 API
registry.registerPath({
  method: 'post',
  path: '/studies',
  tags: ['Studies'],
  summary: '새로운 스터디 생성',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createStudySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '스터디 생성 성공',
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/studies/{id}',
  tags: ['Studies'],
  summary: '스터디 수정',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: paramsIdSchema.shape.id,
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateStudySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '스터디 수정 성공',
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/studies/{id}',
  tags: ['Studies'],
  summary: '스터디 삭제',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: paramsIdSchema.shape.id,
    },
  ],
  responses: {
    204: {
      description: '스터디 삭제 성공 (응답 데이터 없음)',
    },
    404: {
      description: '해당 ID의 스터디를 찾을 수 없음',
    },
  },
});

// 비밀번호 확인 API
registry.registerPath({
  method: 'post',
  path: '/studies/{id}/check-password',
  tags: ['Security'],
  summary: '스터디 비밀번호 확인',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: passwordCheckSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '비밀번호 일치',
    },
    401: {
      description: '비밀번호 불일치',
    },
  },
});

// 습관(Habit) 관련 API 예정
// registry.registerPath({
//   method: 'get',
//   path: '/habits',
//   tags: ['Habits'],
//   summary: '습관 목록 조회',
//   ...
// });

// 스웨거 문서 생성 함수
export const getSwaggerDoc = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: '공부의 숲 API 명세서',
      version: '0.0.1',
      description: '우리 팀 스터디 앱의 API 문서입니다.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: '로컬 개발 서버',
      },
    ],
  });
};

export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = (doc) => swaggerUi.setup(doc);
