
const MODULE_ACCESS_API = "https://smartgym-api-ia2e.onrender.com";

async function checkModuleAccess() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Walang naka-login
    if (!user || !user.user_id) {
        window.location.href = "index.html";
        return false;
    }

    const currentModule = document.body.dataset.module;

    try {
        const response = await fetch(
            `${MODULE_ACCESS_API}/api/user/module-access/${encodeURIComponent(user.user_id)}`,
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Module access request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.modules)) {
            throw new Error("Invalid module access response.");
        }

        const allowedModules = new Set(data.modules);

        // Itago ang mga menu link at cards na walang access.
        document.querySelectorAll("[data-module]").forEach(element => {
            const moduleKey = element.dataset.module;

            if (moduleKey && !allowedModules.has(moduleKey)) {
                element.hidden = true;
            }
        });

        // I-block ang page kapag walang permission sa module nito.
        if (
            currentModule &&
            !allowedModules.has(currentModule)
        ) {
            document.body.innerHTML = `
                <main style="
                    max-width: 600px;
                    margin: 100px auto;
                    padding: 24px;
                    text-align: center;
                    font-family: Arial, sans-serif;
                ">
                    <h2>Access Denied</h2>
                    <p>
                        Wala kang permission para buksan ang module na ito.
                    </p>
                    <button
                        onclick="history.back()"
                        style="padding: 10px 18px; cursor: pointer;"
                    >
                        Go Back
                    </button>
                </main>
            `;

            return false;
        }

        return true;

    } catch (error) {
        console.error("Module access error:", error);

        document.body.innerHTML = `
            <main style="
                max-width: 600px;
                margin: 100px auto;
                padding: 24px;
                text-align: center;
                font-family: Arial, sans-serif;
            ">
                <h2>Unable to Verify Access</h2>
                <p>
                    Hindi ma-verify ang module permissions mo.
                    Pakisubukan ulit.
                </p>
                <button
                    onclick="location.reload()"
                    style="padding: 10px 18px; cursor: pointer;"
                >
                    Retry
                </button>
            </main>
        `;

        return false;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await checkModuleAccess();
});
