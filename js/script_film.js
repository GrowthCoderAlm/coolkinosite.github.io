function get_film_id()
{
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    return id
}

async function film_extract()
{
    const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/' + get_film_id();
    
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

async function get_actors(film_id) {
    const url = 'https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=' + film_id;
    
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

async function sync_page()
{
    let film = await film_extract()
    let actors = await get_actors(get_film_id())

    let poster = document.querySelector('.film-poster img')
    poster.src = film.posterUrl

    let film_name = document.querySelector('.film-title')
    film_name.textContent = film.nameRu

    let film_rating = document.querySelector('.film-stars')
    film_rating.textContent = ""
    let stars = ""
    for (let i = 0; i < 10; i++)
    {
        if (i < Math.round(film.ratingKinopoisk))
        {
            stars = stars + "★"
        }
        else{
            stars = stars + "☆"
        }
    }
    film_rating.textContent = stars

    let year = document.querySelector('.film-year')
    year.textContent = film.year

    let desc = document.querySelector('.desc-text')
    desc.textContent = film.description

    let card_place = document.querySelector(".actors")
    card_place.innerHTML = ''
    if (!card_place) 
    {
        return card_place.innerHTML = '<div>Загрузка...</div>';
    }

    if (!actors || actors.length === 0) {
        card_place.innerHTML = '<div>Актёры не найдены</div>';
        return;
    }

    let cardsHTML = actors.map(actor => 
    (actor != null) ? `
    <div class="actor-card-poster">
        <div class="actor-card-poster">
            <img class="actor-card-poster" src="${actor.posterUrl}" alt="Нет ручек - нет постера >:)">
        </div>
        <h3 class="actor-card-name">${actor.nameRu || 'н/д'}г</h3>
        <p class="actor-card-prof">⭐${actor.professionText || 'н/д'}</p>
    </div> 
    ` : ''
    ).join('') 

    card_place.innerHTML = cardsHTML
}

sync_page()