import React, { useState, useRef } from 'react'
import axios from 'axios'
import './fileUpload.css'
import Canvas from '../Canvas/Canvas'

const FileUpload = () => {

    // useRef
    const canvasRef = useRef(null)
    const contextRef = useRef(null)

    // file, drag, imgSrc, convertedImgSrc
    const [file, setFile] = useState()
    const [dragActive, setDragActive] = useState(false)
    const [isDrawCanvas, setIsDrawCanvas] = useState(true)
    const [imgSrc, setImgSrc] = useState('')
    const [convertedImgSrc, setConvertedImgSrc] = useState('')
    const [canvasSize, setCanvasSize] = useState({height: 100, width: 100})

    const handleChange = (e) => {
        handleFile(e.target.files)
    }

    const handleFile = (files) => {
        setFile(files[0])
        setImgSrc(URL.createObjectURL(files[0]))
    }

    const handleClick = () => {
        if (imgSrc) {
            setIsDrawCanvas(false)
        }
    }

    // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC"
    const dataURLtoFile = (dataurl, name='mask.png') => {
        const arr = dataurl.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n) {
            u8arr[n - 1] = bstr.charCodeAt(n - 1)
            n -= 1 // to make eslint happy
        }
        return new File([u8arr], name, { type: mime })
    }

    // submit original image and mask image 
    const handleSubmit = async (e) => {
        e.preventDefault()

        // get maskfile 
        const maskFile = dataURLtoFile(canvasRef.current.toDataURL())
        
        const url = '/uploadFile/'
        let formData = new FormData()
        formData.append('file', file)
        formData.append('mask', maskFile)

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        }
        // submit original image 
        try { 
            const res = await axios.post(url, formData, config) 
            console.log('res.data', res.data)
            setConvertedImgSrc('/images/' + res.data.filename)
            setIsDrawCanvas(true)
        }
        catch(err) {
            console.log('err', err)
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

    // get canvasSize
    const onImgLoad = ({target: img}) => {
        const {offsetHeight, offsetWidth} = img
        setCanvasSize({height: offsetHeight, width: offsetWidth})
    }

    return (
        <div className="wrapper">
            <form 
                id="form-file-upload"
                className="form-file-upload"
                onDragEnter={handleDrag} 
            >
                <h1>Select Image AND Mask</h1>
                {!imgSrc&&
                    <input 
                        type="file" 
                        id="input-file-upload"
                        onChange={handleChange}
                        accept="image/png, image/jpeg"
                    />
                }
                <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>              
                    {imgSrc?(
                        <img 
                            className="image"
                            src={imgSrc}
                            style={{width: '100%'}}
                            alt=''
                            onLoad={onImgLoad}
                        />
                    ):(
                        <p>Drag and drop your file here or upload</p>
                    )}
                    {!isDrawCanvas&&
                        <Canvas
                            canvasSize={canvasSize} 
                            canvasRef={canvasRef}
                            contextRef={contextRef}   
                        />
                    }
                </label>
                {!imgSrc&&dragActive&& 
                    <div 
                        id="drag-file-element" 
                        onDragEnter={handleDrag} 
                        onDragLeave={handleDrag} 
                        onDragOver={handleDrag} 
                        onDrop={handleDrop}
                    />
                }
                {isDrawCanvas?
                    (<button className="submit-button" type="button" onClick={handleClick}>Canvas</button>):
                    (<button className="submit-button" type="button" onClick={handleSubmit}>Submit</button>)
                }
            </form>
            <div className="form-file-upload">
                <h1>Converted Image</h1>
                <div className="convertedImg">              
                    {imgSrc&&convertedImgSrc&&
                        <img 
                            className="image"
                            src={convertedImgSrc}
                            alt=''
                            style={{width: '100%'}}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default FileUpload