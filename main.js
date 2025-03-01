// const API_KEY = `072422010f874a07b2de9518e96691a4`;
// let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);

let newsList = [];
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;
const menus = document.querySelectorAll(".menus button");
const searchQuery = document.getElementById("search-query");
const searchProcess = document.querySelector(".search-process");
const searchBarToggle = document.getElementById("search-bar-toggle");
const sideMenu = document.getElementById("side-menu");
const sideCategories = document.querySelectorAll(".side-categories li");
const xBtn = document.getElementById("x-mark");

const getNews = async () => {
  try {
    //url에 page라는 parameter를 세팅해줄건데, 그 값은 page로 세팅해줄거다 &page=page 라는 뜻임
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);

    const data = await response.json();
    console.log(data);
    if (data.status === "ok") {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error("data.message");
    }
  } catch (error) {
    // console.log("error", error.message);
    errorRender(error.message);
  }
};

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
  src="${
    news.urlToImage && news.urlToImage !== null
      ? news.urlToImage
      : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
  }" 
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

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

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
xBtn.addEventListener("click", () => {
  sideMenu.style.left = "-250px";
});

// 모바일 사이드 메뉴 카테고리 클릭
sideCategories.forEach((category) => {
  category.addEventListener("click", (event) => getNewsByCategory(event));
  render();
});

const paginationRender = () => {
  // 정하는/주어지는 값: totalResults, page, pageSize, groupSize
  // 계산필요한 값: pageGroup, lastPage, firstPage, totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  const lastPage = groupSize * pageGroup;
  let paginationHTML = ``;
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  // 마지막 페이지그룹이 그룹사이즈보다 작다면 lastpage= totalpages
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  if (page !== firstPage) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(${
      page - 1
    })"><a class="page-link"><</a></li>
    <li class="page-item" onclick="moveToPage(${1})"><a class="page-link"><<</a></li>
    `;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }"onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  if (page !== lastPage) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page + 1
    })"><a class="page-link">></a></li>
    <li class="page-item" onclick="moveToPage(${lastPage})"><a class="page-link">>></a></li>
    `;
  }

  let last = pageGroup * 5;
  if (last > totalPages) {
    // 마지막 그룹이 5개 이하이면
    last = totalPages;
  }
  let first = last - 4 <= 0 ? 1 : last - 4; // 첫그룹이 5이하이면

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

getLatestNews();
