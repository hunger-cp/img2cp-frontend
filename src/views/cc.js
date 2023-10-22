import React from "react";
import { Stage, Layer, Circle, Line, Arc, Text } from 'react-konva';
import { calcOffset, calcSnapPointPos, calcCollision, calcDist } from '../utility/utils';

import ToolBar from "../components/sidebars/toolbar_cc";
import SideBar, { calcQuad, calcLoop } from "../components/sidebars/sidebar_cc";
import CanvasNavBar from "../components/navbars/canvas_navbar_cc";
import Canvas from "../components/canvas_cc";
import CreasePatternDisplay from "../components/crease_pattern_display_cc.js"
import Pattern from "../origami/pattern"

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pattern: new Pattern(),
            quadPoints: [],
            quadLengths: [],
            gridDivisions: 1,
            sidebarWidth: window.innerWidth / 6,
            toolbarWidth: window.innerWidth / 6,
            isQuadLooped: false,
            patternGenPoints: [],
            canvasMode: "Canvas"
        };
    }

    setPattern(pattern) {
        this.setState({pattern: pattern});
    }

    getOffset(POS, REAL_POS) {
        const MIN_OFFSET = 15;
        const OFFSET_DIV = 5;
        const WIDTH = this.getGridWidth();
        return calcOffset(this.state.pattern.points, POS, REAL_POS, Math.min(MIN_OFFSET, WIDTH / OFFSET_DIV), WIDTH);
    }

    getGridWidth() {
        return (window.innerWidth - this.state.sidebarWidth - this.state.toolbarWidth)
            / (2 ** this.state.gridDivisions);
    }

    handleClick = (e) => {
        if (this.state.pattern.isLooped) {
            return;
        }
        const POS = e.target.attrs;
        const REAL_POS = e.target.getStage().getPointerPosition();
        const offset = this.getOffset(POS, REAL_POS);
        if (offset == null) {
            alert("Max number of overlays reached. " +
                "Adding more edges would be suboptimal for the design and thus should not be considered. ")
            return;
        }
        const newPattern = this.state.pattern.addPoint({
            id: this.state.pattern.points.length.toString(),
            x: POS.x,
            y: POS.y,
            offset: offset
        });
        this.setPattern(
            newPattern
        );
    }

    handlePointClick = (e) => {
        if (this.state.pattern.isLooped) {
            calcQuad(
                e.target.attrs.id,
                this.state.pattern.points,
                this.state.pointLengths,
                this.state.pointLengthSum,
                (val) => this.setState({ quadPoints: val }),
                (val) => this.setState({ quadLengths: val })
            );
            return;
        }
        if (e.target.attrs.id === '0') {
            this.setPattern(this.state.pattern.setLooped(true));
            /*calcLoop(
                this.state.points,
                (val) => this.setState({ pointLengths: val }),
                (val) => this.setState({ pointLengthSum: val })
            )*/

        }
    }

    handleLineClick = (e) => {
        if (!this.state.pattern.isLooped) {
            return;
        }
        const POS = e.target.getStage().getPointerPosition();
        const REAL_POS = e.target.getStage().getPointerPosition();
        const offset = this.getOffset(POS, REAL_POS);
        if (offset == null) {
            alert("Max number of overlays reached. " +
                "Adding more edges would be suboptimal for the design and thus should not be considered. ")
            return;
        }
        const newPoint = {
            id: this.state.pattern.size(),
            x: POS.x,
            y: POS.y,
            offset: offset
        };
        const clickedLineIndex = parseInt(e.target.attrs.id);
        // recall that the line index is one less than the index where we want to insert the point
        this.setPattern(
            this.state.pattern.insertPoint((clickedLineIndex + 1) % this.state.pattern.size(), newPoint)
        );
    }

    handleLineHover = (e) => {
        this.setPattern(this.state.pattern.setFocusedLine(e.target.attrs.id));
    }

    handleLineHoverOut = (e) => {
        this.setPattern(this.state.pattern.setFocusedLine(-1));
    }

    handlePointHover = (e) => {
        this.setPattern(this.state.pattern.setFocusedPoint(e.target.attrs.id));
    }

    handlePointHoverOut = (e) => {
        this.setPattern(this.state.pattern.setFocusedPoint(-1));
    }

    handleDrag = (e) => {
        // console.log(e.target)
        const width = this.getGridWidth();
        const SNAP_THRESH = 6;
        this.setPattern(
            this.state.pattern.snapPoints(e.target.attrs.id, [e.target.attrs.x, e.target.attrs.y],
            width, width / SNAP_THRESH, e.target)
        );
    }

    // TODO next; also change all modifications of state.pattern to create a new pattern object. state is readonly
    handlePatternGen = (e) => {
        // var ptr = 0;
        // var patternPoints = this.state.points;
        // for (let i = 0; i < patternPoints; i++) {
        //     if (patternPoints[i].id === this.state.quadPoints[ptr])
        //         patternPoints[i].quad = true;
        //     else
        //         patternPoints[i].quad = false;
        // }
        // this.setState({ patternGenPoints: patternPoints });
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
                        <CanvasNavBar isPatternCalculated={this.state.patternGenPoints.length !== 0}
                                      canvasMode={this.state.canvasMode}
                                      setCanvasMode={(val) => this.setState({ canvasMode: val })}
                        />
                        {this.state.canvasMode === "Canvas" ?
                            <Canvas
                                pattern={this.state.pattern}
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