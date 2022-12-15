const form = document.querySelector('.todo-list-form')
const alert = document.querySelector('.alert')
const input = document.getElementById('todo-list')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.todo-list-container')
const list = document.querySelector('.todo-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement
let editFlag = false // режим редактирования
let editId = ''


//------------- Event listeners ---------------

//submit form

form.addEventListener('submit', addItem)

// clear list

clearBtn.addEventListener('click', clearItems)

window.addEventListener('DOMContentLoaded', initList)


//------------- Functions ---------------

function addItem(e) { 
    e.preventDefault()
    const value = input.value
    const id = new Date().getTime().toString()
    const createdAt = getCurrentTime()

    //hide add button
    // if ( list.children.length >= 10) {
    //     setBackToDefault()
    //     return
    // }

    if(value && value.match(/^\s+$/) == null && !editFlag) {
        //create element
    createListItme(id, value, createdAt)

    //display alert
    displayAlert('Item added to the list', 'success')

    //set to local storage
    addToLocalStorage(id, value, createdAt)

    setBackToDefault()
    }else if (value && editFlag) {
        
        editElement.querySelector('span').innerText = value
        //display alert
        displayAlert('Value changed', 'success')
        //edit local storage
        editLocalStorage(editId, value, createdAt)
        setBackToDefault()
        console.log('edit');
    }else if (value.match(/^\s+$/) !== null || value == '') {
        displayAlert('please enter value', 'error')
    }
}

function displayAlert(text, action){
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    setTimeout(function(){
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`)
    }, 1500)
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id
    setBackToDefault()
    list.removeChild(element)
    removeFromLocalStorage(id)
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling
    input.value = editElement.querySelector('span').innerText
    //set form value
    editFlag = true
    editId = element.dataset.id
    submitBtn.textContent = 'edit'
    console.log(element, 'edit')


}

function clearItems() {
    const items = document.querySelectorAll('.todo-list__item')
    if (items.length > 0) {
        // list.innerHTML = ''
        items.forEach(item => {
            list.removeChild(item)
        })
    }
    setBackToDefault()
    // remove list from local storage
    localStorage.removeItem('list')
}


function setBackToDefault(){
    input.value = ''
    editFlag = false
    editId = ''
    submitBtn.textContent = 'add'
    // submitBtn.hidden = list.children.length >= 10
}

function getCurrentTime() {

    const currentDate = new Date()
    return currentDate.toLocaleTimeString()
    // const hours = currentDate.getHours()
    // const minutes = currentDate.getMinutes()
    // const seconds = currentDate.getSeconds()
    // return `${hours}:${minutes}:${seconds}`
}


//--------------Local storage------------

function addToLocalStorage(id, value, createdAt) {
    const item = {id, value, createdAt}
    let items = getLocalStorage()
    items.push(item)
    localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage(){
    return localStorage.getItem('list') 
    ? JSON.parse(localStorage.getItem('list')) : []
}

function removeFromLocalStorage(id){
    const items = getLocalStorage()
    const updatedList = items.filter(function(item){
        return item.id !== id
    })
    localStorage.setItem('list', JSON.stringify(updatedList))
}

function editLocalStorage(id, value, createdAt){
    const items = getLocalStorage()
    const updatedList = items.map(function(item){
        if ( item.id === id){
            item.value = value
            item.date = createdAt
        }

        return item
    })
    localStorage.setItem('list', JSON.stringify(updatedList))
}


//------------------ Init list --------------------
function initList(){
    const items = getLocalStorage()
    if (items.length > 0) {
        items.forEach(item => {
            createListItme(item.id, item.value, item.createdAt)
        })
    }
}
function createListItme(id, value, createdAt){
    const element = document.createElement('div')
        const attr = document.createAttribute('data-id')
        attr.value = id
        element.setAttributeNode(attr)
        element.classList.add('todo-list__item')
        element.innerHTML = `
            <p class="title">
            <span>${value}</span> - ${createdAt}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn">edit</button>
                <button type="button" class="delete-btn">delete</button>
            </div>
        `
    // add elements to both
    const deleteBtn = element.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', deleteItem)
    const editBtn = element.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem)


    //append child
    
    list.appendChild(element)
        console.log('added item');
    
}