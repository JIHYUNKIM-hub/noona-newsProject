// const API_KEY = `072422010f874a07b2de9518e96691a4`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
const searchQuery = document.getElementById("search-query");
const searchProcess = document.querySelector(".search-process");

searchQuery.addEventListener("click", () => {
  searchProcess.style.display =
    searchProcess.style.display == "none" ? "block" : "none";
});

// search-bars 버튼을 눌렀을 때 사이드 메뉴 열기/닫기
const searchBarToggle = document.getElementById("search-bar-toggle");
const sideMenu = document.getElementById("side-menu");
const sideCategories = document.querySelectorAll(".side-categories li");
const xBtn = document.getElementById('x-mark');

searchBarToggle.addEventListener("click", () => {
  // 사이드 메뉴 열고 닫기
  if (sideMenu.style.left === "0px") {
    sideMenu.style.left = "-250px"; // 사이드 메뉴 숨기기
  } else {
    sideMenu.style.left = "0px"; // 사이드 메뉴 보이게 하기
  }
});

// X버튼 눌렀을 때 사이드 메뉴 닫기
xBtn.addEventListener('click', ()=> {
sideMenu.style.left = '-250px';
})

const getLatestNews = async function () {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=30`
  );
  // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  newsList = data.articles;
  render();
  console.log(newsList);
};

// 뉴스를 그려주는 함수
const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
    <div class="col-lg-4">
<img 
  class="news-img-size" 
  src="${news.urlToImage && news.urlToImage !== null ? news.urlToImage : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'}" 
  onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';"
/>

          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${
              news.description == null || news.description == ""
                ? "내용없음"
                : news.description.length > 200
                ? news.description.slice(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name || "no source"} * ${moment(
        news.publishedAt
      ).fromNow()}</div>
            </div>
            </div>`
    )
    .join("");
  document.getElementById("news-board").innerHTML = newsHTML;
};
getLatestNews();

// 버튼들에 click event 주기
// 카테고리 별로 뉴스 가져오기
// 가져온 뉴스를 보여주기
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();

  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=10&category=${category}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  newsList = data.articles;
  render();
};

// 모바일 사이드 메뉴 카테고리 클릭 
sideCategories.forEach((category)=> {
category.addEventListener('click', (event)=> getNewsByCategory(event));
render();
})

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;

  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=30&q=${keyword}`
  );
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data);
  newsList = data.articles;
  render();
};
