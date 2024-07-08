import { useState, useRef, useEffect, useContext,useLayoutEffect } from "react";
import {TOOL_ACTION_TYPES, TOOL_ITEMS} from '../../constants';
import rough from "roughjs";
import BoardContext from "../store/boardcontext";
import ToolboxContext from "../store/toolboxcontext";
import classes from './Board.module.css';

function Board() {
  const {toolboxState} = useContext(ToolboxContext);

  const textAreaRef = useRef();  
  const canvasRef = useRef();

  const {elements,BoardMouseDownHandler,BoardMouseMoveHandler,toolActionType,textAreaBlur,BoardMouseUpHandler,undo,redo} = useContext(BoardContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore();
          break;
        case TOOL_ITEMS.ERASER:
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore();
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  const handleMouseDown = (event) => {
    BoardMouseDownHandler(event,toolboxState);
  };

  const handleMouseMove = (event) => {
    if (toolActionType === "DRAWING") 
      BoardMouseMoveHandler(event);
  };

  const handleMouseUp=()=>{
    BoardMouseUpHandler();
  }

  return (
    <>
    {toolActionType=== TOOL_ACTION_TYPES.WRITING ? (<textarea type="text"
      className={classes.textElementBox}
      ref={textAreaRef}
      style={{
        top: elements[elements.length - 1].y1,
        left: elements[elements.length - 1].x1,
        fontSize: `${elements[elements.length - 1]?.size}px`,
        color: elements[elements.length - 1]?.stroke,
      }}
      onBlur = {(e)=> textAreaBlur(e.target.value)}
    />) : null}
    <canvas
    id="canvas"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
    </>
  );
}

export default Board;
