import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'
import {getDatabase, ref, push, onValue, remove} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js'


//Use the following to calcuate the expiration of the database
//Stricter rules should be used such as authentication check for fully developed applications
//const new_date = new Date("2024-08-24");
//let expiration = new_date.getTime() //1724457600000

const firebaseConfig = {
    //apiKey: "YOUR_API_KEY",
    //authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_URL,
    //projectId: "realtime-database",
    //storageBucket: "YOUR_PROJECT_ID.appspot.com",
    //messagingSenderId: "YOUR_SENDER_ID",
    //appId: "YOUR_APP_ID"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

function handleAddItem(inputValue){
    if (inputValue != ""){
        push(shoppingListInDB, inputValue)
        // appendItemToShoppingListEl(inputValue)
        clearInputFieldEl()
    }
    inputFieldEl.focus()
}

inputFieldEl.addEventListener("keydown",function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Prevent the default action to avoid any side effects (like submitting a form)
        //e.preventDefault();
        // Call the same function that the button's click event calls
        handleAddItem(inputFieldEl.value);
      }
})

addButtonEl.addEventListener("click", function(e) {
    e.preventDefault();
    let inputValue = inputFieldEl.value
    //Add the item to the shopping list
    handleAddItem(inputValue)
})


onValue(shoppingListInDB, (snapshot)=>{
    
    //console.log("onvalue called")
    if (snapshot.exists()){
        const items = Object.entries(snapshot.val())
        clearListEl()
        for (let item of items){
            appendItemToShoppingListEl(item)
        } 
    }else {
        shoppingListEl.innerHTML = "No items here yet... Mela!"
    }

})

function clearInputFieldEl() {
    //Clear input element after writing to database
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    //shoppingListEl.innerHTML += `<li>${itemValue}</li>`
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.setAttribute("tabindex",0)
    newEl.textContent = itemValue
    newEl.id=itemID
    
    newEl.addEventListener("click", (e)=>{
        e.preventDefault()

        handleListItemClick(newEl.id)
    })

    newEl.addEventListener("keydown",function(e){
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            handleListItemClick(newEl.id)
          }
    })
 
    // Challenge: Attach an event listener to newEl and make it so you console log the id of the item when it's pressed.
    
    shoppingListEl.append(newEl)
}

function handleListItemClick(id){
    let exactLocationOfItemInDB = ref(database, `shoppingList/${id}`)
    remove(exactLocationOfItemInDB)
}

function clearListEl(){

    //Clear the list items 
    shoppingListEl.innerHTML = ""
}