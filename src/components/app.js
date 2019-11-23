import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../store'
import Layer from './layer.js'
import content from './content.js'
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faInfoCircle, faCompressArrowsAlt, faExpandArrowsAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

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
            }
            console.log("Go!")
            console.log(event)
            store.dispatch({type:'HIDE_SPLASH'})
            store.dispatch({type:'SET_MODE', mode: { 'play':1 } })
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

        for (var i=0;i<this.props.layers;i++) {
          store.dispatch({type:'LAYER_INIT',id:i})
        }

        fetch("sounds3.json")
                .then(res => res.json())
                .then((data) => {
                    var tempa = {}
                    var tempi = {}
                    for(var record in data) {
                        tempa[record]=data[record]['sound']
                        tempi[record]=data[record]['image']
                        // console.log(data[record]['sound'])
                        fetch(tempa[record], { method: 'HEAD' }).catch(
                            function(error) {
                                console.log(error);
                            })
                        fetch(tempi[record], { method: 'HEAD' }).catch(
                            function(error) {
                                console.log(error);
                            })
                    }
                    store.dispatch({
                        type: 'SET_URLS',
                        audiourls: tempa,
                        imageurls: tempi
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
          for (var i=0;i<this.props.layers;i++) {
            layers.push(<Layer id={i} key={i.toString()} />)
          }
        }

        store.dispatch({type:'SET_LAYERS',layers:this.props.layers})
        // <FontAwesomeIcon icon={faStop} />
        // <FontAwesomeIcon icon={faInfo} />
        // <FontAwesomeIcon icon={faCompressArrowsAlt} />
        // <FontAwesomeIcon icon={faExpandArrowsAlt} />

    var button_play=false
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

    var splash_content = false
    if(this.props.mode['text']===1) {
        splash_content = splash_info
    } else {
        splash_content = splash_menu
    }

      return (
        <div className="App" onClick={this.shieldClick}>
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
        mode: state.mode,
        audiourls: state.audiourls,
        images: state.images,
        splashstyle: state.splashstyle,
        layer_css: state.layer_css,
        layer_audio: state.layer_audio
    }
}

export default connect(mapStateToProps)(App)
