import Quadrilateral from "./quadrilateral"
import { calcDist, dist } from "../utility/utils"

/**
 * Patterns represent an immutable set of connected points.
 * This class also includes a number of methods for manipulating the
 * contents of patterns (of course, creating a new Object if there are any
 * changes, as Pattern is immutable)
 */
export default class Pattern {

    constructor() {
        this.points = [];
        this.pointLengthSum = 0;
        this.focusedLine = -1;
        this.focusedPoint = -1;
        this.isLooped = false;
        this.quadrilateral = null;
    }

    clone() {
        const newPattern = new Pattern();
        newPattern.points = this.points;
        newPattern.pointLengthSum = this.pointLengthSum;
        newPattern.focusedLine = this.focusedLine;
        newPattern.focusedPoint = this.focusedPoint;
        newPattern.isLooped = this.isLooped;
        newPattern.quadrilateral = this.quadrilateral;
        return newPattern;
    }

    getIsLooped() {
        return this.isLooped;
    }

    setLooped(looped) {
        const newPattern = this.clone();
        newPattern.isLooped = looped;
        return newPattern;
    }

    getPoints() {
        return this.points;
    }

    size() {
        return this.points.length;
    }

    setFocusedLine(lineFocus) {
        const newPattern = this.clone();
        newPattern.focusedLine = lineFocus;
        return newPattern;
    }

    getFocusedLine() {
        return this.focusedLine;
    }

    setFocusedPoint(pointFocus) {
        const newPattern = this.clone();
        newPattern.focusedPoint = pointFocus;
        return newPattern;
    }

    getFocusedPoint() {
        return this.focusedPoint;
    }

    addPoint(point) {
        // if points is empty, push point and set length to -1 (obv)
        // else push point and calculate the distance to first node;
        //      then update the previous last node distance and set it to distance to last node
        const newPattern = this.clone();
        if (newPattern.points.length === 0) {
            newPattern.points.push({
                point: point, 
                length: 0
            });
        }
        else {
            const prevPoint = newPattern.points[newPattern.points.length - 1];
            newPattern.points.push({
                point: point, 
                length: calcDist(point, newPattern.points[0].point)
            });
            const prevLength = prevPoint.length;
            prevPoint.length = calcDist(prevPoint.point, point);
            // update previous last entry in point length sum
            newPattern.pointLengthSum += prevPoint.length - prevLength;
        }
        return newPattern;
    }

    insertPoint(index, point) {
        const newPattern = this.clone();
        newPattern.points.splice(index, 0, point);
        return newPattern;
    }

    snapPoints(point_id, cursorPosition, gridWidth, snapThresh, target) {
        // const proximity = (val, width) => {Math.min(val%width, width-(val%width))}
        const newPattern = this.clone();
        const proximity = (val, width) => val%width;
        for(let i = 0;i<newPattern.points.length;i++) {
            const currPoint = newPattern.points[i];
            if (currPoint.id === point_id) {
                if (dist(proximity(cursorPosition[0], gridWidth), proximity(cursorPosition[1], gridWidth)) < snapThresh) {
                    // console.log(cursorPosition + " " + gridWidth);
                    currPoint.x = cursorPosition[0] - (cursorPosition[0]%gridWidth);
                    currPoint.y = cursorPosition[1] - (cursorPosition[1]%gridWidth);
                    currPoint.offset = [0, 0]
                    target.absolutePosition({x: currPoint.x, y: currPoint.y});
                }
                else if (dist(gridWidth - proximity(cursorPosition[0], gridWidth), gridWidth - proximity(cursorPosition[1], gridWidth)) < snapThresh) {
                    currPoint.x = cursorPosition[0] + gridWidth - (cursorPosition[0]%gridWidth);
                    currPoint.y = cursorPosition[1] + gridWidth - (cursorPosition[1]%gridWidth);
                    currPoint.offset = [0, 0]
                    target.absolutePosition({x: currPoint.x, y: currPoint.y});
                }
                else if (dist(gridWidth - proximity(cursorPosition[0], gridWidth), proximity(cursorPosition[1], gridWidth)) < snapThresh) {
                    currPoint.x = cursorPosition[0] + gridWidth - (cursorPosition[0]%gridWidth);
                    currPoint.y = cursorPosition[1] + (cursorPosition[1]%gridWidth);
                    currPoint.offset = [0, 0]
                    target.absolutePosition({x: currPoint.x, y: currPoint.y});
                }
                else if (dist(proximity(cursorPosition[0], gridWidth), gridWidth - proximity(cursorPosition[1], gridWidth)) < snapThresh) {
                    currPoint.x = cursorPosition[0] + (cursorPosition[0]%gridWidth);
                    currPoint.y = cursorPosition[1] + gridWidth - (cursorPosition[1]%gridWidth);
                    currPoint.offset = [0, 0]
                    target.absolutePosition({x: currPoint.x, y: currPoint.y});
                }
                else {
                    currPoint.offset = [cursorPosition[0]-currPoint.x, cursorPosition[1]-currPoint.y];
                }
            }
            newPattern.points[i] = currPoint
        }
        return newPattern;
    }



}