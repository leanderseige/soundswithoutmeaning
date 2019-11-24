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
          action.audio.volume = 1.0
          temp = Object.assign({}, state.layer_audio)
          temp[action.id] = action.audio
          return Object.assign({}, state, { layer_audio: temp })
        case "SET_URLS":
            // console.log("setting "+action.audiourls)
            return Object.assign({}, state, {
                audiourls: action.audiourls,
                imageurls: action.imageurls,
                audiolabels: action.audiolabels
            })
        case "HIDE_SPLASH":
            console.log("hiding")
            return Object.assign({}, state, {
                splashstyle: {display: 'none'}
            })
        case "SHOW_SPLASH":
            return Object.assign({}, state, {
                splashstyle: {display: 'flex'}
            })
        case "SET_MODE":
            temp = Object.assign({}, state.mode, action.mode)
            return Object.assign({}, state, { mode: temp } )
        case "SET_LAYERS":
            return Object.assign({}, state, {
              nol: action.nol
            })
        case "SET_STARTTIME":
            return Object.assign({}, state, { starttime: action.ms } )
        case "LAYER_SETNEXTTIME":
            temp = Object.assign({}, state.layer_nexttime)
            temp[action.id] = action.nexttime
            return Object.assign({}, state, {layer_nexttime: temp})
        case "LAYER_SETLABEL":
            temp = Object.assign({}, state.layer_label)
            temp[action.id] = action.label
            return Object.assign({}, state, {layer_label: temp})
        default:
            {
                return state
            }
    }
}

const initial_state = {
    starttime:0,
    mode: {
        'screen':0,
        'text':0,
        'play':0
    },
    splashstyle: {display:'flex'},
    layer_css: {},
    layer_audio: {},
    layer_nexttime: {},
    layer_label: {},
    nol: 0
}

const enhancers = compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const store = createStore(reducer, initial_state, enhancers)

export default store
