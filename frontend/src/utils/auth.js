export async function isAuthenticated() {
    try {
        const response = await fetch("http://localhost:4000/auth/check", {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error(error);
        return false;
    }
}
