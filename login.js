const storedUsers = JSON.parse(localStorage.getItem("bankUsers")) || [];
//fn to find index
function findIndex(email) {
    const storedUsers = JSON.parse(localStorage.getItem("bankUsers")) || [];
    return storedUsers.findIndex(user => user.email === email);
}
//fn to check if email already exist
function emailExist(email) {
    const storedUser = JSON.parse(localStorage.getItem("bankUsers")) || [];
    return storedUser.some(user => user.email === email);
}
//fn to check if password matches
function passwordMatch(email, pass) {
    const storedUser = JSON.parse(localStorage.getItem("bankUsers")) || [];
    const matchedUser = storedUser.find(user => user.email === email);
    return matchedUser && matchedUser.pass == pass;
}
//fn to check email format
function emailCheck(email) {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailTest.test(email);
}
//fn to move user to end
function moveUser(storedUsers, target) {

    const targetIndex = findIndex(target);
    if (targetIndex !== -1) {
        const usertoMove = storedUsers.splice(targetIndex, 1)[0];
        storedUsers.push(usertoMove);
        console.log(usertoMove)
    }
    return storedUsers;
}
function login() {
    //values from form
    const emailForm = document.getElementById("email");
    const passForm = document.getElementById("password");

    //trim value
    const email = emailForm.value.trim();
    const pass = passForm.value.trim();

    const errormsg = document.getElementById("error-msg");
    errormsg.textContent = "";

    // error msg 
    if (!email || !pass) {
        errormsg.textContent = "Please fill in all required fields.";
        return;
    }
    else if (!emailCheck(email)) {
        errormsg.textContent = "Please enter valid Email";
        return;
    }
    else if (!emailExist(email)) {
        errormsg.textContent = "User does not exist";
        return;
    }
    else if (!passwordMatch(email, pass)) {
        errormsg.textContent = "Password do not match";
        return;
    }
    if (errormsg.textContent == "") {
        const storedUsers = JSON.parse(localStorage.getItem("bankUsers")) || [];
        const target = email;

        const modifiedUser = moveUser(storedUsers, target);
        console.log(modifiedUser);
        localStorage.setItem("bankUsers", JSON.stringify(modifiedUser));


        //clear form
        emailForm.value = "";
        passForm.value = "";

        const storedNickname = JSON.parse(localStorage.getItem("nickname")) || [];
        storedNickname.splice(0, storedNickname.length);
        localStorage.setItem("nickname", JSON.stringify(storedNickname));


        window.location.href = "user.html";
    }
}
document.getElementById("login").addEventListener("click", () => {
    event.preventDefault();
    login();
})