function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)
 
 
    // отримання контексту для малювання
    const context = canvas.getContext('2d')
   // отримуємо координати canvas відносно viewport
    const rect = canvas.getBoundingClientRect();
 
    let isPaint = false // чи активно малювання
    let points = [] //масив з точками
    
        // об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging, color, size) => {
       // преобразуємо координати події кліка миші відносно canvas
       points.push({
           x: (x - rect.left),
           y: (y - rect.top),
           dragging: dragging,
           color: options.strokeColor,
           size: options.strokeWidth
       })
    }
    
         // головна функція для малювання
       const redraw = () => {
       //очищуємо  canvas
       //context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
       context.strokeStyle = options.strokeColor;
       context.lineJoin = "round";
       context.lineWidth = options.strokeWidth;
       let prevPoint = null;
       for (let point of points){
           context.beginPath();
           context.strokeStyle = point.color;
           context.strokeWidth = point.size
           if (point.dragging && prevPoint){
               context.moveTo(prevPoint.x, prevPoint.y)
           } else {
               context.moveTo(point.x - 1, point.y);
           }
           context.lineTo(point.x, point.y)
           context.closePath()
           context.stroke();
           prevPoint = point;
       }
    }
    
         // функції обробники подій миші
    const mouseDown = event => {
       isPaint = true
       addPoint(event.pageX, event.pageY);
       redraw();
    }
    
    const mouseMove = event => {
       if(isPaint){
           addPoint(event.pageX, event.pageY, true);
           redraw();
       }
    }
    
    // додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup',() => {
       isPaint = false;
    });
    canvas.addEventListener('mouseleave',() => {
       isPaint = false;
    });

    // TOOLBAR
const toolBar = document.getElementById('toolbar')
// clear button
const clearBtn = document.createElement('button')
clearBtn.classList.add('btn')
//clearBtn.textContent = 'Clear'
let clearPic = document.createElement('i')
clearPic.classList.add('fas')
clearPic.classList.add('fa-eraser')
clearBtn.appendChild(clearPic)

clearBtn.addEventListener('click', () => {
// тут необхідно додати код очистки canvas та масиву точок (clearRect)
context.clearRect(0, 0, context.canvas.width, context.canvas.height);
points.length = 0;
})
toolBar.insertAdjacentElement('afterbegin', clearBtn)

const downloadBtn = document.createElement('button')
downloadBtn.classList.add('btn')
//downloadBtn.textContent = 'Download'
let downloadPic = document.createElement('i')
downloadPic.classList.add('fas')
downloadPic.classList.add('fa-download')
downloadBtn.appendChild(downloadPic)

downloadBtn.addEventListener('click', () => {
const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
const newTab = window.open('about:blank','image from canvas');
newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
})
toolBar.insertAdjacentElement('afterbegin', downloadBtn)

const saveBtn = document.createElement('button')
saveBtn.classList.add('btn')
//saveBtn.textContent = 'Save'
let savePic = document.createElement('i')
savePic.classList.add('fas')
savePic.classList.add('fa-save')
saveBtn.appendChild(savePic)

saveBtn.addEventListener('click', () => {
localStorage.setItem('points', JSON.stringify(points));
})
toolBar.insertAdjacentElement('afterbegin', saveBtn)

const restoreBtn = document.createElement('button')
restoreBtn.classList.add('btn')
//restoreBtn.textContent = 'Restore'
let restorePic = document.createElement('i')
restorePic.classList.add('fas')
restorePic.classList.add('fa-redo')
restoreBtn.appendChild(restorePic)


restoreBtn.addEventListener('click', () => {
points = JSON.parse(localStorage.getItem('points'));
redraw();
})
toolBar.insertAdjacentElement('afterbegin', restoreBtn)

const tstampBtn = document.createElement('button')
tstampBtn.classList.add('btn')
//tstampBtn.textContent = 'Timestamp'
let tstampPic = document.createElement('i')
tstampPic.classList.add('fas')
tstampPic.classList.add('fa-clock')
tstampBtn.appendChild(tstampPic)

tstampBtn.addEventListener('click', () => {
new Date() // js функція повертає поточну дату, необхідно перетворити на string
context.fillText(new Date().toString(), 350, 10)
})
toolBar.insertAdjacentElement('afterbegin', tstampBtn)

const bcolor = document.getElementById('color-picker')

bcolor.addEventListener('change', () => {
    options.strokeColor = bcolor.value
})
    
const bsize = document.getElementById('size-picker')

bsize.addEventListener('change', () => {
    options.strokeWidth = bsize.value
})
    
const backgroundBtn = document.createElement('button')
backgroundBtn.classList.add('btn')
//backgroundBtn.textContent = 'Background'
let backgroundPic = document.createElement('i')
backgroundPic.classList.add('fas')
backgroundPic.classList.add('fa-image')
backgroundBtn.appendChild(backgroundPic)

backgroundBtn.addEventListener('click', () => {
    const img = new Image;
    img.src =`https://prikolnye-kartinki.ru/img/picture/Aug/30/da615b9169f7b4717d19d0c71657bbda/1.jpg`;
    img.onload = () => {
       context.drawImage(img, 0, 0);
    }
})
toolBar.insertAdjacentElement('afterbegin', backgroundBtn)

}
 