const Filter = ({filter, handleOnChangeFilter}) => {
    return (
        <label>
            {'filter shown with '} 
            <input value={filter} onChange={handleOnChangeFilter}/>
        </label>
    )
}

export default Filter