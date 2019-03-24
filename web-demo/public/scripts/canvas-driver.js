
function setCanvasProp(c, strokeColor, fillColor, alpha) {
    c.strokeStyle = strokeColor;
    c.fillStyle = fillColor;
    c.globalAlpha = alpha;
}

function drawRect(c, x, y, w, h) {
    c.rect(x, y, w, h);
    c.stroke();
}

function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
}

function bboxToRect(bbox, parentWidth, parentHeight) {
    const wid = bbox.Width/parentWidth;
    const ht = bbox.Height/parentHeight;

    return {
       x: Math.round(bbox.Left/wid), 
       y: Math.round(bbox.Top/ht), 
       w: Math.round(wid), 
       h: Math.round(ht)
    }
}

function putTextBelow(c, text, color, rect) {
    var ogcolor = c.fillStyle;
    c.fillStyle = color;
    var x = rect.x
    var y = Math.round(rect.y + rect.h/2 + 8); // margin of 8px below rect
    c.fillText(text, x, y, rect.w);
    c.fillStyle = ogcolor;
}

function putScore(c, score, label, color, rect) {
    var text = label + " " + Math.round(score) + " %"
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
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
        useDataUrl(event.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);     
}


