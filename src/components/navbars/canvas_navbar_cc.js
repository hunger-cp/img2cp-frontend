import { React, useState, useEffect } from 'react';

export default function CanvasToolBar(props) {
    if (props.isPatternCalculated) {
        if (props.canvasMode == "Canvas") {
            return (
                <div className="flex column">
                    <div className="h-12 bg-zinc-200 hover:cursor-default">
                        <div className="h-full w-48 border-r border-bg-zinc-300 flex justify-center items-center text-lg">Canvas</div>
                    </div>
                    <div className="h-12 bg-zinc-100 ">
                        <div onClick = {() => props.setCanvasMode("CreasePattern")} className="h-full w-48 border-r border-bg-zinc-300 flex justify-center items-center text-zinc-500 hover:text-zinc-700 text-lg hover:cursor-pointer">Crease Pattern</div>
                    </div>
                </div>

            )
        }
        else {
            return (
                <div className="flex column">
                    <div className="h-12 bg-zinc-100 ">
                        <div onClick = {() => props.setCanvasMode("Canvas")} className="h-full w-48 border-r border-bg-zinc-300 flex justify-center text-zinc-500 hover:cursor-pointer hover:text-zinc-700 items-center text-lg">Canvas</div>
                    </div>
                    <div className="h-12 bg-zinc-200 hover:cursor-default">
                        <div className="h-full w-48 border-r border-bg-zinc-300 flex justify-center items-center text-lg ">Crease Pattern</div>
                    </div>
                </div>

            )
        }
    }
    else {
        return (
            <div className="flex column">
            <div className="h-12 bg-zinc-100 hover:cursor-default">
                <div className="h-full w-48 border-r border-bg-zinc-300 flex justify-center items-center text-lg">Canvas</div>
            </div>
            </div>

        )
    }
}