import React, { useReducer } from 'react';
import ToolboxContext from './toolboxcontext';
import { TOOL_ITEMS, TOOLBOX_ACTIONS,COLORS } from "../../constants";

const ToolboxProvider = ({children}) => {

    const toolboxReducer=(state,action)=>{
        if(action.type === TOOLBOX_ACTIONS.CHANGE_STROKE)
        {
           const newState = {...state};
           newState[action.payload.tool].stroke = action.payload.stroke;
           return newState;
        }
        else if(action.type === TOOLBOX_ACTIONS.CHANGE_FILL)
        {
           const newState = {...state};
           newState[action.payload.tool].fill = action.payload.fill;
           return newState;
        }
        else if(action.type === TOOLBOX_ACTIONS.CHANGE_SIZE)
        {
           const newState = {...state};
           newState[action.payload.tool].size = action.payload.size;
           return newState;
        }
        else
        return state;
    }

    const initialToolboxState ={
        [TOOL_ITEMS.LINE]:{
            stroke: COLORS.BLACK,
            size:1
        },
        [TOOL_ITEMS.RECTANGLE]:{
            stroke: COLORS.BLACK,
            fill:null,
            size:1
        },
        [TOOL_ITEMS.CIRCLE]:{
            stroke: COLORS.BLACK,
            fill:null,
            size:1
        },
        [TOOL_ITEMS.ARROW]:{
            stroke: COLORS.BLACK,
            size:1
        },
        [TOOL_ITEMS.BRUSH]: {
            stroke: COLORS.BLACK,
            size:1,
          },
        [TOOL_ITEMS.ERASER]: {
            stroke: COLORS.WHITE,
            size:1,
        },
        [TOOL_ITEMS.TEXT]: {
            stroke: COLORS.BLACK,
            size: 32,
        },

    };
    
    const [toolboxState,dispatch] = useReducer(toolboxReducer,initialToolboxState);

    const changeStrokeHandler = (tool,stroke)=>{
        dispatch({
            type:TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload:{
                tool,stroke
            }
        })
    }

    const changeFillHandler = (tool,fill)=>{
        dispatch({
            type:TOOLBOX_ACTIONS.CHANGE_FILL,
            payload:{
                tool,fill
            }
        })
    }

    const changeSizeHandler = (tool,size)=>{
        dispatch({
            type:TOOLBOX_ACTIONS.CHANGE_SIZE,
            payload:{
                tool,size
            }
        })
    }

  
    const ToolboxContextvalue = {
        toolboxState,
        changeStrokeHandler,
        changeFillHandler,
        changeSizeHandler
    }
  
    return (
    <ToolboxContext.Provider value={ToolboxContextvalue}>
      {children}
    </ToolboxContext.Provider>
  );
}

export default ToolboxProvider;
