let cur_page = 1
const btn_prev = document.querySelector('#btn_paginator-prev')
const btn_next = document.querySelector('#btn_paginator-next')
const page_btns = document.querySelectorAll('.pag_num')
let last_btn = document.querySelector('#btn_paginator-5')
let first_btn = document.querySelector('#btn_paginator-0')




async function get_films_top(page)
{
    const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=' + page;
    
    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'X-API-KEY': '2b90e1f9-498f-44cc-8e1a-136a7e09ef8d'
        }
    });

    let json = await res.json();

    return json.items
}

function check_poster(film)
{   
    if (film.posterUrl != undefined)
    {
        return ``;
    }
    else
    {
        return `Нет постера`
    }
}

async function sync_page() {
    let card_place = document.querySelector(".films_cards")
    card_place.innerHTML = ''
    if (!card_place) 
    {
        return card_place.innerHTML = '<div>Загрузка...</div>';
    }
    
    let films = await get_films_top(cur_page)
    
    if (!films || films.length === 0) {
        card_place.innerHTML = '<div>Фильмы не найдены</div>';
        return;
    }

    let cardsHTML = films.map(film => 
    (film != null) ? `
    <button class="film_card" onclick="window.location.href='film.html?id=${film.kinopoiskId}'" style="
        background-image: url(${film.posterUrl || ''});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    ">
        <div class="film_card-footer">
            <p class="film_card-year">${film.year || 'н/д'}г</p>
            <p class="film_card-rating">⭐${film.ratingKinopoisk || 'н/д'}</p>
        </div>
        ${check_poster(film)}
    </button> 
    ` : ''
).join('') // Надпись про отсутсвие постера пока не работает. Починю позже + заменю на вывод названия фильма

    card_place.innerHTML = cardsHTML
}

function update_page_btns(){
    page_btns.forEach(btn => {
        let page_num = parseInt(btn.textContent)

        if (page_num < cur_page && page_num > 5)
        {
            btn.textContent = cur_page
        }
        else if (page_num >= cur_page && page_num > 5)
        {
            btn.textContent = '6'
        }

        if (parseInt() == cur_page)
        {
            btn.classList.add('cur_page')
        }
        else
        {
            btn.classList.remove('cur_page')
        }
    })
}
 

sync_page(cur_page)



page_btns.forEach(btn => {
    btn.addEventListener('click', function(){
        cur_page = parseInt(btn.textContent)
        sync_page(cur_page)

        update_page_btns()

        btn.classList.toggle('cur_page')

        if (cur_page == 1 && !btn_prev.classList.contains('arrow_disabled'))
        {
            btn_prev.classList.toggle('arrow_disabled')
        }
        else if (cur_page != 1 && btn_prev.classList.contains('arrow_disabled'))
        {
            btn_prev.classList.toggle('arrow_disabled')
        }
    })
})


btn_next.addEventListener('click', function() {
    cur_page++
    sync_page(cur_page)

    update_page_btns()

    if (cur_page > 1 && btn_prev.classList.contains('arrow_disabled'))
    {
        btn_prev.classList.toggle('arrow_disabled')
    }
    page_btns.forEach(btn => {
        
        if (parseInt(btn.textContent) == cur_page && !btn.classList.contains('.cur_page'))
        {
            btn.classList.toggle('cur_page')
        }
    })
})



btn_prev.addEventListener('click', function() {
    if (cur_page > 1)
    {
        cur_page--
        sync_page(cur_page)
        
        update_page_btns()

        page_btns.forEach(btn => {
            
            if (parseInt(btn.textContent) == cur_page && !btn.classList.contains('.cur_page'))
            {
                btn.classList.toggle('cur_page')
            }
        })
        
        if (cur_page == 1){
            btn_prev.classList.toggle('arrow_disabled')
        }
    }
})

