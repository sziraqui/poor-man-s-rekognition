
function setCanvasProp(c, strokeColor, fillColor, alpha, lineWidth, fontSize) {
    c.strokeStyle = strokeColor;
    c.fillStyle = fillColor;
    c.globalAlpha = alpha;
    c.lineWidth = lineWidth;
    c.font = fontSize;
}

function drawRect(c, x, y, w, h) {
    //console.log('drawRect', x,y,w,h);
    c.strokeRect(x, y, w, h);
}

function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
}

function bboxToRect(bbox, parentWidth, parentHeight) {
    const wid = bbox.Width*parentWidth;
    const ht = bbox.Height*parentHeight;
    console.log('bboxToRect', parentWidth, parentWidth);
    return {
       x: Math.round(bbox.Left*wid), 
       y: Math.round(bbox.Top*ht), 
       w: Math.round(wid), 
       h: Math.round(ht)
    }
}

function putTextBelow(c, text, color, rect) {
    var ogcolor = c.fillStyle;
    c.fillStyle = color;
    var x = rect.x
    var y = rect.y + rect.h + 24; // margin of 24px below rect
    c.fillText(text, x, y);
    c.fillStyle = ogcolor;
}

function putScore(c, score, label, color, rect) {
    var text = label + ": " + (score*100).toFixed(2) + " %"
    putTextBelow(c, text, color, rect);
}

/** Source: https://stackoverflow.com/a/23669825/6699069 */
function encodeImageFileAsURL(inputElement, callback) {

    var filesSelected = inputElement.files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64

            var newImage = document.createElement('img');
            newImage.src = srcData;

            document.getElementById("imgTest").innerHTML = newImage.outerHTML;
            callback(document.getElementById("imgTest").innerHTML);
        }
        fileReader.readAsDataURL(fileToLoad);
    }
}

/** Source: https://stackoverflow.com/a/10906961/6699069 */
function renderImage(ctx, e, useDataUrl){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            resize(ctx, img.width, img.height);
            clearCanvas(ctx);
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
        useDataUrl(event.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);     
}

function renderImageFromUrl(ctx, url) {
    var img = new Image();
    img.onload = function(){
        resize(ctx, img.width, img.height);
        clearCanvas(ctx);
        ctx.drawImage(img, 0, 0);
    }
    img.src = url;
}
/** For Canvas ctx.save, ctx.restore glitch when changing canvas.width or canvas.height directtly 
 * Ref: https://stackoverflow.com/q/48044951
*/
function save(ctx){
    let props = ['strokeStyle', 'fillStyle', 'globalAlpha', 'lineWidth', 
    'lineCap', 'lineJoin', 'miterLimit', 'lineDashOffset', 'shadowOffsetX',
    'shadowOffsetY', 'shadowBlur', 'shadowColor', 'globalCompositeOperation', 
    'font', 'textAlign', 'textBaseline', 'direction', 'imageSmoothingEnabled'];
    let state = {}
    for(let prop of props){
      state[prop] = ctx[prop];
    }
    return state;
}
  
function restore(ctx, state){
    for(let prop in state){
      ctx[prop] = state[prop];
    }
}
  /** Must use this wrapper for changing canvas size
   * Otherwise, all canvas properties will be reset to defaults
   */
function resize(ctx, width, height){
    let state = save(ctx);
    ctx.canvas.width = width || canvas.width;
    ctx.canvas.height = height || canvas.height;
    restore(ctx, state);
}