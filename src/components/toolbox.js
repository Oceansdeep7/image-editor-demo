import React, {useState} from 'react'
import {Select, Tabs} from 'antd';
import Asset from './asset'
import {LANGUAGE_OPTIONS} from '../constants'
import Attribute from './attribute'
import CanvasSettings from './canvasSettings'
const { TabPane } = Tabs;

function ToolBox(props){

    const { allCanvas, targetLanguage, setTargetLanguage,
        activeElement, activeCanvas, setActiveElement, setSize, size } = props
    const [activeKey, setActiveKey] = useState("资源")

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

    return <Tabs onChange={setActiveKey} activeKey={activeKey}>
        <TabPane tab="资源" key="资源">
            <Asset allCanvas={allCanvas}/>
        </TabPane>
        <TabPane tab="属性" key="属性">
            <Attribute
                activeElement={activeElement}
                activeCanvas={activeCanvas}
                setActiveElement={setActiveElement}
            />
        </TabPane>
        <TabPane tab="画板" key="画板">
            <CanvasSettings
                activeCanvas={activeCanvas}
                allCanvas={allCanvas}
                setSize={setSize}
                size={size}
            />
        </TabPane>
        <TabPane tab="语言设置" key="语言设置">
            <Select
                options={LANGUAGE_OPTIONS}
                value={targetLanguage}
                onChange={setTargetLanguage}
            />
        </TabPane>
        )}
    </Tabs>
}

export default ToolBox