//Selectors
const todoInput = document.querySelector('.todo-input');
const todoStatus = document.querySelector('.todo-status');
const todoButton = document.querySelector('.add-todo-button');
const todoList = document.querySelector('.todo-list');
const editTodoContainer = document.querySelector('.edit-todo-container');
const editTodoInput = document.querySelector('.edit-todo-input');
const saveTodoButton = document.querySelector('.save-todo-button');
const closeEditTodoButton = document.querySelector('.close-button');
const modal = document.querySelector('.modal');
let editTodoSelectedElement;

//Event Listeners
document.addEventListener('keydown', handleEscape);
todoList.addEventListener('click', handleClickTodoList);
todoButton.addEventListener('click', addTodo);
todoStatus.addEventListener('click', filterTodos);
saveTodoButton.addEventListener('click', saveTodo);
closeEditTodoButton.addEventListener('click', closeEditTodo);

//Functions
function addTodo(event) {
    event.preventDefault();

    const liElement = createTodo(todoInput.value);

    todoList.appendChild(liElement);
    todoInput.value = '';
    todoInput.focus();
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

function completedTodo(element) {
    if (!todoStatus.querySelector('.active').classList.contains('all')) {
        if (element.classList.contains('completed'))
            element.classList.add('effect-reverse');
        else
            element.classList.add('effect');

        element.addEventListener('transitionend', () => {
            filterTodos({ target: todoStatus.querySelector('.active') });
        });
    }

    element.classList.toggle('completed');
}

function deleteTodo(element) {
    element.classList.add('delete');
    element.addEventListener('transitionend', () => {
        element.remove();
    })
}

function editTodo(element) {
    editTodoSelectedElement = element;

    modal.style.display = 'block';
    editTodoContainer.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        editTodoContainer.style.opacity = '1';
    }, 1);

    editTodoInput.value = element.textContent;
    editTodoInput.focus();
}

function closeEditTodo() {
    modal.style.opacity = '0';
    editTodoContainer.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        editTodoContainer.style.display = 'none';
    }, 500);
}

function saveTodo(event) {
    event.preventDefault();
    console.log(editTodoSelectedElement);
    editTodoSelectedElement.innerText = editTodoInput.value;
    closeEditTodo();
}

function filterTodos({ target }) {
    if (
            !target.classList.contains('all') &&
            !target.classList.contains('completed') &&
            !target.classList.contains('pending')
        ) return;

    const todos = todoList.querySelectorAll('.todo-item');

    target.closest('ul').querySelector('.active').classList.remove('active');
    target.classList.add('active');

    todos.forEach(todo => {
        todo.style.display = "flex";
        todo.classList.remove('effect');
        todo.classList.remove('effect-reverse');
        if (target.classList.contains('completed') && !todo.classList.contains('completed'))
            todo.style.display = "none";

        if (target.classList.contains('pending') && todo.classList.contains('completed'))
            todo.style.display = "none";
    });
}

function handleClickTodoList({ target }) {
    if (target.classList.contains('delete-todo-button')) {
        deleteTodo(target.closest('li'));
    } else if (target.classList.contains('edit-todo-button')) {
        editTodo(target.closest('li').querySelector('p'));
    } else if (target.closest('li')) {
        completedTodo(target.closest('li'));
    }
}

function handleEscape(event) {
    if (event.code === 'Escape') {
        closeEditTodo();
    }
}



// filterTodos({ target: todoStatus.querySelector('.active') });