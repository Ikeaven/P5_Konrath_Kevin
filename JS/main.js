let catégories = ['Action', 'Film-Noir', 'Sci-Fi']

let global_url = "http://127.0.0.1:8000/api/v1/titles/"

async function main(){
    // display dynamique elements of the page
    get_best_movie(global_url+"?sort_by=-imdb_score")
    for (categorie of catégories) {
        await get_movie_by_categorie(global_url+"?genre="+categorie)
            .then(array_films => {
                create_carousel(array_films, categorie, false)
            })
}}


window.addEventListener("load", ()=> {
    // onLoad execut main()
    main()
});