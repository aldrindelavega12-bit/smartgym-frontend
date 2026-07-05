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