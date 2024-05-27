'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')
const openModal2 = () => document.getElementById('modal2').classList.add('active')

const closeModal2 = () => {
    document.getElementById('modal2').classList.remove('active')
}

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_editora')) ?? []
const setLocalStorage = (dbEditora) => localStorage.setItem("db_editora", JSON.stringify(dbEditora))

// CRUD - create read update delete
const deleteEditora = (index) => {
    const dbEditora = readEditora()
    dbEditora.splice(index, 1)
    setLocalStorage(dbEditora)
}

const updateEditora = (index, editora) => {
    const dbEditora = readEditora()
    dbEditora[index] = editora
    setLocalStorage(dbEditora)
}

const readEditora = () => getLocalStorage()

const createEditora = (editora) => {
    const dbEditora = getLocalStorage()
    dbEditora.push (editora)
    setLocalStorage(dbEditora)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

//Campos para serem salvos
const saveEditora = () => {
    debugger
    if (isValidFields()) {
        const editora = {
            nome: document.getElementById('nome').value,
            gerente: document.getElementById('gerente').value,
            email: document.getElementById('email').value,
            endereco: document.getElementById('endereco').value,
            celular: document.getElementById('celular').value,
            telefone: document.getElementById('telefone').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createEditora(editora)
            updateTable()
            closeModal()
        } else {
            updateEditora(index, editora)
            updateTable()
            closeModal()
        }
    }
}

//Tabela de Apresentação
const createRow = (editora, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${editora.nome}</td>
        <td>${editora.gerente}</td>
        <td>${editora.email}</td>
        <td>${editora.celular}</td>
        <td>${editora.telefone}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableEditora>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableEditora>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbEditora = readEditora()
    clearTable()
    dbEditora.forEach(createRow)
}

//Apresentação tabela modal e edição
const fillFields = (editora) => {
    document.getElementById('nome').value = editora.nome
    document.getElementById('gerente').value = editora.gerente
    document.getElementById('email').value = editora.email
    document.getElementById('endereco').value = editora.endereco
    document.getElementById('celular').value = editora.celular
    document.getElementById('telefone').value = editora.telefone 
    document.getElementById('nome').dataset.index = editora.index
}

const editEditora = (index) => {
    const editora = readEditora()[index]
    editora.index = index
    fillFields(editora)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editEditora(index)
        } else {
            const editora = readEditora()[index]
            let avisoDelete = document.querySelector('#avisoDelete')

            avisoDelete.textContent = `Deseja realmente excluir o editora ${editora.nome}`
            openModal2()

        // APAGAR O REGISTRO
            document.getElementById('apagar').addEventListener('click', () => {
                deleteEditora(index)
                updateTable()
                closeModal2()
            })
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarEditora')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('modalClose2')
    .addEventListener('click', closeModal2)

document.getElementById('salvar')
    .addEventListener('click', saveEditora)

document.querySelector('#tableEditora>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('cancelar2')
    .addEventListener('click', closeModal2)