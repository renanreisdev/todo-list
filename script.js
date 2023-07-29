//Selectors
const todoInput = document.querySelector('.todo-input');
const todoStatus = document.querySelector('.todo-status');
const todoButton = document.querySelector('.add-todo-button');
const todoList = document.querySelector('.todo-list');

//Event Listeners
todoList.addEventListener('click', completeTodo);
todoButton.addEventListener('click', addTodo);
todoStatus.addEventListener('click', filterTodos);

//Functions
function addTodo(event) {
    event.preventDefault();

    const liElement = createTodo(todoInput.value);

    todoList.appendChild(liElement);
}

function createTodo(text) {
    const liElement = document.createElement('li');
    liElement.classList.add('todo-item');

    const pElement = document.createElement('p');
    pElement.innerHTML = text;
    liElement.appendChild(pElement);

    const divElement = document.createElement('div');
    liElement.appendChild(divElement);

    const editButtonElement = document.createElement('button');
    editButtonElement.classList.add('edit-todo-button');
    divElement.appendChild(editButtonElement);

    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.classList.add('delete-todo-button');
    divElement.appendChild(deleteButtonElement);

    return liElement;
}

function completeTodo({ target }) {
    if (target.closest('li')) {
        target.classList.toggle('complete');
    }
}