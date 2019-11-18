import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import store from '../store'
import logo from '../logo.svg';
// import Layer from './layer.js'
import '../App.css';

class App extends Component {

    mainloop() {
        const state = store.getState()
        var css = Object.assign({},state.styles)
        css[0] = Object.assign({},state.styles[0])
        css[1] = Object.assign({},state.styles[1])
        css[2] = Object.assign({},state.styles[2])
        var iframes={}
        for(var i=0; i<3; i++) {
            var vol = Math.sin(((state.iframes[i])/3000)*Math.PI)
            console.log(i+" "+vol)
            state.device[i].volume=vol
            if(css[i]['backgroundImage']) {
              css[i]['opacity']=vol
            } else  {
              css[i]['opacity']=0
            }
        }
        if(state.frames % 1000 == 0) {
            var dn = Math.ceil((state.frames%3000)/1000)
            var ri = Math.floor(Math.random() * Object.keys(state.audiourls).length)
            console.log("playing "+state.audiourls[ri])
            css[dn]['backgroundImage']='url('+state.imageurls[ri]+')'
            state.device[dn].src=state.audiourls[ri]
            state.device[dn].loop=true
            state.device[dn].play()
            iframes[dn]=3000
        }
        store.dispatch({type:'SET_CSS',css})
        store.dispatch({type:'INC_FRAMES',iframes})
    }

    startMainloop() {
        console.log("go go go")
        store.dispatch({type:'HIDE_SPLASH'})
        // setInterval(this.mainloop,3000)
        setInterval(this.mainloop, 200)
        // this.mainloop()
    }

    constructor(props) {
        super(props)
        store.dispatch({
            type: 'SET_AUDIODEVICE',
            device: [ new Audio(), new Audio(), new Audio() ]
        })
        fetch("sounds3.json")
                .then(res => res.json())
                .then((data) => {
                    var tempa = {}
                    var tempi = {}
                    for(var record in data) {
                        tempa[record]=data[record]['sound']
                        tempi[record]=data[record]['image']
                        console.log(data[record]['sound'])
                    }
                    store.dispatch({
                        type: 'SET_URLS',
                        audiourls: tempa,
                        imageurls: tempi
                    })
                }
            )
        this.startMainloop = this.startMainloop.bind(this)
        this.mainloop = this.mainloop.bind(this)
    }

    render() {
        const state = store.getState()

        // <Layer id=1 />

      return (
        <div className="App">
            <div style={state.styles[0]} className="image0" />
            <div style={state.styles[1]} className="image1" />
            <div style={state.styles[2]} className="image2" />
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
        splashstyle: state.splashstyle
    }
}

export default connect(mapStateToProps)(App)
