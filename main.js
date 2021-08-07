const json = {
    rooms: [{
        id: 0,
        name: 'casa',
        directions: {
            n: 2,
            s: 3,
            e: 4,
            w: 5,
        },
        objects: [],
        hotspots: []
    },
    {
        id: 1,
        name: 'north',
        directions: {
            n: null,
            s: 1,
            e: null,
            w: null,
        },
        objects: [],
        hotspots: []
    },
    {
        id: 2,
        name: 'south',
        directions: {
            n: 1,
            s: null,
            e: null,
            w: null,
        },
        objects: [],
        hotspots: []
    },
    {
        id: 3,
        name: 'est',
        directions: {
            n: null,
            s: null,
            e: null,
            w: 1,
        },
        objects: [],
        hotspots: []
    },
    {
        id: 4,
        name: 'west',
        directions: {
            n: null,
            s: null,
            e: 1,
            w: null,
        },
        objects: [],
        hotspots: []
    }]
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

const generateClass = (image, index) => {
    gui = new Gui();
    generateRooms(image, index);
}

const generateRooms = (image, index) => {
    const room = json.rooms[index]
    rooms.push(new Room(room.id, image, room.directions, room.objects, room.hotspots));
}

const loadAssets = () => {
    let roomsImgPath = json.rooms.map(room => `/assets/rooms/${room.id}.jpg`);
    loadImages(roomsImgPath).then(path => path.map((image, index) => {
        generateClass(image, index);
        init()
    }));

};
const loadImages = paths => Promise.all(paths.map(checkImage));

let init = () => {
    window.requestAnimationFrame(loop);
}

loadAssets()