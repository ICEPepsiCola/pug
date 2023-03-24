import {useState} from 'react'
import './App.less'
import RecordRTC from 'recordrtc'
import {useMount} from 'react-use';
import Number, {toggleShape} from './components/number';
import {toCanvas} from 'html-to-image';
import {IntlProvider, FormattedMessage} from 'react-intl'
import messages from './locales';
import {debounce} from 'lodash';

async function capture() {
    return toCanvas(document.getElementById('glass-container')!!, {
        quality: 1,
        canvasWidth: document.getElementById('glass-container')!!.offsetWidth * 2,
        canvasHeight: document.getElementById('glass-container')!!.offsetHeight * 2,
        pixelRatio: 2,
    }).then(canvas => {
        if (!isRecordingStarted) return Promise.reject()
        context.clearRect(0, 0, canvas2d.width, canvas2d.height)
        context.drawImage(canvas, 0, 0, canvas2d.width, canvas2d.height)
    })
}


let canvas2d: HTMLCanvasElement
let context: CanvasRenderingContext2D
let recorder: RecordRTC
let isRecordingStarted = false
const IS_MOBILE = !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)

function App() {
    const [state, setState] = useState('stop')
    useMount(() => {
        canvas2d = document.getElementById('background-canvas') as HTMLCanvasElement
        context = canvas2d.getContext('2d') as CanvasRenderingContext2D
        canvas2d.width = document.getElementById('glass-container')!!.offsetWidth * 2
        canvas2d.height = document.getElementById('glass-container')!!.offsetHeight * 2
        canvas2d.style.width = document.getElementById('glass-container')!!.offsetWidth + 'px'
        canvas2d.style.height = document.getElementById('glass-container')!!.offsetHeight + 'px'

        recorder = new RecordRTC(canvas2d, {
            type: 'canvas',
            // mimeType: 'video/webm',
            mimeType: 'video/webm;codecs=h264',
            canvas: {
                width: document.getElementById('glass-container')!!.offsetWidth,
                height: document.getElementById('glass-container')!!.offsetHeight,
            },
        })
    })

    const startRecording = debounce(() => {
        setState('start')
        isRecordingStarted = true
        recorder.startRecording()

        const videoEle: HTMLVideoElement = document.getElementById('preview-video')!! as HTMLVideoElement
        videoEle.style.display = 'none'
        videoEle.src = '';
        (document.querySelector('.video-bg') as HTMLElement).style.display = 'none'

        async function loop() {
            await capture()
            requestAnimationFrame(loop)
        }

        loop();
    }, 1000)

    const stopRecording = debounce(() => {
        setState('stop')
        recorder.stopRecording(function () {
            isRecordingStarted = false
            let videoBlob = recorder.getBlob()

            // invokeSaveAsDialog(videoBlob, 'ooo.webm')
            // transAndDownload(recorder.getBlob())

            // Convert the Blob to a MediaSource object and create a new MediaStream
            const videoEle: HTMLVideoElement = document.getElementById('preview-video')!! as HTMLVideoElement
            (document.querySelector('.video-bg') as HTMLElement).style.display = 'flex'
            videoEle.style.width = document.getElementById('glass-container')!!.offsetWidth + 'px'
            videoEle.style.display = 'block'
            videoEle.src = window.URL.createObjectURL(videoBlob)
            recorder.reset()
        })
    }, 1000)
    return <div className='app'>
        <div className='glass-container' id='glass-container'>
            <Number/>
        </div>
        <div className='record-btns'>
            <button onClick={toggleShape}>
                <FormattedMessage id='Toggle Shape'/>
            </button>
            {state === 'stop' && !IS_MOBILE ? <button onClick={startRecording}><FormattedMessage id='Start Record'/></button> : null}
            {state === 'start' && !IS_MOBILE ? <button onClick={stopRecording}>Stop Record</button> : null}
        </div>
        <div className='video-bg'>
            <div className='video-bg-close' onClick={_ => {
                const bg = document.querySelector('.video-bg') as HTMLElement
                bg.style.display = 'none'
            }}><FormattedMessage id='Close'/>
            </div>
            <video controls autoPlay playsInline id="preview-video"></video>
        </div>
        <canvas id='background-canvas' style={{position: 'absolute', top: '-9999px', left: '-9999px'}}></canvas>
        <div className="links">
            <a href="https://github.com/ICEPepsiCola"><FormattedMessage id='By ICEPepsiCola'/></a>
            <span className="divider">•</span>
            <a href="mailto:icepepsicola@foxmail.com"><FormattedMessage id='Contact Me'/></a>
            <span className="divider">•</span>
        </div>
    </div>
}


export default function () {
    const [locale, setLocale] = useState<'en' | 'zh'>('en')
    console.log(locale);
    return <IntlProvider messages={messages[locale]} locale={locale}>
        <div className='change-lang'>
            <li onClick={_ => locale != 'zh' && setLocale('zh')} className={locale === 'zh' ? 'selected' : ''}>{messages.zh.lang}</li>
            /
            <li onClick={_ => locale != 'en' && setLocale('en')} className={locale === 'en' ? 'selected' : ''}>{messages.en.lang}</li>
        </div>
        <App/>
    </IntlProvider>
}
