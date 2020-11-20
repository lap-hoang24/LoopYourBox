let video = document.createElement("video");
let canvasElement = document.getElementById("canvas");
let canvas = canvasElement.getContext("2d");
let loadingMessage = document.getElementById("loadingMessage");
let informations = document.getElementById('informations');

let action = document.getElementById('action');
let partner = document.getElementById('partner');
let container = document.getElementById('container');

let info ="";

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}
// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
});

async function tick() {
    loadingMessage.innerText = "⌛ Loading video..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
    
            info = code.data.split('##');
            
            try {
                let urlContainer = `http://localhost:3000/api/container/${info[3]}`;
                let containerInfo = await fetch(urlContainer);
                containerInfo = await containerInfo.json();

                let urlPartner = `http://localhost:3000/api/partner/${info[2]}`;
                let partnerInfo = await fetch(urlPartner);
                partnerInfo = await partnerInfo.json();
                
                informations.hidden = false;
                action.innerHTML = info[1] ;
                partner.innerHTML = partnerInfo.name ;
                container.innerHTML = `${containerInfo.name} ${containerInfo.credit} credits`;

            } catch { 
                console.log('cant fetch Info')
            }

            cancelAnimationFrame(stream);
        } 
    }
    let stream = requestAnimationFrame(tick);
}

async function validation() {
    const token = getCookie("token");
    let url = `http://localhost:3000/api/history`
    myInit = {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          reference: info[0],
          token: token,
        })
    };

    try {
        let data = await fetch(url, myInit); 
        const data2 = await data.json();
        
        if (data2) {
            window.location.replace("/partner");
        }
    } catch (e) {
        return e;
    }  
}


