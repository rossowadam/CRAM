// Take in data of the section and send it to the endpoint.
// Robustly throw errors based on backend response.
export async function createSection(data: {
    title: string;
    subtitle: string;
    content: string;
    // timestamp is added in the backend: time of storage
    }) {

    // build the request
    const response = await fetch("/api/v1/sections/create", {
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
            case 401:
                throw new Error("Only logged-in users may create sections");
            case 409:
            case 422:
                throw new Error(body.error); // known errors
            default:
                throw new Error("Something went wrong. Please try again.");
        }
    }

    return body;
}