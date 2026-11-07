
// Selecionar elementos

const loginForm = document.getElementById('loginForm');
const btnTheme = document.querySelector('#themeButton');


const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const welcomeMessage = document.getElementById('welcomeMessage');

const loginMessage = document.getElementById('loginMessage');
const logoutButton = document.getElementById('logoutButton');

const expenseForm = document.getElementById('expenseForm');
const expensesList = document.getElementById('expensesList');
const totalExpenses = document.getElementById('totalExpenses');

const categoryFilter = document.getElementById('categoryFilter');

const currentDateTime= document.getElementById('currentDateTime');

const weatherInfo = document.getElementById('weatherInfo');
const refreshWeather = document.getElementById('refreshWeather');
const weatherDate = document.getElementById('weatherDate');

const maxTemperature = document.getElementById('maxTemperature');
const minTemperature = document.getElementById('minTemperature');
const precipitation = document.getElementById('precipitation');

// ===========================================================================================

// Criar listas de despesas
let expenses = [];
let currentUser = null;

console.log("Formulário de despesas:", expenseForm);
console.log("Botão de tema escuro/claro");
console.log("Formulário:", loginForm);

// ===========================================================================================

// Evento submit

loginForm.addEventListener('submit', function(e) {
e.preventDefault();

const formData = new FormData(this);
const userName = formData.get('userName').trim();

// Validar o nome
if(userName === "") {
    loginMessage.textContent = "Introduza um nome válido.";
    return;
}

loginMessage.textContent= "";

// Guardar o nome no LocalStorage
localStorage.setItem('userName', userName);
showApplication(userName);

// Mesagem quando clicar em "Entrar"
console.log("Fez Login na sessão!");
console.log("Nome introduzido:", userName);
console.log("Formulário submetido!");
});

// ===========================================================================================

function updateThemeButton() {

    const darkMode = document.body.classList.contains('dark-mode');

    if (darkMode === true) {
        btnTheme.textContent = '☀️ Modo claro';
    } else {
        btnTheme.textContent = '🌙 Modo escuro';
    }

}

// ===========================================================================================

// Função do Tema Claro/Escuro
btnTheme.addEventListener('click', function(e) {

    document.body.classList.toggle('dark-mode');


    const darkMode = document.body.classList.contains('dark-mode');

    if (darkMode === true) {
        // Guardar preferência do modo escuro
        localStorage.setItem('theme', 'dark');
        console.log("Dark mode activated!")
    } else {
        // Guardar preferência do modo claro
        localStorage.setItem('theme', 'light');
        console.log("Light mode activated!")
    }

    updateThemeButton();

});

// ===========================================================================================

// Recuperar o tema guardado
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

updateThemeButton();

const savedUser = localStorage.getItem('userName');

if (savedUser !== null) {
    showApplication(savedUser);
} else { 
    console.log("Não existe nenhum utilizador guardado.");
}
console.log("Utilizador recuperado:", savedUser);

// ===========================================================================================

function showApplication(userName) {

    // Identificar o utilizador atual
    currentUser = userName;

    // Recuperar as despesas desse utilizador
    const userExpenses = localStorage.getItem('expenses_' + currentUser);

    if (userExpenses !== null) {

        expenses = JSON.parse(userExpenses);

    } else {

        // Recuperar despesas antigas, antes da separação por utilizador
        const oldExpenses = localStorage.getItem('expenses');

        if (oldExpenses !== null) {

            expenses = JSON.parse(oldExpenses) || [];

            localStorage.setItem('expenses_' + currentUser, JSON.stringify(expenses));

            localStorage.removeItem('expenses');

        } else {

            expenses = [];

        }

    }

    authSection.hidden = true;
    appSection.hidden = false;

    welcomeMessage.textContent = "Olá, " + userName + "!";

    // Repor o filtro de categorias
categoryFilter.value = "Todas";

// Atualizar a lista de despesas
renderExpenses();

// Consultar a meteorologia automaticamente
updateWeather();

}

function saveExpenses() {

    localStorage.setItem('expenses_' + currentUser, JSON.stringify(expenses));

}

// ===========================================================================================

logoutButton.addEventListener('click', function(e) {

    // Mesagem ao clicar "Terminar Sessão"
    console.log("Fez Logout da sessão!")

// Remove o nome guardado
localStorage.removeItem('userName');

// Limpar os dados do utilizador ativo da memória
currentUser = null;
expenses = [];

// Esconde a aplicação
authSection.hidden = false;
appSection.hidden = true;
});

// ===========================================================================================

expenseForm.addEventListener('submit', function(e) {

    e.preventDefault();

    const formData = new FormData(this);

    const description = formData.get('description').trim();
    const amount = Number(formData.get('amount'));
    const category = formData.get('category');

    // Validar os dados introduzidos
    if (description === "" || !Number.isFinite(amount) || amount <= 0 || category === "") {

    alert("Verifique os dados da despesa.");

    return;

}

    console.log(description);
    console.log(amount);
    console.log(category);

    const expense = {
        description: description,
        amount: amount,
        category: category
    };

    expenses.push(expense);
    console.log(expenses);

    saveExpenses();

    renderExpenses();

})

// =============================================================================================

function renderExpenses() {

    expensesList.textContent = "";

    let total = 0;

    const selectedCategory = categoryFilter.value;

    expenses.forEach(function(expense, index) {

        if (selectedCategory !== "Todas" && expense.category !== selectedCategory) {
            return;
        }

        const li = document.createElement('li');

        const expenseText = document.createElement('span');

        expenseText.className = 'expense-text';

        expenseText.textContent = `${expense.description} - ${expense.amount.toFixed(2)} € - ${expense.category}`;

        li.appendChild(expenseText);

        // Botão Eliminar
        const deleteButton = document.createElement('button');

        deleteButton.textContent = 'Eliminar';

        deleteButton.classList.add('btn-danger');

        deleteButton.addEventListener('click', function() {

            expenses.splice(index, 1);

            saveExpenses();

            renderExpenses();

        });

        li.appendChild(deleteButton);

// =============================================================================================

        // Botão Editar
        const editButton = document.createElement('button');

        editButton.textContent = 'Editar';

        editButton.classList.add('btn-primary');

        editButton.addEventListener('click', function() {

            const newDescription = prompt('Nova descrição:', expense.description);

            if (newDescription === null) {
                return;
            }

            const newAmount = prompt('Novo valor:', expense.amount);

            if (newAmount === null) {
                return;
            }

            const newCategory = prompt('Nova categoria: Alimentação, Transportes, Habitação, Saúde, Lazer ou Outros:', expense.category);

            if (newCategory === null) {
                return;
            }

            const amountNumber = Number(newAmount.replace(',', '.'));

            const validCategories = ['Alimentação', 'Transportes', 'Habitação', 'Saúde', 'Lazer', 'Outros'];

            if (newDescription.trim() === '' || Number.isNaN(amountNumber) || amountNumber <= 0 || !validCategories.includes(newCategory.trim())) {
                alert('Dados inválidos. Verifique a descrição, o valor e a categoria.');
                return;
            }

            expenses[index] = {
                description: newDescription.trim(),
                amount: amountNumber,
                category: newCategory.trim()
            };

            saveExpenses();

            renderExpenses();

        });

        li.appendChild(editButton);


        // Adicionar despesa à lista HTML
        expensesList.appendChild(li);

        total = total + expense.amount;

    });

    totalExpenses.textContent = `${total.toFixed(2)} €`;

}

// ===========================================================================================

categoryFilter.addEventListener('change', function() {

    renderExpenses();

});

// =======================================================================================

function updateDateTime() {

    const now = new Date();

    const date = now.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const time = now.toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    currentDateTime.textContent = `Data: ${date} | Hora: ${time}`;

}

updateDateTime();

setInterval(updateDateTime, 1000);

// =====================================================================================

async function updateWeather() {

    weatherInfo.textContent = "A obter informação meteorológica...";

    try {

        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=39.463&longitude=-8.1975&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto");

        if (!response.ok) {
            throw new Error("Erro ao consultar a API.");
        }

        const data = await response.json();

        const daily = data.daily;

// Obter a data da previsão
const date = new Date(daily.time[0] + "T00:00:00");

weatherDate.textContent = `Previsão para ${date.toLocaleDateString('pt-PT')}`;

// Apresentar temperatura máxima
maxTemperature.textContent = `${daily.temperature_2m_max[0]} °C`;

// Apresentar temperatura mínima
minTemperature.textContent = `${daily.temperature_2m_min[0]} °C`;

// Apresentar precipitação
precipitation.textContent = `${daily.precipitation_sum[0]} mm`;

// Limpar mensagem de carregamento ou erro
weatherInfo.textContent = "";

    } catch (error) {

        weatherInfo.textContent = "Não foi possível obter a informação meteorológica.";

        console.log("Erro:", error);

    }

}

// ===========================================================================================

refreshWeather.addEventListener('click', function() {
    
    updateWeather();
})






