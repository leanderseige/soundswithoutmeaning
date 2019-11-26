import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store'

class Statsbar extends Component {

  render() {
    var now = (new Date()).getTime()
    var percent = Math.round((this.props.nexttime-now)/600)
    var volume = (50-Math.abs(50-percent))*2

    var pct_style={width:(percent*2).toString()+"px"}
    var vol_style={width:(volume*2).toString()+"px"}

    return (
      <div className="statsbar">
        <h3>{this.props.label}</h3>
        <div className="statsvol" style={vol_style}>Volume: {volume} %</div>
        <div className="statspct" style={pct_style}>Time: {percent} %</div>
      </div>
    )
  }

}

function mapStateToProps(state, ownProps) {
    return {
        css: state.layer_css[ownProps.id], // only need to trigger update
        nexttime: state.layer_nexttime[ownProps.id],
        label: state.layer_label[ownProps.id],
        id: ownProps.id
    }
}

export default connect(mapStateToProps)(Statsbar)
