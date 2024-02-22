const state = {
    earnings: 0,
    expense:0,
    net:0,
    transactions: [
        // {
        //     id: 5,
        //     text: "demo credit",
        //     amount: 500,
        //     type: "credit",
        // },
        // {
        //     id:3,
        //     text: "demo debit",
        //     amount: 400,
        //     type: "debit",
        // },
    ],
}

let isUpdate = false;
let tid;



const transactionFormEl = document.getElementById("transactionForm")

const renderTransactions = ()=> {
    const transactionContainerEl = document.querySelector(".transactions")
    const netAmountEl = document.getElementById("netAmount")
    const earningEl = document.getElementById("earning")
    const expenseEl = document.getElementById("expense")

    const transactions = state.transactions;

    let earning = 0;
    let expense = 0;
    let net = 0;
    transactionContainerEl.innerHTML = ""
    transactions.forEach((transaction)=>{
        const {id,amount,text,type} = transaction;
        const isCredit = type === "credit" ? true : false;
        const sign = isCredit ? "+" : "-";
        const transactionEl =`
         <div class="transaction" id="${id}">
                <div class="content" onclick="showEdit(${id})"> <div class="left">
                <p>${text}</p>
                <p>${sign} ₹ ${amount}</p>
            </div>
            <div class="${isCredit ? "credit": "debit"}">${isCredit ? "C": "D"}</div>
            </div><hr/>
                <div class="lower">
                    <div class="pen" onclick="handelEdit(${id})"><i class="fa-regular fa-pen-to-square"></i></div>
                    <div class="trash" onclick="handelDelete(${id})"><i class="fa-solid fa-trash"></i></div>
                </div>
        
        
           </div> `

                earning += isCredit ? amount : 0;
                expense += !isCredit ? amount : 0;
                net = earning - expense;

                transactionContainerEl.insertAdjacentHTML("afterbegin",transactionEl)
    })

     netAmountEl.innerHTML = `₹ ${net}`
     earningEl.innerHTML = `₹ ${earning}`
     expenseEl.innerHTML = `₹ ${expense}`
};


const addTransaction = (e) =>{
    e.preventDefault();

    
    const isEarn = e.submitter.id == "earnbtn" ? true : false;

    console.log(e);

    const formData = new FormData(transactionFormEl)
    const tData = {};
    formData.forEach((value,key) =>{
        tData[key] = value;
    } );
     console.log(tData);

      const{text, amount} = tData
    const transaction = {
        id: isUpdate ? tid : Math.floor(Math.random()*1000),
        text: text,
        amount: +amount,
        type: isEarn ? "credit" : "debit",

    };

    if(isUpdate){
        const tIndex = state.transactions.findIndex((t) => t.id === tid);
        state.transactions[tIndex] = transaction;
        isUpdate = false;
        tid = null;
    }else{
        state.transactions.push(transaction)
    }

   
    renderTransactions()

    console.log({state});
}
const showEdit = (id)=>{
    const selectedTransaction = document.getElementById(id)
    const lowerEl = selectedTransaction.querySelector(".lower")

    lowerEl.classList.toggle("show")
}
const handelEdit = (id)=>{
    const transaction = state.transactions.find((t) => t.id === id);
    const {text, amount} = transaction;
    const textInput = document.getElementById("text");
    const amountInput = document.getElementById("amount")
    textInput.value = text;
    amountInput.value = amount;
    tid = id;
    isUpdate = true;

    console.log({text,amount});
};
const handelDelete = (id)=>{
    const filteredTransaction = state.transactions.filter((t)=> t.id !== id);
    state.transactions = filteredTransaction;
    renderTransactions()
};
renderTransactions();
transactionFormEl.addEventListener("submit",addTransaction)