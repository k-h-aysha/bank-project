const sessionUser = JSON.parse(sessionStorage.getItem("bankUsers")) || [];
const storedUser = JSON.parse(localStorage.getItem("bankUsers")) || [];
console.log(sessionUser);
let currentAction = "none";
let recentAction = null;


// get last logedin username
const userName = sessionUser.name;
const userAccno = sessionUser.accno;
const userEmail = sessionUser.email;
const userPhno = sessionUser.ph_no;
const userAddress = sessionUser.address;
const userPass = sessionUser.pass;
const userMpin = sessionUser.mpin;
let storedHistory = sessionUser.transaction;
const userpercent = sessionUser.percent;
let balance = sessionUser.bal;

// change name of user in the heading 
document.getElementById("main-name").textContent = `Hello ${userName}!`;
document.getElementById("balance").textContent = "$" + balance;
setRecent();

// change name and acc no of user in right heading 
document.getElementById("right-acc-name").textContent = userName;
document.getElementById("right-acc-no").textContent = userAccno;




//fn to blur background
function blur() {
    document.getElementById("body").style.filter = "blur(5px)";
    document.getElementById("body").style.pointerEvents = "none";
    event.stopPropagation();
}

//fn to unblur background
function unblur() {
    document.getElementById("body").style.filter = "none";
    document.getElementById("body").style.pointerEvents = "all";
}

//fn to update balance
function updateBal(newBalance) {
    sessionUser.bal = newBalance.toString();
    sessionStorage.setItem("bankUsers", JSON.stringify(sessionUser));
}

//nickname
let nickname = null;
//change recent transactions
function recentPeople(nickname, sendAccno) {
    const storedNickname = JSON.parse(sessionStorage.getItem("nickname")) || [];
    //check if accno already made transfer
    const recentUserExist = storedNickname.findIndex(user => user.sendAccno === sendAccno)
    //new transaction
    console.log(recentUserExist)
    if (recentUserExist == -1) {

        const recent = {
            nickname,
            sendAccno,
        }
        const updateNickname = [...storedNickname, recent];
        if (updateNickname.length > 5) {
            updateNickname.shift();
        }
        sessionStorage.setItem("nickname", JSON.stringify(updateNickname));
        console.log(updateNickname);
    }
    if (storedNickname.length > 5) {
        storedNickname.shift();
    }
}


//recents
function setRecent() {
    const storedNickname = JSON.parse(sessionStorage.getItem("nickname")) || [];
    const count = Math.min(storedNickname.length, 5);
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`recent${i}`).textContent = "";
    }
    for (let i = 1; i <= count; i++) {
        document.getElementById(`recent${i}`).textContent = storedNickname[storedNickname.length - i].nickname;
    }
}


//when any recent is clicked
let recentAccno = null;
for (let i = 1; i <= 5; i++) {
    document.getElementById(`people${i}`).addEventListener("click", () => {
        event.preventDefault();
        recentAction = "hello";
        document.getElementById("popup-heading").textContent = "Transfer";
        currentAction = "Transfer"
        const storedNickname = JSON.parse(sessionStorage.getItem("nickname")) || [];
        recentAccno = storedNickname[storedNickname.length - i].sendAccno;
        openMoneyVerify();
        console.log(recentAccno);
    })
}


// //progress bar



//fn to update progress bar
//for each transfer of $2 1% will increase
function updateProgress(amount) {
    // const increment = 1;
    const rewardAmount = 5;

    const sessionUser = JSON.parse(sessionStorage.getItem("bankUsers")) || [];
    const currentUser = sessionUser.percent;
    let currentPercentage = parseInt(currentUser);
    console.log(typeof amount)
    let newPercentage = currentPercentage + (amount / 2);

    document.getElementById("progress").style.width=`${newPercentage}%`;
    document.getElementById("progress-txt").textContent=`${newPercentage}%`;

    if(newPercentage<=100){
    currentPercentage=newPercentage.toString();
    sessionUser.percent=currentPercentage;
    sessionStorage.setItem("bankUsers", JSON.stringify(sessionUser));
    }
    if (newPercentage > 100) {
        newPercentage=newPercentage-100;
        currentPercentage=newPercentage.toString();
        let newBalance = parseInt(bankBalance) + rewardAmount;
        updateBal(newBalance);
        sessionUser.percent=currentPercentage;
        sessionStorage.setItem('bankUsers', JSON.stringify(sessionUser));
    }

}

// when home is clicked 
document.getElementById("home").addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("popup").style.display = "flex";
    document.getElementById("popup").style.height = "35vh";
    document.getElementById("popup").style.top = "25vh";
    document.getElementById("exit").style.display = "flex";
    blur();

});

document.getElementById("exit-yes").addEventListener("click",()=>{
    event.preventDefault();
    window.location.href = "home.html";
})
document.getElementById("exit-no").addEventListener("click",()=>{
    event.preventDefault();
    closePopup();
})

//my account is clicked 
const myaccBtn = document.getElementById("myacc-btn");

//popup 
myaccBtn.addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("myacc").style.display = "block";
    blur();
});


// close myacc popup 
document.getElementById("close-myacc").addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("myacc").style.display = "none";
    unblur();
});
//edit details in my account
document.getElementById("myacc-name").textContent = userName;
document.getElementById("myacc-no").textContent = userAccno;
document.getElementById("myacc-email").textContent = userEmail;
document.getElementById("myacc-phno").textContent = userPhno;
document.getElementById("myacc-address").textContent = `${userAddress.house},${userAddress.pin},${userAddress.state}`;


//close all popup
function closePopup() {
    document.getElementById("popup").style.height = "77vh";
    document.getElementById("popup").style.top = "15vh";
    document.getElementById("popup").style.display = "none";
    document.getElementById("select-people").style.display = "none";
    document.getElementById("money-verify").style.display = "none";
    document.getElementById("success").style.display = "none";
    document.getElementById("transactionHistory").style.display = "none";

    unblur();
}
document.getElementById("close-popup").addEventListener("click", () => {
    event.preventDefault();
    closePopup();
});


//fn when a service is clicked (deposit and withdraw)
function openMoneyVerify() {
    document.getElementById("popup").style.display = "flex";
    document.getElementById("money-verify").style.display = "flex";
    document.getElementById("error-msg2").textContent = "";
    document.getElementById("body").style.filter = "blur(5px)";
    document.getElementById("body").style.pointerEvents = "none";
    event.stopPropagation();
}


//fn to verify mpin and money
// let amount=null;
function transaction() {
    const amountString = document.getElementById("amount")
    const amount = parseInt(amountString.value);
    const mpinForm = document.getElementById("mpin");
    const mpinDeposit = mpinForm.value;
    let bankBalance = sessionUser.bal;

    if (!amountString.value || !mpinForm.value) {
        document.getElementById("error-msg2").textContent = "Please fill required fields";
        console.log(aysha)
    }
    //if mpin is correct
    if (mpinDeposit === userMpin) {
        //clear form
        amountString.value = "";
        mpinForm.value = "";

        let newBalance;
        if (currentAction === "Deposit") {
            newBalance = parseInt(bankBalance) + amount;
        }
        else if ((currentAction === "Withdraw") && bankBalance >= amount) {
            newBalance = parseInt(bankBalance) - amount;
        }
        else if ((currentAction === "Transfer") && bankBalance >= amount) {
            // newBalance = parseInt(sessionUser[sessionUser.length - 1].bal) - amount;
            newBalance = parseInt(bankBalance) - amount;
        }
        else if (bankBalance < amount) {
            document.getElementById("error-msg2").textContent = "Insufficient balance";
            return;
        }
        updateBal(newBalance);
        console.log("balance" + bankBalance)
        console.log("newbalance" + newBalance)

        document.getElementById("balance").textContent = "$" + newBalance;
        // updateProgress(amount);

        document.getElementById("money-verify").style.display = "none";
        document.getElementById("success").style.display = "flex";
        document.getElementById("success-msg").textContent = currentAction + " successfull!";

        //transfer, user bal change
        if (currentAction === "Transfer") {
            if (recentAction == "hello") {
                sendAccno = recentAccno;
            }
            document.getElementById("popup-name").textContent = `Account holder: ${sendUserName(sendAccno)}`;
            document.getElementById("popup-accno").textContent = `A/c no: ${sendAccno}`;
            sendBalance = parseInt(storedUser[sendUserIndex(sendAccno)].bal) + amount;
            storedUser[sendUserIndex(sendAccno)].bal = sendBalance.toString();
            sessionStorage.setItem("bankUsers", JSON.stringify(sessionUser));
            recentPeople(nickname, sendAccno);
            console.log(amount);
            setRecent();
        }
        else {//normal deposit and withdraw
            document.getElementById("popup-name").textContent = `Account holder: ${userName}`;
            document.getElementById("popup-accno").textContent = `A/c no: ${userAccno}`;
        }

    } else {
        document.getElementById("error-msg2").textContent = "MPIN is incorrect";
    }
    TransHistory(amount);
    updateProgress(amount)
}

//fn to check if user exist
let sendUser = null;
function sendUserExist(sendAccno) {
    const storedUser = JSON.parse(localStorage.getItem("bankUsers")) || [];
    return storedUser.some(user => user.accno === sendAccno);
}


//fn to get send user name
function sendUserName(sendAccno) {
    const storedUser = JSON.parse(localStorage.getItem("bankUsers")) || [];
    const user = storedUser.find(user => user.accno === sendAccno);
    return user ? user.name : false;
}
//fn to find send user balance
function sendUserIndex(sendAccno) {
    const storedUser = JSON.parse(localStorage.getItem("bankUsers")) || [];
    return storedUser.findIndex(user => user.accno === sendAccno);
}

//fn to verify acc to transfer
let sendAccno = null;
function verifyPeople() {
    const accnoForm = document.getElementById("acc-no");
    const reAccnoForm = document.getElementById("reacc-no");
    const holderForm = document.getElementById("holder")
    const nicknameForm = document.getElementById("nickname");

    sendAccno = accnoForm.value;
    const reSendAccno = reAccnoForm.value;
    const holder = holderForm.value.trim().toUpperCase();
    nickname = nicknameForm.value.trim();


    if (!sendAccno || !reSendAccno || !holder || !nickname) {
        document.getElementById("error-msg1").textContent = "Please fill all required fields";
    }
    else if (sendAccno !== reSendAccno) {
        document.getElementById("error-msg1").textContent = "Account number does not match";
    }
    else if (!sendUserExist(sendAccno)) {
        document.getElementById("error-msg1").textContent = "Account number does not exist";
    }
    else if ((sendUserExist(sendAccno)) && (sendUserName(sendAccno) !== holder)) {
        document.getElementById("error-msg1").textContent = "Account holder name does not match";
    }

    if (document.getElementById("error-msg1").textContent == "") {
        //clear form
        accnoForm.value = "";
        reAccnoForm.value = "";
        holderForm.value = "";
        nicknameForm.value = "";
        currentAction = "Transfer";
        document.getElementById("select-people").style.display = "none";

        document.getElementById("popup-heading").textContent = "Transfer";
        openMoneyVerify();

    }
}
//fn to set MPIN
function setMpin() {
    const mpinForm = document.getElementById("forgotM-newMpin");
    const reMpinForm = document.getElementById("forgotM-reMpin");

    const newMpin = mpinForm.value.trim();
    const reMpin = reMpinForm.value.trim();

    if (!newMpin || !reMpin) {
        document.getElementById("error-msg4").textContent = "Please fill all required fields";
    }
    else if (newMpin.length != 4) {
        document.getElementById("error-msg4").textContent = "Enter 4 digit MPIN";
    }
    else if (newMpin != reMpin) {
        document.getElementById("error-msg4").textContent = "MPIN does not match";
    }
    if (document.getElementById("error-msg4").textContent == "") {
        //clear form
        mpinForm.value = "";
        reMpinForm.value = "";

        //change mpin in local storage
        sessionUser.mpin = newMpin.toString();
        sessionStorage.setItem("bankUsers", JSON.stringify(sessionUser));

        document.getElementById("forgotM2").style.display = "none";
        document.getElementById("success").style.display = "flex";
        document.getElementById("success-msg").textContent = "MPIN changed successfull!";
        document.getElementById("popup-name").textContent = `Account holder: ${userName}`;
        document.getElementById("popup-accno").textContent = `A/c no: ${userAccno}`;
    }
}


//fn to verify MPIN change
function changeMpin() {
    const emailForm = document.getElementById("forgotM-email");
    const passForm = document.getElementById("forgotM-pass");

    const emailMpin = emailForm.value.trim();
    const passMpin = passForm.value.trim();
    console.log(emailMpin)
    console.log(passMpin)
    if (!emailMpin || !passMpin) {
        document.getElementById("error-msg3").textContent = "Please fill all required fields";
    }
    else if (emailMpin != userEmail) {
        document.getElementById("error-msg3").textContent = "Please enter linked email";
    }
    else if (passMpin != userPass) {
        document.getElementById("error-msg3").textContent = "Incorrect password";
    }
    if (document.getElementById("error-msg3").textContent == "") {
        //clear form
        emailForm.value = "";
        passForm.value = "";

        document.getElementById("forgotM1").style.display = "none";
        document.getElementById("forgotM2").style.display = "flex";
        document.getElementById("error-msg4").textContent = "";
    }
}

//fn to make new rows for transaction history
// function updateTransactionDisplay() {
//     const tableBody = document.getElementById('table').getElementsByTagName('tbody')[0]; // Replace 'yourTableId' with the actual ID of your table
//     const tableRows = tableBody.querySelectorAll('tr');

//     let firstVisibleRow = true;
//     tableRows.forEach(row => {
//       if (firstVisibleRow && !row.classList.contains('hidden-row')) {
//         row.classList.add('hidden-row');
//         firstVisibleRow = false;
//       } else if (row.classList.contains('hidden-row')) {
//         row.classList.remove('hidden-row');
//         firstVisibleRow = true; // Reset flag for next iteration
//       }
//     });
//   }

//fn to make new row
function newTransaction(storedHistory) {
    //display transaction in table
    const tableBody = document.getElementById('transactionTableBody');
    //  const numRows = tableBody.children.length;
    tableBody.innerHTML = '';
    const row = storedHistory.length;
    //    console.log(numRows)
    console.log(storedHistory)
    console.log(row)
    // console.log(storedHistory[1].type)
     
    let j=row-1;
        for (let i = 0; i < storedHistory.length; i++) {
            const newRow = document.createElement('tr');
            const dateCell = document.createElement('td');
            dateCell.textContent = storedHistory[j].date;

            const typeCell = document.createElement('td');
            typeCell.textContent = storedHistory[j].type;

            const amountCell = document.createElement('td');
            amountCell.textContent = storedHistory[j].amount;

            newRow.appendChild(dateCell);
            newRow.appendChild(typeCell);
            newRow.appendChild(amountCell);

            tableBody.appendChild(newRow);
            j--;
        }
    
}
newTransaction(storedHistory)

//fn to update transaction history
function setHistory() {
    // const sessionUser = JSON.parse(localStorage.getItem("bankUsers")) || [];
    const count = Math.min(storedHistory.length, 5);
    for (let i = 1; i <= 5; i++) {
        document.getElementsByTagName(td)[i].textContent = "";
    }
    for (let i = 1; i <= count; i++) {
        document.getElementsByTagName(td).textContent = "";
    }

}


//fn to update transaction history
function TransHistory(amount) {
    const sessionUser = JSON.parse(sessionStorage.getItem("bankUsers")) || [];
    console.log(sessionUser)
    console.log(storedHistory)
    let updateHistory;

    const history = {
        date: new Date().toLocaleDateString(),
        type: "",
        amount
    }
    if (currentAction == "Deposit") {
        history.type = "Deposit"
        history.amount = amount;
    }
    else if (currentAction == "Withdraw") {
        history.type = "Withdraw"
        history.amount = amount;
    }
    else if (currentAction == "Transfer") {
        history.type = `to ${sendUserName(sendAccno)}`;
        history.amount = amount;
    }
    if (storedHistory.length > 0) {
        updateHistory = [...storedHistory, history];
    } else {
        updateHistory = [history]; // Create a new array with just the new transaction
        console.log("No existing transaction history found.");
    }

    if (updateHistory.length > 6) {
        updateHistory.shift();
    }
    storedHistory = updateHistory;
    sessionUser.transaction = updateHistory
    sessionStorage.setItem("bankUsers", JSON.stringify(sessionUser));
    console.log(updateHistory);
    console.log(sessionUser);

    newTransaction(updateHistory);

}

console.log(sessionUser)

//deposit is clicked
document.getElementById("deposit").addEventListener("click", () => {
    event.preventDefault();
    currentAction = "Deposit";
    document.getElementById("popup-heading").textContent = "Deposit";
    openMoneyVerify();
})

//send is clicked to deposit or withdraw money
document.getElementById("send").addEventListener("click", () => {
    event.preventDefault();
    transaction();

})

//successful service
document.getElementById("done").addEventListener("click", () => {
    event.preventDefault();
    closePopup();

})

//withdraw is clicked
document.getElementById("withdraw").addEventListener("click", () => {
    event.preventDefault();
    currentAction = "Withdraw";
    document.getElementById("popup-heading").textContent = "Withdraw";
    openMoneyVerify();
});

// transfer is clicked 
document.getElementById("transfer1").addEventListener("click", () => {
    event.preventDefault
    document.getElementById("popup").style.display = "flex";
    document.getElementById("select-people").style.display = "flex";
    recentAction = null;
    document.getElementById("error-msg1").textContent = "";
    blur();

});

//verify is clicked
document.getElementById("verify").addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("error-msg1").textContent = "";
    verifyPeople();
});

//forgot mpin is clicked
document.getElementById("forgotMpin").addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("popup").style.display = "flex";
    document.getElementById("forgotM1").style.display = "flex";
    document.getElementById("forgotM2").style.display = "none";
    document.getElementById("popup").style.height = "67vh";
    document.getElementById("error-msg3").textContent = "";
    blur();
})

//to verify email and password to change mpin clicked
document.getElementById("submit").addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("error-msg3").textContent = "";
    changeMpin();
})

// to set new mpin 
document.getElementById("confirm-mpin").addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("error-msg4").textContent = "";
    setMpin();
})

// transfer 2 is clicked 
document.getElementById("transfer2").addEventListener("click", () => {
    event.preventDefault
    document.getElementById("popup").style.display = "flex";
    document.getElementById("select-people").style.display = "flex";
    recentAction = null;
    document.getElementById("error-msg1").textContent = "";
    blur();

});

// history is clicked 
document.getElementById("history").addEventListener("click", () => {
    event.preventDefault
    document.getElementById("popup").style.display = "flex";
    document.getElementById("transactionHistory").style.display = "flex";
    blur();

});

//account details is clicked
document.getElementById("accDetails").addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("myacc").style.display = "block";
    blur();
});


//logout is clicked
document.getElementById("logout-btn").addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("popup").style.display = "flex";
    document.getElementById("popup").style.height = "35vh";
    document.getElementById("popup").style.top = "25vh";
    document.getElementById("exit").style.display = "flex";
    localStorage.setItem("bankUsers",sessionUser)
    blur();
});