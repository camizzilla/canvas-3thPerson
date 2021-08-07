const json = {
    rooms: [{
        id: 0,
        name: 'casa',
        directions: {
            n: true,
            s: true,
            e: true,
            w: true,
        },
        objects: [],
        hotspots: []
    }]
}


let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
const WIDTH = canvas.width = 600;
const HEIGHT = canvas.height = 800;

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
        rooms[index].draw();
        gui.drawDirectionArrows(rooms[index].directions)
        then = now - (delta % interval);
    }
}

class Gui {
    constructor() {
        this.side = 30
    }

    drawDirectionArrows({
        n,
        s,
        e,
        w
    }) {
        ctx.save()
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "blue";
        n && this.createDirectionArrow([0, 0, WIDTH, this.side]);
        s && this.createDirectionArrow([0, HEIGHT - this.side, WIDTH, this.side]);
        e && this.createDirectionArrow([0, 0, this.side, HEIGHT]);
        w && this.createDirectionArrow([WIDTH - this.side, 0, this.side, HEIGHT]);
        ctx.restore()
    }

    createDirectionArrow(args) {
        ctx.fillRect(...args);
    }
}

class Room {
    constructor(id, img, directions, objects, hotspots) {
        this.id = id;
        this.img = img;
        this.directions = directions;
        this.objects = objects;
        this.hotspots = hotspots;
    }

    draw() {
        ctx.drawImage(this.img, 0, 0, WIDTH, HEIGHT);
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

const generateClass = (image) => {
    gui = new Gui();
    generateRooms(image);
}

const generateRooms = (image) => {
    rooms = json.rooms.map(room => new Room(room.id, image, room.directions, room.objects, room.hotspots));
}

const loadAssets = () => {
    let roomsImgPath = json.rooms.map(room => `/assets/rooms/${room.id}.jpg`);
    loadImages(roomsImgPath).then(path => path.map(image => {
        generateClass(image);
        init()
    }));

};
const loadImages = paths => Promise.all(paths.map(checkImage));

let init = () => {
    window.requestAnimationFrame(loop);
}

loadAssets()