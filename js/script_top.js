const cards = document.querySelector(".films_cards")
let cur_page = 1
const btn_prev = document.querySelector('#btn_paginator-prev')
const btn_next = document.querySelector('#btn_paginator-next')
const page_btns = document.querySelectorAll('.pag_num')

function get_place_grad(place){
    if (place <= 3) return "grandPlace"
    else if (place <= 10) return "topPlace"
    else if (place <= 20) return "middlePlace"
    else return "bottomPlace"
}

function get_stars(cnt){
    let stars = ""
    for (let i = 0; i < 10; i++) {
        stars += i < Math.round(cnt) ? "★" : "☆"
    }
    return stars
}

async function get_films_top() {
    const url = 'http://185.72.144.247:7757/top25';
    let res = await fetch(url);
    if (!res.ok) throw new Error("Ошибка - " + res.status)

    let json = await res.json();
    return json
}

async function get_film_by_name(name)
{

    const url = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=' + name;
    
    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'X-API-KEY': '2b90e1f9-498f-44cc-8e1a-136a7e09ef8d'
        }
    });

    let json = await res.json();

    film = json.films[0]

    return (film.filmId)
}

async function sync_page() {
    let card_place = document.querySelector(".films_cards")
    
    if (!card_place) {
        console.error("Элемент .films_cards не найден")
        return
    }
    
    card_place.innerHTML = '<div class="title">Загрузка...</div>'
    
    let films = await get_films_top()
    
    if (!films || films.length === 0) {
        card_place.innerHTML = '<div class="title">Фильмы не найдены</div>'
        return
    }
    

    const cur_page_films = films.slice((cur_page-1)*5, ((cur_page-1)*5)+5);
    
    const film_ids_promises = cur_page_films.map(film => get_film_by_name(film.title));
    
    const film_ids = await Promise.all(film_ids_promises);
    
    let cardsHTML = cur_page_films.map((film, index) => film ? `
    <button class="film_card" onclick="window.location.href='film.html?id=${film_ids[index]}'">
        <h1 class="top_rating-place ${get_place_grad(index+1)}">${index+1+(cur_page-1)*5}</h1>
        <img class="film_card-poster" src="http://185.72.144.247:7757${film.poster_URL}" alt="Постер">
        <div class="film_card-info">
            <div class="film_card-head">
                <h3 class="film_card-title">${film.title}</h3>
                <p class="film_card-year">${film.year}</p>
                <p class="film_card-age">${film.age_rating}</p>
                <p class="film_card-rating">${film.rating}</p>
                <p class="film_card-duration">${film.duration}</p>
            </div>
            <div class="film_card-body">
                <p class="film_card-desc">${film.desc}</p>
            </div>
            <p class="film_card-stars">${get_stars(film.rating)}</p>
        </div>
    </button>
    ` : '').join('') 
    
    card_place.innerHTML = cardsHTML
}

function update_page_btns(){
    
    page_btns.forEach(btn => {
        let page_num = parseInt(btn.textContent)
        if (page_num == cur_page)
        {
            btn.classList.add('cur_page')
        }
        else
        {
            btn.classList.remove('cur_page')
        }
    })

    if (cur_page >= 5)
    {
        if (!btn_next.classList.contains('arrow_disabled'))
        {
            btn_next.classList.toggle('arrow_disabled')
        }
    }
    else
    {
        if (btn_next.classList.contains('arrow_disabled'))
        {
            btn_next.classList.toggle('arrow_disabled')
        }
    }

    if (cur_page <= 1)
    {
        if (!btn_prev.classList.contains('arrow_disabled'))
        {
            btn_prev.classList.toggle('arrow_disabled')
        }
    }
    else
    {
        if (btn_prev.classList.contains('arrow_disabled'))
        {
            btn_prev.classList.toggle('arrow_disabled')
        }
    }
}

sync_page()


page_btns.forEach(btn => {
    btn.addEventListener('click', function(){
        cur_page = parseInt(btn.textContent)
        sync_page()

        update_page_btns()

        
    })
})


btn_next.addEventListener('click', function() {
    if (!btn_next.classList.contains('arrow_disabled'))
    {
        cur_page++
        sync_page()
        update_page_btns()
    }
})



btn_prev.addEventListener('click', function() {
    if (!btn_prev.classList.contains('arrow_disabled'))
    {
        cur_page--
        sync_page()
        update_page_btns()
    }
})

