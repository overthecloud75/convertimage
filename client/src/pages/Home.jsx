import Canvas from "../components/Canvas/Canvas"
import FileUpload from "../components/FileUpload/FileUpload"

const Home = () => {
    return (
        <div className="container">
            <FileUpload/>
            <Canvas/>
        </div>
        
    )
}

export default Home