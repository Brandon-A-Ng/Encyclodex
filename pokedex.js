let pokemonArray = []; 
const fetchJson = url => fetch(url).then(res => res.json());

// FETCH API //

(async() => {
    [partOne, partTwo] = await Promise.all([
        Promise.all(new Array(107).fill(0).map((_, i) => fetchJson(`https://pokeapi.co/api/v2/pokemon/${i + 387}`))),
        Promise.all(new Array(107).fill(0).map((_, i) => fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${i + 387}`)))
    ]);
    createPokemonArray(partOne, partTwo);
    createPokemonList(pokemonArray);
    displayPokemon(pokemonArray[0]);
    listClick(); 
})();

// CREATE POKEMON ARRAY //

const pokedexList = document.getElementById("pokemon-list");

const createPokemonArray = ((array1, array2) => {
    let combinedArray = []; 
    array1.forEach(n => {
        index = n.id - 387;
        combinedArray[index] = {...array1[index], ...array2[index]};
    });
    pokemonArray = combinedArray.map(poke => ({
        index: (poke.id - 387), 
        id: ("00" + (poke.id-386)).slice(-3),
        name: poke.name.toUpperCase(),
        sprite: `images/sprites/${("00" + (poke.id-386)).slice(-3)}.png`,
        type: poke.types.map((type) => type.type.name.toUpperCase()), 
        height: feetConverter(poke.height),
        weight: poundConverter(poke.weight),
        flavoredText: poke.flavor_text_entries[2].flavor_text.replaceAll("\n", " "),
        genderDifference: poke.has_gender_differences, 
        form: poke.forms_switchable
    }));

    pokemonArray[1].flavoredText = combinedArray[1].flavor_text_entries[5].flavor_text.replaceAll("\n", " ");
    pokemonArray[52].name = "MIME JR.";

    pokemonArray[26].form = true;
    pokemonArray[35].form = true;
    pokemonArray[36].form = true;
    pokemonArray[41].form = false;
    pokemonArray[58].form = false;
    pokemonArray[61].form = false;
    pokemonArray[73].form = false;
    pokemonArray[88].form = false;
})

const feetConverter = (decimeter) => {
    accumlativeInches = Math.round(decimeter * 3.93701);
    let feet = Math.floor(accumlativeInches / 12); 
    let inches = accumlativeInches % 12; 
    return `${feet}'${String(inches).padStart(2, "0")}\"`;
}

const poundConverter = (hectogram) => {
    let accumlativePound = (hectogram * 0.220462); 
    let roundPound = Math.round(accumlativePound * 10) / 10; 
    return `${roundPound} lbs`;
}

// CREATE POKEMON LIST //

createPokemonList = (pokemonArray) => {
    pokemonArray.forEach(({index, id, name}) => {
        const item = document.createElement("li");
        item.setAttribute("id", `${index}`);
        item.innerHTML = `<span class="pokedex-li-span">${id}</span> <span>${name}</span>`;
        pokedexList.append(item);
    })
}; 

// CREATE POKEMON DISPLAY //

const displayId = document.getElementById("pokemon-id");
const displayName = document.getElementById("pokemon-name");
const displaySprite = document.getElementById("pokemon-sprite"); 
const displayHeight = document.getElementById("pokemon-height");
const displasyWeight = document.getElementById("pokemon-weight");
const displayFlavoredText = document.getElementById("pokemon-desciption");

const displayPokemon = (poke) => {
    displayId.innerHTML = poke.id; 
    displayName.innerHTML = poke.name; 
    displaySprite.src = poke.sprite; 
    displayHeight.innerHTML = poke.height;
    displasyWeight.innerHTML = poke.weight; 
    displayFlavoredText.innerHTML = poke.flavoredText;
    displayTypes(poke.type);
    displayGender(poke.genderDifference); 
    displayFormChange(poke.form); 
}

// UPDATE AND DISPLAY TYPES //

const displayTypes = (types) => {
    let typesDiv = document.getElementById("pokemon-types");
    let blueTitle = typesDiv.firstElementChild.className; 
    while(!(blueTitle == typesDiv.lastElementChild.className)) {
        typesDiv.lastElementChild.remove();
    }

    for (let i = 0; i < types.length; i++) {
        let type = document.createElement("span"); 
        type.innerText = types[i].toUpperCase();
        type.classList.add("type");
        type.classList.add(types[i].toLowerCase());
        typesDiv.append(type);
    }
}
// GENDER CHANGE //

const genderButton = document.getElementById("gender-button"); 
const genderLogo = document.getElementById("gender-logo");
 
const displayGender = (genderBoolean) => {
    if(genderBoolean) {
        genderButton.classList.remove("display-none"); 
    }
    else {
        genderButton.classList.add("display-none");
    }
}

gender = () => {
    if(genderButton.classList.contains("blue")) {
        displaySprite.src = `images/sprites/${displayId.innerHTML}f.png`;
        genderButton.classList.remove("blue");
        genderButton.classList.add("red"); 
        genderLogo.src = "images/buttons/female.png"; 
    }
    else {
        displaySprite.src = `images/sprites/${displayId.innerHTML}.png`;
        genderButton.classList.add("blue");
        genderButton.classList.remove("red"); 
        genderLogo.src = "images/buttons/male.png"; 
    }
};

// SEARCH FEATURE // 

const search = document.getElementById("search-input"); 

search.addEventListener("input", (e) => {
    const inputValue = e.target.value.toUpperCase()
    let liAll = document.querySelectorAll("li");
    for (let li of liAll) {
        let listName = li.lastChild.innerText
        if (!listName.indexOf(inputValue) == 0) {
            li.classList.add("display-none");
        }
        else {
            li.classList.remove("display-none"); 
        }
    }
});

// EVENT LISTENER FOR LIST //

const listClick = () => {
    let liAll = document.querySelectorAll("li");
    for (let li of liAll) {
        li.addEventListener("click", () => {
            displayPokemon(pokemonArray[li.id]); 
        }); 
    }
}

// FORM CHANGE // 

const formButton = document.getElementById("form-button");
const formLogo = document.getElementById("form-logo"); 

const displayFormChange = (formBoolean) => {
    let backgroundColor = ["normal", "bug", "dark", "dragon", "electric", "fighting",
                "fire", "flying", "ghost", "grass", "ground", "ice", "poison",
                "psychic", "rock", "steel", "water"];
    
    for(let type of backgroundColor) {
       formButton.classList.remove(type);
    }
    if(formBoolean) {
        while (formButton.classList.length > 2) {
            formButton.classList.remove(`${formButton.classList[formButton.classList.length-2]}`);
        }
        if(displayName.innerHTML == "BURMY" || displayName.innerHTML == "WORMADAM") {
            formLogo.src = "images/buttons/forest.png";
            formButton.classList.add("grass"); 
            formButton.setAttribute("onclick", "burmyLineFormChange()"); 
        }
        else if(displayName.innerHTML == "CHERRIM") {
            formLogo.src = "images/buttons/overcast.png";
            formButton.classList.add("ghost"); 
            formButton.setAttribute("onclick", "cherrimFormChange()"); 
        }
        else if(displayName.innerHTML == "SHELLOS" || displayName.innerHTML == "GASTRODON") {
            formLogo.src = "images/buttons/east.png";
            formButton.classList.add("poison"); 
            formButton.setAttribute("onclick", "shellosLineFormChange()");  
        }
        else if(displayName.innerHTML == "ROTOM") {
            formLogo.src = "images/buttons/blank.png";
            formButton.classList.add("electric"); 
            formButton.setAttribute("onclick", "rotomFormChange()"); 
        }
        else if(displayName.innerHTML == "GIRATINA") {
            formLogo.src = "images/buttons/blank.png";
            formButton.classList.add("ghost"); 
            formButton.setAttribute("onclick", "giratinaFormChange()");  
        }
        else if(displayName.innerHTML == "SHAYMIN") {
            formLogo.src = "images/buttons/blank.png";
            formButton.classList.add("grass"); 
            formButton.setAttribute("onclick", "shayminFormChange()");  
        }
        else {
            formLogo.src = "images/buttons/blank.png";
            formButton.classList.add("normal");
            formButton.setAttribute("onclick", "arceusFormChange()");  
        }
        formButton.classList.remove("display-none");
    }
    else {
        formButton.classList.add("display-none");
        formButton.setAttribute("onclick", ""); 
    }
}

const burmyLineFormChange = () => { 
    console.log(formButton.classList.length);
    if (formLogo.getAttribute("src") === "images/buttons/forest.png") {
        // change to sand burmey
        formLogo.src = `images/buttons/mountain.png`;
        formButton.classList.add("ground"); 
        formButton.classList.remove("grass"); 
        displaySprite.src = `images/sprites/${displayId.innerHTML}s.png`;
        if (displayName.innerHTML == "WORMADAM") {
            displayTypes(["BUG", "GROUND"]);
        }
    }
    else if (formLogo.getAttribute("src") === "images/buttons/mountain.png") {
        // change to city burmey
        formLogo.src  = "images/buttons/city.png";
        formButton.classList.add("steel"); 
        formButton.classList.remove("ground");
        displaySprite.src = `images/sprites/${displayId.innerHTML}c.png`;
        if (displayName.innerHTML == "WORMADAM") {
            displayTypes(["BUG", "STEEL"]);
        }
    }
    else {
        // change to forest burmey
        formLogo.src = "images/buttons/forest.png";
        formButton.classList.add("grass");
        formButton.classList.remove("steel");
        displaySprite.src = `images/sprites/${displayId.innerHTML}.png`;
        if (displayName.innerHTML == "WORMADAM") {
            displayTypes(["BUG", "GRASS"]);
        }
    }
};

const cherrimFormChange = () => {
    if (formLogo.getAttribute("src") === "images/buttons/overcast.png") {
        // change to sunshine
        formLogo.src = "images/buttons/sunny.png";
        formButton.classList.add("water"); 
        formButton.classList.remove("ghost"); 
        displaySprite.src = "images/sprites/035s.png";
    }
    else {
        // change to overcast
        formLogo.src = "images/buttons/overcast.png";
        formButton.classList.add("ghost"); 
        formButton.classList.remove("water"); 
        displaySprite.src = "images/sprites/035.png";
    }
}

const shellosLineFormChange = () => {
    if (formLogo.getAttribute("src") === "images/buttons/east.png") {
        // change to west
        formLogo.src = "images/buttons/west.png";
        displaySprite.src = `images/sprites/${displayId.innerHTML}w.png`;
    }
    else {
        // change to east
        formLogo.src = "images/buttons/east.png";
        displaySprite.src = `images/sprites/${displayId.innerHTML}.png`;
    }
}

var indexRotomForms = 1; 

const rotomFormChange = () => {
    let forms = ["electric", "flying", "grass", "fire", "ice", "water"];
    let formAppliance = ["none", "fan", "lawnmower", "oven", "fridge", "washer"];
    const display = () => {
        formLogo.src = `images/buttons/${formAppliance[indexRotomForms]}.png`;
        displaySprite.src = `images/sprites/093${forms[indexRotomForms]}.png`;
        formButton.classList.add(`${forms[indexRotomForms]}`); 
        formButton.classList.remove(`${forms[indexRotomForms-1]}`); 
        displayTypes(["electric", forms[indexRotomForms]]); 
    }
    if(indexRotomForms < forms.length) {
        if(forms[indexRotomForms] == "electric") {
            formLogo.src = "images/buttons/blank.png";
            displaySprite.src = "images/sprites/093.png";
            formButton.classList.add(`${forms[indexRotomForms]}`); 
            formButton.classList.remove(`${forms[5]}`); 
            displayTypes([forms[indexRotomForms]]); 
            indexRotomForms++; 
        }
        else if(forms[indexRotomForms] == "water") {
            display();
            indexRotomForms = 0; 
        }
        else {
            display();
            indexRotomForms++; 
        }
    }
}

const giratinaFormChange = () => {
    if (formLogo.getAttribute("src") === "images/buttons/griseous-orb.png") {
        // change to normal
        formLogo.src = "images/buttons/blank.png";
        displaySprite.src = `images/sprites/${displayId.innerHTML}.png`;
    }
    else {
        // change to origin
        formLogo.src = "images/buttons/griseous-orb.png";
        displaySprite.src = `images/sprites/${displayId.innerHTML}o.png`;
    }
}

const shayminFormChange = () => {
    if (formLogo.getAttribute("src") === "images/buttons/gracidea.png") {
        // change to land
        formLogo.src = "images/buttons/blank.png";
        displaySprite.src = `images/sprites/${displayId.innerHTML}.png`;
        displayTypes(["grass"]);
    }
    else {
        // change to flying
        formLogo.src = "images/buttons/gracidea.png";
        displaySprite.src = `images/sprites/${displayId.innerHTML}s.png`;
        displayTypes(["grass", "flying"])
    }
}

var indexArceusForms = 1; 

const arceusFormChange = () => {
    let forms = ["normal", "bug", "dark", "dragon", "electric", "fighting",
                "fire", "flying", "ghost", "grass", "ground", "ice", "poison",
                "psychic", "rock", "steel", "water"];
    const display = () => {
        formLogo.src = `images/buttons/${forms[indexArceusForms]}-plate.png`;
        displaySprite.src = `images/sprites/107${forms[indexArceusForms]}.png`;
        formButton.classList.add(`${forms[indexArceusForms]}`); 
        formButton.classList.remove(`${forms[indexArceusForms-1]}`); 
        displayTypes([forms[indexArceusForms]]); 
    }
    if(indexArceusForms < forms.length) {
        if(forms[indexArceusForms] == "normal") {
            formLogo.src = "images/buttons/blank.png";
            displaySprite.src = "images/sprites/107.png";
            formButton.classList.add(`${forms[indexArceusForms]}`); 
            formButton.classList.remove(`${forms[16]}`); 
            displayTypes([forms[indexArceusForms]]); 
            indexArceusForms++; 
        }
        else if(forms[indexArceusForms] == "water") {
            display(); 
            indexArceusForms = 0; 
        }
        else {
            display();
            indexArceusForms++; 
        }
    }
}