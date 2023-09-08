import { React, useState } from 'react';
import { Stage, Layer, Circle, Line, Arc, Text } from 'react-konva';
import Grid from "../utility/grid";
import { hslToHex, calcDist } from '../utility/utils';

export default function Canvas(props) {
    
    return (
        <div >
            <Stage 
                width={props.width} 
                height={window.innerHeight} 
                className="relative">
                <Layer>
                    <Grid width={props.width/(2 ** props.gridDivisions)} maxWidth={props.width} maxHeight = {window.innerHeight} onClick={props.eventHandlers.handleClick}/>
                </Layer>
            </Stage>
        </div>
    )
}