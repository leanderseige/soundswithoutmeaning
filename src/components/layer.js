import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store'

class Layer extends Component {

  mainloop() {
    // are we actually on air?
    if(this.props.mode['play']===0) {
      return
    }
    // let's calculate our timing
    var now = (new Date()).getTime()
    var reltime = this.props.nexttime - now
    // prepare new css object
    var newcss = Object.assign({},this.props.css)
    // are we past the deadline? load new medium then
    if( reltime <= 0 ){
      // reset relative time and set next deadline
      reltime = 60000 + reltime
      store.dispatch({type:'LAYER_SETNEXTTIME',
        id:this.props.id,
        nexttime:this.props.nexttime+60000
      })
      var randitem = Math.floor(Math.random() * Object.keys(this.props.all_imageurls).length)
      var toplay = this.props.all_imageurls[randitem]
      console.log(this.props.id+" "+Math.round((new Date()).getTime() / 1000)+" playing "+toplay)
      newcss['backgroundImage'] = 'url(' + toplay + ')'
      this.props.audio.src=this.props.all_audiourls[randitem]
      this.props.audio.loop=true
      this.props.audio.play()
      var label = this.props.all_audiolabels[randitem]
      store.dispatch({type:'LAYER_SETLABEL', id:this.props.id, label:label})
    }
    var scale = (30000-Math.abs((30000-reltime)))/30000
    newcss['opacity'] = scale
    store.dispatch({type:'LAYER_SETCSS', id:this.props.id, css:newcss})
  }

  constructor(props) {
    super(props)
    this.mainloop = this.mainloop.bind(this);
    console.log("I am "+this.props.id+" of "+this.props.nol)
    store.dispatch({type:'LAYER_SETNEXTTIME',
      id:this.props.id,
      nexttime:(60000/this.props.nol)*this.props.id+(new Date()).getTime()
    })
    store.dispatch({type:'LAYER_SETAUDIO',
      id:this.props.id,
      audio:new Audio()
    })
    store.dispatch({type:'LAYER_SETCSS',
      id:this.props.id,
      css: { zIndex : (this.props.id+1) }
    })
    setInterval(this.mainloop, 200)
  }

  render() {
    return (
      <div style={this.props.css} className="layer">{this.props.id}</div>
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
        css: state.layer_css[ownProps.id],
        audio: state.layer_audio[ownProps.id],
        nexttime: state.layer_nexttime[ownProps.id],
        nol: state.nol,
        id: ownProps.id
    }
}

export default connect(mapStateToProps)(Layer)
