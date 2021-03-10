export async function interceptor(url: string, method = 'GET'): Promise<any> {
    const response = await fetch(url, {
        method,
        headers: {
            "x-rapidapi-key": '1e33b37031msh113802dd83ed5d5p1c5a21jsnb93136ed6aef',
            "x-rapidapi-host": 'api-nba-v1.p.rapidapi.com'
        }
    })

    const body = await response.json();

    return body;
}