import { fabric } from "fabric";
import {Button, message, Spin} from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useState, useRef} from 'react';
import {download, getImageUrl} from '../helper'

function Canvas(props) {
    const {data: {language = 'default', waiting = false}, size,
        setActiveCanvas, activeLanguage, setActiveElement,
        allCanvas, index } = props
    const id = `${language}-canvas`
    const canvasRef = useRef()

    const saveImage = () => {
        canvasRef.current.discardActiveObject()
        canvasRef.current.renderAll();
        const {width, height} = canvasRef.current
        const objects = canvasRef.current.getObjects()
        if (objects.some(item =>  item.top < 10 || item.left <10 || item.top + item.height > height - 10 || item.left + item.width > width - 10
        )) {
            message.error(`图${index+1}有溢出，请修改`)
        } else {
            download(getImageUrl(id), `${language}_${nanoid(6)}.png`)
        }
    }

    useEffect(() => {
        canvasRef.current = new fabric.Canvas(id);
        props.data.ref = canvasRef.current

        const shape = new fabric.Textbox(nanoid(8), {
            text: '请输入',
            width : 120,
            // height : 40,
            fill : '#06c',
            left: size[0] / 2 - 60,
            top: size[1] / 2 - 20,
            lineHeight: 1,
            lockScalingY: true,
            fontSize: 40,
            textAlign: 'left',
            splitByGrapheme: false,
            // styles: {
            //     0: {
            //         0: { textDecoration: 'underline', fontSize: 80 },
            //         1: { fill: 'red' }
            //     },
            // }
        })

        canvasRef.current.selection = false;
        canvasRef.current.add(shape);
        canvasRef.current.setWidth(size[0]);
        canvasRef.current.setHeight(size[1])
        canvasRef.current.backgroundColor = 'rgba(255,255,255,1)';
        canvasRef.current.renderAll();
        canvasRef.current.on("mouse:down", function (options) {
            setActiveCanvas(props.data)
            console.log(options, options.target, options.e.offsetX, options.e.offsetY)
            if(options.target) {
                canvasRef.current.renderAll();
                setActiveElement(options.target)
            } else {
                setActiveElement(null)
            }
            allCanvas.filter(item => item.language !== language).forEach((item)=>{
                item.ref.discardActiveObject()
                item.ref.renderAll();
            })
        });

        // canvasRef.current.on("mouse:up", function (options) {
        //     console.log('up', options)
        //
        // });
        // canvasRef.current.on("mouse:out", function (options) {
        //
        // });

        // canvasRef.current.on("object:scaling", function (obj) {
        //     if (obj.target &&  obj.target.height && obj.target.scaleY) {
        //         // if (obj.target.id.includes("txt")) {
        //         let lastHeight
        //         let lastWidth
        //
        //         const updateTextSize = () => {
        //             if (obj.target) {
        //                 if (obj.target.height && obj.target.scaleY) {
        //                     lastHeight = obj.target.height * obj.target.scaleY;
        //                     // lastWidth = obj.target.width * obj.target.scaleX;
        //                 }
        //
        //                 obj.target.set({
        //                     height: lastHeight || obj.target.height,
        //                     // width: lastWidth || obj.target.width,
        //                     scaleY: 1,
        //                 });
        //
        //                 canvasRef.current.renderAll();
        //             }
        //         };
        //
        //
        //         updateTextSize();
        //         // }
        //     }
        // });

    }, [])

    return <Spin spinning={waiting}>
        <div style={{boxShadow: language === activeLanguage && '0 0 0 1px #1890FF', margin: 1}}>
            {/*<div>{language}</div>*/}
            <canvas id={id}/>
        </div>
        <Button type="primary" block onClick={saveImage}>保存图片</Button>
    </Spin>
}

export default React.memo(Canvas)