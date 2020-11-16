아래와 같이 하면 성공한다...
\$ docker-compose up --build

Log도 제대로 나온다. 겨우 develop에서만 fullstack 한건데....

궁금한점

- .env는 왜 된거지??
- server는 hot module replace ment 가 안된다.

환경설정 체크리스트...

- client 코드를 변경하면 바로 반영이 되는가?
  - 성공.
- server 코드를 변경하면 바로 반영이 되는가?
  - nodemon으로 서버 기동하고. refresh 소켓만 보내면 되는데, 웹팩을 다시 빌드할 필요가 없음
- client에서 server로 api를 호출 가능한가?
  - 성공.

# Debug

### Debug .env

```
$ docker-compose exec server node
$ process.env.API_HOST

```
