const json = {
    rooms: [{
            id: 0,
            name: 'garden',
            directions: {
                n: 1,
                s: null,
                e: null,
                w: 2,
            },
            objects: [],
            hotspots: [{
                id: 0,
                name: 'bbq',
                descr: 'una griglia',
                x: 150,
                y: 250,
                w: 150,
                h: 100
            }]
        },
        {
            id: 1,
            name: 'bbq',
            directions: {
                n: null,
                s: 0,
                e: null,
                w: null,
            },
            objects: [],
            hotspots: []
        },
        {
            id: 2,
            name: 'cancelletto',
            directions: {
                n: 3,
                s: 0,
                e: null,
                w: null,
            },
            objects: [],
            hotspots: []
        },
        {
            id: 3,
            name: 'cancelletto Aperto',
            directions: {
                n: 4,
                s: 2,
                e: null,
                w: null,
            },
            objects: [],
            hotspots: []
        },
        {
            id: 4,
            name: 'west',
            directions: {
                n: null,
                s: 3,
                e: null,
                w: null,
            },
            objects: [],
            hotspots: []
        }
    ]
}


let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
const WIDTH = canvas.width = 400;
const HEIGHT = canvas.height = 600;

let rooms = [];
let gui;

//Loop 
let fps = 30;
let now;
let then = Date.now();
let interval = 5500 / fps;
let delta;
let index = 0;

let loop = () => {
    window.requestAnimationFrame(loop);
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        rooms[index].loop(gui.getMouseMove);
        gui.drawDirectionArrows(rooms[index].directions)
        gui.description('xxx')
        then = now - (delta % interval);
    }
}

class Gui {
    constructor(canvas, directions) {
        this.side = 30;
        this.centerX = WIDTH / 4;
        this.centerY = HEIGHT / 4;
        this.halfWidth = WIDTH / 2;
        this.halfHeight = HEIGHT / 2;

        this.setDirections(directions);
        this.canvas = canvas;

        this.IsDescrMode = false;
        this.descrTimer = 0;

        this.mouseMove = {
            x: 0,
            y: 0
        };
        this.mouseClick = false;

        this.canvas.addEventListener('mousedown', (e) => this.mouseClickEventHandler(e, 'down'))
        this.canvas.addEventListener('mouseup', (e) => this.mouseClickEventHandler(e, 'up'))
        
        this.canvas.addEventListener('mousemove', (e) => this.mouseMoveEventHandler(e))
    }

    drawDirectionArrows() {
        ctx.save()
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "blue";

        this.n !== null && this.createDirectionArrow([this.centerX, 0, this.halfWidth, this.side]);
        this.s !== null && this.createDirectionArrow([this.centerX, HEIGHT - this.side, this.halfWidth, this.side]);
        this.e !== null && this.createDirectionArrow([0, this.centerY, this.side, this.halfHeight]);
        this.w !== null && this.createDirectionArrow([WIDTH - this.side, this.centerY, this.side, this.halfHeight]);
        ctx.restore()
    }



    createDirectionArrow(args) {
        ctx.fillRect(...args);
    }

    mouseClickEventHandler(e, mode) {
        if( mode === 'down' ){
            let mouse = this.getMousePos(e);
            if( !this.IsDescrMode ){
                this.setDirection(mouse);
                this.setDirections(rooms[index].directions)
            }
            this.mouseClick = e.button;
            this.IsDescrMode = !this.IsDescrMode;
        } else {
            this.mouseClick = false;
        }
    }

    setDirection(mouse){
        this.n !== null && mouse.x > this.centerX && mouse.x < this.centerX + this.halfWidth && mouse.y > 0 && mouse.y < this.side && (index = this.n)
        this.s !== null && mouse.x > this.centerX && mouse.x < this.centerX + this.halfWidth && mouse.y > HEIGHT - this.side && mouse.y < HEIGHT && (index = this.s)
        this.e !== null && mouse.x > 0 && mouse.x < this.side && mouse.y > this.centerY && mouse.y < this.centerY + this.halfHeight && (index = this.e)
        this.w !== null && mouse.x > WIDTH - this.side && mouse.x < WIDTH && mouse.y < this.centerY + this.halfHeight && (index = this.w)
    }

    mouseMoveEventHandler(e) {
        this.mouseMove = this.getMousePos(e);
    }

    get getMouseMove() {
        return this.mouseMove;
    }
    getMousePos(e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    setDirections(directions) {
        this.n = directions.n;
        this.s = directions.s;
        this.e = directions.e;
        this.w = directions.w;
    }

    description(descr){
        if( this.IsDescrMode ){
            ctx.save()
            ctx.fillStyle = "#fff";
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, WIDTH, HEIGHT)
            ctx.globalAlpha = 1;
    
            ctx.font = `16px Arial`;
            ctx.fillRect(0, HEIGHT - 100, WIDTH, 100)
            ctx.fillStyle = "#000";
            ctx.fillText(descr, 10, HEIGHT - 80); 
            
            ctx.restore()
        }
    }
}

class Room {
    constructor(id, img, directions, objects, hotspots) {
        this.id = id;
        this.img = img;
        this.directions = directions;
        this.objects = objects;
        this.hotspots = hotspots.map(hotspot => new Hotspot(hotspot.id, hotspot.name, hotspot.descr, hotspot.x, hotspot.y, hotspot.w, hotspot.h));
    }

    loop(mouseMove) {
        this.draw();
        this.setHotspot(mouseMove)
    }

    draw() {
        ctx.drawImage(this.img, 0, 0, WIDTH, HEIGHT);
    }

    setHotspot(mouseMove) {
        !this.IsDescrMode && this.hotspots.map(hotspot => hotspot.look(mouseMove))
    }
}

class Hotspot {
    constructor(id, name, descr, x, y, w, h) {
        this.id = id;
        this.name = name;
        this.descr = descr;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fontSize = '18';
    }

    look(mouseMove) {
        if ( mouseMove ){
            this.isHovered(mouseMove) && this.drawDescr(mouseMove);
        }
    }

    isHovered(mouseMove) {
        return mouseMove.x > this.x && mouseMove.x < this.x + this.w && 
        mouseMove.y > this.y && mouseMove.y < this.y + this.h
    }

    drawDescr({x, y}){

        ctx.save()
        ctx.fillStyle = "#fff";
        ctx.font = `${this.fontSize}px Arial`;
        const rectWidth = ctx.measureText(this.descr).width * 1.5;
        const rectHeight = this.fontSize * 1.5;
        ctx.fillRect(x - rectWidth *.5, y - rectHeight + this.fontSize *.5  , rectWidth, rectHeight)
        ctx.textAlign = 'center'
        ctx.fillStyle = "#000";
        ctx.fillText(this.descr, x, y); 
        ctx.restore()
    }
}

//Load all images 
const checkImage = path =>
    new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = err => resolve(err);
        img.src = path;
    });

const generateClass = (image, index) => {
    generateRooms(image, index);
}

const generateRooms = (image, index) => {
    const room = json.rooms[index]
    rooms.push(new Room(room.id, image, room.directions, room.objects, room.hotspots));
}

const loadAssets = () => {
    let roomsImgPath = json.rooms.map(room => `/assets/rooms/${room.id}.jpg`);
    loadImages(roomsImgPath).then(path => {
        path.map((image, index) => generateClass(image, index));
        gui = new Gui(canvas, rooms[index].directions);
        init()
    })


};
const loadImages = paths => Promise.all(paths.map(checkImage));

let init = () => {
    window.requestAnimationFrame(loop);
}

loadAssets()