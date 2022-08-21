import React, { useState } from 'react'
import axios from 'axios'

const FileUpload = () => {
    const [file, setFile] = useState()
    const [imgSrc, setImgSrc] = useState()
    const [convertedImgSrc, setConvertedImgSrc] = useState('')

    const handleChange = (e) => {
        setFile(e.target.files[0])
        setImgSrc(URL.createObjectURL(e.target.files[0]))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const url = '/uploadFile/'
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileName', file.name)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        try { 
            const res = await axios.post(url, formData, config) 
            console.log(res.data)
            setConvertedImgSrc('/images/' + res.data.filename)
        }
        catch(err) {
            console.log(err)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>React File Upload</h1>
                <input 
                    type="file" 
                    onChange={handleChange}
                    accept="image/png, image/jpeg"
                />
                <button type="submit">Upload</button>
            </form>
            <img 
                src={imgSrc}
                alt=''
            />
            {convertedImgSrc&&
                (
                    <img 
                    src={convertedImgSrc}
                    alt=''
                    />
                )
            }
        </>
    )
}

export default FileUpload