let users = []; //array of all users 
function signup() { //this fn is called whet submt clicked

    //value from form is obtained
    const nameForm = document.getElementById("name");
    const emailForm = document.getElementById("email");
    const passForm = document.getElementById("pass");
    const repassForm = document.getElementById("re_pass");


    //trim values obtained
    const uname = nameForm.value.trim();
    const name = uname.toUpperCase();
    const email = emailForm.value.trim();
    const pass = passForm.value.trim();
    const re_pass = repassForm.value.trim();

    const errormsg = document.getElementById("error-msg1");
    errormsg.textContent = "" //clear existing error msg


    // error msg 
    if (!name || !email || !pass || !re_pass) {
        errormsg.textContent = "Please fill in all required fields.";
        return;
    }
    else if (!emailCheck(email)) {
        errormsg.textContent = "Please enter valid Email";
        return;
    }
    else if (emailExist(email)) {
        errormsg.textContent = "Email already exist";
        return;
    }
    else if (pass.length < 8) {
        errormsg.textContent = "Password must contain atleast 8 characters";
        return;
    }
    else if (pass != re_pass) {
        errormsg.textContent = "Password do not match";
        return;
    }
    //hashing can be added

    // generate acc number
    function generateAccno() {
        const random = Math.floor(Math.random() * 1000000);
        return random.toString().padStart(6, "0");
    }

    //check if acc already exist
    let isUnique = false;
    let storedUsers = JSON.parse(localStorage.getItem("bankUsers")) || [];
    let checkAccno;
    while (!isUnique) {
        checkAccno = generateAccno();
        isUnique = !storedUsers.some(user => user.accno === checkAccno);
    }
    //user 

    const user = {
        name,
        email,
        pass,
        bal: "0",
        mpin,
        percent:"0",
        address: {
            house: "",
            pin: "",
            state: "Kerala",
        },
        transaction: [],
        accno: checkAccno,
        ph_no: ""
    }
    //clear form
    nameForm.value = "";
    emailForm.value = "";
    passForm.value = "";
    repassForm.value = "";

    //registration successfull
    if (errormsg.textContent == "") {
        // assign hero sub to variables
        const heroSub1 = document.getElementById("hero-sub1");
        const heroSub2 = document.getElementById("hero-sub2");

        //change their style
        heroSub1.style.display = "none";
        heroSub2.style.display = "flex";

        //signup second part
        function signupsub(user) {
            const phnoForm = document.getElementById("phno");
            const addressForm = document.getElementById("address");
            const pinForm = document.getElementById("pin-no");
            const mpinForm = document.getElementById("mpin");
            const rempinForm = document.getElementById("rempin");

            user.ph_no = phnoForm.value.trim();
            const mPin = mpinForm.value.trim();
            const rempin = rempinForm.value.trim();
            user.address.house = addressForm.value.trim();
            user.address.pin = pinForm.value.trim();

            console.log(user)
            const errormsg = document.getElementById("error-msg2");
            errormsg.textContent = "" //clear existing error msg

            // error msg 
            //check if mpin matches
            if(mPin != rempin) {
                errormsg.textContent = "MPIN do not match";
                return;
            }
            //check phn and pin length
            else if (phnoForm.value.length < 10) {
                errormsg.textContent = "phone no must contain 10 digits";
                return;
            }
            else if (pinForm.value.length < 6) {
                errormsg.textContent = "PIN no must contain 6 digits";
                return;
            }
            else if (!phnoForm.value || !addressForm.value || !pinForm.value || !mpinForm.value || !rempinForm.value) {
                errormsg.textContent = "Please fill in all required fields.";
                return;
            };
            
            if (errormsg.textContent == "") {
                //store mpin
                user.mpin = mPin;

                //store in local storage
                const storedUsers = JSON.parse(localStorage.getItem("bankUsers")) || [];
                storedUsers.push(user);
                localStorage.setItem("bankUsers", JSON.stringify(storedUsers));

                //clear form
                phnoForm.value = "";
                addressForm.value = "";
                pinForm.value = "";
                mpinForm.value = "";
                rempinForm.value = "";

                console.log(user)
                const storedNickname = JSON.parse(localStorage.getItem("nickname")) || [];
                storedNickname.splice(0,storedNickname.length);
                localStorage.setItem("nickname",JSON.stringify(storedNickname));

                window.location.href = "user.html";
            }
        }
        document.getElementById("signup-done").onclick = function () {
            event.preventDefault();
            signupsub(user);
        };

        alert("Registration successful!");
    }
}

//fn to check email format
function emailCheck(email) {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailTest.test(email);
}

//fn to check if email already exist
function emailExist(email) {
    const storedUser = JSON.parse(localStorage.getItem("bankUsers")) || [];
    return storedUser.some(user => user.email === email);
}


//signup fn called when btn is clicked
document.getElementById("signup").onclick = function () {
    event.preventDefault();
    signup();

    console.log(users);
};





