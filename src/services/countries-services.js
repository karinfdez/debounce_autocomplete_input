
export default function fetchData(url='', dataRequest={}) {
    return new Promise((resolve, reject) => {
        fetch(url, dataRequest)
        .then((response) => {
            return response.json();
        })
        .then((jsonResult) => {
            resolve(jsonResult)
        }).catch((err) => {
            reject(Error(err.message));
        });
    })
}