async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://smartgym-api-ia2e.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log(data);

        if (data.status === "success") {
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "member") {
                window.location.href = "member.html";
            } 
            else if (data.user.role === "staff") {
                window.location.href = "staff.html";
            } 
            else if (data.user.role === "admin") {
                window.location.href = "admin.html";
            }

        } else {
            document.getElementById("error").innerText = data.message;
        }

    } catch (error) {
        console.error(error);
        document.getElementById("error").innerText = "Server error";
    }
}