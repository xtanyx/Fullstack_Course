import { useDispatch } from "react-redux"
import { changeFilter } from "../reducers/filterReducer"

const FilterForm = () => {
  const dispatch = useDispatch()

  const handleFilterChange = (event) => {
    dispatch(changeFilter(event.target.value))
  }

  const filterStyle = {
    marginBottom: 10 
  }

  return (
    <div style={filterStyle}>
      {'filter '}
      <input onChange={handleFilterChange}></input>
      <br></br>
    </div>
  )
}

export default FilterForm