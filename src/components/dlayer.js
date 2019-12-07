import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store'

class DLayer extends Component {

  mainloop() {
    // are we actually on air?
    if(this.props.mode['play']===0) {
      return
    }
    for (var i=0;i<this.props.nol;i++) {
        // let's calculate our timing
        var now = (new Date()).getTime()
        var reltime = this.props.nexttime[i] - now
        // prepare new css object
        var newcss = Object.assign({},this.props.css[i])
        // are we past the deadline? load new medium then
        if( reltime <= 0 ){
          // reset relative time and set next deadline
          reltime = 60000 + reltime
          store.dispatch({type:'LAYER_SETNEXTTIME',
            id: i,
            nexttime:this.props.nexttime[i]+60000
          })
          var randitem = Math.floor(Math.random() * Object.keys(this.props.all_imageurls).length)
          var toplay = this.props.all_imageurls[randitem]
          console.log(i+" "+Math.round((new Date()).getTime() / 1000)+" playing "+toplay)
          newcss['backgroundImage'] = 'url(' + toplay + ')'
          this.props.audio[i].src=this.props.all_audiourls[randitem]
          this.props.audio[i].loop=true
          this.props.audio[i].play()
          var label = this.props.all_audiolabels[randitem]
          store.dispatch({type:'LAYER_SETLABEL', id: i, label:label})
        }
        var scale = (30000-Math.abs((30000-reltime)))/30000
        newcss['opacity'] = scale
        store.dispatch({type:'LAYER_SETCSS', id: i, css:newcss})
    }
  }

  constructor(props) {
    super(props)
    this.mainloop = this.mainloop.bind(this);
    for (var i=0;i<this.props.nol;i++) {
        store.dispatch({type:'LAYER_SETNEXTTIME',
          id: i ,
          nexttime:(60000/this.props.nol)* i +(new Date()).getTime()
        })
        store.dispatch({type:'LAYER_SETAUDIO',
          id: i ,
          audio:new Audio()
        })
        store.dispatch({type:'LAYER_SETCSS',
          id: i ,
          css: { zIndex : ( i +1) }
        })
    }
    setInterval(this.mainloop, 150)
  }

    render() {
        const layers = []

        for (var i=0;i<this.props.nol;i++) {
          layers.push(
              <div id={i} key={"l"+i.toString()} style={this.props.css[i]} className="layer">{i}</div>
            )
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
        nol: state.nol
    }
}

export default connect(mapStateToProps)(DLayer)
