const apiKey = ``;
let news = [];
//뉴스 가져오기
const getLatestNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log("show news", news);
};

getLatestNews();
