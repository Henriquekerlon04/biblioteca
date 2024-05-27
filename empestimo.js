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

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_emprestimo')) ?? []
const setLocalStorage = (dbEmprestimo) => localStorage.setItem("db_emprestimo", JSON.stringify(dbEmprestimo))

// CRUD - create read update delete
const deleteEmprestimo = (index) => {
    const dbEmprestimo = readEmprestimo()
    dbEmprestimo.splice(index, 1)
    setLocalStorage(dbEmprestimo)
}

const updateEmprestimo = (index, emprestimo) => {
    const dbEmprestimo = readEmprestimo()
    dbEmprestimo[index] = emprestimo
    setLocalStorage(dbEmprestimo)
}

const readEmprestimo = () => getLocalStorage()

const createEmprestimo = (emprestimo) => {
    const dbEmprestimo = getLocalStorage()
    dbEmprestimo.push (emprestimo)
    setLocalStorage(dbEmprestimo)
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
const saveEmprestimo = () => {
    debugger
    if (isValidFields()) {
        const emprestimo = {
            codigo: document.getElementById('codigo').value,
            tipo: document.getElementById('tipo').value,
            nome: document.getElementById('nome').value,
            livro: document.getElementById('livro').value,
            dtemprestimo: document.getElementById('dtemprestimo').value,
            dtdevolucao: document.getElementById('dtdevolucao').value
           
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createEmprestimo(emprestimo)
            updateTable()
            closeModal()
        } else {
            updateEmprestimo(index, emprestimo)
            updateTable()
            closeModal()
        }
    }
}

//Tabela de Apresentação
const createRow = (emprestimo, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${emprestimo.codigo}</td>
        <td>${emprestimo.nome}</td>
        <td>${emprestimo.livro}</td>
        <td>${emprestimo.dtemprestimo}</td>
        <td>${emprestimo.dtdevolucao}</td>
      
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableEmprestimo>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableEmprestimo>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbEmprestimo = readEmprestimo()
    clearTable()
    dbEmprestimo.forEach(createRow)
}

//Apresentação tabela modal
const fillFields = (emprestimo) => {
    document.getElementById('codigo').value = emprestimo.codigo
    document.getElementById('tipo').value = emprestimo.tipo
    document.getElementById('nome').value = emprestimo.nome
    document.getElementById('livro').value = emprestimo.livro
    document.getElementById('dtemprestimo').value = emprestimo.editora 
    document.getElementById('dtdevolucao').value = emprestimo.isbn 
}

const editEmprestimo = (index) => {
    const emprestimo = readEmprestimo()[index]
    emprestimo.index = index
    fillFields(emprestimo)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editEmprestimo(index)
        } else {
            const emprestimo = readEmprestimo()[index]
            let avisoDelete = document.querySelector('#avisoDelete')

            avisoDelete.textContent = `Deseja realmente excluir o emprestimo ${emprestimo.nome}`
            openModal2()

        // APAGAR O REGISTRO
            document.getElementById('apagar').addEventListener('click', () => {
                deleteEmprestimo(index)
                updateTable()
                closeModal2()
            })
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarEmprestimo')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('modalClose2')
    .addEventListener('click', closeModal2)

document.getElementById('salvar')
    .addEventListener('click', saveEmprestimo)

document.querySelector('#tableEmprestimo>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('cancelar2')
    .addEventListener('click', closeModal2)