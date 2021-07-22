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
    create_carousel(array_film, "Meilleurs", true);

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


function add_event_click(carousel, categorie){
    let btn_left = document.querySelector(".carousel__content."+categorie+ " .carousel__btn_left")
    let btn_right = document.querySelector(".carousel__content."+categorie+ " .carousel__btn_right")
    btn_left.addEventListener("click", () => {
        carousel.move_left();
    })
    btn_right.addEventListener("click", () => {
        carousel.move_right()
    })
}



function create_carousel(data, categorie, isBest){
    let carousel = new Carousel(data, categorie)


    if ("content" in document.createElement("template")){

        let insert = document.querySelector(".insert");

        let template = document.querySelector(".carousel");
        let clone = document.importNode(template.content, true);
        let titre = clone.querySelector('h1');
        titre.textContent = categorie;

        let carousel_content = clone.querySelector(".carousel__content");
        carousel_content.classList.add(categorie)

        let images = clone.querySelectorAll("img");
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
        add_event_click(carousel, categorie)

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

    next(start_value){
        let value = (start_value + 1) % 7;
        return value
    }

    previous(start_value){
        let value = (start_value - 1 ) % 7;
        if (value == -1){
            value = this.array_films.length - 1
        }
        return value
    }

    select_film(){
        let position = this.current_position;
        let visible_film = []
        for(let i = 0; i < 4 ; i++){
            visible_film.push(this.array_films[position])
            position = this.next(position)

        }
        return visible_film
    }

    display_film(visible_film){
        let carousel_content = document.querySelectorAll(".carousel__content." + this.categorie + " img");
        let count = 0
        for (let img of carousel_content){
            img.setAttribute("src", visible_film[count].image_url)
            img.setAttribute("alt", visible_film[count].title)
            count += 1;
        }
    }

    move_left(){
        // console.log("left " + this.categorie)
        this.current_position = this.next(this.current_position);
        let visible_film = this.select_film();
        this.display_film(visible_film)
    }

    move_right(){
        // console.log("right " + this.categorie)
        this.current_position = this.previous(this.current_position);
        let visible_film = this.select_film();
        this.display_film(visible_film)
    }
}