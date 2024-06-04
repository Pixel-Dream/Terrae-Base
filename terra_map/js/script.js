// Temp map data, replaced by external json file in future
const mapData = {
    "hex_size": 30,
    "countries": [
        {
            "name_en": "CountryA",
            "name_cn": "国家A",
            "flag": "../img/hol.jpg",  // Example placeholder URL for flag
            "color": "#56aee5",
            "hexagons": [
                {"q": 3, "r": 5},
                {"q": 4, "r": 3},
                {"q": 4, "r": 4},
                {"q": 3, "r": 3},
                {"q": 5, "r": 4},
                {"q": 6, "r": 2},
                {"q": 5, "r": 5}
            ]
        },
        {
            "name_en": "CountryB",
            "name_cn": "国家B",
            "flag": "../img/hol.jpg",
            "color": "#96e556",
            "hexagons": [
                {"q": 6, "r": 7},
                {"q": 6, "r": 6},
                {"q": 7, "r": 7},
                {"q": 8, "r": 7},
                {"q": 7, "r": 8}
            ]
        }
    ]
};

function hexToPixel(hex, size) {
    const x = size * (3 / 2 * hex.q);
    const y = size * (Math.sqrt(3) * (hex.r + hex.q / 2));
    return { x: x, y: y };
}

function drawHexagon(ctx, x, y, size, color="#badaef") {
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + size * Math.cos(i * Math.PI / 3), y + size * Math.sin(i * Math.PI / 3));
    }
    ctx.closePath();
    ctx.lineWidth = 1.0;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}

function getHexVertices(center, size) {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
        const angle = 2 * Math.PI / 6 * i;
        const x = parseFloat((center.x + size * Math.cos(angle)).toFixed(5));
        const y = parseFloat((center.y + size * Math.sin(angle)).toFixed(5));
        vertices.push({ x: x, y: y });
    }
    return vertices;
}

function drawCountryBorder(ctx, hexagons, size) {
    const borders = new Set();
    hexagons.forEach(hex => {
        const center = hexToPixel(hex, size);
        const vertices = getHexVertices(center, size);
        for (let i = 0; i < 6; i++) {
            const edge = `${vertices[i].x},${vertices[i].y},${vertices[(i + 1) % 6].x},${vertices[(i + 1) % 6].y}`;
            const reverseEdge = `${vertices[(i + 1) % 6].x},${vertices[(i + 1) % 6].y},${vertices[i].x},${vertices[i].y}`;
            console.log(edge);
            console.log(reverseEdge);
            if (borders.has(reverseEdge)) {
                borders.delete(reverseEdge);
            } else {
                borders.add(edge);
            }
        }
    });
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    borders.forEach(border => {
        const [x1, y1, x2, y2] = border.split(',').map(Number);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    });

    ctx.stroke();
}

function calculateCenter(hexagons, size) {
    let totalX = 0;
    let totalY = 0;
    hexagons.forEach(hex => {
        const pixel = hexToPixel(hex, size);
        totalX += pixel.x;
        totalY += pixel.y;
    });
    return {
        x: totalX / hexagons.length,
        y: totalY / hexagons.length
    };
}

function drawCountryInfo(ctx, country, center) {
    const flagImg = new Image();
    flagImg.src = country.flag;
    flagImg.onload = () => {
        ctx.drawImage(flagImg, center.x + 40, center.y - 30, 20, 20); // Adjust the position and size of the flag image
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(country.name_cn, center.x + 40, center.y  );
        ctx.fillText(country.name_en, center.x + 40, center.y - 40 );
    };
}

function drawMap() {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const hexSize = mapData.hex_size;

    mapData.countries.forEach(country => {

        // Draw Country Hex
        country.hexagons.forEach(hex => {
            const pixel = hexToPixel(hex, hexSize);
            drawHexagon(ctx, pixel.x, pixel.y, hexSize, country.color);
        });
        // Draw Border
        drawCountryBorder(ctx, country.hexagons, hexSize);


        // Info Card
        const center = calculateCenter(country.hexagons, hexSize);
        console.log(center);
        drawCountryInfo(ctx, country, center);
    });
}

window.onload = drawMap;
