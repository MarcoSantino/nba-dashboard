export async function interceptor(url: string, method = 'GET'): Promise<any> {
    const {
        REACT_APP_RAPIDAPI_KEY,
        REACT_APP_RAPIDAPI_HOST
    } = process.env;
    const response = await fetch(url, {
        method,
        headers: {
            "x-rapidapi-key": REACT_APP_RAPIDAPI_KEY as string,
            "x-rapidapi-host": REACT_APP_RAPIDAPI_HOST as string
        }
    })

    const body = await response.json();

    return body;
}