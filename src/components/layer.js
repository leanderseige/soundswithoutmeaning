import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store'

class Layer extends Component {

  mainloop() {
    if(this.props.mode===0) {
      return
    }
    // calculate general animation parameters
    var relframes = (this.props.frames+this.props.id*750) % 3000
    // var scale = Math.sin((relframes/3000)*Math.PI)
    var scale = (1500-Math.abs((1500-relframes)))/1500
    // set volume
    this.props.audio.volume = scale
    // build new css set
    var newcss = Object.assign({},this.props.css)
    // change medium?
    if( relframes % 3000 === 0) {
      var randitem = Math.floor(Math.random() * Object.keys(this.props.all_imageurls).length)
      var toplay = this.props.all_imageurls[randitem]
      console.log("playing "+toplay)
      newcss['backgroundImage'] = 'url(' + toplay + ')'
      newcss['zIndex'] = this.props.id
      this.props.audio.src=this.props.all_audiourls[randitem]
      this.props.audio.loop=true
      this.props.audio.play()
    }
    newcss['opacity'] = scale
    store.dispatch({type:'LAYER_SETCSS',id:this.props.id,css:newcss})
    // calc frames
    var newframes = this.props.frames-10
    if(newframes<0){
      newframes = 3000
    }
    store.dispatch({type:'LAYER_SETFRAMES',id:this.props.id,frames:newframes})
  }

  constructor(props) {
    super(props)
    this.mainloop = this.mainloop.bind(this);
    console.log("I am "+this.props.id)
    store.dispatch({type:'LAYER_SETFRAMES',id:this.props.id,frames:3000})
    store.dispatch({type:'LAYER_SETAUDIO',id:this.props.id,audio:new Audio()})
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
        all_audiourls: state.audiourls,
        all_imageurls: state.imageurls,
        frames: state.layer_frames[ownProps.id],
        css: state.layer_css[ownProps.id],
        audio: state.layer_audio[ownProps.id],
        id: ownProps.id
    }
}

export default connect(mapStateToProps)(Layer)
