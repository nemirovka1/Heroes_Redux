import { useState } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { createNewHero } from "../heroesList/heroesSlice";
import { useHttp } from "../../hooks/http.hook";

const HeroesAddForm = () => {
    const [heroName,setHeroName]=useState('');
    const [heroDescription,setHeroDescription]=useState('');
    const [heroSkill,setHeroSkill]=useState('');

    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const createNewHeroes=(event)=>{
        event.preventDefault()

        const newHero={
            id:uuidv4(),
            name:heroName,
            description:heroDescription,
            element:heroSkill
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
                .then(response=>console.log(response,'Успешно'))
                .then(dispatch(createNewHero(newHero)))
                .catch(error=>console.log(error));

        setHeroName('');
        setHeroDescription('');
        setHeroSkill('');
}

    const renderFilters=(filters,status)=>{
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                if (name === 'all')  return;
                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={createNewHeroes}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    value={heroName}
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    onChange={(event)=>setHeroName(event.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    value={heroDescription}
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    onChange={(event)=>setHeroDescription(event.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    value={heroSkill}
                    id="element" 
                    name="element"
                    onChange={(event)=>setHeroSkill(event.target.value)}>
                    <option >Я владею элементом...</option>
                    {renderFilters(filters,filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;