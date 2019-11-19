import { createStore, compose } from 'redux'

function reducer(state, action) {
    var temp
    switch (action.type) {
        case 'LAYER_SETFRAMES':
          temp = Object.assign({}, state.layer_frames)
          temp[action.id]=action.frames
          return Object.assign({}, state, { layer_frames: temp })
        case 'LAYER_SETCSS':
          temp = Object.assign({}, state.layer_css)
          temp[action.id] = Object.assign({}, action.css)
          return Object.assign({}, state, { layer_css: temp })
        case 'LAYER_SETAUDIO':
          temp = Object.assign({}, state.layer_audio)
          temp[action.id] = action.audio
          return Object.assign({}, state, { layer_audio: temp })
        case "SET_URLS":
            // console.log("setting "+action.audiourls)
            return Object.assign({}, state, {
                audiourls: action.audiourls,
                imageurls: action.imageurls
            })
        case "HIDE_SPLASH":
            return Object.assign({}, state, {
                splashstyle: {display: 'none'}
            })
        case "SET_MODE":
            return Object.assign({}, state, {
              mode: action.mode
            })
        case "SET_LAYERS":
            return Object.assign({}, state, {
              layers: action.layers
            })
        default:
            {
                return state
            }
    }
}

const initial_state = {
    mode:0,
    splashstyle: {display:'flex'},
    layer_frames: {},
    layer_css: {},
    layer_audio: {},
    layers: 0
}

const enhancers = compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const store = createStore(reducer, initial_state, enhancers)

export default store
