import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store'

class DLayer extends Component {

  mainloop() {
    // are we actually on air?
    if(this.props.mode['play']===0) {
      return
    }
    var newcss={}
    var csschanged = false
    for (var i=0;i<this.props.nol;i++) {
        if(this.props.restartflag[i]===true) {
            store.dispatch({type:'LAYER_RESTARTFLAG',
              id: i ,
              flag: false
            })
        }
        newcss[i] = Object.assign({},this.props.css[i])
        // let's calculate our timing
        var now = (new Date()).getTime()
        var reltime = this.props.nexttime[i] - now
        // prepare new css object
        // are we past the deadline? load new medium then
        if( reltime <= 0 ) {
          // reset relative time and set next deadline
          reltime = 60000 + reltime
          store.dispatch({type:'LAYER_SETNEXTTIME',
            id: i,
            nexttime:this.props.nexttime[i]+60000
          })
          var randitem = Math.floor(Math.random() * Object.keys(this.props.all_imageurls).length)
          var toplay = this.props.all_imageurls[randitem]
          console.log(i+" "+Math.round((new Date()).getTime() / 1000)+" playing "+toplay)
          newcss[i]['backgroundImage'] = 'url(' + toplay + ')'
          csschanged=true
          store.dispatch({type:'LAYER_RESTARTFLAG',
            id: i ,
            flag: true
          })
          try {
              // this.props.audio[i].stop()
              console.log("Setting: "+this.props.all_audiourls[randitem])
              this.props.audio[i].src=this.props.all_audiourls[randitem]
              this.props.audio[i].loop=true
              this.props.audio[i].play()
          } catch(e) {
              console.log(e)
          }
          var label = this.props.all_audiolabels[randitem]
          store.dispatch({type:'LAYER_SETLABEL', id: i, label:label})
        }
    }
    if(csschanged) {
        store.dispatch({type:'LAYER_SETCSS', id: i, css:newcss})
    }
  }

  constructor(props) {
    super(props)
    this.mainloop = this.mainloop.bind(this);
    var css = {}
    for (var i=0;i<this.props.nol;i++) {
        store.dispatch({type:'LAYER_SETNEXTTIME',
          id: i ,
          nexttime:(60000/this.props.nol)* i +(new Date()).getTime()
        })
        store.dispatch({type:'LAYER_SETAUDIO',
          id: i ,
          audio:new Audio()
        })
        store.dispatch({type:'LAYER_RESTARTFLAG',
          id: i ,
          flag: false
        })
        css[i]={}
        css[i]['zIndex']=i+1
    }
    store.dispatch({type:'LAYER_SETCSS',
      id: i ,
      css: css
    })
    setInterval(this.mainloop, 250)
  }

    render() {
        const layers = []

        for (var i=0;i<this.props.nol;i++) {
            if(this.props.restartflag[i]===true) {
                layers.push(
                    <div id={i} key={"l"+i.toString()} style={this.props.css[i]} className="layer_off">{i}</div>
                )
            } else {
                layers.push(
                    <div id={i} key={"l"+i.toString()} style={this.props.css[i]} className="layer">{i}</div>
                )
            }
        }

        return (
            <div>{layers}</div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        mode: state.mode,
        layers: state.layers,
        all_audiourls: state.audiourls,
        all_imageurls: state.imageurls,
        all_audiolabels: state.audiolabels,
        css: state.layer_css,
        audio: state.layer_audio,
        nexttime: state.layer_nexttime,
        restartflag: state.layer_restartflag,
        nol: state.nol
    }
}

export default connect(mapStateToProps)(DLayer)
