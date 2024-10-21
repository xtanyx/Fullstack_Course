const PersonForm = ({handleOnSubmit, handleOnChangeName, handleOnChangeNumber, newName, newNumber}) => {
    return (
        <form onSubmit={handleOnSubmit}>
            <div>
                name: <input value={newName} onChange={handleOnChangeName}/>
            </div>
            <div>
                number: <input value={newNumber} onChange={handleOnChangeNumber}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm