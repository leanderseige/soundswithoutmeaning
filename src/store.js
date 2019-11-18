import { createStore, compose } from 'redux'
import logo from './logo.svg';

function reducer(state, action) {
    switch (action.type) {
        case "SET_URLS":
            // console.log("setting "+action.audiourls)
            return Object.assign({}, state, {
                audiourls: action.audiourls,
                imageurls: action.imageurls
            })
        case "SET_AUDIODEVICE":
            // console.log("setting device")
            return Object.assign({}, state, {
                device: action.device
            })
        case "SET_CSS":
            return Object.assign({}, state, {
                styles: action.css
            })
        case "HIDE_SPLASH":
            return Object.assign({}, state, {
                splashstyle: {display: 'none'}
            })
        case "INC_FRAMES":
            // console.log("inc frames")
            var temp = Object.assign({},state.iframes,action.iframes)
            for(var i in temp) {
                temp[i] = temp[i]-10
            }
            return Object.assign({}, state, {
                frames: state.frames+10,
                iframes: temp
            })
        default:
            {
                return state
            }
    }
}

const initial_state = {
    frames:0,
    images: { 0: "lala", 1: {logo}, 2: {logo} },
    iframes: { 0: 3000, 1: 3000, 2: 3000 },
    styles: { 0: {}, 1: {}, 2: {} },
    splashstyle: {display:'flex'}
}

const enhancers = compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const store = createStore(reducer, initial_state, enhancers)

export default store
