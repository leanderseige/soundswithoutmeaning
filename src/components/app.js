import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../store'
import DLayer from './dlayer.js'
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
                // we opportunistically use this loop to (re)set timing
                store.dispatch({type:'LAYER_SETNEXTTIME',
                  id:n,
                  nexttime:(60000/this.props.nol)*n+(new Date()).getTime()
                })
            }
            console.log("Go!")
            console.log(event)
            this.setState( { wmode_splash : 0 } )
            // store.dispatch({type:'HIDE_SPLASH'})
            store.dispatch({type:'SET_MODE', mode: { 'play':1 } })
            store.dispatch({type:'SET_STARTTIME', ms:Math.round((new Date()).getTime()) } )
            event.stopPropagation()
        }
    }

    shieldClick(event) {
        console.log("shield click")
        this.setState( { wmode_splash : 1 } )
        // store.dispatch({type:'SHOW_SPLASH'})
    }

    handleInfoButton(event) {
        this.setState( { wmode_text : 1 } )
        // store.dispatch({type:'SET_MODE', mode: { 'text':1 } })
        event.stopPropagation()
    }

    handleChartButton(event) {
        this.setState( { wmode_text : 2 } )
        // store.dispatch({type:'SET_MODE', mode: { 'text':2 } })
        event.stopPropagation()
    }

    handleCloseButton(event) {
        this.setState( { wmode_text : 0 } )
        // store.dispatch({type:'SET_MODE', mode: { 'text':0 } })
        this.setState( { wmode_splash : 0 } )
        // store.dispatch({type:'HIDE_SPLASH'})
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
        this.handleCloseButton = this.handleCloseButton.bind(this)
        this.handleInfoButton = this.handleInfoButton.bind(this)
        this.handleChartButton = this.handleChartButton.bind(this)
        this.shieldClick = this.shieldClick.bind(this)
        this.goFullscreen = this.goFullscreen.bind(this)
        this.state = { wmode_splash : 1 }
    }

    componentDidMont() {
        this.setState( { wmode_text : 1 } )
        this.setState( { wmode_splash : 1 } )
    }

    render() {
        const state = store.getState()

        var layers = <DLayer />

        var button_play=false
        var app_style={backgroundColor:'#111'}
        if(this.props.mode['play']===1) {
            button_play= <FontAwesomeIcon icon={faStop} />
        } else{
            button_play= <FontAwesomeIcon icon={faPlay} />
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
        if(this.state.wmode_text===1) {
            splash_content = splash_info
        } else if (this.state.wmode_text===2) {
            splash_content = splash_charts
        } else {
            splash_content = splash_menu
        }

        console.log("wmode_splash: "+this.state.wmode_splash)
        if(this.state.wmode_splash > 0) {
            var splash_screen =
            <div style={{display:"flex"}} className="splash_container">
                {splash_content}
            </div>
        } else {
            var splash_screen =
            <div style={{display:"none"}} className="splash_container">
            </div>
        }

        return (
            <div className="App" onClick={this.shieldClick} style={app_style} >
                {layers}
                {splash_screen}
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
