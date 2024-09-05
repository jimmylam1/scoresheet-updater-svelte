const Canvas = require('canvas')
const fs = require('fs')

async function main() {
    const image = await Canvas.loadImage(`../assets/bg.png`)
    const canvas = Canvas.createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0)
    for (let r = 0; r < image.height; r++) {
        for (let c = 0; c < image.width; c++) {
            const data = ctx.getImageData(c, r, 1, 1)
            const pixel = data.data
            // pixel[0] = 255
            // pixel[1] = 255
            // pixel[2] = 255
            pixel[3] = 255 - pixel[0]
            if (pixel[0] < 250)
                pixel[3] += 20
            ctx.putImageData(data, c, r)
        }
    }

    fs.writeFileSync('newBg.png', canvas.toBuffer())
}

main()