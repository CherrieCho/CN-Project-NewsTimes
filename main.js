const apiKey = ``;
let newsList = [];
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);
//페이지네이션 관련 변수
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const headLine = document.querySelector(".head-line svg");
const menus = document.querySelectorAll(".menu button");

menus.forEach((button) =>
  button.addEventListener("click", (event) => getNewsByCategory(event))
);

//뉴스 가져와서 배열 업뎃 후 렌더하는 함수(공통부분)
const getNews = async () => {
  //에러 핸들링
  try {
    //페이지 정보(&page=page 속성을 url 쿼리에 추가)
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      //검색 결과가 없는 경우
      if (data.totalResults === 0) {
        throw new Error("검색 결과가 없습니다.");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    renderError(error.message);
  }
};

//전체 뉴스 가져오기
const getLatestNews = async () => {
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  getNews();
};

//카테고리별 뉴스
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  getNews();
};

//키워드별로 검색
const getNewsByKeyword = async (event) => {
  event.preventDefault();
  const keyword = document.getElementById("search-input").value.toLowerCase();
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );
  getNews();
};

//모바일 사이드바 카테고리
/* Set the width of the side navigation to 300px */
function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  const sideMenus = document.querySelectorAll(".sidenav button");

  //button 태그에 이벤트리스너 추가
  sideMenus.forEach((button) =>
    button.addEventListener("click", (event) => {
      getNewsByCategory(event);
      closeNav();
    })
  );
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

//newsList를 보여주는 render()
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
            <h2><a href=${item.url} target="_blank">${item.title}</a></h2>
            <p>${item.description}</p>
            <div>${item.source.name} * ${time}</div>
          </div>
          </div>`;
  });

  document.querySelector("#news-board").innerHTML = newsHTML.join("");
};

//에러메시지 보여주는 함수
const renderError = (errorMessage) => {
  document.querySelector(
    "#news-board"
  ).innerHTML = `<div class="alert alert-light" role="alert" style="text-align: center;">
  ${errorMessage}
</div>`;
};

//페이지네이션
const paginationRender = () => {
  //pageGroup: 해당 페이지가 속한 페이지 그룹 번호는?
  const pageGroup = Math.ceil(page / groupSize);

  //totalPages: 총 페이지 개수
  const totalPages = Math.ceil(totalResults / pageSize);

  //lastPage: 해당 페이지가 속한 그룹에 있는 마지막 페이지 번호?
  let lastPage = pageGroup * groupSize;

  //페이지 개수가 그룹 사이즈보다 작을 경우
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  //firstPage: 해당 페이지가 속한 그룹에 있는 첫번째 페이지 번호?
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = ``;

  if (pageGroup === 1) {
    paginationHTML = ``;
  } else {
    paginationHTML = `  <li class="page-item" onclick="moveToPage(${1})">
                      <a class="page-link" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li><li class="page-item" onclick="moveToPage(${
                      page - 1
                    })">
                      <a class="page-link" aria-label="Previous">
                        <span aria-hidden="true">&lt;</span>
                      </a>
                    </li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  if (pageGroup === Math.ceil(totalPages / groupSize)) {
    paginationHTML += ``;
  } else {
    paginationHTML += `          <li class="page-item" onclick="moveToPage(${
      page + 1
    })">
            <a class="page-link" aria-label="Next">
              <span aria-hidden="true">&gt;</span>
            </a>
          </li><li class="page-item" onclick="moveToPage(${totalPages})">
            <a class="page-link" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

getLatestNews();
