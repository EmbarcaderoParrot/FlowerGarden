
// Some of this code is based on flower samples from
// https://www.html5canvastutorials.com/advanced/html5-canvas-blooming-flowers-effect/

"use strict";

function getVal(val, def) {
  if (val == null)
    return def;
  return val;
}

class Pic extends CanvasTool.ImageGraphic {
  constructor(opts) {
    super(opts);
    this.targetURL = opts.targetURL;
  }

  onClick(e) {
    if (!this.targetURL)
      return true;
    window.open(this.targetURL, "gardenInfo");
    return true;
  }
}

class Circle extends CanvasTool.Graphic {
  constructor(opts) {
    super(opts);
    console.log("Circle ", opts);
  }
}

var PICS = [
  {
    id: 'don', url: 'images/penguin.svg', x: 50, y: 0, width: 20, height: 30,
    targetURL: 'http://worldviews.club/don'
  },
  {
    id: 'shawna', url: 'images/penguin2.svg', x: 100, y: 50, width: 20, height: 30,
    targetURL: 'http://worldviews.club/shawna'
  },
  {
    id: 'manami', url: 'images/mamaP.jpg', x: 200, y: -50, width: 40, height: 50,
    targetURL: 'http://www.dancevita.com/'
  },
  {
    id: 'taiko', url: 'images/taiko.svg', x: 150, y: -100, width: 50, height: 50,
    targetURL: 'http://taiko.org'
  },
  {
    id: 'candle', url: 'images/animated-candle-image-0022.gif', x: 250, y: -200, width: 30, height: 60,
    targetURL: 'http://taiko.org'
  },
  {
    id: 'candle', url: 'images/transFlower.png', x: -50, y: 150, width: 60, height: 60,
    targetURL: 'http://taiko.org'
  }
];


class GardenTool extends CanvasTool {
  constructor(name, opts) {
    super(name, opts);
    opts = opts || {};
    this.numStartupFlowers = getVal(opts.numStartupFlowers, 10);
    this.maxNumWildFlowers = getVal(opts.maxNumWildFlowers, 10);
    var ctx = this.ctx;
    ctx.strokeStyle = "white";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "#333";
    ctx.globalAlpha = .85;
    this.flowers = [];
    this.initGUI();
  }

  xresize() {
    //console.log("resizing the canvas...");
    var view = this.getView();
    console.log("view:", view);
    /*
    let canvasWidth = this.canvas.clientWidth;
    let canvasHeight = this.canvas.clientHeight;
    let maxCanvasSize = 800;
    if (canvasWidth > maxCanvasSize) {
        canvasWidth = maxCanvasSize;
    }
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasWidth;
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    */
    this.setView(view);
    this.draw();
  }


  clear() {
    super.clear();
    this.flowers = [];
  }

  initGUI() {
    var inst = this;
    $("#save").click(e => inst.downloadGardenObj());
    var dropzone = "#" + this.canvasName;
    $(dropzone).on('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    $(dropzone).on('dragenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    $(dropzone).on('drop', (e) => inst.handleDrop(e));
  }


  start() {
    var inst = this;
    this.flowers = [];
    super.start();
  }

  startWildFlowers(maxNumWildFlowers) {
    var inst = this;
    inst.numWildFlowers = 0;
    inst.maxNumWildFlowers = maxNumWildFlowers;
    setInterval(() => {
      if (inst.numWildFlowers < inst.maxNumWildFlowers) {
        inst.numWildFlowers++;
        inst.addFlowers(1);
      }
    }, 500);
  }

  loadPics(pics) {
    var inst = this;
    pics.forEach(pic => inst.addPic(pic));
  }

  addFlowers(numFlowers) {
    console.log("addFlowers " + numFlowers);
    for (var i = 0; i < numFlowers; i++)
      this.addFlower();
  }

  addFlower(opts) {
    opts = opts || {};
    if (opts.x == null)
      opts.x = uniform(-100, 100);
    if (opts.y == null)
      opts.y = uniform(-100, 100);
    var f = new Flower(opts);
    this.addGraphic(f);
    this.flowers.push(f);
    return f;
  }

  getNumFlowers() {
    return this.flowers.length;
  }

  addPic(opts) {
    var imgGraphic = new Pic(opts);
    this.addGraphic(imgGraphic);
  }

  handleMouseDown(e) {
    if (e.which != 1)
      return;
    var x = e.clientX;
    var y = e.clientY;
    var pt = this.getMousePos(e);
    console.log("new flower ", pt);
    var f = new Flower(pt);
    this.addGraphic(f);
    this.flowers.push(f);
  }

  clearCanvas() {
    //var ctx = this.canvas.getContext('2d');
    var ctx = this.ctx;
    var canvas = this.canvas;
    ctx.resetTransform();
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#999';
    ctx.fillStyle = this.background;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  async loadGardenFile(url) {
    url = url || "garden.json";
    console.log("Reading garden file " + url);
    var obj = await loadJSON("garden.json");
    console.log("got garden data: " + JSON.stringify(obj));
    this.loadGardenJSON(obj);
  }

  // load flowers from a JSON object
  loadGardenJSON(obj) {
    console.log("loadGardenJSON");
    obj.flowers.forEach(flower => {
      console.log("flower:", flower);
      this.addFlower(flower);
    })
  }

  async loadGardenFromDB(url) {
    url = url || "/getGaden";
    var obj = await loadJSON(url);
    console.log("got garden data: " + JSON.stringify(obj));
    this.loadGardenJSON(obj);
  }
  
  getGardenStateObj() {
    var obj = { flowers: []};
    this.flowers.forEach(f => obj.flowers.push(f.getState()));
    return obj;
  }

  downloadGardenObj() {
    var obj = this.getGardenStateObj();
    var jstr = JSON.stringify(obj, null, 3);
    downloadFromBrowser("gardenState.json", jstr);
  }

  handleDrop(e) {
    var inst = this;
    if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
      e.preventDefault();
      e.stopPropagation();
      var files = e.originalEvent.dataTransfer.files;
      if (files.length > 1) {
        alert("Cannot handle multiple dropped files");
        return;
      }
      var file = files[0];
      console.log("file", file);
      console.log("files", e.originalEvent.dataTransfer.files)
      var reader = new FileReader();
      reader.onload = (e) => {
        var jstr = reader.result;
        console.log("got jstr", jstr);
        var data = JSON.parse(jstr);
        console.log("data", data);
        inst.clear();
        inst.loadGardenJSON(data);
      };
      var txt = reader.readAsText(file);
    }
  }

}

