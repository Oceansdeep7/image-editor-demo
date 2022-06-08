import { fabric } from "fabric";
import {Layout, Checkbox, Space, Button} from 'antd';
import { nanoid } from 'nanoid';
import {
    FontSizeOutlined,
    RedoOutlined,
    UndoOutlined,
} from '@ant-design/icons';
import {useEffect, useState, useRef, Component} from 'react';
import './App.less'
import Canvas from './components/canvas'
import ToolBox from './components/toolbox'
import {insertElement} from './helper'
import axios from 'axios'

const { Header, Sider, Content } = Layout;


const v2Client = () => axios.create({
    baseURL: '/v2',
    responseType: 'json',
    headers: {

    },
})

export default function App() {
    const [size, setSize] = useState([1200, 1200]);
    const [useOperatorMap, setUseOperatorMap] = useState(false)
    const [allCanvas, setAllCanvas] = useState([
        {
            language: '默认',
            attrs: {},
        },
        {
            language: '阿拉伯语',
            attrs: {},
        }
    ])
    const [activeCanvas, setActiveCanvas] = useState(allCanvas[0])
    const activeLanguage = activeCanvas.language
    const [activeElement, setActiveElement] = useState(null)
    const [targetLanguage, setTargetLanguage] = useState('ar')
    const [zoom, setZoom] = useState(1)

    const translateText = (canvas, index, newText) => {
        if (canvas.item(index)) {
            const text = canvas.item(index)
            const {height, text: prevText, fontSize, width} = text
            text.set({
                text: newText,
            })
            console.log({prevText, newText, height, prevHeight: text.height, width})
            if(Math.abs(height - text.height) > fontSize) {
                if ([...newText].length > [...prevText].length) {
                    while (text.height > height) {
                        text.set({
                            fontSize: text.fontSize - 1,
                        });
                    }
                } else {
                    while (text.height < height) {
                        text.set({
                            fontSize: text.fontSize + 1,
                        });
                    }
                }
            }
            text.set({
                lineHeight: height * text.lineHeight / text.height,
                lockScalingY: true,
            });
            console.log('误差', Math.abs(text.height - height), text)
            canvas.renderAll()
        }
    }

    const translate = () => {
        const object = allCanvas[0].ref.getObjects()
        const text_list = object.map(({text}) => text)
        setAllCanvas([...allCanvas.map(item => ({...item, waiting: true}))])
        v2Client().post('/creative_texts/translate', {
            text_list,
            target: targetLanguage,
        }).then((res) => {
                const data = res.data.data
                const canvas = allCanvas[1].ref
                const cb = () => {
                    canvas.renderAll()
                    data.forEach((text, index) => {
                        translateText(canvas, index, text)
                    })
                    setAllCanvas([...allCanvas.map(item => ({...item, waiting: false}))])
                }
                allCanvas[1].ref.loadFromJSON(allCanvas[0].ref.toJSON(), cb)
            }
        )
    }

    return (
      <Layout>
        <Header>
            <Space>
                <Button onClick={translate}>翻译</Button>
                <Button onClick={()=> insertElement('Textbox', activeCanvas.ref)}>
                    添加文本框
                    {/*<FontSizeOutlined onClick={()=> insertElement('Textbox', activeCanvas.ref, size)}/>*/}
                </Button>
                {/*<UndoOutlined/>*/}
                {/*<RedoOutlined/>*/}
                <Checkbox disabled checked={useOperatorMap} onChange={e => setUseOperatorMap(e.target.value)}>操作映射</Checkbox>
            </Space>
        </Header>
        <Layout>
            <Content>
                <div className="canvas-wrapper" style={{transform: `scale(${zoom})`}}>
                    {allCanvas.map((data, index) => <Canvas
                        size={size}
                        key={data.language}
                        data={data}
                        activeLanguage={activeLanguage}
                        setActiveCanvas={setActiveCanvas}
                        setActiveElement={setActiveElement}
                        allCanvas={allCanvas}
                        index={index}
                    />)}
                </div>
            </Content>
          <Sider width={240}>
            <ToolBox
                allCanvas={allCanvas}
                setSize={setSize}
                size={size}
                targetLanguage={targetLanguage}
                setTargetLanguage={setTargetLanguage}
                activeElement={activeElement}
                activeCanvas={activeCanvas}
                setActiveElement={setActiveElement}
            />
          </Sider>
        </Layout>
      </Layout>
  );
}

