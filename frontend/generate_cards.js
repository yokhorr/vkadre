const citiesTranslation = new Map();

const translationPairs = [
    ["vladivostok", "Владивосток"],
    ["artem", "Артём"],
    ["ussuriysk", "Уссурийск"]
]

for (let i = 0; i < translationPairs.length; i++) {
    citiesTranslation.set(translationPairs[i][0], translationPairs[i][1]);
}

const jsons = [
    "seances",
    "dates-days-of-week",
    "films",
    "films-ids",
    "genre-namesIds",
    "theatres-seancesIds",
];

const dir = "../backend/data/jsons/";
const city = "vladivostok";

// console.log(jsons.length);

const promises = jsons.map((url) => {
    return fetch(`${dir}${url}_${city}.json`).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    });
});
let jsonData2;
const filmsDictionary = {};

Promise.all(promises).then((results) => {
    jsonData2 = results;
    // console.log(jsonData2);
    Object.keys(jsonData2[2]).forEach((key) => {
        filmsDictionary[jsonData2[2][key].filmId] = jsonData2[2][key];
    });
    // console.log(filmsDictionary);
    let cards = document.getElementById("cards");
    Object.keys(jsonData2[0]).forEach((key) => {
        let item = document.createElement("div");
        item.classList.add("item");
        item.setAttribute("data-city", citiesTranslation.get(city));
        item.setAttribute("data-theatre", jsonData2[0][key].theatre);
        item.setAttribute(
            "data-genres",
            filmsDictionary[jsonData2[0][key].filmId].genres
        );
        item.setAttribute("data-time", jsonData2[0][key].time);
        item.setAttribute("data-date", jsonData2[0][key].date);
        item.setAttribute("data-filmId", jsonData2[0][key].filmId);
        item.setAttribute(
            "data-rating",
            filmsDictionary[jsonData2[0][key].filmId].rating
        );
        item.setAttribute("data-cost", jsonData2[0][key].cost);
        item.setAttribute("data-seancesId", jsonData2[0][key].seanceId);
        cards.appendChild(item);
        let card = document.createElement("div");
        card.className = "card";
        let poster = document.createElement("div");
        let re = document.createElement("img");
        if (
            `../backend/data/films_images/${jsonData2[0][key].filmId}.jpg` !==
            undefined
        ) {
            re.src = `../backend/data/films_images/${jsonData2[0][key].filmId}.jpg`;
        } else {
            re.src = "../frontend/defaultImage.jpg";
        }

        poster.appendChild(re);
        poster.classList.add("before-element");
        poster.className = "poster";
        card.appendChild(poster);
        let details = document.createElement("div");
        details.className = "details";
        let idf = document.createElement("p");
        idf.innerHTML = `${filmsDictionary[jsonData2[0][key].filmId].name}`;
        details.appendChild(idf);
        let h3 = document.createElement("h3");
        let genres = document.createElement("div");
        genres.className = "genres";
        details.appendChild(h3);
        let genre = document.createElement("span");
        genre.innerHTML = `Sci-fi`;
        genres.appendChild(genre);
        details.appendChild(genres);
        card.appendChild(details);
        item.appendChild(card);
    });
    // repo cards generation
    const cardsGenerated = new CustomEvent("cardsGenerated");
    document.dispatchEvent(cardsGenerated);
});
// console.log(promises);
