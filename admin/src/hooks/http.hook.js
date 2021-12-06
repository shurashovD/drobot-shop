import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useAlert } from "./alert.hook"

export const useHttp = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const { errorAlert } = useAlert()
    const { id } = useSelector(state => state.authState)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        headers['Content-Type'] = 'application/json'
        headers['Authorization'] = `Base ${id}`
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

            setLoading(false)
            return result
        }
        catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [id])

    const sendFormData = useCallback( async (url, data, files, headers = {}) => {
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

        headers['Authorization'] = `Base ${id}`
        for ( let [key, value] of Object.entries(headers) ) {
            xhr.setRequestHeader(key, value)
        }

        try {
            return await new Promise((resolve, reject) => {
                setProgress(0)
                setLoading(true)
                xhr.send(formData)
                xhr.upload.onprogress = event =>  {
                    setProgress(parseInt(100 * event.loaded / event.total))
                }
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
                            setProgress(0)
                            setLoading(false)
                            resolve(response)
                        }
                        reject(response)
                    }
                }
            })
        }
        catch (e) {
            setProgress(0)
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [id])

    const getFile = useCallback(async (url) => {
        setLoading(true)
        const headers = {}
        headers['Authorization'] = `Base ${id}`
        try {
            const response = await fetch(url, { method: 'GET', body: null, headers })
            const result = await response.blob()

            if ( !response.ok ) {
                throw new Error(result.message || 'SERVER ERROR')
            }

            setLoading(false)
            return result
        }
        catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [id])

    const clearError = useCallback(() => setError(null), [])

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, clearError, errorAlert])

    return { request, sendFormData, getFile, loading, progress, error, clearError } 
}