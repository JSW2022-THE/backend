FROM node:alpine

# 디렉토리 지정
WORKDIR /usr/src/app

# 의존성 설치를 위해 package.json, yarn.lock 복사
COPY package.json ./
COPY package-lock.json ./

# 의존성 설치
RUN npm install --force

# 필요한 모든 파일을 복사
COPY . .

# 2000 컨네이터 포트 Open
EXPOSE 2000

# 애플리케이션 실행
CMD [ "node", "index.js" ]