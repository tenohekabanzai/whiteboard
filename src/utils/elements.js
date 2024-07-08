import getStroke from 'perfect-freehand';
import getArrowHeadsCoordinates from './math';
import { distanceBetweenPoints } from './math';
import rough from 'roughjs/bin/rough'
const gen = rough.generator();

export const createRoughElement = (id,x1,y1,x2,y2,{type,stroke,fill,size})=>{

    const element = {id,x1,y1,x2,y2,type,fill,stroke,size};
    let options = {seed: id+1,fillStyle:"solid"}

    if(stroke)
    options.stroke = stroke
    if(fill)
    options.fill = fill        
    if(size)
    options.strokeWidth = size

    if(type==="TEXT")
    {
      element.text = "";
      return element;
    }
    else if(type==="BRUSH" || type==="ERASER")
    {
        const brushElement = {
            id,
            points: [{x:x1,y:y1}],
            path: new Path2D(getSvgPathFromStroke(getStroke([{x:x1,y:y1}],{size:size}))),
            type,
            stroke,
            size,
        }
        return brushElement;
    } 
    else if(type==="LINE")
    element.roughEle = gen.line(x1,y1,x2,y2,options);
    else if(type==='RECTANGLE')
    element.roughEle = gen.rectangle(x1,y1,x2-x1,y2-y1,options);
    else if(type==='CIRCLE')
    element.roughEle = gen.ellipse((x1+x2)/2,(y1+y2)/2,x2-x1,y2-y1,options);
    else if(type==='ARROW')
    {
        const {x3,y3,x4,y4} = getArrowHeadsCoordinates(x1,y1,x2,y2,"20");
        const points = [[x1,y1],[x2,y2],[x3,y3],[x2,y2],[x4,y4]];
        element.roughEle = gen.linearPath(points,options);
    }
    
    return element;
}

export default createRoughElement;

export const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";
  
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );
  
    d.push("Z");
    return d.join(" ");
  };