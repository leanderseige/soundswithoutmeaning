import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../store'
import Layer from './layer.js'
import Statsbar from './statsbar.js'
import content from './content.js'
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faInfoCircle, faCompressArrowsAlt, faExpandArrowsAlt, faTimesCircle, faChartBar } from '@fortawesome/free-solid-svg-icons'

class App extends Component {

    handleStartButton(event) {
        if(this.props.mode['play']===1) {
            window.location.reload()
        } else {
            // hack around iOS anxiousness
            for(var n in this.props.layer_audio) {
                console.log("silent playing "+n)
                this.props.layer_audio[n].src = "data/silence.mp3"
                this.props.layer_audio[n].play()
                store.dispatch({type:'LAYER_SETLABEL', id:n, label:"Silence"})
            }
            console.log("Go!")
            console.log(event)
            store.dispatch({type:'HIDE_SPLASH'})
            store.dispatch({type:'SET_MODE', mode: { 'play':1 } })
            store.dispatch({type:'SET_STARTTIME', ms:Math.round((new Date()).getTime()) } )
            event.stopPropagation()
        }
    }

    shieldClick(event) {
        console.log("shield click")
        store.dispatch({type:'SHOW_SPLASH'})
    }

    handleInfoButton(event) {
        store.dispatch({type:'SET_MODE', mode: { 'text':1 } })
        event.stopPropagation()
    }

    handleChartButton(event) {
        store.dispatch({type:'SET_MODE', mode: { 'text':2 } })
        event.stopPropagation()
    }

    handleCloseButton(event) {
        store.dispatch({type:'SET_MODE', mode: { 'text':0 } })
        store.dispatch({type:'HIDE_SPLASH'})
        event.stopPropagation()
    }

    goFullscreen(event) {
        console.log("fs click")
        var elem = document.documentElement;
        if(this.props.mode['screen']===1) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
            store.dispatch({type:'SET_MODE', mode: { 'screen':0 } })
        } else {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
            store.dispatch({type:'SET_MODE', mode: { 'screen':1 } })
        }
        event.stopPropagation()
    }

    constructor(props) {
        super(props)

        store.dispatch({type:'SET_LAYERS',nol:this.props.nol})

        fetch("sounds4.json")
                .then(res => res.json())
                .then((data) => {
                    var tempa = {}
                    var tempi = {}
                    var templ = {}
                    for(var record in data) {
                        tempa[record]=data[record]['sound']
                        tempi[record]=data[record]['image']
                        templ[record]=data[record]['label']
                        // console.log(data[record]['sound'])
                        fetch(tempa[record], { method: 'HEAD' }).catch(
                            function(error) {
                                console.log(error)
                            })
                        fetch(tempi[record], { method: 'HEAD' }).catch(
                            function(error) {
                                console.log(error)
                            })
                    }
                    store.dispatch({
                        type: 'SET_URLS',
                        audiourls: tempa,
                        imageurls: tempi,
                        audiolabels: templ
                    })
                }
            )
        this.handleStartButton = this.handleStartButton.bind(this)
        this.shieldClick = this.shieldClick.bind(this)
        this.goFullscreen = this.goFullscreen.bind(this)

    }

    render() {
        const state = store.getState()

        const layers = []

        if(state.imageurls) {
          for (var i=0;i<this.props.nol;i++) {
            layers.push(<Layer id={i} key={"l"+i.toString()} />)
          }
        }

    var button_play=false
    var app_style={backgroundColor:'#111'}
    if(this.props.mode['play']===1) {
        button_play= <FontAwesomeIcon icon={faStop} />
        app_style={backgroundColor:'#111'}
    } else{
        button_play= <FontAwesomeIcon icon={faPlay} />
        app_style={backgroundColor:'#111'}
    }

    var button_screen=false
    if(this.props.mode['screen']===1) {
        button_screen= <FontAwesomeIcon icon={faCompressArrowsAlt} />
    } else{
        button_screen= <FontAwesomeIcon icon={faExpandArrowsAlt} />
    }

    var splash_menu =
    <div>
        {content[0]}
        <button onClick={this.handleStartButton} className="sbVeryBig">
            {button_play}
        </button>
        <br />
        <button onClick={this.goFullscreen} className="sbBig">
            {button_screen}
        </button>
        <button onClick={this.handleInfoButton} className="sbBig">
            <FontAwesomeIcon icon={faInfoCircle} />
        </button>
        <button onClick={this.handleChartButton} className="sbBig">
            <FontAwesomeIcon icon={faChartBar} />
        </button>
        <br />
        <button onClick={this.handleCloseButton} className="sbBig">
            <FontAwesomeIcon icon={faTimesCircle} />
        </button>
    </div>

    var splash_info =
    <div>
        {content[1]}
        <br />
        <button onClick={this.handleCloseButton} className="sbBig">
            <FontAwesomeIcon icon={faTimesCircle} />
        </button>
    </div>

    var runtime = Math.round((new Date()).getTime())-this.props.starttime
    var splash_charts = <div>
      <Statsbar id={0} key={"s0"} />
      <Statsbar id={1} key={"s1"} />
      <Statsbar id={2} key={"s2"} />
      <br />
        Time: {(Math.floor(runtime/60000)).pad(2)} min {(Math.floor((runtime/1000)%60)).pad(2)} sec
      <br />
      <button onClick={this.handleCloseButton} className="sbBig">
          <FontAwesomeIcon icon={faTimesCircle} />
      </button>
    </div>

    var splash_content = false
    if(this.props.mode['text']===1) {
        splash_content = splash_info
    } else if (this.props.mode['text']===2) {
        splash_content = splash_charts
    } else {
        splash_content = splash_menu
    }

      return (
        <div className="App" onClick={this.shieldClick} style={app_style} >
            {layers}
            <div style={state.splashstyle} className="splash_container">
                {splash_content}
            </div>
        </div>
      )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starttime: state.starttime,
        mode: state.mode,
        audiourls: state.audiourls,
        images: state.images,
        splashstyle: state.splashstyle,
        layer_css: state.layer_css,
        layer_audio: state.layer_audio,
        layer_label: state.layer_label,
        nexttime: state.layer_nexttime
    }
}

export default connect(mapStateToProps)(App)
