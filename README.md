# C:LEC BE

NestJS와 Prisma를 기반으로 구축된 CLEC 프로젝트의 백엔드 서버입니다.

## ✨ 주요 기술 스택

* **Framework**: [NestJS](https://nestjs.com/)
* **ORM**: [Prisma](https://www.prisma.io/)
* **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
* **API Documentation**: [Swagger](https://swagger.io/) (`@nestjs/swagger`)
* **Validation**: `class-validator`, `class-transformer`
* **Language**: TypeScript

## 🛠️ 사전 요구 사항

* Node.js (v20.x 이상 권장)
* npm
* 데이터베이스 (PostgreSQL)

## 🚀 설치 및 실행 방법

1.  **레포지토리 복제**
    ```bash
    git clone [https://github.com/UniCon-CLEC/BE.git](https://github.com/UniCon-CLEC/BE.git)
    cd BE
    ```

2.  **의존성 설치**
    프로젝트에 필요한 패키지들을 설치합니다.
    ```bash
    npm install
    ```

3.  **`.env` 파일 설정**
    > **중요**: 생성된 `.env` 파일에 아래 두 가지 환경 변수를 반드시 설정해야 합니다.
    > - `DATABASE_URL`: Prisma가 연결할 데이터베이스 주소입니다. (예: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`)
    > - `SUPABASE_JWKS_URL`: Supabase 인증을 위한 JWKS URL입니다.

4.  **데이터베이스 마이그레이션**
    Prisma를 사용하여 데이터베이스 스키마를 동기화합니다. 이 명령어는 `prisma/schema.prisma` 파일을 기반으로 데이터베이스를 생성하고 최신 상태로 업데이트합니다.
    ```bash
    npx prisma migrate dev
    ```

5.  **개발 서버 실행**
    아래 명령어를 실행하면 코드가 변경될 때마다 서버가 자동으로 재시작되는 개발 모드로 서버를 실행합니다.
    ```bash
    npm run start:dev
    ```
    서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 📄 데이터베이스 관계도 (ERD)

프로젝트의 데이터베이스 구조는 아래와 같습니다.

<img width="2212" height="1457" alt="image" src="https://github.com/user-attachments/assets/8650c856-2ea4-4fba-89b0-7621957e3d64" />


## 📚 API 문서

개발 서버 실행 후, 아래 주소로 접속하면 Swagger를 통해 API 문서를 확인하고 직접 테스트해볼 수 있습니다.

* **Swagger**: `http://localhost:3000/docs`

## 🚀 CI/CD (자동 배포)

본 프로젝트는 GitHub Actions, Docker, Azure를 활용한 CI/CD 파이프라인이 구축되어 있습니다. `develop` 브랜치에 새로운 코드가 푸시(Push)될 때마다 자동으로 서버 애플리케이션의 빌드와 배포가 진행됩니다.

* **Trigger Branch**: `develop`
* **CI/CD Platform**: `GitHub Actions`
* **Containerization**: `Docker`
* **Cloud Provider**: `Azure`
    * **Hosting**: Azure App Service (for Containers)
    * **Image Registry**: Azure Container Registry (ACR)

### 배포 파이프라인 주요 과정

1.  **Docker 이미지 빌드**: `Dockerfile`을 기반으로 NestJS 애플리케이션의 프로덕션용 이미지를 생성합니다.
2.  **ACR에 이미지 푸시**: 생성된 이미지를 버전 태그와 함께 Azure Container Registry에 업로드합니다.
3.  **Azure App Service에 배포**: ACR에 업로드된 최신 이미지를 App Service에 배포하여 새로운 버전의 애플리케이션을 실행합니다.
4.  **DB 마이그레이션**: 배포된 컨테이너가 시작될 때 `npx prisma migrate deploy` 명령어를 자동으로 실행하여, 데이터베이스 스키마를 항상 최신 상태로 유지합니다.