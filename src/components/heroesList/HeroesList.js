import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {createSelector} from '@reduxjs/toolkit';
import { heroesDelete, fetchHeroes } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

const HeroesList = () => {
   const filteredHeroesSelector=createSelector(
        (state)=>state.filters.activeFilter,
        (state)=>state.heroes.heroes,
        (filter,heroes)=>{
            if (filter === 'all') {
                return heroes;
            } else {
                return heroes.filter(elem=>elem.element===filter)
            }
        }
   )
    const filteredHeroes=useSelector(filteredHeroesSelector)
    const dispatch = useDispatch();
    const {request} = useHttp();
    const heroesLoadingStatus = useSelector(state => state.heroes.filteredHeroes);
    useEffect(() => {
        dispatch(fetchHeroes());
    }, []);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }
    const onDeleteHeroes=(id)=>{
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
        .then(data => console.log(data, 'Deleted'))
        .then(dispatch(heroesDelete(id)))
        .catch(err => console.log(err));
    }
    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} remove={()=>onDeleteHeroes(id)}/>
        })
    }
    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;