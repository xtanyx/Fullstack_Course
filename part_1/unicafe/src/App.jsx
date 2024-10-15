import { useState } from 'react'

const Button = ({feedback,handleOnClick}) => {
  return (
    <button onClick={handleOnClick}>
      {feedback}
    </button>
  )
  
}

const StatisticsLine = ({text,value,extra=''}) => {
  return (
  <tr>
    <td>{text}</td>
    <td>{value} {extra}</td>
  </tr>)
}

const Statistics = ({good,neutral,bad,all,average,positive}) => {

  if (all !== 0){
    return(
      <table>
        <tbody>
          <StatisticsLine text='good' value={good}/>
          <StatisticsLine text='neutral' value={neutral}/>
          <StatisticsLine text='bad' value={bad}/>
          <StatisticsLine text='all' value={all}/>
          <StatisticsLine text='average' value={average}/>
          <StatisticsLine text='positive' value={positive} extra='%'/>
        </tbody>
      </table>
    )
  }
  else {
    return <p>No feedback given</p>
  }
  
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral,setNeutral] = useState(0)
  const [bad,setBad] = useState(0)
  const [all,setAll] = useState(0)
  const [average,setAverage] = useState(0)
  const [positive,setPositive] = useState(0)

  const GOOD = 1;
  const NEUTRAL = 2;
  const BAD = 3;

  const averageScore = (all,valueupdated,flag) => {
    console.log('all: ',all)
    let total_score = 0;
    if (flag === 1){
      total_score = (valueupdated*1) + (neutral*0) + (bad*(-1))
    } 
    else if (flag === 2) {
      total_score = (good*1) + (valueupdated*0) + (bad*(-1))
    }
    else{
      total_score = (good*1) + (neutral*0) + (valueupdated*(-1))
    }
    console.log(total_score)
    setAverage(total_score/all)
  }

  const posPercent = (all,valueupdated,flag) => {
    let positivepercent = 0;
    if(flag===1){
      positivepercent = (valueupdated/all)*100
    }
    else{
      positivepercent = (good/all)*100
    }
    setPositive(positivepercent)
  }

  const handleOnClick = (flag,value,update) => {
    const valueupdated = value+1 
    const allupdated = all+1
    update(valueupdated)
    setAll(allupdated)
    averageScore(allupdated,valueupdated,flag)
    posPercent(allupdated,valueupdated,flag)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button feedback='good' handleOnClick={() => handleOnClick(GOOD,good,setGood)}/>
      <Button feedback='neutral' handleOnClick={() => handleOnClick(NEUTRAL,neutral,setNeutral)}/>
      <Button feedback='bad' handleOnClick={() => handleOnClick(BAD,bad,setBad)}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App
