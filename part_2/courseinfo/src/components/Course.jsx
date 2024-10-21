const Header = ({name}) => {
    return (<h3>{name}</h3>)
}
  
const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)}
      </div>
    )
}
  
const Total = ({parts}) => {
    const initialValue = 0
    const sum = parts.reduce((accumulator,currentValue) => accumulator+currentValue.exercises, initialValue)
    return(
    <strong>
      <p>total of {sum} exercises</p>
    </strong>
    )
}
  
const Course = ({course}) => {
    //console.log(course.name)
    return(
      <div>
        <Header name={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
}

export default Course