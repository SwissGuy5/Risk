const defaultHeaders = {
    'content-type': 'application/json'
};
async function fetchServer(path, bodyObj, headers = defaultHeaders) {
    const res = await fetch(path, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyObj)
    });
    const data = await res.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}