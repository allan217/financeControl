const Modal = {
	open() {
		document.querySelector('.modal-overlay').classList.add('active');
		Form.clearFields();
},
	close() {
		document.querySelector('.modal-overlay').classList.remove('active');
}
}

const Storage = {
get() {
	return JSON.parse(localStorage.getItem("control.finances:transaction-Setembro")) || []
},
set(transactions) {
	localStorage.setItem("control.finances:transaction-Setembro", JSON.stringify(transactions))
}
}

const ModalRem = {
	open() {
		document.querySelector('.modal-remove').classList.add('active');
		
  },
	close() {
		document.querySelector('.modal-remove').classList.remove('active');
  }
}

const Transaction = {
all: Storage.get(),
add(transaction) {
	Transaction.all.push(transaction)
	App.reload()
},
remove(index) {
	Transaction.all.splice(index, 1);
	App.reload();
},
edit(index, transaction) {
	Transaction.all[index] = transaction;
	App.reload();
},
selectSaid(index, transaction) {
	let sd = document.querySelector('#saida');
	let negativo = "-";
	
	if(sd) {
		negativo+Form.amount.value;
		console.log("Saida selecionada !");
        }
	
},
selectEnt(index, transaction) {
	let et = document.querySelector('#entrada');
	
	if(et) {
		Form.amount.value;
		console.log("Entrada selecionada !");
        }
	
},
incomes() {
	let income = 0;
	Transaction.all.forEach(transaction => {
		if(transaction.amount > 0) {
			income += transaction.amount;
		}	
	})
	
	return income;
},
expenses() {
	let expense = 0;
	Transaction.all.forEach(transaction => {
		if(transaction.amount < 0) {
			expense += transaction.amount;
		}	
	})
	
	return expense;
},
total() {
	return Transaction.incomes() + Transaction.expenses();
}
}

const DOM = {
transactionsContainer: document.querySelector('#data-table tbody'),

addTransaction(transaction, index) {
	const tr = document.createElement('tr')
	tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
	tr.dataset.index = index

	DOM.transactionsContainer.appendChild(tr)
},
innerHTMLTransaction(transaction, index) {
	const CSSclasses = transaction.amount > 0 ? "income" : "expense"

	const amount = Utils.formatCurrency(transaction.amount)

	const html = `		
			<td class="description">${transaction.description}</td>
			<td class="${CSSclasses}">${amount}</td>
			<td class="date">${transaction.date}</td>
		<td>
			<img onclick="Transaction.remove(${index}), ModalRem.open()" src="../assets/minus.svg" alt="Remover Transação">
			<img onclick="Form.edit(${index})" id="editTrans" src="../assets/edit.png" alt="Edição">
		</td>
		` 
	return html
},

updateBalance() {
	document
	.getElementById('incomeDisplay')
	.innerHTML = Utils.formatCurrency(Transaction.incomes())
	document
	.getElementById('expenseDisplay')
	.innerHTML = Utils.formatCurrency(Transaction.expenses())
	document
	.getElementById('totalDisplay')
	.innerHTML = Utils.formatCurrency(Transaction.total())
},
clearTransactions() {
	DOM.transactionsContainer.innerHTML = ""
}
}

const Utils = {
formatAmount(value) {
	value = value * 100
	return Math.round(value)
},
formatDate(date) {
	const splittedDate = date.split("-")
	return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
},
formatCurrency(value) {
	const signal = Number(value) < 0 ? "-" : ""
	value = String(value).replace(/\D/g, "")
	
	value = Number(value) / 100

	value = value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	})
	
	return signal + value
}
}

const Form = {
id: 0,
description: document.querySelector('input#description'),
amount: document.querySelector('input#amount'),
date: document.querySelector('input#date'),
editingIndex: -1,

getValues() {
	return {
		id: Form.id.value,
		description: Form.description.value,
		amount: Form.amount.value,
		date: Form.date.value
	}
},
validateFields() {
	const {id, description, amount, date} = Form.getValues()
	if(
		description.trim() === "" ||
		amount.trim() === "" ||
		date.trim() === "") {
			throw new Error("Preencha todos os campos")
	}
},
formatValues() {
	let {id, description, amount, date} = Form.getValues()
	amount = Utils.formatAmount(amount)
	date = Utils.formatDate(date)

	return {
		id,
		description,
		amount,
		date
	}
},
saveTransacition(transaction) {
	if(Form.editingIndex < 0){
		Transaction.add(transaction)
	}else{
		Transaction.edit(Form.editingIndex, transaction)
	}

	Form.editingIndex = -1;
},
clearFields() {
	Form.id.value = ""
	Form.description.value = ""
	Form.amount.value = ""
	Form.date.value = ""
},
edit(index) {
	Modal.open();
	Form.editingIndex = parseInt(index);

	let {amount, date, description} = Transaction.all[index];
	amount = amount / 100;

	const dateArr = date.split('/');
	const strDate = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;

	Form.description.value = description;
	Form.amount.value = amount;
	Form.date.value = strDate;
},
submit(event) {
	event.preventDefault()
	try {
		
		Form.validateFields()
		
		const transaction = Form.formatValues()
		
		Form.saveTransacition(transaction)
		
		Form.clearFields()
		
		Modal.close()			

	}catch (error) {
		alert(error.message)
	}
	
}
}

Storage.get()

const App = {
init() {

	Transaction.all.forEach(DOM.addTransaction)
	
	DOM.updateBalance()

	Storage.set(Transaction.all)

},
reload() {
	DOM.clearTransactions()
	App.init()
}
}

App.init()