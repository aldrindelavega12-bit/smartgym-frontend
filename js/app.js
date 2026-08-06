async function login() {

    const username =
    document.getElementById("username").value;

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

    // EMPTY CHECK
    if(!username || !password){

        error.innerText =
        "Please enter username and password";

        card.classList.add("shake");

        setTimeout(() => {

            card.classList.remove("shake");

        }, 400);

        return;
    }

    // LOADING
    btn.innerText = "Logging in...";
    btn.classList.add("loading");

    try {

        const response = await fetch(
            "https://smartgym-api-ia2e.onrender.com/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        console.log(data);

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

            // REDIRECT DELAY
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

            }, 1000);

        }

        // INVALID LOGIN
        else {

            error.innerText =
            data.message || "Invalid login";

            card.classList.add("shake");

            setTimeout(() => {

                card.classList.remove("shake");

            }, 400);

            // RESET BUTTON
            btn.innerText = "Log in";

            btn.classList.remove("loading");
        }

    }

    catch (err) {

        console.error(err);

        error.innerText =
        "Server error";

        card.classList.add("shake");

        setTimeout(() => {

            card.classList.remove("shake");

        }, 400);

        // RESET BUTTON
        btn.innerText = "Log in";

        btn.classList.remove("loading");
    }
}

// ==========================================
// Activation Link
// ==========================================

const API_URL = "https://smartgym-api-ia2e.onrender.com";

let activationToken = null;

window.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    activationToken = params.get("token");

    if (!activationToken) {

        return;

    }

    checkActivationToken();

});

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
        document.getElementById("activationName").innerHTML =
            `Welcome,<strong>${result.full_name}</strong>`;

        document.getElementById("activationModal").style.display = "flex";

    }

    catch (err) {

        console.error(err);

        alert("Unable to verify activation link.");

    }

}

async function activateAccount() {

    const username =
        document.getElementById("activationUsername").value.trim();

    const password =
        document.getElementById("activationPassword").value;

    const confirm =
        document.getElementById("activationConfirm").value;

    if (!username || !password || !confirm) {

        alert("Please complete all fields.");
        return;

    }

    if (password !== confirm) {

        alert("Passwords do not match.");
        return;

    }

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

        if (!result.success) {

            alert(result.message);
            return;

        }

        alert("Account activated successfully!");

        // Close modal
        document.getElementById("activationModal").style.display = "none";

        // Remove token from URL
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

    }

    catch (err) {

        console.error(err);

        alert("Unable to activate account.");

    }

}