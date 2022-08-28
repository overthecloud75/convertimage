import { useState, useEffect } from 'react'
import './canvas.css'

const Canvas = ({canvasSize, canvasRef, contextRef}) => {

    const [ctx, setCtx] = useState()
    const [isDrawing, setIsDrawing] = useState(false)
    
    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = canvasSize.width
        canvas.height = canvasSize.height

        const context = canvas.getContext('2d')
        context.strokeStyle = 'black'
        context.lineWidth = 20
        contextRef.current = context 
        setCtx(contextRef.current)
    }, [canvasSize.width, canvasSize.height, canvasRef, contextRef])
    
    const startDrawing = () => {
        setIsDrawing(true)
    }

    const finishDrawing = () => {
        setIsDrawing(false)
    }

    const drawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent
        if (ctx) {
            if (!isDrawing) {
                ctx.beginPath()
                ctx.moveTo(offsetX, offsetY)
            } else {
                ctx.lineTo(offsetX, offsetY)
                ctx.stroke()
            }
        }
    }

    return (
        <div className="canvasWrap">
            <canvas 
                className="canvas"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={drawing}
                onMouseLeave={finishDrawing}
            >
            </canvas>
        </div>
)
}

export default Canvas