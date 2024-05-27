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

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_funcionario')) ?? []
const setLocalStorage = (dbFuncionario) => localStorage.setItem("db_funcionario", JSON.stringify(dbFuncionario))

// CRUD - create read update delete
const deleteFuncionario = (index) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario.splice(index, 1)
    setLocalStorage(dbFuncionario)
}

const updateFuncionario = (index, funcionario) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario[index] = funcionario
    setLocalStorage(dbFuncionario)
}

const readFuncionario = () => getLocalStorage()

const createFuncionario = (funcionario) => {
    const dbFuncionario = getLocalStorage()
    dbFuncionario.push (funcionario)
    setLocalStorage(dbFuncionario)
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
const saveFuncionario = () => {
    debugger
    if (isValidFields()) {
        const funcionario = {
            nome: document.getElementById('nome').value,
            matricula: document.getElementById('matricula').value,
            telefone: document.getElementById('telefone').value,
            celular: document.getElementById('celular').value,
            email: document.getElementById('email').value,
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            cpf: document.getElementById('cpf').value,
            funcao: document.getElementById('funcao').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createFuncionario(funcionario)
            updateTable()
            closeModal()
        } else {
            updateFuncionario(index, funcionario)
            updateTable()
            closeModal()
        }
    }
}

//Tabela de Apresentação
const createRow = (funcionario, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${funcionario.nome}</td>
        <td>${funcionario.matricula}</td>
        <td>${funcionario.cpf}</td>
        <td>${funcionario.funcao}</td>
        <td>${funcionario.celular}</td>
        <td>${funcionario.email}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableFuncionario>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableFuncionario>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbFuncionario = readFuncionario()
    clearTable()
    dbFuncionario.forEach(createRow)
}

//Apresentação tabela modal
const fillFields = (funcionario) => {
    document.getElementById('nome').value = funcionario.nome
    document.getElementById('matricula').value = funcionario.matricula
    document.getElementById('telefone').value = funcionario.telefone
    document.getElementById('celular').value = funcionario.celular
    document.getElementById('email').value = funcionario.email
    document.getElementById('rua').value = funcionario.rua
    document.getElementById('numero').value = funcionario.numero
    document.getElementById('complemento').value = funcionario.complemento
    document.getElementById('cidade').value = funcionario.cidade
    document.getElementById('estado').value = funcionario.estado
    document.getElementById('cpf').value = funcionario.cpf
    document.getElementById('funcao').value = funcionario.funcao   

    document.getElementById('nome').dataset.index = funcionario.index
}

const editFuncionario = (index) => {
    const funcionario = readFuncionario()[index]
    funcionario.index = index
    fillFields(funcionario)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editFuncionario(index)
        } else {
            const funcionario = readFuncionario()[index]
            let avisoDelete = document.querySelector('#avisoDelete')

            avisoDelete.textContent = `Deseja realmente excluir o funcionario ${funcionario.nome}`
            openModal2()

        // APAGAR O REGISTRO
            document.getElementById('apagar').addEventListener('click', () => {
                deleteFuncionario(index)
                updateTable()
                closeModal2()
            })
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarFuncionario')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('modalClose2')
    .addEventListener('click', closeModal2)

document.getElementById('salvar')
    .addEventListener('click', saveFuncionario)

document.querySelector('#tableFuncionario>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('cancelar2')
    .addEventListener('click', closeModal2)