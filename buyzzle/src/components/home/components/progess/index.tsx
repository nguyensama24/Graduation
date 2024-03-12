
import ProgressBar from "./ProgressBar";

const appStyles = {
    height: 20,
    width: 285,
};

export default function Progess() {

    return (
        <div className="App" style={appStyles}>
            <ProgressBar bgColor={"#EA4B48"} progress={(Math.floor(Math.random() * 100)+ 1)} />
        </div>
    );
}
