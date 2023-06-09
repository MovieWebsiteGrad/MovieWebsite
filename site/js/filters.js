const FITLERS = ["Genre", "Year", "Production Company"];

const selection = document.getElementById("filters-section");
const filterMap = new Map();

const searchElement = document.getElementById("search");

searchElement.onkeyup = ()=>{
    getFilteredMovies(filterMap, searchElement.value);
}

const addFilters = label => {
   fetch(`https://0tkppuy4r3.execute-api.us-east-1.amazonaws.com/deployment/values?column=${label}`)
   .then(response => response.json())
   .then(values => {
        const map = new Map();
        const div = document.createElement("div");
        div.innerHTML = `<span><b><i>${label}:</i></b>&nbsp;&nbsp;</span><br />`;
        values.sort();
        for(let value of new Set(values))
        {
            map.set(value, false);
            const p = document.createElement("p");
            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");

            input.onchange = ()=>{
                map.set(value, !map.get(value));
                getFilteredMovies(filterMap, searchElement.value);
            }

            p.appendChild(input);
            p.appendChild(document.createTextNode(value));
            div.appendChild(p);
        }
        selection.appendChild(div);
        filterMap.set(label, map);
   })
}

for(const filter of FITLERS)
    addFilters(filter);

const getFilteredMovies = (map, searchKey) => {
    const filterJSON = {}
    for (const [column, filters] of map.entries()){
        const activeFilters = [];
        for(const [filter, status] of filters.entries())
        {
            if (status)
                activeFilters.push(filter);
        }
        if (activeFilters.length != 0)
            filterJSON[column] = activeFilters;
    }
    fetch("https://0tkppuy4r3.execute-api.us-east-1.amazonaws.com/deployment/movies", {
        "method":"POST",
        headers: { "Content-Type": "application/json"},
        body:JSON.stringify({filters:filterJSON, search:searchKey})
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("cardContainer").innerHTML = '';
        showMovies(data);
    })
}