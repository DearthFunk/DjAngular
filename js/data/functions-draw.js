function drawPath(ctx,positions,lineWidth,lineColor) {
    ctx.beginPath();
    ctx.moveTo(positions[0].x,positions[0].y);
    for (var i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i].x,positions[i].y);
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
}


function drawRectangle(ctx,x,y,w,h,fillColor,lineWidth,lineColor) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle =  lineColor;
    ctx.stroke();
}


function drawRoundedRectangle(ctx,x, y, w, h, r) {
    if (w < 2 * r) r = w ;
    if (h < 2 * r) r = h ;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
