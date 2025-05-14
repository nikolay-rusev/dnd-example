import './App.css';
import InteractionPane from 'interactionpane';
import React, {useState} from 'react';
import DragNDrop from './DragNDrop';

function App() {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({x: 0, y: 0});
    return (
        <div className='App'>
            <InteractionPane
                scale={scale}
                setScale={setScale}
                offset={offset}
                setOffset={setOffset}
            >
                <DragNDrop />
            </InteractionPane>
        </div>
    );
}

export default App;
