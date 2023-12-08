//////////////////// CONSTANTES ////////////////////
const add = '+'
const substract = '-'
const multiply = '*'
const divide = '/'

//////////////////// VARIABLES ////////////////////
let divDetailedResults = document.getElementById('detailed-results')
let purple = '#cebcea'
let blue = '#3685d6'
let green = '#60f3db'
let yellow = '#ffef26'
let orange = '#ffa45b'
let red = '#ff7678'
let arrayOfValues = []

//////////////////// FUNCTIONS ////////////////////
function createSpan(char, color){
    let span = document.createElement("span")
    span.innerText = char
    span.style.color = color
    
    return span
}

function setColorsToTitle(){
    let title = document.getElementById('title')
    let stringTitle = "ma calculatrice pédagogique"
    let colors = [purple, blue, green, yellow, orange, red]

    for(let i=0; i<stringTitle.length; i++){
        title.append(createSpan(stringTitle[i], colors[Math.floor(Math.random() * colors.length)]))
    }
}

function displayRules(){

    divDetailedResults.innerHTML = `Lorsqu'on souhaite faire un calcul avec plusieurs types d'opérateurs, il y a des priorités à respecter. D'abord les <span class="bold" style="color:${red}">multiplications</span> et <span class="bold" style="color:${red}">divisions</span> puis <span class="bold" style="color:${orange}">additions</span> et <span class="bold" style="color:${orange}">soustractions</span>.
    <br>Exemple :
    <br><div class="bold" style="margin-left:30px; color:${blue}">5 + 3 x 2 - 10 / 5 + 8
    <br>5 + <span style="color:${red}">3 x 2</span> - <span style="color:${red}">10 / 5</span> + 8
    <br>5 + <span style="color:${red}">&nbsp; &nbsp;6&nbsp; &nbsp;</span> - <span style="color:${red}">&nbsp; &nbsp;&nbsp;2&nbsp; &nbsp;</span> + 8
    <br><span style="color:${red}">&nbsp; &nbsp;5 + 6</span>&nbsp; &nbsp; - &nbsp; &nbsp; 2 + 8
    <br><span style="color:${red}">&nbsp; &nbsp; &nbsp;11</span> - 2 + 8
    <br><span style="color:${red}">&nbsp; &nbsp; &nbsp;11 - 2</span> + 8
    <br><span style="color:${red}">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;9</span>&nbsp; &nbsp; + 8
    <br><span style="color:${red}">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;9 + 8</span>
    <br><span style="color:${red}">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;17</span></div>`
}

function calculate(value){

    let keys = [...document.getElementsByClassName('keys')]
    let screen = document.getElementById('screen')
    let listKeys = keys.map(key => key.dataset.key)
    const clearAll = 'Delete'
    const enter = 'Enter'

    if(listKeys.includes(value)){
        
        if(!isNaN(parseInt(value))){
            value = parseInt(value)
        }
        if(!isNaN(arrayOfValues[arrayOfValues.length-1]) && !isNaN(value)){
            arrayOfValues[arrayOfValues.length-1] = parseInt('' + arrayOfValues[arrayOfValues.length-1] + value)
        } else {
            if(value != enter){
                arrayOfValues.push(value)
            }
        }
        
        switch(value){
            case clearAll:
                screen.textContent = ''
                arrayOfValues = []
                displayRules()
                break;
            case enter:
                screen.textContent = Math.round(eval(screen.textContent) * 100) / 100
                showDetails(arrayOfValues)
                break;
            default:
                screen.textContent += value
                break;
        }
    }
}

function showDetails(array){

    divDetailedResults.innerHTML = `Analysons ce qui doit être calculé :<br>${getStringOfValues(array)}<br>`
    divDetailedResults.innerHTML += `Dans ton calcul, je vois ${getAllSelectedOperators(array)}.<br>`

    if(array.includes(multiply) || array.includes(divide)){
        divDetailedResults.innerHTML += `Je calcule ce qui est en rouge en premier<br>${getStringOfValues(array, multiply, divide)}<br>`
        
        divDetailedResults.innerHTML += `${getResultForSelectedOperators(array, multiply, divide)}<br>`
    }
    if(array.includes(add) || array.includes(substract)){
        divDetailedResults.innerHTML += `Je calcule ce qui est en rouge en premier<br>${getStringOfValues(array, add, substract)}<br>`
        
        divDetailedResults.innerHTML += `${getResultForSelectedOperators(array, add, substract)}<br>`
    }

    divDetailedResults.innerHTML += `Et voilà le résultat :<br>`
    divDetailedResults.innerHTML += `<span class="bold" style="color:${blue}">${Math.round(eval(getFinalResult(array)) * 100) / 100}</span>`
}


function getStringOfValues(array, operator1 = null, operator2 = null){
    
    let stringOfValues = ''
    let selectedIndex = []
    if(operator1 != null && operator2 != null){
        
        for(let i=0; i<array.length; i++){
            if(array[i] == operator1 || array[i] == operator2){
                selectedIndex.push(i-1, i, i+1);
            }
        }
    }
    for(let i=0; i<array.length; i++){
        let value = array[i] + ' '
        if(array[i] == multiply){
            value = 'x ';
        }
        if(selectedIndex.includes(i)) {
            stringOfValues += `<span class="bold" style="color:${red}">${value}</span>`
        } else {
            stringOfValues += `<span class="bold" style="color:${blue}">${value}</span>`
        }
    }
    return stringOfValues
}

function getResultForSelectedOperators(array, operator1, operator2){
    
    for(let i=0; i<array.length; i++){
        if(array[i] == operator1 || array[i] == operator2){
            let results = ''
            let selectedOperatorsAndNbrs = array.slice(i-1, i+2)
            for(let i=0; i<selectedOperatorsAndNbrs.length;i++){
                results += selectedOperatorsAndNbrs[i];
            }
            array.splice(i-1, (i+1) - (i-1) +1, Math.round(eval(results) * 100) / 100)
            getResultForSelectedOperators(array, operator1, operator2)
        }
    }
    return getStringOfValues(array)
}

function getFinalResult(array){
    let stringOfValues = ''
    for(let i=0; i<array.length; i++){
        stringOfValues += array[i]
    }
    return stringOfValues
}

function getAllSelectedOperators(array){

    let operators = [];
    let selectedOperators = ''

    if(array.includes(multiply)){
        operators.push('multiplications')
    }
    if(array.includes(divide)){
        operators.push('divisions')
    }
    if(array.includes(add)){
        operators.push('additions')
    }
    if(array.includes(substract)){
        operators.push('soustractions')
    }

    for( let i=0; i<operators.length-1; i++){
        let separator = ','
        if(i == operators.length-2){
            separator = ''
        }
        selectedOperators += `des ${operators[i]}${separator} `
    }

    if(operators.length > 1){
        selectedOperators += `et des ${operators[operators.length-1]}`
    } else {
        selectedOperators += `une ${operators[operators.length-1].substring(0, operators[operators.length-1].length-1)}`
    }

    return selectedOperators
}


//////////////////// CODE ////////////////////
setColorsToTitle();
displayRules();
document.addEventListener('click', function(e) {
    calculate(e.target.dataset.key);
})