FROM nginx:1.21.1

RUN mkdir /app

# WORK 디렉토리는 app_build 로 설정
WORKDIR /app

# WORKDIR 디렉토리 안에 build 폴더 생성 (/app_build/build)
RUN mkdir ./build

COPY ./dist ./build

# nginx 의 default.conf 를 삭제
RUN rm /etc/nginx/conf.d/default.conf

# 도커파일실행기준 nginx_setting/nginx.conf 파일을 nginx.conf 를 아래 경로에 복사
COPY ./nginx.conf /etc/nginx/conf.d

# 80포트 오픈
EXPOSE 80

#container 실행시 자동으로 실행하는 nignx 커맨드
CMD ["nginx", "-g", "daemon off;"]

