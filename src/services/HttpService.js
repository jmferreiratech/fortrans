class HttpService {

    static getJSON(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.statusText);
                return response.json();
            });
    }
}

export default () => HttpService;
