import { NonSensitiveDiaryEntry } from "../types";

const DiaryEntry = ({entry}: {entry: NonSensitiveDiaryEntry}) => {
  return(
    <div>
      <h3>{entry.date}</h3>
      <p>
        visibility: {entry.visibility} <br/>
        weather: {entry.weather}
      </p>
    </div>
  )
}

export default DiaryEntry;