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
        case "SET_IMAGE":
            // console.log("set image")
            var tempi = Object.assign({},state.images)
            tempi[action.dn]=action.image
            var temps = Object.assign({},state.styles)
            temps[action.dn] = Object.assign({},temps[action.dn])
            temps[action.dn]['backgroundImage']='url('+action.image+')'
            temps[action.dn]['backgroundSize']='200%'
            temps[action.dn]['backgroundPosition']='center'
            return Object.assign({}, state, {images: tempi}, {styles: temps})
        case "SET_STYLE":
            // console.log("set style")
            var temps = Object.assign({},state.styles)
            temps[action.dn] = Object.assign({},temps[action.dn])
            temps[action.dn]['opacity']=action.vol
            return Object.assign({}, state, {styles: temps})
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
    styles: { 0:{opacity:0.0}, 1:{opacity:0.0}, 2:{opacity:0.0} },
    splashstyle: {display:'flex'}
}

const enhancers = compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const store = createStore(reducer, initial_state, enhancers)

export default store
