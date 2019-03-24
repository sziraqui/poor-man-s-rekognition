$(document).ready(main);
function main() {
    var fileInput = document.getElementById('imageFile');
    var canvas1Title = document.getElementById('canvas1Title');
    var canvas1 = document.getElementById('sourceImageCanvas1');
    var postReq = document.getElementById('postRequestJson');
    var postButton = document.getElementById('postButton');
    var postRes = document.getElementById('postResponseJson');
    
    var imageUrl = document.getElementById('imageUrl');
    var canvas2Title = document.getElementById('canvas2Title');
    var canvas2 = document.getElementById('sourceImageCanvas2');
    var getReq = document.getElementById('getRequestJson');
    var getButton = document.getElementById('getButton');
    var getRes = document.getElementById('getResponseJson');
    
    var ctx1 = canvas1.getContext('2d');
    setCanvasProp(ctx1, "green", "blue", 0.6);
    fileInput.addEventListener('change', (e) => renderImage(ctx1, e), false);
}
