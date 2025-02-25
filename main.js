// const API_KEY = `072422010f874a07b2de9518e96691a4`;
let newsList = [];

const getLatestNews = async function () {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=10`
  );
  // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`

  const response = await fetch(url);
  const data = await response.json();
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
              src=${news.urlToImage}
            />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.description}</p>
            <div>${news.source.name} * ${news.publishedAt}</div>
          </div>
        </div>`
    )
    .join("");
  document.getElementById("news-board").innerHTML = newsHTML;
};
getLatestNews();
