import {Layout, Checkbox, Space, Button} from 'antd';
import {
    FontSizeOutlined,
    RedoOutlined,
    UndoOutlined,
    ZoomOutOutlined,
    ZoomInOutlined,
} from '@ant-design/icons';
import {useEffect, useState, useRef} from 'react';
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
    const [size, setSize] = useState([720, 1280]);
    const [targetLanguage, setTargetLanguage] = useState('th')
    const [zoom, setZoom] = useState(1)
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
    const [activeElement, setActiveElement] = useState(null)
    const activeLanguage = activeCanvas.language
    const activeCanvasRef = useRef()
    const activeElementRef = useRef()

    useEffect(() => {
        const handleDeleteElement = (e) => {
            if (e.code === 'Backspace' && activeCanvasRef.current && activeElementRef.current) {
                activeCanvasRef.current.ref.remove(activeElementRef.current)
                activeCanvasRef.current.ref.requestRenderAll()
                setActiveElement(null)
            }
        }
        window.addEventListener('keydown', handleDeleteElement)
        return () => {
            window.removeEventListener('keydown', handleDeleteElement)
        }
        }, [])

    useEffect(()=>{
        activeCanvasRef.current = activeCanvas
    },[activeCanvas])

    useEffect(()=>{
        activeElementRef.current = activeElement
    },[activeElement])

    const translateText = (canvas, index, newText) => {
        if (canvas.item(index)) {
            const text = canvas.item(index)
            const {width} = text
            text.set({
                text: newText,
                fontFamily: 'PingFang',
                lockScalingY: true,
            })
            if (text.width > width) {
                text.set({
                    fontSize:  +(text.fontSize * width / (text.width + 1)).toFixed(0),
                    width,
                })
            }
            console.log('误差', Math.abs(text.width - width), text)
            canvas.renderAll()
        }
    }

    const translate = () => {
        const object = allCanvas[0].ref.getObjects()
        const text_list = object.map(({text}) => text)
        if(!text_list.length){
            return
        }
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

    const zoomChange = (type) => {
        if ((type === 'zoomOut' && zoom < 0.5) || (type === 'zoomIn' && zoom > 2)) {
            return
        }
        const newZoom = type === 'zoomOut' ? zoom - 0.25 : zoom + 0.25
        allCanvas.forEach(canvas => {
            canvas.ref.setZoom(newZoom)
            canvas.ref.setHeight(size[1] * newZoom);
            canvas.ref.setWidth(size[0] * newZoom);
            canvas.ref.renderAll()
        })
        setZoom(newZoom)
    }

    return (
      <Layout>
        <Header>
            <Space>
                <ZoomOutOutlined onClick={()=> zoomChange('zoomOut')} />
                <div>{`${zoom * 100}%`}</div>
                <ZoomInOutlined onClick={()=> zoomChange('zoomIn')}/>
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
            <Content >
                <div className="canvas-wrapper">
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
                zoom={zoom}
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

