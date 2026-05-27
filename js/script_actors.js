const cards = document.querySelector(".actors_list")
let actor_cards = document.querySelectorAll('.actor_card')
let cur_page = 1
const btn_prev = document.querySelector('#btn_paginator-prev')
const btn_next = document.querySelector('#btn_paginator-next')
const page_btns = document.querySelectorAll('.pag_num')

async function find_actor_by_name(name)
{
    const url = 'https://kinopoiskapiunofficial.tech/api/v1/persons?name=' + name;
    
    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'X-API-KEY': '2b90e1f9-498f-44cc-8e1a-136a7e09ef8d'
        }
    });

    let json = await res.json();
    actor = json.items[0]

    return (actor.kinopoiskId)
}

async function get_actor_data(actor_name)
{
    actor_id = await find_actor_by_name(actor_name)

    const url = 'https://kinopoiskapiunofficial.tech/api/v1/staff/' + actor_id;
    
    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'X-API-KEY': '2b90e1f9-498f-44cc-8e1a-136a7e09ef8d'
        }
    });

    let json = await res.json();
    
    return json
}

function create_films_list(films)
{
    let films_list = `<p class="link_group">`

    films_list += films.slice(0, 20).map((film) => film ? `
        <a class="films-history-link" href="film.html?id=${film.filmId}">${film.nameRu},</a>
    ` : '').join(' ')

    films_list += `и другие.</p>`
    
    return films_list;
}

async function load_choosen_actor(actor_name)
{
    let actor = await get_actor_data(actor_name)
    
    let card_place = document.querySelector(".choosen_actor")
    
    if (!card_place) {
        console.error("Элемент .choosen_actor не найден")
        return
    }
    
    card_place.innerHTML = '<div class="title">Загрузка...</div>'
    
    if (!actor || actor.length === 0) {
        card_place.innerHTML = '<div class="title">Актёр не найден</div>'
        return
    }
    
    let cards_html = `
    <div class="actor_info">
        <div class="actor_main_info">
            <div class="actor-card-poster">
                <img class="actor-card-poster" src="${actor.posterUrl || '../images/no-image.jpg'}" alt="Постер актёра">
            </div>
            <ul class="actor_main_info-texts">
                <li class="actor-card-name"><h3>${actor.nameRu}</h3></li>
                <li class="actor-card-name"> </li>
                <li class="actor-card-prof">${actor.profession || 'Актёр'}</li>
            </ul>
        </div>
        <div class="actor-films-history">
            <h5 class="films-history-count">${actor.films ? actor.films.length : 0} Фильмов</h5>
            ${create_films_list(actor.films)}
        </div>
    </div>
    `
    
    card_place.innerHTML = cards_html
}

async function get_actors_top()
{
    const url = 'http://185.72.144.247:7757/actors';
    let res = await fetch(url);
    if (!res.ok) throw new Error("Ошибка - " + res.status)  

    let json = await res.json();
    return json
}

async function sync_page()
{
    let card_place = document.querySelector(".actors_list")
    
    if (!card_place) {
        console.error("Элемент .actors_list не найден")
        return
    }
    
    card_place.innerHTML = '<div class="title">Загрузка...</div>'
    
    let actors = await get_actors_top()
    
    if (!actors || actors.length === 0) {
        card_place.innerHTML = '<div class="title">Актёры не найдены</div>'
        return
    }
    
    const cur_page_actors = actors.slice((cur_page-1)*16, ((cur_page-1)*16)+16);
    
    let cards_html = cur_page_actors.map((actor) => actor ? `
    <button class="actor-card">
        <div class="actor-card-poster">
            <img class="actor-card-poster" src="http://185.72.144.247:7757${actor.image_URL}" alt="Нет ручек - нет постера >:)">
        </div>
        <p class="actor-card-name">${actor.name + " " + actor.surname}</p>
    </button>
    ` : '').join('') 
    
    card_place.innerHTML = cards_html
    
    const new_actor_cards = document.querySelectorAll('.actor_card')
    new_actor_cards.forEach(btn => {
        btn.addEventListener('click', function(){
            let actor_name_element = btn.querySelector('.actor-card-name');
            if (actor_name_element) {
                load_choosen_actor(actor_name_element.textContent);
            }
        })
    })
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

const actors_list = document.querySelector(".actors_list");

if (actors_list) {
    actors_list.addEventListener('click', function(event) {
        const actor_card = event.target.closest('.actor-card');
        
        if (actor_card) {

            let actor_name_element = actor_card.querySelector('.actor-card-name');
            if (actor_name_element) {
                load_choosen_actor(actor_name_element.textContent);
            }
        }
    });
}

sync_page()
load_choosen_actor("Райан Гослинг")