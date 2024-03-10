import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://scrimba-5fc9b-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const dataText = ref(database, "text");

const inputValue =document.getElementById('endorsement')
const inputFrom = document.getElementById('from')
const inputTo = document.getElementById('to')
const btn = document.getElementById('btn')
const innerBox = document.getElementById('innerBox')

btn.addEventListener('click',function(){
    let textValue = {
        text:inputValue.value,
        to:inputTo.value,
        from:inputFrom.value,
        like :0
    }    
    push(dataText, textValue)
    clearValue()
})

onValue(dataText,function(snapshot){
    if (snapshot.exists()){
    let item = Object.entries(snapshot.val())
    let itemArray = item.reverse()
    innerBox.innerHTML =""
    for(let i of itemArray){

   renderBox(i)
    }
}
    else{
        innerBox.innerHTML=`<span class="spanCenter">No Message here... yet</span>`
    }
})

function clearValue(){
    inputFrom.value = ""
    inputTo.value = ""
    inputValue.value = ""
}

function renderBox(item){
    let itemID=item[0]
    let itemto= `${item[1].to}`
    let itemvalue =item[1].text
    let itemfrom =`${item[1].from}`
    let itemlike =`${item[1].like}`
    let exactLocationOfItemInDB = ref(database, `text/${itemID}`)
    let messageTo =""
    let messageForm =""

    if(!itemto){
        messageTo =""
    }else{
        messageTo=`To`
    } 

    if(!itemfrom){
        messageForm=""
    }else{
        messageForm=`From`
    }
    
    let newEl = document.createElement('div')
    newEl.classList.add("box")

    let btnremove = document.createElement('span')
    btnremove.textContent = "X"

    btnremove.classList.add('remove')
    newEl.append(btnremove)

    let message =`
    <h3>${messageTo} ${itemto}</h3>
    <p>${itemvalue}</p>
    <div class="cssInline">
    <h3>${messageForm} ${itemfrom}</h3>
    <span id="like">${itemlike}</span>
    </div>
    `   
    newEl.innerHTML += message
    innerBox.append(newEl)  

    btnremove = newEl.querySelector('.remove')
    let like = newEl.querySelector('#like')

    like.addEventListener('click',function(){
        set(exactLocationOfItemInDB,{
            text:itemvalue,
            to: itemto,
            from:itemfrom,
            like :Number(itemlike)+1
        })
    })

    btnremove.addEventListener('click',function(){
        remove(exactLocationOfItemInDB)
    })
    
}