const apiKey = ``;
let newsList = [];

const headLine = document.querySelector(".head-line svg");
const menus = document.querySelectorAll(".menu button");

menus.forEach((button) =>
  button.addEventListener("click", (event) => getNewsByCategory(event))
);

//뉴스 가져오기
const getLatestNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

//카테고리별 뉴스
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

//모바일 사이드바 카테고리
/* Set the width of the side navigation to 300px */
function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  const sideMenus = document.querySelectorAll(".sidenav a");
  //a 태그 중에서 첫번째만 빼고 이벤트리스너 추가
  for (let i = 1; i < sideMenus.length; i++) {
    sideMenus[i].addEventListener("click", function (event) {
      getNewsByCategory(event);
    });
  }
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//검색창 토글
const toggleSearch = () => {
  const searchContainer = document.querySelector(".search-container");
  searchContainer.classList.toggle("active");
};

const render = () => {
  const newsHTML = newsList.map((item) => {
    const time = moment(item.publishedAt).startOf("day").fromNow();

    if (!item.description) {
      item.description = "내용 없음";
    } else if (item.description.length > 200) {
      item.description = item.description.substring(0, 200) + "...";
    }

    if (!item.source.name) {
      item.source.name = "No Source";
    }

    return `<div class="row news">      
          <div class="col-lg-4">
            <img
              class="img-size"
              src=${item.urlToImage}
              onerror="this.onerror=null; this.src='https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6.png';"
            />
          </div>
          <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <div>${item.source.name} * ${time}</div>
          </div>
          </div>`;
  });

  document.querySelector("#news-board").innerHTML = newsHTML.join("");
};

getLatestNews();
