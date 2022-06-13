import React, {useEffect, useState} from 'react'
import {Empty, Form, InputNumber, Select} from 'antd';
import { SketchPicker } from 'react-color'
import fonts from '../assets/TH.ttf'

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
    const {activeElement, activeCanvas, setActiveElement, presetColors } = props
    const [,forceUpdate] = useState(0)
    const [fontLoading, setFontLoading] = useState(false)

    useEffect(()=>{

        async function loadFonts() {
            console.log(document.fonts)
            const font = new FontFace('PingFang', `url(${fonts})`);
            setFontLoading(true)
            await font.load();
            document.fonts.add(font);
            setFontLoading(false)
        }

        loadFonts().catch(res => {
            console.log(res)
            setFontLoading(false)
        })


    },[])


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
                        label="字体"
                    >
                        <Select options={[{
                            value: 'PingFang', label: '泰语字体'
                        }]}
                                loading={fontLoading}
                                disabled={fontLoading}
                                value={activeElement.fontFamily}
                                onChange={value => onChange('fontFamily', value)}/>
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
                            presetColors={presetColors}
                            onChangeComplete={(color) =>  onChange('fill', color.hex)
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="背景色"
                    >
                        <SketchPicker
                            color={activeElement.backgroundColor}
                            presetColors={presetColors}
                            onChangeComplete={(color) =>  onChange('backgroundColor', color.hex)
                            }
                        />
                    </Form.Item>
                </>
                : <Empty description="需要选中文本框"/>
        }
    </div>
}

export default Attribute