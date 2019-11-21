import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../store'
import Layer from './layer.js'
import content from './content.js'
import '../App.css';

class App extends Component {

    startMainloop(event) {
        console.log("Go!")
        console.log(event)
        store.dispatch({type:'HIDE_SPLASH'})
        store.dispatch({type:'SET_MODE', mode:1})
        event.stopPropagation()
    }

    stopReload(event) {
        window.location.reload()
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
        this.startMainloop = this.startMainloop.bind(this)
        this.shieldClick = this.shieldClick.bind(this)
    }

    goFullscreen(event) {
        console.log("click")
        store.dispatch({type:'SHOW_SPLASH'})
    }

    shieldClick(event) {
        console.log("click")
        store.dispatch({type:'SHOW_SPLASH'})
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

      return (
        <div className="App" onClick={this.shieldClick}>
            {layers}
            <div style={state.splashstyle} className="splash_container">
                <div>
                    {content[0]}
                    <button onClick={this.startMainloop} className="splash_button">
                        Start
                    </button>
                    <br />
                    <button onClick={this.stopReload} className="splash_button">
                        Reset
                    </button>
                    <br />
                    <button onClick={this.stopReload} className="splash_button">
                        About
                    </button>
                    <button onClick={this.goFullscreen} className="splash_button">
                        Fullscreen
                    </button>
                </div>
            </div>
        </div>
      )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        audiourls: state.audiourls,
        images: state.images,
        splashstyle: state.splashstyle,
        layer_css: state.layer_css
    }
}

export default connect(mapStateToProps)(App)
