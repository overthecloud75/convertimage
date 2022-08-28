import React, { useState } from 'react'
import axios from 'axios'
import './fileUpload.css'

const FileUpload = () => {
    // file, drag, imgSrc, convertedImgSrc
    const [file, setFile] = useState()
    const [dragActive, setDragActive] = useState(false)
    const [imgSrc, setImgSrc] = useState('')
    const [convertedImgSrc, setConvertedImgSrc] = useState('')

    const handleChange = (e) => {
        handleFile(e.target.Files)
    }

    const handleFile = (fileList) => {
        setFile(fileList[0])
        setImgSrc(URL.createObjectURL(fileList[0]))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = '/uploadFile/'
        const formData = new FormData()
        console.log('file', file)
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

    // handle drag events
    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    const handleDrop = (e) => {
        setDragActive(false)
        handleFile(e.dataTransfer.files)
    };

    return (
        <div className="wrapper">
            <form 
                id="form-file-upload"
                onDragEnter={handleDrag} 
                onSubmit={handleSubmit}
            >
                <h1>File Upload</h1>
                <input 
                    type="file" 
                    id="input-file-upload"
                    onChange={handleChange}
                    accept="image/png, image/jpeg"
                />
                <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
                    <p>Drag and drop your file here or</p>
                    <button className="upload-button" type="submit">Upload</button>
                </label>
                { dragActive && 
                    <div 
                        id="drag-file-element" 
                        onDragEnter={handleDrag} 
                        onDragLeave={handleDrag} 
                        onDragOver={handleDrag} 
                        onDrop={handleDrop}
                    />
                }
            </form>
            <div className="image">
                {imgSrc&&
                    (
                        <img 
                            src={imgSrc}
                            alt=''
                        />
                    )
                }
                {convertedImgSrc&&
                    (
                        <img 
                            src={convertedImgSrc}
                            alt=''
                        />
                    )
                }
            </div>
        </div>
    )
}

export default FileUpload