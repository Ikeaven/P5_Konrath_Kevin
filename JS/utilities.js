async function get_request(url){
    // Get request
    let response = await fetch(url)
    if (response.ok){
        return response.json();
    } else{
        return false;
    }

}


async function get_best_movie(url){
    // display best movies info
    array_film = await get_movie_by_categorie(url);
    create_carousel(array_film, "Meilleurs", true);

    let best_film_url = array_film[0].url

    let films_detail = await get_request(best_film_url)

    let title = document.getElementsByClassName("best__titre");
    title[0].innerHTML = array_film[0].title;

    let image = document.getElementsByClassName("best__image");
    image[0].setAttribute("src", array_film[0].image_url)

    let description = document.getElementsByClassName("best__description");
    description[0].innerHTML = films_detail.description;

    add_best_btn_event(films_detail)
}


function add_best_btn_event(data){
    // add click event to detail button
    let btn = document.querySelector('.best__button')
    btn.addEventListener("click", ()=>{
        display_modal(data)
    })

    let img = document.querySelector('.best__image')
    img.addEventListener("click", ()=>{
        display_modal(data)
    })
}


async function get_movie_by_categorie(url){
    // Get movies by category
    // return array of 7 movies
    let array_film = []
    let response = await get_request(url);
    for(let el of response.results){
        array_film.push(el)
    }

    var response_p2 = await get_request(url+"&page=2")

    if (response_p2){
        for(let i = 0; i<2 ; i++){
            array_film.push(response_p2.results[i])
        }
    }
    return array_film
}
