const API_KEY = `072422010f874a07b2de9518e96691a4`;
let news = [];

const getLatestNews = async function () {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );

  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log(news);
};

getLatestNews();
