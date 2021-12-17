export const request = async (url, method = 'GET', body = null, headers = {}) => {
    headers['Content-Type'] = 'application/json'
    if ( body ) body = JSON.stringify(body)
    try {
        const response = await fetch(url, { method, body, headers })
        const data = await response.text()

        try {
            JSON.parse(data)
        }
        catch {
            throw new Error('INVALID SERVER RESPONSE')
        }

        const result = JSON.parse(data)

        if ( !response.ok ) {
            throw new Error(result.message || 'SERVER ERROR')
        }
        return result
    }
    catch (e) {
        throw e
    }
}

export const sendFormData = async (url, data, files, headers = {}) => {
    const formData = new FormData()
    for ( let [key, value] of Object.entries(data)) {
        formData.append(key, value)
    }
    
    for (let i in files) {
        const [fileKey, fileName] = Object.entries(files[i])[0]
        formData.append(fileKey, fileName)
    }
        
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    for ( let [key, value] of Object.entries(headers) ) {
        xhr.setRequestHeader(key, value)
    }

    try {
        return await new Promise((resolve, reject) => {
            xhr.send(formData)
            xhr.onreadystatechange = () => {
                if (parseInt(xhr.readyState) === 4) {
                    try {
                        JSON.parse(xhr.response)
                    }
                    catch {
                        reject({message: 'INVALID SERVER RESPONSE'})
                    }
                    const response = JSON.parse(xhr.response)
                    if ( parseInt(xhr.status) < 300 ) {
                        resolve(response)
                    }
                    reject(response)
                }
            }
        })
    }
    catch (e) {
        console.log(e);
        throw e
    }
}