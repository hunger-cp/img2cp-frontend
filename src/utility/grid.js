import { React, memo } from "react";
import { Stage, Layer, Circle, Line, Arc, Text } from 'react-konva';

const Grid = ({ width, maxWidth, maxHeight, onClick}) => {
    console.log("Rendering Grid...")
    const gridPoints = calculation(width, maxWidth, maxHeight, onClick);
        
    return gridPoints;
}
const calculation = (width, maxWidth, maxHeight, onClick) => {
    var gridPoints = []
    for(let i = 0; i < maxWidth; i+=width) {
        gridPoints.push(
            i != 0 ?
            <Line
                points = {[i, 0, i, maxHeight]}
                stroke="#D4D4D8"
                strokeWidth = {0.7}
            />
            :
            <></>
        )
        for(let j = 0; j < maxHeight; j+=width) {
            if (i == 0) {
                gridPoints.push(
                    j != 0 ?
                    <Line
                        points = {[0, j, maxWidth, j]}
                        stroke="#D4D4D8"
                        strokeWidth = {0.7}
                    />
                    :
                    <></>
                )
            }
            gridPoints.push(
                <>
                    <Circle
                        id = {i + " " + j + "Clickable"}
                        key = {i + " " + j + "Clickable"}
                        radius = {width/2}
                        x = {i}
                        y = {j}
                        fill = "#D4D4D8"
                        opacity = {0}
                        onClick={onClick}
                        onTap={onClick}
                    />
                </>
            )
        }
    }
    return gridPoints;
}
export default memo(Grid);