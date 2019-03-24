$(document).ready(main);
function main() {
    var sourceImage = document.getElementById('sourceImageFile');
    var targetImage = document.getElementById('targetImageFile');
    var similarityInp1 = document.getElementById('similarityThreshold1');
    var canvas1Title = document.getElementById('canvas1Title');
    var sourceCanvas1 = document.getElementById('sourceImageCanvas1');
    var targetCanvas1 = document.getElementById('targetImageCanvas1');
    var postReq = document.getElementById('postRequestJson');
    var postButton = document.getElementById('postButton');
    var postRes = document.getElementById('postResponseJson');
    
    var sourceImageUrl = document.getElementById('sourceImageUrl');
    var targetImageUrl = document.getElementById('targetImageUrl');
    var similarityInp2 = document.getElementById('similarityThreshold2');
    var canvas2Title = document.getElementById('canvas2Title');
    var sourceCanvas2 = document.getElementById('sourceImageCanvas2');
    var targetCanvas2 = document.getElementById('targetImageCanvas2')
    var getReq = document.getElementById('getRequestJson');
    var getButton = document.getElementById('getButton');
    var getRes = document.getElementById('getResponseJson');
    
    var sourceCtx1 = sourceCanvas1.getContext('2d');
    var targetCtx1 = targetCanvas1.getContext('2d');
    var sourceCtx2 = sourceCanvas2.getContext('2d');
    var targetCtx2 = targetCanvas2.getContext('2d');
    setCanvasProp(sourceCtx1, "cyan", "lawngreen", 1.0, 2, "12pt serif");
    setCanvasProp(sourceCtx2, "cyan", "lawngreen", 1.0, 2, "12pt serif");
    setCanvasProp(targetCtx1, "cyan", "lawngreen", 1.0, 2, "12pt serif");
    setCanvasProp(targetCtx2, "cyan", "lawngreen", 1.0, 2, "12pt serif");
    addHandlersForPost('/api/compare-faces/from-blob', sourceCtx1, targetCtx1, postButton, sourceImage, targetImage, similarityInp1, postReq, postRes);
    addHandlersForGet('/api/compare-faces/from-url', sourceCtx2, targetCtx2, getButton, sourceImageUrl, targetImageUrl, similarityInp2, getReq, getRes);
}

function makePostRequest(apiEndpoint, reqBody, onResolve, resolveTarget, sourceCtx, targetCtx) {
    
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
        resJson => onResolve(resJson, resolveTarget, sourceCtx, targetCtx)
    ).catch(
        err => console.log('makePostRequest:', apiEndpoint, '\n', err)
    );
}

function makeGetRequest(apiEndpoint, reqParams, onResolve, resolveTarget, sourceCtx, targetCtx) {
    var expandUrl = "?";
    for(var key in reqParams) {
        expandUrl = expandUrl + key + "=" + reqParams[key] + "&";
    }
    var getUrl = apiEndpoint+expandUrl.slice(0, expandUrl.length -1);
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
        resJson => onResolve(resJson, resolveTarget, sourceCtx, targetCtx)
    ).catch(
        err => console.log('makeGetRequest:', getUrl, '\n', err)
    );
}

function resolveFetch(resJson, resolveTarget, sourceCtx, targetCtx) {
    console.log(resJson);
    showSourceFace(sourceCtx, resJson);
    resolveTarget.innerHTML = prettify(resJson);
    showFaceMatches(targetCtx, resJson);
}


function prettify(json) {
    if (typeof json != 'string') {
         return JSON.stringify(json, undefined, 2);
    }
    return json;
}

function showSourceFace(ctx, resJson) {
    var sourceFace = resJson.SourceImageFace;
    //console.log('faceDetails', faceDetails);
    if(sourceFace) {
        var rect = bboxToRect(sourceFace.BoundingBox, ctx.canvas.width, ctx.canvas.height);
        drawRect(ctx, rect.x, rect.y, rect.w, rect.h);
        putScore(ctx, sourceFace.Confidence, "isFace", "blue", rect, 16);
    }
}

function showFaceMatches(ctx, resJson) {
    var faceMatches = resJson.FaceMatches;
    if(faceMatches) {
        for(var faceMatch of faceMatches) {
            if (faceMatch) {
                var face = faceMatch.Face;
                var similarity = faceMatch.Similarity;
                var rect = bboxToRect(face.BoundingBox, ctx.canvas.width, ctx.canvas.height);
                drawRect(ctx, rect.x, rect.y, rect.w, rect.h);
                putScore(ctx, similarity, "matches", "lawngreen", rect, -16);
            }
        }
    }
    var unMatched = resJson.UnmatchedFaces;
    if (unMatched) {
        for(var face of unMatched) {
            var rect = bboxToRect(face.BoundingBox, ctx.canvas.width, ctx.canvas.height);
            var confidence = face.Confidence;
            drawRect(ctx, rect.x, rect.y, rect.w, rect.h);
            putScore(ctx, confidence, "isFace", "blue", rect, 16);
        }
    }
}

function preparPostReqBody(source, target, similarity) {
    return {
        SourceImage: {
            Bytes: source
        },
        TargetImage: {
            Bytes: target
        },
        SimilarityThreshold: similarity
    }
}

function prepareGetReqParam(source, target, similarity){
    return {
        sourceImage: source,
        targetImage: target,
        similarityThreshold: similarity
    }
}

function addHandlersForPost(apiEndpoint, sourceCtx, targetCtx, btn, sourceFile, targetFile, similarityInp, requestTarget, responseTarget) {
    var sourceDataUrl = null;
    var targetDataUrl = null;
    var similarityThreshold = null;

    var setBtnClick = () => {
        
        if (sourceDataUrl && targetDataUrl && similarityThreshold) {
            var reqBody = preparPostReqBody(sourceDataUrl, targetDataUrl, similarityThreshold);
            requestTarget.innerHTML = prettify(reqBody);
            btn.onclick = (e) => {
                makePostRequest(apiEndpoint, reqBody, resolveFetch, responseTarget, sourceCtx, targetCtx);
            };
        }
    }

    var setSourceDataUrl = (dataUrl) => {
        sourceDataUrl = dataUrl;
        setBtnClick();
    };

    var setTargetDataUrl = (dataUrl) => {
        targetDataUrl = dataUrl;
        setBtnClick();
    };
    
    similarityInp.addEventListener('input', (e) => {
        similarityThreshold = similarityInp.value;
        setBtnClick();
    });

    sourceFile.addEventListener('change', (e) => renderImage(sourceCtx, e, setSourceDataUrl), false);
    targetFile.addEventListener('change', (e) => renderImage(targetCtx, e, setTargetDataUrl), false);  
}

function addHandlersForGet(apiEndpoint, sourceCtx, targetCtx, btn, sourceUrlInp, targetUrlInp, similarityInp, requestTarget, responseTarget) {
    var sourceUrl = null;
    var targetUrl = null;
    var similarityThreshold = null;

    var setBtnClick = () => {
      
        if (sourceUrl && targetUrl && similarityThreshold) {
            var reqParams = prepareGetReqParam(sourceUrl, targetUrl, similarityThreshold)
            requestTarget.innerHTML = prettify(reqParams);
            btn.onclick = (e) => {
                makeGetRequest(apiEndpoint, reqParams, resolveFetch, responseTarget, sourceCtx, targetCtx);
            };
        }
    }

    var setSourceUrl = (e) => {
        sourceUrl = sourceUrlInp.value;
        renderImageFromUrl(sourceCtx, sourceUrl);
        setBtnClick();
    };

    var setTargetUrl = (e) => {
        targetUrl = targetUrlInp.value;
        renderImageFromUrl(targetCtx, targetUrl);
        setBtnClick();
    };
    
    similarityInp.addEventListener('input', (e) => {
        similarityThreshold = similarityInp.value;
        setBtnClick();
    });
    
    sourceUrlInp.addEventListener('input', setSourceUrl, false);
    targetUrlInp.addEventListener('input', setTargetUrl, false);
}