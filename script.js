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
let todoStatusActive = localStorage.getItem('todoStatusActive') || '';
let editTodoSelectedElement;

//Event Listeners
document.addEventListener('keydown', handleEscape);
todoList.addEventListener('click', handleClickTodoList);
todoButton.addEventListener('click', addTodo);
todoStatus.addEventListener('click', renderAndFilterTodos);
saveTodoButton.addEventListener('click', saveTodo);
closeEditTodoButton.addEventListener('click', closeEditTodo);

//Functions
function addTodo(event) {
    event.preventDefault();

    if (error(todoInput)) return;
    todoInput.closest('form').classList.remove('error');

    createTodo(todoInput.value);
    saveLocalTodos();

    todoInput.value = '';
    todoInput.focus();
}

function createTodo(text, completed) {
    const liElement = document.createElement('li');
    liElement.classList.add('todo-item');
    if (completed) liElement.classList.add('completed');

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

    todoList.appendChild(liElement);
}

function completedTodo(element) {
    if (!todoStatus.querySelector('.active').classList.contains('all')) {
        if (element.classList.contains('completed'))
            element.classList.add('effect-reverse');
        else
            element.classList.add('effect');

        element.addEventListener('transitionend', () => {
            renderAndFilterTodos({ target: todoStatus.querySelector('.active') });
        });
    }
    element.classList.toggle('completed');
    saveLocalTodos();
}

function deleteTodo(element) {

    element.classList.add('delete');
    element.addEventListener('transitionend', () => {
        element.remove();
    })
    saveLocalTodos();
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

    if (error(editTodoInput)) return;
    editTodoInput.closest('form').classList.remove('error');

    editTodoSelectedElement.innerText = editTodoInput.value;
    closeEditTodo();
    saveLocalTodos();
}

function renderAndFilterTodos(element) {
    if (element) {
        if (element.target.classList.contains('all') ||
            element.target.classList.contains('completed') ||
            element.target.classList.contains('pending')
        ) {
            element.target.closest('ul').querySelector('.active').classList.remove('active');
            element.target.classList.add('active');
            todoStatusActive = element.target.classList[0];
            localStorage.setItem('todoStatusActive', todoStatusActive);
        }
    }

    const todos = todoList.querySelectorAll('.todo-item');

    todos.forEach(todo => {
        todo.style.display = "flex";
        todo.classList.remove('effect');
        todo.classList.remove('effect-reverse');

        if (todoStatusActive === 'completed' && !todo.classList.contains('completed'))
            todo.style.display = "none";

        if (todoStatusActive === 'pending' && todo.classList.contains('completed'))
            todo.style.display = "none";
    });
}

function handleClickTodoList(element) {
    if (element) {
        const target = element.target;
        if (target.classList.contains('delete-todo-button')) {
            deleteTodo(target.closest('li'));
        } else if (target.classList.contains('edit-todo-button')) {
            editTodo(target.closest('li').querySelector('p'));
        } else if (target.closest('li')) {
            completedTodo(target.closest('li'));
        }
    } else {
        if (todoStatusActive === '') {
            todoStatus.querySelector('.pending').classList.add('active');
            todoStatusActive = 'pending'
        } else {
            todoStatus.querySelector(`.${todoStatusActive}`).classList.add('active');
        }
    }
}

function handleEscape(event) {
    if (event.code === 'Escape') {
        closeEditTodo();
    }
}

function saveLocalTodos() {
    let todos = [];

    todoList.querySelectorAll('.todo-item').forEach(todo => {
        todos.push([todo.innerText, todo.classList.contains('completed')]);
    })

    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todoList.innerHTML = '';

    todos.forEach(todo => {
        createTodo(todo[0], todo[1]);
    });
}

function error(element) {
    if (element.value.trim() === '') {
        element.closest('form').setAttribute('data-error', 'Campo não pode ser vazio.');
        element.closest('form').classList.add('error');
        element.value = '';
        element.focus();

        return true;
    }

    return false;
}

handleClickTodoList();
getTodos();
renderAndFilterTodos();