

"use strict"

class SvetlanaFlower extends Flower {
    constructor(opts) {
        super(opts);
        this.showFace = true;
        this.affect = 5;
    }

    xxxdraw(canvas, ctx) {
        //super.draw(canvas, ctx);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = .7;
        ctx.beginPath();
        var a0 = Math.PI / 2 - 0.7;
        var a1 = Math.PI / 2 + 0.7;
        ctx.arc(this.cx, this.cy, 20, a0, a1);
        ctx.fill();
        ctx.stroke();
    }


    drawFace(ctx, cx, cy, r) {
        console.log("drawFace affect", this.affect);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = .7;
        r = r * 10;
        var d = .3 * r;
        var leyex = cx - d;
        var leyey = cy - d;
        var reyex = cx + d;
        var reyey = cx - d;
        var er = 0.1 * r;
        ctx.beginPath();
        ctx.arc(leyex, leyey, er, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(reyex, reyey, er, 0, 2 * Math.PI);
        ctx.fill();
        if (this.affect < 5)
            return;
        ctx.beginPath();
        var a0 = Math.PI / 2 - 0.7;
        var a1 = Math.PI / 2 + 0.7;
        ctx.arc(cx, cy, 0.5 * r, a0, a1);
        ctx.stroke();
    }

}

//# sourceURL=js/SvetlanaFlower.js
