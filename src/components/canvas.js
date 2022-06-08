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
        console.log(objects[0])
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

        const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
        const img = document.createElement('img');
        img.src = deleteIcon;

        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: -32,
            cursorStyle: 'pointer',
            mouseUpHandler: deleteObject,
            render: renderIcon,
            cornerSize: 24
        });

        fabric.Textbox.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: -32,
            cursorStyle: 'pointer',
            mouseUpHandler: deleteObject,
            render: renderIcon,
            cornerSize: 24
        });

        const shape = new fabric.Textbox(nanoid(8), {
            text: '请输入',
            width : 120,
            // height : 40,
            fill : '#06c',
            left: size[0] / 2 - 120 / 2,
            top: size[1] / 2  - 40 / 2,
            lineHeight: 1,
            lockScalingY: true,
            fontSize: 40,
            textAlign: 'left',
            // splitByGrapheme: true,

            // styles: {
            //     0: {
            //         0: { textDecoration: 'underline', fontSize: 80 },
            //         1: { fill: 'red' }
            //     },
            // }
        })


        // canvasRef.current.add(group);
        canvasRef.current.add(shape);
        canvasRef.current.backgroundColor = 'rgba(255,255,255,1)';
        canvasRef.current.renderAll();
        canvasRef.current.on("mouse:down", function (options) {
            setActiveCanvas(props.data)
            // console.log(options, options.target, options.e.offsetX, options.e.offsetY)
            if(options.target) {
                // const {
                //     fill = '#0066cc',
                //     stroke,
                //     strokeWidth = 0,
                //     fontSize,
                // } = options.target
                // setAttrs({ fill, stroke: stroke || '', strokeWidth: strokeWidth, fontSize})
                // // options.target.set({
                // //   fontSize: 60,
                // // });
                // canvasRef.current.renderAll();
                setActiveElement(options.target)
            }else {
                setActiveElement(null)
                allCanvas.forEach((item)=>{
                        item.ref.discardActiveObject()
                        item.ref.renderAll();
                })
            }
        });

        canvasRef.current.on("mouse:up", function (options) {

        });
        canvasRef.current.on("mouse:out", function (options) {

        });
        // canvasRef.current.on("selection:updated", function (options) {
        //     console.log('selection', options)
        //
        // });


        // canvasRef.current.on("object:scaling", function (obj) {
        //     console.log(12345, obj.target, obj.target.height,  obj.target.scaleY)
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
        //         console.log(12345)
        //
        //         updateTextSize();
        //         // }
        //     }
        // });

        function deleteObject(eventData, transform) {
            const target = transform.target;
            const canvas = target.canvas;
            canvas.remove(target);
            canvas.requestRenderAll();
        }

        function renderIcon(ctx, left, top, styleOverride, fabricObject) {
            const size = this.cornerSize;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(img, -size/2, -size/2, size, size);
            ctx.restore();
        }
    }, [])

    const width = size[0]
    const height = size[1]

    return <Spin spinning={waiting}>
        <div style={{boxShadow: language === activeLanguage && '0 0 0 1px #1890FF'}}>
            {/*<div>{language}</div>*/}
            <canvas id={id} width={props.data.ref?.height|| width} height={ props.data.ref?.height|| height}/>
        </div>
        <Button type="primary" block onClick={saveImage}>保存图片</Button>
    </Spin>
}

export default React.memo(Canvas)