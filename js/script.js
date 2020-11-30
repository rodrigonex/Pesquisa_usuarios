
let personGlobal = [];

let inputText = document.querySelector('#input-text');
let btnBusca = document.querySelector('#btn-busca');
let personSelect = document.querySelector('#person');
let selectEstatis = document.querySelector('#statistic');
let clearEstatistic = document.querySelector("#estatisiticas .titulo");
const filter = document.querySelector('#usuarios .titulo');

window.addEventListener('load', ()=> {
    fetchCountries();
});

async function fetchCountries(){  
    //const res = await fetch('http://localhost:3000/persons');
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const jsonn = await res.json();

    person = jsonn.results.map(person =>{
     const {name, picture, dob, gender} = person;
     return {
        age: dob.age,
        gender,
        large: picture.large,
        nameComplete: `${name.first} ${name.last}`
     }
    })
    personGlobal = person;
    handlePersonButtons();
}

function render(){
    renderPerson()
    serchPerson()
    renderIstatistic()
}

function renderIstatistic(){
    const TotalMan = person.filter(person =>{
        return person.gender == "male"
    })

    const TotalFamale = person.filter(person =>{
        return person.gender == "female"
    })

    const totalAges = person.reduce((accumulator, current) =>{
        return accumulator + current.age;
    }, 0);

    const mediaIdade = totalAges / person.length;

    if(person.length > 0){
        selectEstatis.innerHTML =`
            <ul>
                <li> Sexo marsculino: ${TotalMan.length} </li>
                <li> Sexo feminino: ${TotalFamale.length} </li>
                <li> Soma das idades: ${totalAges} </li>
                <li> Media das idades: ${mediaIdade.toFixed(0)} </li>
            </ul>
        `;
    }
    clearEstatistic.innerHTML = "Estatistica";
}

function renderPerson(){
    let peopleHTML = "<div>"

    person.forEach(person =>{
        const {nameComplete, age, large} = person;
        const personHTML= `
        <div class="container-person">
            <img src="${large}">
            <p> ${nameComplete}, ${age} anos
        </div>
        `;
        peopleHTML += personHTML;
    })
    peopleHTML += "</div>"
    personSelect.innerHTML = peopleHTML;
}

function serchPerson(){
    totalPerson = person.length
    if(person.length > 0){
        filter.textContent =`
        ${totalPerson} usuários(s) encontrado(s)
        `;
    } 
}

function handlePersonButtons(){
    inputText.addEventListener('keypress', captureEventEnter)
    btnBusca.addEventListener('click', captureEventBuscar)
}

function captureEventEnter(event){
    if(inputText.value.length > 0){
        if(event.key === "Enter"){
            personText(inputText.value)
        }
    }else{
        clear()
    }
}

function captureEventBuscar(event){
    if(inputText.value.length > 0){
        personText(inputText.value)
    }else{
        clear()
    }
}

function personText(caracter){
    person = personGlobal.filter(person =>{
        return person.nameComplete.toLowerCase().includes(caracter.toLowerCase())
    });

    render();
}

function clear(){
    personSelect.innerHTML = "";
    selectEstatis.innerHTML = "";
    filter.textContent = "Nemhum usuário filtrado";
    clearEstatistic.textContent = "Sem dados para mostrar"
}