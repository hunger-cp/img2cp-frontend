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
                    {renderLines(props.state.isLooped, props.state.points, props.state.focusedLine, props.eventHandlers)}
                    {props.state.points.map((point) => (
                        <Circle 
                            key={point.id}
                            id={point.id}
                            x={point.x + point.offset[0]}
                            y={point.y + point.offset[1]}
                            radius={props.state.focusedPoint == point.id ? 7 : 5}
                            fill="#FAA0A0"
                            onTap={props.eventHandlers.handlePointClick}
                            onClick={props.eventHandlers.handlePointClick}
                            onMouseOver={props.eventHandlers.handlePointHover}
                            onMouseOut={props.eventHandlers.handlePointHoverOut}
                            draggable={true}
                            onDragMove={props.eventHandlers.handleDrag}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}

function renderLines(isClosedLoop, points, focusedLine, eventHandlers) {
    if (!isClosedLoop) {
        return (
            <Line 
                points={points.flatMap((point) => [point.x + point.offset[0],point.y + point.offset[1]])}
                tension={0}
                stroke="#FAA0A0"
                strokeWidth={1}
                closed={isClosedLoop}
            />
        );
    }
    let out = [];
    let hueInterval = 360/points.length;
    for(let i = 0;i<points.length;i++) {
        // // console.log(i);
        // // console.log(hueInterval*i);
        let fill = i%2 == 0 ? hslToHex(hueInterval*i, 100, 86): hslToHex(hueInterval*i, 45, 56);
        let p1 = points[i], p2 = points[(i+1)%points.length];
        out.push(
            <>
                <Line
                    id={i+"_"}
                    key={i+"_"}
                    points={[p1.x + p1.offset[0], p1.y + p1.offset[1], p2.x + p2.offset[0], p2.y + p2.offset[1]]}
                    strokeWidth={focusedLine == i+"" ? 5 : 2}
                    stroke = {fill}
                />
                <Line
                    id={i+""}
                    key={i+""}
                    points={[p1.x + p1.offset[0], p1.y + p1.offset[1], p2.x + p2.offset[0], p2.y + p2.offset[1]]}
                    strokeWidth={15}
                    stroke={fill}
                    opacity={0}
                    onClick={eventHandlers.handleLineClick}
                    onMouseOver={eventHandlers.handleLineHover}
                    onMouseOut={eventHandlers.handleLineHoverOut}
                />
            </>
        );
        
    }
    // // console.log(out);
    return out;
}