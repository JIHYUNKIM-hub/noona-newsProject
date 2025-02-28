// const API_KEY = `072422010f874a07b2de9518e96691a4`;
let newsList = [];
// let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=20`);
const menus = document.querySelectorAll(".menus button");
const searchQuery = document.getElementById("search-query");
const searchProcess = document.querySelector(".search-process");
const searchBarToggle = document.getElementById("search-bar-toggle");
const sideMenu = document.getElementById("side-menu");
const sideCategories = document.querySelectorAll(".side-categories li");
const xBtn = document.getElementById('x-mark');

const getNews = async () => {
  try{
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  if(data.status==='ok') {
    if(data.articles.length===0) {
      throw new Error('No result for this search');
    }
  newsList = data.articles;
  render();
  } else {
    throw new Error('data.message');
  }
  } catch(error) {
    // console.log("error", error.message);
    errorRender(error.message);
  }
}

const getLatestNews = async function () {
  url = new URL(
`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=20`
  );
  await getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
   url = new URL(
   `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=20&category=${category}`
  );
  await getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
   url = new URL(
        // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&q=${keyword}`
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=20&q=${keyword}`
  );
  await getNews();
};

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

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;

document.getElementById("news-board").innerHTML = errorHTML;
}

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

searchQuery.addEventListener("click", () => {
  searchProcess.style.display =
    searchProcess.style.display == "none" ? "block" : "none";
});

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

// 모바일 사이드 메뉴 카테고리 클릭 
sideCategories.forEach((category)=> {
category.addEventListener('click', (event)=> getNewsByCategory(event));
render();
})




