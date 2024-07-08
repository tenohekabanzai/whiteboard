import React, { useReducer, useState, useCallback } from "react";
import BoardContext from "./boardcontext";
import { TOOL_ITEMS, TOOL_ACTION_TYPES, BOARD_ACTIONS } from "../../constants";
import createRoughElement from "../../utils/elements";
import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "../../utils/elements";

import rough from "roughjs/bin/rough";
const gen = rough.generator();

const BoardProvider = ({ children }) => {
  const boardReducer = (state, action) => {
    
    if (action.type === BOARD_ACTIONS.CHANGE_TOOL)
    return { ...state, activeToolItem: action.payload.tool };

    else if (action.type === BOARD_ACTIONS.DRAW_DOWN) {

      const { clientX, clientY } = action.payload;
      const prevElements = [...state.elements];

      const newElement = createRoughElement(
        state.elements.length,
        clientX,
        clientY,
        clientX,
        clientY,
        { type: state.activeToolItem, stroke: action.payload.stroke, fill: action.payload?.fill, size: action.payload.size}
      );

      return {
        ...state,
        toolActionType: state.activeToolItem === TOOL_ITEMS.TEXT ? TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
        elements: [...prevElements, newElement],
      };

    } 
    else if (action.type === BOARD_ACTIONS.DRAW_MOVE) 
    {
      const { clientX, clientY } = action.payload;
      const prevElements = [...state.elements];
      const idx = state.elements.length - 1;

      if(prevElements[idx].type === "BRUSH" || prevElements[idx].type === "ERASER" )
      {
        prevElements[idx].points = [...prevElements[idx].points,{ x: clientX, y: clientY }];
        prevElements[idx].path = new Path2D(getSvgPathFromStroke(getStroke(prevElements[idx].points,{size:prevElements[idx].size})));
        return {...state,elements: prevElements};
      }

      prevElements[idx].x2 = clientX;
      prevElements[idx].y2 = clientY;

      const x1 = prevElements[idx].x1;
      const y1 = prevElements[idx].y1;
      const stroke = prevElements[idx].stroke;
      const fill = prevElements[idx].fill;
      const size = prevElements[idx].size;

      const newElement = createRoughElement(idx, x1, y1, clientX, clientY, {
        type: state.activeToolItem, stroke: stroke, fill: fill, size: size
      });
      prevElements[idx] = newElement;

      return { ...state, elements: [...prevElements] };
    } 
    else if( action.type === "DRAW_UPP")
    {
      const prevElements = [...state.elements];
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(prevElements);
      return {
        ...state,
        history: newHistory,
        index: state.index + 1,
      };
    }
    else if (action.type === BOARD_ACTIONS.DRAW_UP) 
    {
      return { ...state, toolActionType: TOOL_ACTION_TYPES.NONE };
    } 
    else if (action.type === BOARD_ACTIONS.CHANGE_TEXT)
    {
      const idx = state.elements.length-1;
      const prevElements = [...state.elements];
      prevElements[idx].text = action.payload.text;
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(prevElements);
      return {...state,toolActionType:TOOL_ACTION_TYPES.NONE, elements : [...prevElements],history: newHistory, index: state.index + 1}

    }
    else if( action.type === BOARD_ACTIONS.UNDO)
    {
      if(state.index <= 0) 
      return state;
      return {...state,elements:state.history[state.index-1],index: state.index -1}
    }
    else if(action.type === BOARD_ACTIONS.REDO)
    {
      if(state.index >= state.history.length - 1) 
      return state;
      return {...state,elements: state.history[state.index + 1],index: state.index+1,};
    }
    else return state;
  };

  const initialBoardState = {
    activeToolItem: TOOL_ITEMS.LINE,
    toolActionType: TOOL_ACTION_TYPES.NONE,
    elements: [],
    history:[[]],
    index:0,
  };

  const [boardState, dispatch] = useReducer(boardReducer, initialBoardState);

  const changeToolHandler = (tool) => {
    
    dispatch({ type: "CHANGE_TOOL", payload: { tool: tool } });
  };

  const BoardMouseDownHandler = (event,toolboxState) => {
    if(boardState.toolActionType === "WRITING")
      return;
    const clientX = event.clientX;
    const clientY = event.clientY;
    dispatch({
      type: "DRAW_DOWN",
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke,
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,
      },
    });
  };

  const BoardMouseMoveHandler = (event) => {

    if(boardState.toolActionType === "WRITING")
    return;
    const clientX = event.clientX;
    const clientY = event.clientY;
    
    dispatch({
      type: "DRAW_MOVE",
      payload: {
        clientX,
        clientY,
      },
    });
  };

  const BoardMouseUpHandler = () => {

    if(boardState.toolActionType === "WRITING")
    return;
    if(boardState.toolActionType === "DRAWING")
    {
      dispatch({
        type: "DRAW_UPP",
      })
    }

    dispatch({
      type: "DRAW_UP",
    });
  };

  const textAreaBlur=(text)=>{
    dispatch({
      type:BOARD_ACTIONS.CHANGE_TEXT,
      payload:{
        text,
      }
    })
  }

  const BoardUndoHandler = useCallback(() => {
    dispatch({
      type: BOARD_ACTIONS.UNDO,
    });
  }, []);

  const BoardRedoHandler = useCallback(() => {
    dispatch({
      type: BOARD_ACTIONS.REDO,
    });
  }, []);


  const BoardContextvalue = {
    activeToolItem: boardState.activeToolItem,
    changeToolHandler,
    elements: boardState.elements,
    toolActionType: boardState.toolActionType,
    BoardMouseDownHandler,
    BoardMouseMoveHandler,
    BoardMouseUpHandler,
    textAreaBlur,
    undo: BoardUndoHandler,
    redo: BoardRedoHandler,
  };

  return (
    <BoardContext.Provider value={BoardContextvalue}>
      {children}
    </BoardContext.Provider>
  );
};

export default BoardProvider;
