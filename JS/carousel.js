function create_carousel(data, categorie, isBest){
    // insert carousel
    let carousel = new Carousel(data, categorie)

    // check if browser can use template
    if ("content" in document.createElement("template")){

        // get the DOM element in which we will insert the carousel
        let insert = document.querySelector(".insert_carousel");

        // get carousel template, clone it, set value in clone
        let template = document.querySelector(".carousel");
        let clone = document.importNode(template.content, true);
        let titre = clone.querySelector('h1');
        if(categorie == "Meilleurs"){
            titre.textContent = "Films les mieux notés"
        } else {
            titre.textContent = categorie;
        }

        let carousel_content = clone.querySelector(".carousel__content");
        carousel_content.classList.add(categorie)

        let images = clone.querySelectorAll("img");
        let position = 0;
        for (image of images){
            image.setAttribute("src", data[position].image_url)
            image.setAttribute("alt", data[position].title)
            position += 1;
        }
        // insert clone in DOM
        if (isBest){
            insert.insertBefore(clone, insert.firstChild)
        } else{
            insert.appendChild(clone)
        }
        add_btn_event_click(carousel, categorie);
        add_image_event_click(carousel, categorie);
    } else{
        console.log("Le naviguateur ne prend pas en charge les templates")
    }
}

function add_image_event_click(carousel, categorie){
    // add click event to carousls images
    let images = document.querySelectorAll(".carousel__content."+categorie+ " img")
    for (let img of images){
        img.addEventListener("click", ()=>{
            index = parseInt(img.className);
            carousel.get_detail(index)
        })
    }
}

function add_btn_event_click(carousel, categorie){
    // add click envent to carousels buttons
    let btn_left = document.querySelector(".carousel__content."+categorie+ " .carousel__btn_left")
    let btn_right = document.querySelector(".carousel__content."+categorie+ " .carousel__btn_right")
    btn_left.addEventListener("click", () => {
        carousel.move_left();
    })
    btn_right.addEventListener("click", () => {
        carousel.move_right()
    })
}


class Carousel{

    constructor(array_films, categorie){
        // init value
        this.categorie = categorie
        this.array_films = array_films
        // console.log("TEST"+ this.array_films[0].title)
        this.current_position = 0;
        this.visible_film = array_films.slice(0, 4)
    }

    next(start_value){
        // return next value after "start_value"
        // return number is always between 0 to 6
        // if start_value is 6, next value is 0
        let value = (start_value + 1) % 7;
        return value
    }

    previous(start_value){
        // return next value before "start_value"
        // return number is always between 0 to 6
        // if start_value is 0, next value is 6
        let value = (start_value - 1 ) % 7;
        if (value == -1){
            value = this.array_films.length - 1
        }
        return value
    }

    select_film(){
        // select 4 film, first is in this.current_position
        let position = this.current_position;
        for(let i = 0; i < 4 ; i++){
            this.visible_film[i] = this.array_films[position]
            position = this.next(position)
        }
    }

    display_film(){
        // set movies values to carousel
        let carousel_content = document.querySelectorAll(".carousel__content." + this.categorie + " img");
        let count = 0
        for (let img of carousel_content){
            img.setAttribute("src", this.visible_film[count].image_url)
            img.setAttribute("alt", this.visible_film[count].title)
            count += 1;
        }
    }

    get_detail(index){
        // display modal window with film information
        let film_details = get_request(this.visible_film[index].url);
        film_details.then(res => {
            display_modal(res);
        })
    }

    move_left(){
        // move carousel to left
        this.current_position = this.next(this.current_position);
        this.select_film();
        this.display_film()
    }

    move_right(){
        // move carousel to right
        this.current_position = this.previous(this.current_position);
        this.select_film();
        this.display_film()
    }
}