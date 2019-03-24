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
    var ctx2 = canvas2.getContext('2d');
    setCanvasProp(ctx1, "cyan", "green", 1.0, 2, "16pt serif");
    setCanvasProp(ctx2, "cyan", "green", 1.0, 2, "16pt serif");
    addHandlersForPost('/api/face-detection/from-blob', ctx1, postButton, fileInput, postReq, postRes);
    addHandlersForGet('/api/face-detection/from-url', ctx2, getButton, imageUrl, getReq, getRes)
}

function makePostRequest(dataUrl, apiEndpoint, onResolve, resolveTarget, ctx) {
    var reqBody = {
        Image: {
            Bytes: dataUrl
        }
    };
    fetch(apiEndpoint, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow",
        body: JSON.stringify(reqBody)
    }).then(
        response => response.json()
    ).then(
        resJson => onResolve(resJson, resolveTarget, ctx)
    ).catch(
        err => console.log('makePostRequest:', apiEndpoint, '\n', err)
    );
}

function makeGetRequest(imageUrl, apiEndpoint, onResolve, resolveTarget, ctx) {
    var reqParams = "?imageUrl="+imageUrl;
    var getUrl = apiEndpoint+reqParams;
    fetch(getUrl, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow"
    }).then(
        response => response.json()
    ).then(
        resJson => onResolve(resJson, resolveTarget, ctx)
    ).catch(
        err => console.log('makeGetRequest:', getUrl, '\n', err)
    );
}

function resolveFetch(resJson, resolveTarget, ctx) {
    console.log(JSON.stringify(resJson));
    showFaces(ctx, resJson);
    resolveTarget.innerHTML = syntaxHighlight(resJson);
}

/** Source: https://stackoverflow.com/a/7220510/6699069 */
function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function showFaces(ctx, resJson) {
    faceDetails = resJson.FaceDetails;
    console.log('faceDetails', faceDetails);
    if(faceDetails) {
        faceDetails.forEach((face, i) => {
            var rect = bboxToRect(face.BoundingBox, ctx.canvas.width, ctx.canvas.height);
            drawRect(ctx, rect.x, rect.y, rect.w, rect.h);
            putScore(ctx, face.Confidence, "isFace", "blue", rect);
        });
    }
}

function addHandlersForPost(apiEndpoint, ctx, btn, fileTarget, requestTarget, responseTarget) {
    var useDataUrl = (dataUrl) => {
        btn.addEventListener('click', (e) => {
            requestTarget.innerHTML = syntaxHighlight({
                Image: {
                    Bytes: dataUrl
                }
            });
            makePostRequest(dataUrl, apiEndpoint, resolveFetch, responseTarget, ctx);
        }); 
    };
    fileTarget.addEventListener('change', (e) => renderImage(ctx, e, useDataUrl), false); 
}

function addHandlersForGet(apiEndpoint, ctx, btn, urlInp, requestTarget, responseTarget) {
    var url = null;
    urlInp.addEventListener('input', () => {
        url = urlInp.innerHTML;
        renderImageFromUrl(ctx, url);
    });
    btn.addEventListener('click', (e) => {
        requestTarget.innerHTML = syntaxHighlight({
            imageUrl: urlInp.innerHTML
        });
        makeGetRequest(apiEndpoint, url, resolveFetch, responseTarget, ctx);
    });
}