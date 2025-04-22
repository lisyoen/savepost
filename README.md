# SavePost

SavePost는 로그 데이터를 저장하는 POST API를 제공하는 프로젝트입니다.  
이 프로젝트는 간단한 RESTful API를 통해 데이터를 저장하고 관리할 수 있도록 설계되었습니다.

## 주요 기능

- **POST 요청 처리**: 클라이언트로부터 데이터를 받아 JSON 파일에 저장.
- **데이터 관리**: 저장된 데이터를 파일 시스템을 통해 관리.
- **확장 가능성**: TypeScript와 Express를 기반으로 구축되어 유지보수와 확장이 용이.

## 기술 스택

- **Node.js**: 서버 실행 환경.
- **Express**: RESTful API 구현.
- **TypeScript**: 정적 타입을 지원하는 JavaScript 슈퍼셋.
- **MySQL**: 데이터베이스 연동 가능 (현재는 파일 시스템 사용).

## 설치 및 실행

1. **의존성 설치**:
   ```bash
   npm install
   ```

2. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

3. **빌드 및 실행**:
   ```bash
   npm run build
   npm start
   ```

## API 사용법

### POST `/savepost`

- **요청 본문**:
  ```json
  {
    "key": "value",
    "message": "저장할 메시지"
  }
  ```

- **응답**:
  ```json
  {
    "success": true,
    "id": 1
  }
  ```

## 디렉토리 구조

```
savepost/
├── client/          # 클라이언트 관련 파일
├── data/            # JSON 데이터 저장 디렉토리
├── src/             # 서버 소스 코드
│   ├── api/         # API 관련 모듈
│   └── index.ts     # 서버 진입점
├── .vscode/         # VSCode 설정 파일
├── .idea/           # IntelliJ 설정 파일
├── package.json     # 프로젝트 설정 파일
├── tsconfig.json    # TypeScript 설정 파일
└── README.md        # 프로젝트 설명 파일
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.