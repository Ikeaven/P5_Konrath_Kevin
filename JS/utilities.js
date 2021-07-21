// import Movies from './movies'
let catégories = ['Action', 'Film-Noir', 'Sci-Fi']

let global_url = "http://127.0.0.1:8000/api/v1/titles/"

async function get_request(url){
    let response = await fetch(url)
    if (response.ok){
        return response.json();
    } else{
        return response.status;
    }

}

async function get_meilleurs_film(url){
    array_film = await get_categories(url);
    create_carousel(array_film, "Film les mieux notés", true);

    let best_film = array_film[0].url

    let films_detail = await get_request(best_film)

    let title = document.getElementsByClassName("best__titre");
    title[0].innerHTML = array_film[0].title;

    let image = document.getElementsByClassName("best__image");
    image[0].setAttribute("src", array_film[0].image_url)

    let description = document.getElementsByClassName("best__description");
    description[0].innerHTML = films_detail.description;
}

async function get_categories(url){
    let array_film = []
    let response = await get_request(url);
    let response_p2 = await get_request(url+"&page=2")
    for(let el of response.results){
        array_film.push(el)
    }
    for(let i = 0; i<2 ; i++){
        array_film.push(response_p2.results[i])
    }
    return array_film

}


function create_carousel(data, categorie, isBest){
    carousel = new Carousel(data, categorie)


    if ("content" in document.createElement("template")){

        var insert = document.querySelector(".insert");

        var template = document.querySelector(".carousel");
        var clone = document.importNode(template.content, true);
        var titre = clone.querySelector('h1');
        titre.textContent = categorie;
        var images = clone.querySelectorAll("img");
        let position = 0;
        for (image of images){
            image.setAttribute("src", data[position].image_url)
            image.classList.add(data[position].titre)
            position += 1;
        }
        if (isBest){
            insert.insertBefore(clone, insert.firstChild)
        }
        insert.appendChild(clone)


    } else{
        // afficher un message : le naviguateur ne prend pas en charge les templates
    }
}

async function main(){
    get_meilleurs_film(global_url+"?sort_by=-imdb_score")
    for (categorie of catégories) {
        console.log(categorie)
        await get_categories(global_url+"?genre="+categorie)
            .then(array_films => {

                console.log(array_films)
                create_carousel(array_films, categorie, false)
            }

            )

}}


window.addEventListener("load", ()=> {
    main()
});

class Carousel{

    list_carousels = []

    constructor(array_films, categorie){
        this.categorie = categorie
        this.array_films = array_films
        this.current_position = 0
        this.list_carousels.push(this)
    }

    next(){
        this.current_position = (this.current_position + 1) % 4;
        return this.current_position
    }

    previous(){
        this.current_position = (this.current_position - 1 ) %4;
        if (this.current_position == -1){
            this.current_position = this.array_films.length - 1
        }
        return this.current_position
    }
}