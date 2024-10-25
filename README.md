# 참고
**주의 사항**
* nouislider.js, nouislider.min.js 위치
* ~/frontend/node_modules/nouislider-react/node_modules/nouislider/distribute/nouislider.js 위치에 옮겨주고 실행

* reactstrap carousel warning 제거
* ~/frontend/node_modules/reactstrap/dist/reactstrap.module.js 파일에서 "Carousel.childContextTypes" 를 찾아서 주석처리 해준다

* 일정의 캘린더 수정작업 필요
* OS 윈도우와 브라우저 엣지의 경우 일정관리 > 일정의 css에 세로형태의 스크롤바가 생김
* node_modules > @fullcalendar > common > main.css > .fc .fc-scroller {} 에 옵션 추가
  * overflow: auto !important;

install npm libraries
```
docker-compose run frontend npm install --force --legacy-peer-deps
```
install npm new libraries
```
docker-compose run frontend npm install {library} --force --legacy-peer-deps
```

## Migration Reset
```
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete
```

## File Path fix - 완료
```
1. makemigrations / migrate 필수 입니다.
2. 기존 데이터 베이스와 백엔드에 저장된 데이터와 호환이 불가능합니다.
3. 라이브에 적용전에 기존 데이터에서 대해서 파일 이동 작업과 데이터 베이스 path 변경해야합니다.
```