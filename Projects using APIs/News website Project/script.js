const API_KEY = "461c8a0431664a14b112b542d4d68135";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query){
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    console.log(data);
    bindData(data.articles);
}

function bindData(articles){
        const cardsContainer = document.getElementById('cards-container');
        const newsTemplate = document.getElementById('news-card');

        cardsContainer.innerHTML = '';

        articles.forEach((article) => {
            if(!article.urlToImage){
                return;
            }
            const cardClone = newsTemplate.content.cloneNode(true);
            fillCardData(cardClone, article);
            cardsContainer.appendChild(cardClone);
        });
}

function fillCardData(cardClone, article){
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {timeZone: "Asia/Jakarta",});

    newsSource.innerHTML = `${article.source.name} - ${date}`;

   cardClone.firstElementChild.addEventListener('click', () => {
    window.open(article.url, "_blank");
   });
}

let currSelectedNav = null;
function onNavItemClick(id){
    fetchNews(id);
    const navItem = document.getElementById(id);
    currSelectedNav?.classList.remove('active');
    currSelectedNav = navItem;
    currSelectedNav.classList.add('active');
}

const searchText = document.getElementById('search-text');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if(!query){
        return;
    }
    fetchNews(query);
    currSelectedNav?.classList.remove('active');
    currSelectedNav = null;
})