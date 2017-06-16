const GifEncoder = require('gifencoder')
const Canvas = require('canvas')
class CustomLoader {
    static createCircularLoader(w,h,color,output) {
        const r = Math.min(w,h)/3
        console.log(`${w},${h}`)
        const gifEncoder = new GifEncoder(w,h)
        const canvas = new Canvas()
        canvas.width = w
        canvas.height = h
        gifEncoder.createReadStream().pipe(require('fs').createWriteStream(output))
        gifEncoder.start()
        gifEncoder.setQuality(100)
        gifEncoder.setDelay(100)
        gifEncoder.setRepeat(0)
        const context = canvas.getContext('2d')
        context.strokeStyle = color
        context.lineWidth = r/10
        var deg = 0,a = 0
        while(deg<=360 && a<360) {
            context.clearRect(0,0,w,h)
            context.fillStyle = 'white'
            context.fillRect(0,0,w,h)
            context.save()
            context.translate(w/2,h/2)
            context.beginPath()
            // context.moveTo(0,-r)
            for(var i = a;i<deg;i+=10) {
                const newDeg = i-90
                const x = r*Math.cos(newDeg*Math.PI/180)
                const y = r*Math.sin(newDeg*Math.PI/180)
                context.lineTo(x,y)
            }
            //context.arc(0,0,r,a,deg-a)
            context.stroke()
            if(a<=360 && deg>=180) {
                a += 20
                console.log(a)
            }
            if(deg < 360) {
                deg += 20
            }
            context.restore()
            gifEncoder.addFrame(context)
        }
        gifEncoder.finish()
    }
    static createLinearLoader(w,color,output) {
        const canvas = new Canvas()
        canvas.width = w
        canvas.height = 40
        const context = canvas.getContext('2d')
        const gifencoder = new GifEncoder(w,w/6)
        gifencoder.createReadStream().pipe(require('fs').createWriteStream(output))
        gifencoder.start()
        gifencoder.setDelay(100)
        gifencoder.setQuality(100)
        gifencoder.setRepeat(0)

        var s = 0,e = 0
        while(e<=w && s<w) {
          context.save()
          context.translate(0,canvas.height/2)
          context.moveTo(0,0)
          context.lineTo(w,0)
          context.lineCap = 'round'
          context.lineWidth = 5
          context.strokeStyle = 'gray'
          context.stroke()
          context.strokeStyle = color
          context.beginPath()
          context.moveTo(s,0)
          context.lineTo(e,0)
          context.stroke()
          if(e<w) {
              e += w/10
          }
          if(s < w && e>=2*w/5) {
              s += w/10
          }
          context.restore()
          gifencoder.addFrame(context)
        }
        gifencoder.finish()

    }
}
module.exports = CustomLoader
