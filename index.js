const btnPost = document.getElementById('btnPost');
const btnSendChanges = document.getElementById('btnSendChanges');
const nameInputPost = document.getElementById('inputPostNombre');
const lastNameInputPost = document.getElementById('inputPostApellido');
const nameInputPut = document.getElementById('inputPutNombre');
const lastNameInputPut = document.getElementById('inputPutApellido');
const idInputPut = document.getElementById('inputPutId');
const displayedResults = document.getElementById('results');
const btnPut = document.getElementById('btnPut');
const idInputDelete = document.getElementById('inputDelete');
const btnDelete = document.getElementById('btnDelete');

function onlyDigits(element) {
    element.value = element.value.replace(/[^0-9]/g, '');
}

function btnActivation(btn, value1, value2) {
    if (value1 === '' || value2 === 'undefined' || value2 === '')
        btn.setAttribute('disabled', true);
    else
        btn.removeAttribute('disabled');
}

function showAlert() {
    const errorAlert = document.getElementById('alert-error');
    errorAlert.classList.replace('d-none', 'd-block');
    setTimeout(() => errorAlert.classList.replace('d-block', 'd-none'), 2500);
}

function addToDisplayedResults(user) {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `
                <p>ID: ${user.id}</p>
                <p>NAME: ${user.name}</p>
                <p>LASTNAME: ${user.lastname}</p>
            `;
    displayedResults.appendChild(li);
}

async function getJSON(idInput, isPut = false) {
    try {
        const idInputValue = idInput ? idInput.value : '';
        const response = await fetch(`https://65424422f0b8287df1ffcd4f.mockapi.io/users/${idInputValue}`);
        const result = await response.json();
        if (isPut)
            return result;
        else if (!response.ok)
            throw Error;
        else {
            displayedResults.innerHTML = '';
            if (idInputValue === '')
                result.forEach(user => addToDisplayedResults(user));
            else {
                addToDisplayedResults(result);
                idInput.value = '';
            }
        }
    } catch (error) {
        showAlert();
    }
}

async function postJSON() {
    try {
        await fetch('https://65424422f0b8287df1ffcd4f.mockapi.io/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nameInputPost.value,
                lastname: lastNameInputPost.value
            })
        });
    } catch (error) {
        showAlert();
    }
}

async function putJSON() {
    try {
        await fetch(`https://65424422f0b8287df1ffcd4f.mockapi.io/users/${idInputPut.value}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nameInputPut.value,
                lastname: lastNameInputPut.value
            })
        });
    } catch (error) {
        showAlert;
    }
}

async function deleteJSON() {
    try {
        const response = await fetch(`https://65424422f0b8287df1ffcd4f.mockapi.io/users/${idInputDelete.value}`, { method: "DELETE" });
        if (!response.ok)
            throw Error;
        else
            return true;
    } catch (error) {
        showAlert();
        return false;
    }
}

btnPost.addEventListener('click', async () => {
    btnPost.setAttribute('disabled', true);
    await postJSON();
    getJSON();
    nameInputPost.value = '';
    lastNameInputPost.value = '';
});

idInputPut.addEventListener('input', async () => {
    if (idInputPut.value === '')
        btnPut.setAttribute('disabled', true);
    else {
        btnPut.removeAttribute('disabled');
        const inputs = await getJSON(idInputPut, true);
        if (inputs !== 'Something went wrong while parsing response JSON') {
            btnPut.removeEventListener('click', showAlert);
            btnPut.setAttribute('data-bs-target', "#dataModal");
            nameInputPut.value = inputs.name;
            lastNameInputPut.value = inputs.lastname;
            btnSendChanges.removeAttribute('disabled');
        } else {
            btnPut.addEventListener('click', showAlert);
            btnPut.removeAttribute('data-bs-target');
        }
    }
});

btnSendChanges.addEventListener('click', async () => {
    await putJSON();
    getJSON();
    idInputPut.value = '';
    btnPut.setAttribute('disabled', true);
});

btnDelete.addEventListener('click', async () => {
    if (await deleteJSON()) {
        if (idInputDelete.value === idInputPut.value) {
            idInputPut.value = '';
            btnPut.setAttribute('disabled', true);
        }
        getJSON();
        idInputDelete.value = '';
        btnDelete.setAttribute('disabled', true);
    }
});