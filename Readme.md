# 프론트엔드 개발 과제

## 요구사항

- [x] Webpack 적용
- [x] 칼럼 확장
  - [x] 네 개의 칼럼으로 확장
  - [x] 각 칼럼의 독립적인 드래그 앤 드롭 영역
- [x] 드래그 제약 조건
  - [x] 첫 번째 칼럼에서 세 번째 칼럼으로 아이템 이동 금지
  - [x] 짝수 아이템을 다른 짝수 아이템 앞으로 이동 금지
  - [x] 이동할 수 없는 지점으로 아이템을 드래그 할 경우 UI 표시
- [x] 멀티 드래그 구현

<br/>

## 설치 및 실행
```
npm install
npm run start
```

<br/>

## src 디렉토리 구조

```
📂 src
 ┣ 📂 components
 ┃ ┣ Column.jsx
 ┃ ┣ Header.jsx
 ┃ ┣ Item.jsx
 ┃ ┗ MultiDragAndDrop.jsx
 ┣ 📂 hooks
 ┃ ┣ useDrag.js
 ┃ ┗ useSelect.js
 ┣ 📂 lib
 ┃ ┣ constants.js
 ┃ ┣ data.js
 ┃ ┗ utils.js
 ┣ App.jsx
 ┣ index.js
 ┣ input.css
 ┗ output.css
```

<br/>

## 스타일링
`tailwindCSS` : 가장 익숙한 스타일링 라이브러리이기도 하고, 유틸리티 클래스를 활용해서 간편하고 빠르게 스타일링 할 수 있어서 선택했습니다.

