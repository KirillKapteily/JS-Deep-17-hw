let moreItemsBtn = document.querySelector(".moreItemsBtn");
let lessItemsBtn = document.querySelector(".lessItemsBtn");
let savePaginationState = document.querySelector(".savePaginationState");

let currentPage = 1;
let limitPerPage = 3;

let allArticles = [];
let templa;

// 0.1 more/less btns
function moreItemsChange() {
    limitPerPage++;
    // loadTemplate();
    goToPage();
    loadData();
}

function lessItemsChange() {
    limitPerPage--;
    // loadTemplate();
    goToPage();
    loadData();

    if (limitPerPage == 1) {
        lessItemsBtn.disabled = true;
    } else {
        lessItemsBtn.disabled = false;
    }
}

//0.2 save state 
function loadState() {
    let getSavedLimit = localStorage.getItem("limitPerPage");
    if (getSavedLimit !== null) {
        limitPerPage = parseInt(getSavedLimit, 10);
        console.log(limitPerPage);

    }
}

function saveState() {
    localStorage.setItem("limitPerPage", limitPerPage);
    console.log(limitPerPage);
}

loadState()


// 1. load
async function loadTemplate() {
    const response = await fetch('./pagination.hbs');
    const template = await response.text();
    templa = Handlebars.compile(template);
}

// 2. render
function rendering() {
    const start = (currentPage - 1) * limitPerPage;
    const end = start + limitPerPage;
    let pageArticles = allArticles.slice(start, end);

    const articles = document.getElementById('articles');
    const html = pageArticles.map(article => templa(article)).join('');
    articles.innerHTML = html;
    // html += innerHTML = `<button id="page1" type="button">1</button> <button id="page2" type="button">2</button> <button id="page3" type="button">3</button>`;
}

function renderPagination() {
    let divPagination = document.querySelector("#pagination")
    const totalPages = Math.ceil(allArticles.length / limitPerPage);
    let html = '';

    html += `
        <button 
            class="page-btn prev" 
            data-page="${currentPage - 1}" 
            ${currentPage === 1 ? 'disabled' : ''}>
            Попередня сторінка
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button 
                class="page-btn ${i === currentPage ? 'active' : ''}" 
                data-page="${i}">
                ${i}
            </button>
        `;
    }

    html += `
        <button 
            class="page-btn next" 
            data-page="${currentPage + 1}" 
            ${currentPage === totalPages ? 'disabled' : ''}>
            Наступна сторінка
        </button>
    `;

    divPagination.innerHTML = html;
}

function goToPage(page) {
    // const totalPages = Math.ceil(allArticles.length / limitPerPage);
    currentPage = page;
    rendering();
    renderPagination();
}


// 3. load info
async function loadData() {
    try {
        const response = await fetch(
            `https://pixabay.com/api/?key=53352675-f765205d0f030ff68d578e4b2&q=yellow+flowers&image_type=photo`
        );
        const data = await response.json();
        allArticles = data.hits || [];
        currentPage = 1;

        rendering();
        renderPagination();
    } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
    }
}

// 4. init
window.addEventListener('DOMContentLoaded', async () => {
    await loadTemplate();

    const but = document.getElementById('butt');
    const divPagination = document.querySelector("#pagination");


    but.addEventListener('click', () => {
        if (!allArticles.length) {
            loadData();
        } else {
            rendering();
            renderPagination();
        }
    });


    if (divPagination) {
        divPagination.addEventListener("click", (event) => {
            const data = event.target.closest(".page-btn");
            if (!data) return;

            const page = Number(data.dataset.page);
            if (!Number.isNaN(page)) {
                goToPage(page);
            }
        });
    }
});


moreItemsBtn.addEventListener("click", moreItemsChange);
lessItemsBtn.addEventListener("click", lessItemsChange);
savePaginationState.addEventListener("click", saveState)