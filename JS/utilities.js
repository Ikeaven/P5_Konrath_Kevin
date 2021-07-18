// import Movies from './movies'


let global_url = "http://127.0.0.1:8000/api/v1/titles/"

async function get_request(url){
    let response = await fetch(url)
    if (response.ok){
        return response.json();
    } else{
        return response.status;
    }

}

async function get_meilleur_film(url){
    let response = await get_request(url);
    let movies_url = response.results[0].url

    let films_detail = await get_request(movies_url)

    let title = document.getElementsByClassName("best__titre");
    title[0].innerHTML = response.results[0].title;

    let image = document.getElementsByClassName("best__image");
    image[0].setAttribute("src", response.results[0].image_url)

    let description = document.getElementsByClassName("best__description");
    description[0].innerHTML = films_detail.description;
}



get_request("http://127.0.0.1:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score&page=2")
    .then(res => {
        res.results.forEach(el => {
            console.log(el)
        });
    })
    .catch(err => {
        console.log(err)
    })



window.addEventListener("load", ()=> {
    get_meilleur_film(global_url+"?sort_by=-imdb_score")

});