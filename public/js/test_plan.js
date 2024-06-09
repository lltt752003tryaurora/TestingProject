// ****** Global Variable **********

const form = document.querySelector(".grocery-form");
const alertElement = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

const itemList = new ItemList();
let editFlag = false;
let editID = "";

// ****** Call function **********
getLocalStorage();

submitBtn.addEventListener("click", function(e){
    e.preventDefault();
    if(!editFlag){
        addItem();
    }else{
        editItem();
    }
});

clearBtn.addEventListener("click",clearItems);

// ****** local storage **********
function setLocalStorage(arr) {

    localStorage.setItem("GroceryList", JSON.stringify(arr));

}

function getLocalStorage() {
    itemList.list = localStorage.getItem("GroceryList") ? JSON.parse(localStorage.getItem("GroceryList")) : [];
    showItems();
}

// ****** Functions **********
function addItem() {
  

    var value = grocery.value;
    var id = new Date().getTime().toString();

    if(value.trim() !== ""){
        var item = new Items(id, value);
        itemList.addItemMethod(item);
        setLocalStorage(itemList.list);
        showItems();
        resetForm()
        displayAlert("Item added", "success");
        if(!container.classList.contains("show-container")){
            container.classList.add("show-container");
        }

    }else{
        displayAlert("please enter value", "danger");
    }
}

function showItems() {
    var content = "";
    itemList.list.map(function (item) {
        content += `
                <div data-id="${item.id}"  class="grocery-item">
                    <p class="title">${item.value}</p>
                    <div class="btn-container">
                    <!-- edit btn -->
                    <button onclick="getItem('${item.id}')" type="button" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <!-- delete btn -->
                    <button onclick="deleteItem('${item.id}')" type="button" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                
            `;
    });


    list.innerHTML = content;
}

function deleteItem(id) {
    itemList.deleteItemMethod(id);
    setLocalStorage(itemList.list);
    showItems();
    displayAlert("item removed", "danger");
}

function getItem(id){
    let item = itemList.getItemMethod(id);
    grocery.value = item.value;
    submitBtn.innerHTML ="Edit";
    editFlag = true;
    editID = item.id;
}

function editItem(){
    var newValue = grocery.value ;

    if(newValue.trim() !== ""){

        itemList.editItemMethod(editID,newValue);
        setLocalStorage(itemList.list);
        showItems();
        resetForm();
        displayAlert("value changed", "success");
    }else {
        displayAlert("please enter value", "danger");
    }

}

function resetForm(){
    form.reset();
    submitBtn.innerHTML ="Submit";
    editFlag = false;
    editID = "";
}

function clearItems() {
   
    displayAlert("empty list", "danger");
    resetForm();
    localStorage.removeItem("GroceryList");
    getLocalStorage();
    container.classList.remove("show-container");
}

function displayAlert(text, action) {
    alertElement.innerText = text;
    alertElement.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function () {
        alertElement.innerText = "";
        alertElement.classList.remove(`alert-${action}`);
    }, 1000);
}