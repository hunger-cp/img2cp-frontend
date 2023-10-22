import { React, useState, useEffect } from 'react';
import { Stage, Layer, Circle, Line, Arc, Text } from 'react-konva';
import { hslToHex, calcDist } from '../../utility/utils';

export default function SideBar(props) {
    /*
    const [isLooped, setLooped] = useState(props.isLooped);

    useEffect (()=> {
        setLooped(props.isLooped)
    }, [props.isLooped])

    const [quadPoints, setQuadPoints] = useState(props.quadPoints);
    const [quadLengths , setQuadLengths] = useState([]);

    useEffect (() => {
        setQuadPoints(props.quadPoints)
    }, [props.quadPoints])

    const [pointLengths, setPointLengths] = useState([]);
    const [pointLengthSum, setPointLengthSum] = useState(-1);
    */
    /*if (isLooped && pointLengths.length != props.state.points.length) {
        calcLoop(props.state.points, setPointLengths, setPointLengthSum);
    }*/
    
    /*if (quadPoints.length != 0 && quadLengths.length == 0) {
        console.log("Calculating Quadrilateral...");
        calcQuad(quadPoints[0], props.state.points, pointLengths, pointLengthSum, setQuadPoints, setQuadLengths);
        console.log(quadPoints);
        console.log(quadLengths);
    }*/
    const quadPoints = props.state.quadPoints;
    const quadLengths = props.state.quadLengths;
    const pointLengths = props.state.pointLengths;
    const pointLengthSum = props.state.pointLengthSum

    return (
        <div className="w-1/3">
            <Stage
                width={props.sidebarWidth}
                height={window.innerHeight} 
            >
                <Layer>
                    {props.state.isLooped ? 
                    renderLoop(
                        pointLengthSum, 
                        pointLengths, 
                        props.state.focusedLine, 
                        props.eventHandlers
                    ) : 
                    <></>}
                    {quadPoints.length != 0 ?
                    renderQuad(
                        quadPoints,
                        quadLengths,
                        props.state.points,
                        pointLengths,
                        props.isQuadLooped, 
                        props.setIsQuadLooped
                    ) : 
                    <></>}
                </Layer>
            </Stage>
        </div>
    )
}

export function calcLoop(points, setPointLengths, setPointLengthSum) {
    let tmpLen = 0, tmpLens = [], p1 = points[0], p2 = null;
    for(let i = 1;i<points.length+1;i++) {
        p2 = points[i%points.length];
        let dist = calcDist(p1, p2);
        tmpLen+=dist;
        tmpLens.push(dist);
        p1 = p2;
    }
    console.table(tmpLens);
    setPointLengths(tmpLens);
    setPointLengthSum(tmpLen);
}
const precision = (num) => Math.round(parseFloat(num)*100000)/100000;


export function calcQuad(startingPoint, points, pointLengths, pointLengthSum, setQuadPoints, setQuadLengths) {
    var quadPoints = [startingPoint], quadLengths = [];
    const idealQuadLength = pointLengthSum/4, startingPointInt = parseInt(startingPoint);
    
    // console.log("Ideal: " + idealQuadLength);
    let quadLengthT = 0;
    for(let i = startingPointInt+1;i%points.length!=startingPointInt;i++) {
        // console.log(i)
        let previousQuadLengthT = quadLengthT;
        quadLengthT+=pointLengths[(i-1)%points.length];
        // console.log(this.state.plengths[(i-1)%this.state.points.length])
        // console.log(tmpQLen)
        if (previousQuadLengthT <= idealQuadLength && quadLengthT >= idealQuadLength) {
            if(idealQuadLength-previousQuadLengthT > quadLengthT-idealQuadLength) {
                quadPoints.push(points[i%points.length].id);
                quadLengths.push(quadLengthT);
                // console.log("Added " + i);
            }
            else {
                quadPoints.push(points[(--i)%points.length].id);
                quadLengths.push(previousQuadLengthT);
                // console.log("Added " + (i));
            }
            
            quadLengthT = 0;
        }
    }
    quadLengthT+=pointLengths[(startingPointInt-1) % points.length];
    quadLengths.push(quadLengthT);
    console.log("Calculated: " + quadLengths);
    console.log(pointLengthSum)
    if (precision(quadLengths[0]) == precision(quadLengths[2]) && precision(quadLengths[1]) == precision(pointLengthSum-(quadLengths[0]+quadLengths[1]+quadLengths[2])))
        console.log("Completed Quadrilateral");
    setQuadPoints(quadPoints);
    setQuadLengths(quadLengths);
}

function renderLoop(len, lens, focusId, eventHandlers) {
    var out = [];
    let displaceAngle = 0;
    let hueInterval = 360/lens.length;
    for(let i = 0;i<lens.length;i++) {
        // // console.log(i);
        let angle = (lens[i]/len) * 360;
        // // console.log(hueInterval*i)
        let fill = i%2 == 0 ? hslToHex(hueInterval*i, 100, 86): hslToHex(hueInterval*i, 45, 56);
        out.push(
            <>
                <Arc 
                    angle={angle-2}
                    innerRadius = {focusId == i+"" ? 112 : 115}
                    outerRadius = {focusId == i+"" ? 125 : 122}
                    x = {150}
                    y = {150}
                    rotation = {displaceAngle}
                    fill = {fill}
                    key={i+"_"}
                    id={i+"_"}
                />
                <Arc 
                    angle={angle-2}
                    innerRadius = {110}
                    outerRadius = {127}
                    x = {150}
                    y = {150}
                    rotation = {displaceAngle}
                    fill = {fill}
                    opacity={0}
                    key={"Arc_"+i}
                    id={"Arc_"+i}
                    onMouseOver={eventHandlers.over}
                    onMouseOut={eventHandlers.out}
                />
            </>
        );
        displaceAngle += angle;
        
    }
    return out;
}

function rotateQuad(quad, quadLengths) {
    var tmpMaxQuad = -1;
    var rotation = 0;
    for(let i = 0; i < quadLengths.length; i++) {
        if (quadLengths[i] > tmpMaxQuad) {
            tmpMaxQuad = quadLengths[i]
            rotation = i;
        }
    }
    console.log("Rotation: " + rotation)
    var outQuad = [];
    var outQuadLengths = [];
    var k = 0;
    for (var i = rotation; i < quad.length; i++) {
        outQuad[k] = quad[i];
        outQuadLengths[k] = quadLengths[i];
        k++;
    }
    for (var i = 0; i < rotation; i++) {
        outQuad[k] = quad[i];
        outQuadLengths[k] = quadLengths[i];
        k++;
    }
    return [outQuad, outQuadLengths];
}

function renderQuad(quad, quadLengths, points, plengths, isQuadLooped, setIsQuadLooped) {
    // console.log(quadLengths)
    // console.log("rendering quad");
    let outPoints = [
        <Circle 
            x={25}
            y={300}
            radius={3}
            fill="#FAA0A0"
        />
    ]
    let lines = []
    var rotatedQuad = rotateQuad(quad, quadLengths);
    var quad = rotatedQuad[0];
    var quadLengths = rotatedQuad[1];
    console.log("Rotated Quad: " + quadLengths)
    const mult = 225/quadLengths[0];
    // console.log(mult);
    // console.log(this.state.quadLengths);
    const start = parseInt(quad[0])
    let p1 = points[start], p2 = null;
    let hueInterval = 360/plengths.length;
    let offsetX = 25, offsetY = 300;
    let deltX = offsetX;
    let deltY = offsetY;
    let distX = 0, distY = 0;
    let sum = 0;
    // console.log(this.state.quad)
    // console.log(this.state.plengths)
    let side = 0;
    let loop = false;
    console.log(start);
    for(let i = start+1;i%points.length!=start+1 || !loop;i++) {
        console.log(i);
        if (i%points.length == (start + 2)%points.length)
            loop = true;
        // console.log(i);
        let idx = i%points.length
        const colorIdx = (i-1)%points.length;
        let fill = colorIdx%2 == 0 ? hslToHex(hueInterval*colorIdx, 100, 86): hslToHex(hueInterval*colorIdx, 45, 56);
        p2 = points[idx];
        
        if (side == 0) {
            distX = calcDist(p1, p2)*mult;
        }
        if (side == 1) {
            distY = calcDist(p1, p2)*mult;
        }
        if (side == 2) {
            distX = -calcDist(p1, p2)*mult;
        }
        if (side == 3) {
            distY = -calcDist(p1, p2)*mult;
        }
        lines.push(
            <Line
                points = {[deltX, deltY, deltX+=distX, deltY+=distY]}
                stroke={fill}
                strokeWidth={2}
            />
        )
        outPoints.push(
            <Circle 
                x={deltX}
                y={deltY}
                radius={3}
                fill="#FAA0A0"
            />
        )
        sum += calcDist(p1, p2);
        p1 = p2;
        if (points[idx].id == quad[side+1]) {
            side++;
            sum = 0;
            distX = 0
            distY = 0;
        }
    }
    console.log("Nahhh " + deltX + " " + deltY)
    console.log("Error Bounds" + distX + " " + distY);
    if (!isQuadLooped && Math.round(deltX) == 25 && Math.round(deltY) == 300)
        setIsQuadLooped(true);
    // console.log(sum);
    return lines.concat(outPoints);
}