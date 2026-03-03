// Take in data of the user and send it to the endpoint.
// Robustly throw errors based on backend response.
export async function createUser(data: {
    name: string;
    email: string;
    password: string;
    }) {

    // build the request
    const response = await fetch("/api/v1/user/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    // send the request
    const body = await response.json();

    // robustly throw errors
    if (!response.ok) {
        switch (response.status) {
            case 409:
            case 403:
            case 422:
                throw new Error(body.error); // known errors
            default:
                throw new Error("Something went wrong. Please try again.");
        }
    }

    return body;
}

export async function loginUser(data: {
    email: string;
    password: string;
}) {

    // build the request
    const response = await fetch("/api/v1/user/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const body = await response.json();

    // robustly throw errors
    if (!response.ok) {
        if (response.status === 403) {
            throw new Error(body.error);
        }
        throw new Error("Something went wrong. Please try again.");
    }

    return body;
}