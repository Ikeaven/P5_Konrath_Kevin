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
    let btn = document.querySelector('.best__button')
    btn.addEventListener("click", ()=>{
        display_modal(data)
    })
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


function add_btn_event_click(carousel, categorie){
    let btn_left = document.querySelector(".carousel__content."+categorie+ " .carousel__btn_left")
    let btn_right = document.querySelector(".carousel__content."+categorie+ " .carousel__btn_right")
    btn_left.addEventListener("click", () => {
        carousel.move_left();
    })
    btn_right.addEventListener("click", () => {
        carousel.move_right()
    })
}

function add_image_event_click(carousel, categorie){
    let images = document.querySelectorAll(".carousel__content."+categorie+ " img")
    for (let img of images){
        img.addEventListener("click", ()=>{
            index = parseInt(img.className);
            carousel.get_detail(index)
        })
    }
}

function add_modal_btn_event(){
    let btn = document.querySelector(".modal--exit")
    btn.addEventListener("click", ()=>{
        let modal = document.querySelector(".modal")
        modal.remove()
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
            // image.classList.add(data[position].title.replaceAll(' ', '_'))
            position += 1;
        }
        if (isBest){
            insert.insertBefore(clone, insert.firstChild)
        }
        insert.appendChild(clone)
        add_btn_event_click(carousel, categorie);
        add_image_event_click(carousel, categorie);

    } else{
        // afficher un message : le naviguateur ne prend pas en charge les templates
    }
}

function display_modal(data){
    let insert = document.querySelector("#insert_modal");

    let template = document.querySelector('.modal_template');
    let clone = document.importNode(template.content, true);
    let img = clone.querySelector("img")
    img.setAttribute('src', data.image_url)
    img.setAttribute("alt", data.title)
    let infos = [data.title, data.genres, data.date_published, data.rated, data.imdb_score, data.directors, data.actors, data.duration, data.countries, data.worldwide_gross_income, data.long_description]
    let li_elements = clone.querySelectorAll("li");
    count = 0
    for(let li of li_elements){
        li.textContent = infos[count]
        count += 1;
    }
    if (document.querySelector(".modal")){
        let modal = document.querySelector(".modal")
        modal.remove()
    }
    insert.appendChild(clone)
    add_modal_btn_event()

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

    list_carousels = [];

    constructor(array_films, categorie){
        this.categorie = categorie
        this.array_films = array_films
        console.log("TEST"+ this.array_films[0].title)
        this.current_position = 0;
        this.visible_film = array_films.slice(0, 4)
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
        for(let i = 0; i < 4 ; i++){
            this.visible_film[i] = this.array_films[position]
            position = this.next(position)

        }
    }

    display_film(){
        let carousel_content = document.querySelectorAll(".carousel__content." + this.categorie + " img");
        let count = 0
        for (let img of carousel_content){
            img.setAttribute("src", this.visible_film[count].image_url)
            img.setAttribute("alt", this.visible_film[count].title)
            count += 1;
        }
    }

    get_detail(index){

        let film_details = get_request(this.visible_film[index].url);
        film_details.then(res => {
            console.log(res);
            display_modal(res);
        })



    }

    move_left(){
        // console.log("left " + this.categorie)
        this.current_position = this.next(this.current_position);
        this.select_film();
        this.display_film()
    }

    move_right(){
        // console.log("right " + this.categorie)
        this.current_position = this.previous(this.current_position);
        this.select_film();
        this.display_film()
    }
}