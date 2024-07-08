import React, { useContext } from 'react';
import classes from './Toolbox.module.css'
import cx from "classnames";
import { COLORS,STROKE_TOOL_TYPES,FILL_TOOL_TYPES,SIZE_TOOL_TYPES, TOOL_ITEMS } from "../../constants";
import ToolboxContext from '../store/toolboxcontext';
import BoardContext from '../store/boardcontext';

const Toolbox = () => {

  const {activeToolItem} = useContext(BoardContext);
  const {toolboxState,changeStrokeHandler,changeFillHandler,changeSizeHandler} = useContext(ToolboxContext);
  
  const strokeColor = toolboxState[activeToolItem]?.stroke;
  const fillColor = toolboxState[activeToolItem]?.fill;
  const size = toolboxState[activeToolItem]?.size;

  return (
    <div className={classes.container}>
      {STROKE_TOOL_TYPES.includes(activeToolItem) &&(<div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>Stroke</div>
        <div className={classes.colorsContainer}>
            <div>
              <input
                className={classes.colorPicker}
                type="color"
                value={strokeColor}
                onChange={(e) => changeStrokeHandler(activeToolItem, e.target.value)}
              ></input>
            </div>
         {Object.keys(COLORS).map((k)=>{
          return (
            <div key={Math.random()} className={cx(classes.colorBox,{[classes.activeColorBox]: strokeColor===COLORS[k]})} 
            style={{backgroundColor: COLORS[k]}}
            onClick={()=> changeStrokeHandler(activeToolItem,COLORS[k])}
            >

            </div>
          )
         })}
        </div>
      </div>)}

      {FILL_TOOL_TYPES.includes(activeToolItem) &&(<div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>Fill</div>
        <div className={classes.colorsContainer}>
            {fillColor === null ? (
              <div
                className={cx(classes.colorPicker, classes.noFillColorBox)}
                onClick={() => changeFillHandler(activeToolItem, COLORS.BLACK)}
              ></div>
            ) : (
              <div>
                <input
                  className={classes.colorPicker}
                  type="color"
                  value={fillColor}
                  onChange={(e) => changeFillHandler(activeToolItem, e.target.value)}
                ></input>
              </div>
            )}
            <div
              className={cx(classes.colorBox, classes.noFillColorBox, {
                [classes.activeColorBox]: fillColor === null,
              })}
              onClick={() => changeFillHandler(activeToolItem, null)}
            ></div>
            {Object.keys(COLORS).map((k) => {
              return (
                <div
                  key={k}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: fillColor === COLORS[k],
                  })}
                  style={{ backgroundColor: COLORS[k] }}
                  onClick={() => changeFillHandler(activeToolItem, COLORS[k])}
                ></div>
              );
            })}
        </div>
      </div>)}

      {SIZE_TOOL_TYPES.includes(activeToolItem) &&(<div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>{activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}</div>
        <div className={classes.colorsContainer}>
         <input type="range" 
         min={activeToolItem === TOOL_ITEMS.TEXT ? 12:1}
         max={activeToolItem === TOOL_ITEMS.TEXT ? 64:50} 
         step={1}
         value={size}
         onChange={(e)=> changeSizeHandler(activeToolItem,e.target.value)}
         />
        </div>
      </div>)}
    </div>
  );
}

export default Toolbox;


