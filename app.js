let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext("2d");
let img = new Image();

let imageWidth,
imageHeight,
scaling = false,
scale = 1,
//ratio = 1,
maxScale,
scaleFactor = 1.1,
//scaleDown = false,
//scaleUp = false,
scaleDraw,
distance,
lastDistance = 0,
canDrag = false,
isDragging = false,
startCoords = {
    x: 0,
    y: 0
},
last = {
    x: 0,
    y: 0
},
moveX = 0,
moveY = 0,
redraw;

document.getElementById('imageLoader').onchange = function(e) {
    
    img.onload = draw;
   
    img.src = URL.createObjectURL(this.files[0]);
  };
  function draw() {
  
    let wrh = img.width / img.height;
    let newWidth = canvas.width;
    let newHeight = canvas.height;
    if (newHeight > newWidth) {
        newHeight = canvas.height;
        newWidth = newHeight * wrh;
    }

    let xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
    let yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;

    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
   
  }


  $("#myCanvas")
    .on("touchstart", function (e) {
        let position = pointerEvents(e),
            touch = e.originalEvent.touches || e.originalEvent.changedTouches;

        if (e.type === "touchstart" && touch.length === 2) {
            scaling = true;

            lastDistance = Math.sqrt(
                (touch[0].clientX - touch[1].clientX) *
                (touch[0].clientX - touch[1].clientX) +
                (touch[0].clientY - touch[1].clientY) *
                (touch[0].clientY - touch[1].clientY)
            );
        } else {
            canDrag = true;
            isDragging = scaling = false;

            startCoords = {
                x: position.x - $(this).offset().left - last.x,
                y: position.y - $(this).offset().top - last.y
            };
        }

        drawInterval = setInterval(resizeCanvas, 100)
    })
    .on("touchmove", function (e) {
        e.preventDefault();
        isDragging = true;

        if (isDragging && canDrag && scaling === false) {
            let position = pointerEvents(e),
                offset = e.type === "touchmove" ? 1.3 : 1;

            moveX = (position.x - $(this).offset().left - startCoords.x) * offset;
            moveY = (position.y - $(this).offset().top - startCoords.y) * offset;

            redraw = requestAnimationFrame(draw);
        } else if (scaling === true) {
            let touch = e.originalEvent.touches || e.originalEvent.changedTouches;


            distance = Math.sqrt(
                (touch[0].clientX - touch[1].clientX) *
                (touch[0].clientX - touch[1].clientX) +
                (touch[0].clientY - touch[1].clientY) *
                (touch[0].clientY - touch[1].clientY)
            );

            scaleDraw = requestAnimationFrame(draw);
        }
    })
    .on("touchend", function (e) {
        let position = pointerEvents(e);

        canDrag = isDragging = scaling = false;

        last = {
            x: position.x - $(this).offset().left - startCoords.x,
            y: position.y - $(this).offset().top - startCoords.y
        };

        cancelAnimationFrame(scaleDraw);
        cancelAnimationFrame(redraw);
       
    });

