import { React, useState } from 'react';
import { Stage, Layer, Circle, Line, Arc, Text } from 'react-konva';
import Grid from "../utility/grid";
import { hslToHex, calcDist } from '../utility/utils';

export default function Canvas(props) {
    const [gridDivisions, setGridDivisions] = useState(-1);

    if (gridDivisions == -1) {
        var tmpGridDivisions = gridDivisions;
        for(let i = 0; i < props.state.quadLengths.length; i++) {
            tmpGridDivisions = Math.max(tmpGridDivisions, props.state.quadLengths[i]/props.width/(2 ** gridDivisions));
        }
        console.log(tmpGridDivisions);
        setGridDivisions(tmpGridDivisions + 3);
    }

    return (
        <div >
            <Stage 
                width={props.width} 
                height={window.innerHeight} 
                className="relative">
                <Layer>
                    <Grid width={props.width/(2 ** gridDivisions)} maxWidth={props.width} maxHeight = {window.innerHeight} onClick={props.eventHandlers.handleClick}/>
                </Layer>
            </Stage>
        </div>
    )
}