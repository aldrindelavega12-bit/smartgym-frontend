async function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const error =
        document.getElementById("error");

    const btn =
        document.getElementById("loginBtn");

    const card =
        document.querySelector(".login-card");


    // CLEAR ERROR
    error.innerText = "";


    // EMPTY USERNAME
    if (!username) {

        error.innerText =
            "Please enter your username.";

        card.classList.add("shake");

        setTimeout(() => {
            card.classList.remove("shake");
        }, 400);

        return;
    }


    // EMPTY PASSWORD
    if (!password) {

        error.innerText =
            "Please enter your password.";

        card.classList.add("shake");

        setTimeout(() => {
            card.classList.remove("shake");
        }, 400);

        return;
    }


    // LOADING
    btn.disabled = true;

    btn.innerText =
        "Logging in...";

    btn.classList.add("loading");


    try {

        const response = await fetch(
            `${API_URL}/api/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );


        const data =
            await response.json();


        console.log("LOGIN:", data);


        // SUCCESS
        if (data.status === "success") {

            // SAVE USER
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // SUCCESS POPUP
            const popup =
                document.createElement("div");

            popup.className =
                "success-popup";

            popup.innerText =
                "✅ Login successful";

            document.body.appendChild(popup);


            // REDIRECT
            setTimeout(() => {

                if (data.user.role === "pre_member") {

                    window.location.href =
                        "pre_member.html";

                }

                else if (data.user.role === "member") {

                    window.location.href =
                        "member.html";

                }

                else if (data.user.role === "staff") {

                    window.location.href =
                        "staff.html";

                }

                else if (data.user.role === "trainer") {

                    window.location.href =
                        "trainer.html";

                }

                else if (data.user.role === "admin") {

                    window.location.href =
                        "admin.html";

                }

                else {

                    // Unknown role
                    error.innerText =
                        "Account role is not recognized.";

                    btn.disabled = false;

                    btn.innerText =
                        "Log in";

                    btn.classList.remove(
                        "loading"
                    );

                    popup.remove();
                }

            }, 1000);

            return;
        }


        // INVALID LOGIN
        error.innerText =
            data.message ||
            "Invalid username or password.";

        card.classList.add("shake");

        setTimeout(() => {
            card.classList.remove("shake");
        }, 400);


        // RESET BUTTON
        btn.disabled = false;

        btn.innerText =
            "Log in";

        btn.classList.remove("loading");

    }


    catch (err) {

        console.error(
            "LOGIN ERROR:",
            err
        );


        error.innerText =
            "Unable to connect to server.";

        card.classList.add("shake");

        setTimeout(() => {
            card.classList.remove("shake");
        }, 400);


        // RESET BUTTON
        btn.disabled = false;

        btn.innerText =
            "Log in";

        btn.classList.remove("loading");

    }

}
// ==========================================
// ACTIVATION
// ==========================================

const API_URL = "https://smartgym-api-ia2e.onrender.com";

let activationToken = null;

// CHECK LINK
window.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    activationToken = params.get("token");

    if (!activationToken) {

        return;

    }

    checkActivationToken();

});

// VERIFY TOKEN
async function checkActivationToken() {

    try {

        const response = await fetch(

            `${API_URL}/api/activation/${activationToken}`

        );

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            alert(result.message);

            return;

        }

        document.getElementById(
            "activationModal"
        ).style.display = "flex";

    }

    catch (err) {

        console.error(err);

        alert("Unable to verify activation link.");

    }

}

// CLOSE
function closeActivationModal() {

    document.getElementById(
        "activationModal"
    ).style.display = "none";

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );

}

// ACTIVATE ACCOUNT
async function activateAccount() {

    const username =
    document.getElementById(
        "activationUsername"
    ).value.trim();

    const password =
    document.getElementById(
        "activationPassword"
    ).value;

    const confirm =
    document.getElementById(
        "activationConfirm"
    ).value;

    const btn =
    document.getElementById(
        "activateBtn"
    );

    if (username === "") {

        alert("Please enter username.");

        return;

    }

    if (password.length < 8) {

        alert("Password must be at least 8 characters.");

        return;

    }

    if (password !== confirm) {

        alert("Passwords do not match.");

        return;

    }

    btn.disabled = true;

    btn.innerText = "Activating...";

    try {

        const response = await fetch(

            `${API_URL}/api/activate_account`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    token: activationToken,

                    username: username,

                    password: password

                })

            }

        );

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            btn.disabled = false;

            btn.innerText = "Activate Account";

            alert(result.message);

            return;

        }

        alert("Account activated successfully!");

        closeActivationModal();

        window.location.href = "index.html";

    }

    catch (err) {

        console.error(err);

        alert("Server Error.");

        btn.disabled = false;

        btn.innerText = "Activate Account";

    }

}
