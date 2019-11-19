import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../store'
import Layer from './layer.js'
import '../App.css';

class App extends Component {

    startMainloop() {
        console.log("Go!")
        store.dispatch({type:'HIDE_SPLASH'})
        store.dispatch({type:'SET_MODE', mode:1})
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
                    }
                    store.dispatch({
                        type: 'SET_URLS',
                        audiourls: tempa,
                        imageurls: tempi
                    })
                }
            )
        this.startMainloop = this.startMainloop.bind(this)
    }

    render() {
        const state = store.getState()

        const layers = []

        if(state.imageurls) {
          for (var i=0;i<this.props.layers;i++) {
            layers.push(<Layer id={i} key={i.toString()} />)
          }
        }

      return (
        <div className="App">
            {layers}
            <div style={state.splashstyle} className="splash_container" >
                <div>
                <h1>sounds without meaning</h1><br />
                <br />
                please use your headphones<br />
                <br />
                concentrate and relax<br />
                <br />
                <br />
                <button onClick={this.startMainloop} className="splash_button">
                    Start
                </button>
                </div>
            </div>
        </div>
      );
    }

}

function mapStateToProps(state, ownProps) {
    return {
        audiourls: state.audiourls,
        images: state.images,
        styles: state.styles,
        splashstyle: state.splashstyle,
        layer_css: state.layer_css
    }
}

export default connect(mapStateToProps)(App)
