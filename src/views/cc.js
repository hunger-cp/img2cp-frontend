import React from "react";
import { Stage, Layer, Circle, Line, Arc, Text } from 'react-konva';
import { calcOffset, calcSnapPointPos, calcCollision, calcDist } from '../utility/utils';

import ToolBar from "../components/sidebars/toolbar_cc";
import SideBar, { calcQuad, calcLoop } from "../components/sidebars/sidebar_cc";
import CanvasNavBar from "../components/navbars/canvas_navbar_cc";
import Canvas from "../components/canvas_cc";
import CreasePatternDisplay from "../components/crease_pattern_display_cc.js"

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            isLooped: false,
            quadPoints: [],
            quadLengths: [],
            pointLengths: [],
            pointLengthSum: 0,
            focus: -1,
            focusP: -1,
            gridDivisions: 1,
            sidebarWidth: window.innerWidth / 6,
            toolbarWidth: window.innerWidth / 6,
            isQuadLooped: false,
            patternGenPoints: [],
            canvasMode: "Canvas"
        };
    }

    handleClick = (e) => {
        if (this.state.isLooped) return;
        const pos = e.target.attrs, realPos = e.target.getStage().getPointerPosition(), width = (window.innerWidth - this.state.sidebarWidth - this.state.toolbarWidth) / (2 ** this.state.gridDivisions);
        const offset = calcOffset(this.state.points, pos, realPos, Math.min(15, width / 5), width);

        const nonLoopedClickHandler = (e) => {
            var tmpPoints = this.state.points.concat({ id: this.state.points.length.toString(), x: pos.x, y: pos.y, offset: offset });
            return tmpPoints;
        }

        var tmpPoints = nonLoopedClickHandler(e);

        if (offset != null)
            this.setState({ points: tmpPoints });
        else
            alert("Max number of overlays reached. Adding more edges would be suboptimal for the design and thus should not be considered. Please try a different point. ")
    }
    handlePointClick = (e) => {
        if (this.state.isLooped) {
            calcQuad(
                e.target.attrs.id,
                this.state.points,
                this.state.pointLengths,
                this.state.pointLengthSum,
                (val) => this.setState({ quadPoints: val }),
                (val) => this.setState({ quadLengths: val })
            );
            return;
        }
        if (e.target.attrs.id == '0') {
            this.setState({ isLooped: true });
            calcLoop(
                this.state.points,
                (val) => this.setState({ pointLengths: val }),
                (val) => this.setState({ pointLengthSum: val })
            )

        }
    }
    handleLineClick = (e) => {
        if (!this.state.isLooped) return;
        console.log(e.target)
        const pos = e.target.getStage().getPointerPosition(), realPos = e.target.getStage().getPointerPosition(), width = (window.innerWidth - this.state.sidebarWidth - this.state.toolbarWidth) / (2 ** this.state.gridDivisions);
        const offset = calcOffset(this.state.points, pos, realPos, Math.min(15, width / 5), width);
        var tmpPoints = this.state.points;
        console.log(pos)
        tmpPoints.splice((parseInt(e.target.attrs.id) + 1) % tmpPoints.length, 0, { id: tmpPoints.length.toString(), x: pos.x, y: pos.y, offset: offset });
        if (offset != null)
            this.setState({ points: tmpPoints });
        else
            alert("Max number of overlays reached. Adding more edges would be suboptimal for the design and thus should not be considered. Please try a different point. ")
    }
    handleLineHover = (e) => {
        this.setState({ focusedLine: e.target.attrs.id });
    }
    handleLineHoverOut = (e) => {
        this.setState({ focusedLine: -1 });
    }
    handlePointHover = (e) => {
        this.setState({ focusedPoint: e.target.attrs.id });
    }
    handlePointHoverOut = (e) => {
        this.setState({ focusedPoint: -1 });
    }
    handleDrag = (e) => {
        // console.log(e.target)
        const width = (window.innerWidth - this.state.sidebarWidth - this.state.toolbarWidth) / (2 ** this.state.gridDivisions)
        const points = calcSnapPointPos(this.state.points, e.target.attrs.id, [e.target.attrs.x, e.target.attrs.y], width, width / 6, e.target)
        // console.log(points);
        this.setState({ points: points });
    }
    handlePatternGen = (e) => {
        var ptr = 0;
        var patternPoints = this.state.points;
        for (let i = 0; i < patternPoints; i++) {
            if (patternPoints[i].id == this.state.quadPoints[ptr])
                patternPoints[i].quad = true;
            else
                patternPoints[i].quad = false;
        }
        this.setState({ patternGenPoints: patternPoints });
    }
    incrementGrid = () => {
        this.setState({ gridDivisions: this.state.gridDivisions + 1 });
    }
    decrementGrid = () => {
        this.setState({ gridDivisions: this.state.gridDivisions - 1 });
    }


    render() {
        const sidebarWidth = this.state.sidebarWidth;
        const toolbarWidth = this.state.toolbarWidth;

        return (
            <div className="flex pt-20">
                <ToolBar
                    gridDivisions={this.state.gridDivisions}
                    incrementGrid={this.incrementGrid}
                    decrementGrid={this.decrementGrid}
                    isQuadLooped={this.state.isQuadLooped}
                    handlePatternGen={this.handlePatternGen}
                />
                <div className="flex divide-x divide-zinc-300">
                    <SideBar
                        state={this.state}
                        isLooped={this.state.isLooped}
                        quadPoints={this.state.quadPoints}
                        eventHandlers={{ over: this.handleLineHover, out: this.handleLineHoverOut }}
                        sidebarWidth={sidebarWidth}
                        isQuadLooped={this.state.isQuadLooped}
                        setIsQuadLooped={(val) => this.setState({ isQuadLooped: val })}
                    />
                    <div>
                        <CanvasNavBar isPatternCalculated={this.state.patternGenPoints.length != 0} canvasMode={this.state.canvasMode} setCanvasMode={(val) => this.setState({ canvasMode: val })} />
                        {this.state.canvasMode == "Canvas" ?
                            <Canvas
                                width={window.innerWidth - sidebarWidth - toolbarWidth}
                                state={this.state}
                                setState={this.setState}
                                gridDivisions={this.state.gridDivisions}
                                eventHandlers={{
                                    handleClick: this.handleClick,
                                    handlePointClick: this.handlePointClick,
                                    handlePointHover: this.handlePointHover,
                                    handlePointHoverOut: this.handlePointHoverOut,
                                    handleLineClick: this.handleLineClick,
                                    handleLineHover: this.handleLineHover,
                                    handleLineHoverOut: this.handleLineHoverOut,
                                    handleDrag: this.handleDrag
                                }}
                            />
                            :
                            <CreasePatternDisplay
                                width={window.innerWidth - sidebarWidth - toolbarWidth}
                                state={this.state}
                                setState={this.setState}
                                gridDivisions={this.state.gridDivisions}
                                eventHandlers={{
                                    handleClick: this.handleClick,
                                    handlePointClick: this.handlePointClick,
                                    handlePointHover: this.handlePointHover,
                                    handlePointHoverOut: this.handlePointHoverOut,
                                    handleLineClick: this.handleLineClick,
                                    handleLineHover: this.handleLineHover,
                                    handleLineHoverOut: this.handleLineHoverOut,
                                    handleDrag: this.handleDrag
                                }}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}