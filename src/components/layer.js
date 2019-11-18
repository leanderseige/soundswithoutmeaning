import React, { Component } from 'react';
import { connect } from 'react-redux';

class Layer extends Component {
  mainloop() {
      var update = Object.assign({},this.setup.


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


  constructor(props) {
    super(props)
    setInterval(this.mainloop, 200)
  }

  render() {
    return (
      <div style={this.setup.css} className="layer"></div>
    );
  }

}

function mapStateToProps(state, ownProps) {
    return {
        setup: state.layer[this.props.id]
    };
}

export default connect(mapStateToProps)(Layer)
