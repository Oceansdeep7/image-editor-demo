import React, {useState} from 'react'
import {Empty, Form, InputNumber, Select} from 'antd';
import { SketchPicker } from 'react-color'

const STYLE_OPTIONS = [
    {
        value: 'normal',
        label: 'normal',
    },
    {
        value: 'italic',
        label: 'italic',
    },
]

const ALIGN_OPTIONS = [
    {
        value: 'left',
        label: 'left',
    },
    {
        value: 'center',
        label: 'center',
    },
    {
        value: 'right',
        label: 'right',
    }
]

function Attribute(props) {
    const {activeElement, activeCanvas, setActiveElement} = props
    const [_,forceUpdate] = useState(0)
    // async function loadFonts() {
    //     const target = canvasRef.current.getActiveObject()
    //     const font = new FontFace('pf', `url(${fonts})`);
    //     setLoading(true)
    //     await font.load();
    //     document.fonts.add(font);
    //     target.set("fontFamily", 'pf')
    //     canvasRef.current.renderAll()
    //     setLoading(false)
    //     console.log(canvasRef.current.toObject())
    //     console.log(canvasRef.current.toJSON())
    //     console.log(canvasRef.current.item(0)); // reference fabric.Rect added earlier (first object)
    //     console.log(canvasRef.current.getObjects()); // get all objects on canvas (rect will be first and only)
    // }

    const onChange = (type, value) => {
        activeElement.set({
            [type]: value
        })
        activeCanvas.ref.renderAll()
        forceUpdate(i => ++i)
    }

    return <div>
        {
            activeElement ? <>
                    <Form.Item
                        label="字号"
                    >
                        <InputNumber precision={0} min={1} value={activeElement.fontSize}
                                     onChange={value => onChange('fontSize', value)}/>
                    </Form.Item>
                    <Form.Item
                        label="样式"
                    >
                        <Select options={STYLE_OPTIONS}
                                value={activeElement.fontStyle}
                                onChange={value => onChange('fontStyle', value)}/>
                    </Form.Item>
                    <Form.Item
                        label="对齐方式"
                    >
                        <Select options={ALIGN_OPTIONS}
                                value={activeElement.textAlign}
                                onChange={value => onChange('textAlign', value)}/>
                    </Form.Item>
                    <Form.Item
                        label="颜色"
                    >
                        <SketchPicker
                            color={activeElement.fill}
                            onChangeComplete={(color) =>  onChange('fill', color.hex)
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="背景色"
                    >
                        <SketchPicker
                            color={activeElement.backgroundColor}
                            onChangeComplete={(color) =>  onChange('backgroundColor', color.hex)
                            }
                        />
                    </Form.Item>
                </>
                : <Empty/>
        }
    </div>
}

export default Attribute