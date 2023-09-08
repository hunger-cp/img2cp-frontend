import { React, useState, useEffect } from 'react';

export default function ToolBar(props) {
    return(
        <div className="w-1/3 px-8 pt-8 rounded-3xl shadow-2xl bg-white border-solid border border-zinc-200">
            <div className="flex justify-between">
                <span className="whitespace-nowrap font-medium">Grid Divisions: </span>
                <div className="inline-flex">
                    {props.gridDivisions == 1 ? 
                        <button onClick={props.decrementGrid} disabled className="border border-zinc-400 rounded-full p-1.5 mr-3 group hover:border-zinc-600 disabled:border-zinc-200">
                            <span className="">
                                <svg className="block h-3 w-3 stroke-zinc-400 enabled:group-hover:stroke-zinc-600 stroke-2 disabled:stroke-zinc-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="presentation" focusable="false"><path d="M2 16h28"></path></svg>
                            </span>
                        </button>
                        :
                        <button onClick={props.decrementGrid} className="border border-zinc-400 rounded-full p-1.5 mr-3 group hover:border-zinc-600 disabled:border-zinc-200">
                            <span className="">
                                <svg className="block h-3 w-3 stroke-zinc-400 enabled:group-hover:stroke-zinc-600 stroke-2 disabled:stroke-zinc-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="presentation" focusable="false"><path d="M2 16h28"></path></svg>
                            </span>
                        </button>
                    }
                    <span className="font-light">{props.gridDivisions}</span>
                    <button onClick={props.incrementGrid} className="border border-zinc-400 rounded-full p-1.5 ml-3 group hover:border-zinc-600">
                        <span className="">
                            <svg className="block h-3 w-3 stroke-zinc-400 group-hover:stroke-zinc-600 stroke-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="presentation" focusable="false"><path d="M2 16h28M16 2v28"></path></svg>
                        </span>
                    </button>
                </div>
            </div>
            <div className="">
                {props.isQuadLooped ? 
                    <button onClick={props.handlePatternGen} className="py-3 px-6 rounded-lg mt-4 w-80 bg-gradient-to-r from-red-500 via-pink-500 via-25% to-rose-500 text-white text-lg font-light bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 hover:cursor-pointer">
                        Generate Crease Pattern
                    </button>
                :
                <><button disabled className="py-3 px-6 rounded-lg mt-4 w-80 bg-gradient-to-r from-gray-500 via-slate-500 via-25% to-zinc-500 text-white text-lg font-light bg-[position:_0%_0%] bg-[size:_200%] transition-all duration-500">
                    Generate Crease Pattern
                </button>
                <p className="pt-2 text-sm">Edge must be a valid closed, complete quadrilateral</p></>}
            </div>
        </div>
    )
}