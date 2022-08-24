import {configureStore} from '@reduxjs/toolkit';
import filters from '../components/heroesFilters/filtersSlice';
import heroes from '../components/heroesList/heroesSlice';
// import heroes from '../reducers/heroes';

const stringMiddleweare=()=>(next)=>(action)=>{
    if (typeof action === 'string'){
        return next ({
            type:action
        })
    }
    return next(action)
}

// const store =createStore(
//                 combineReducers({heroes,filters}),
//                 compose(applyMiddleware(ReduxThunk, stringMiddleweare),
//                 window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//                 )

const store=configureStore({
    reducer: {heroes,filters},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleweare),
    devTools:process.env.Node_ENV !=='production',
    
})

export default store;

