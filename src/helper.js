import {fabric} from 'fabric'
import {nanoid} from 'nanoid'

export function download(url, filename) {
    return fetch(url).then(res => res.blob().then(blob => {
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }))
}

export function getImageUrl(id) {
    const img = document.getElementById(id);
    return img.toDataURL("image/png");
}

const baseShapeConfig = {
    Textbox: {
        text: '请输入',
        width: 140,
        height: 60,
        fill: '#06c',
        fontSize: 40,
        // splitByGrapheme: true,
        lockScalingY: true,
        textAlign: 'left',
        lineHeight: 1,
    }
}

let count = 0

export function insertElement(type, canvas, size){
    let shape = null;
    if(type === 'Textbox') {
        count += 2
        shape = new fabric[type](nanoid(8), {
            ...baseShapeConfig[type],
            left: count,
            top: count,
        })
    }
    canvas.add(shape);
}

