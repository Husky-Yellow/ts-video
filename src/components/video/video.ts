let styles = require('./video.css')
interface Ivideo {
  url: string
  elem: string | HTMLElement
  width?: string
  height?: string
  autoplay?: boolean
}

// 组件接口
interface Icomponent {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

function video(options: Ivideo) {
  return new Video(options)
}
class Video implements Icomponent {
  tempContainer;
  constructor(private settings: Ivideo) {
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      autoplay: false,
    }, this.settings)
    this.init()
  }
  init() { 
    this.template()
    this.handle()
  }
  template() {
    this.tempContainer = document.createElement('div')
    this.tempContainer.className = styles.video
    this.tempContainer.style.width = this.settings.width
    this.tempContainer.style.height = this.settings.height
    this.tempContainer.innerHTML = `
      <video class="${styles['video-content']}"
      src="${this.settings.url}"
      >
      </video>
      <div class="${styles['video-controls']}">
        <div class="${styles['video-progress']}">
          <div class="${styles['video-progress-now']}">
          </div>
          <div class="${styles['video-progress-suc']}">
          </div>
          <div class="${styles['video-progress-bar']}">
          </div>
        </div>
        <div class="${styles['video-play']}">
          <i class="iconfont icon-bofang"></i>
        </div>
        <div class="${styles['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div class="${styles['video-full']}">
        <i class="iconfont icon-quanping"></i>
      </div>
        <div class="${styles['video-volume']}">
          <i class="iconfont icon-yinliang"></i>
          <div class="${styles['video-volprogress']}">
            <div class="${styles['video-volprogress-now']}">
            </div>
            <div class="${styles['video-volprogress-bar']}">
            </div>
        </div>
      </div>
      </div>
    `
    if (typeof this.settings.elem === 'object') {
      this.settings.elem.appendChild(this.tempContainer)
    } else {
      document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer)
    }
  }
  handle() {
    let videoContent : HTMLVideoElement = this.tempContainer.querySelector(`.${styles['video-content']}`)
    let videoControls = this.tempContainer.querySelector(`.${styles['video-controls']}`)
    let videoPaly = this.tempContainer.querySelector(`.${styles['video-controls']} i`)
    let videoTimes = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`)
    let videoFull = this.tempContainer.querySelector(`.${styles['video-full']} i`)
    let videoProgress = this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`)
    let timer = null
    // 视频是否播放完毕
    videoContent.addEventListener('canplay',()=>{
      videoTimes[1].innerHTML = formateTime(videoContent.duration)
    })
    // 视频播放事件
    videoContent.addEventListener('play',()=>{
      videoPaly.className = 'iconfont icon-weibiaoti--'
      timer = setInterval(playIng,1000)
    })
    // 视频暂停事件
    videoContent.addEventListener('pause',()=>{
      videoPaly.className = 'iconfont icon-bofang'
      clearInterval(timer)
    })
    // 全屏
    videoFull.addEventListener('click',()=>{
      videoContent.requestFullscreen()
    })
    // 播放/暂停
    videoPaly.addEventListener('click',()=>{
      if (videoContent.paused) {
        videoContent.play()
      } else {
        videoContent.pause()
      }
    })
    function formateTime(number:number):string {
      number = Math.round(number);
      let min = Math.floor(number/60);
      let sec = number%60
      return setZero(min)+ ':'+setZero(sec)
    }
    // 正在播放中
    function playIng() {
      videoTimes[0].innerHTML = formateTime(videoContent.currentTime)
      // 
      let scale = videoContent.currentTime / videoContent.duration
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration
      videoProgress[0].style.width = scale*100 + '%'
      videoProgress[1].style.width = scaleSuc*100 + '%'
      videoProgress[2].style.left = scale*100 + '%'
    }
    function setZero(number:number):string {
      return number >10 ?`0${number}` : `${number}`
    }
   }

}
export default video