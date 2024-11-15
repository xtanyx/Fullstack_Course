import React, { useEffect, useState } from 'react';
import { NonSensitiveDiaryEntry, Weather, Visibility } from './types';
import { getAll, addEntry } from './services/diaryService';
import DiaryEntry from './components/DiaryEntry';
import axios from 'axios';

function App() {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisiblity] = useState<Visibility>(Visibility.Ok);
  const [weather, setWeather] = useState<Weather>(Weather.Rainy);
  const [comment, setComment] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    getAll()
    .then(data => {
      setDiaryEntries(data);
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  const handleAddEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiaryEntry = {
      date: date,
      visibility: visibility,
      weather: weather,
      comment: comment
    }
    addEntry(newDiaryEntry)
      .then(data => {
        setDiaryEntries(diaryEntries.concat(data));
      })
      .catch(error => {
        if (axios.isAxiosError(error)){
          console.log(error);
          if (error.response) {
            setNotification(error.response.data);
            setTimeout(() => {
              setNotification('');
            }, 3000);
          }
        }
        else {
          setNotification('Something went wrong.');
          setTimeout(() => {
            setNotification('');
          }, 3000);
        }
      })

    setDate('');
    setComment('');
  };

  return (
    <div>
      <div>
        <h1>Add new entry</h1>
        <p>
          {notification}
        </p>
        <form onSubmit={handleAddEntry}>
          <div>
            date
            <input
              type='date'
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div>
            {'visibility '}
            {
              Object.values(Visibility).map(w =>
                <span key={w.toString()}>
                  {w.toString()}
                  <input
                    type='radio'
                    name='visibility'
                    onChange={() => setVisiblity(w)}
                  />
                </span>)
            }
          </div>
          <div>
            {'weather '}
            {
              Object.values(Weather).map(w =>
                <span key={w.toString()}>
                  {w.toString()}
                  <input
                    type='radio'
                    name='weather'
                    onChange={() => setWeather(w)}
                  />
                </span>)
            }
          </div>
          <div>
            comment
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
          <button>add</button>
        </form>
      </div>
      <div>
        <h1>Diary entries</h1>
        {
          diaryEntries.map(entry => <DiaryEntry key={entry.id} entry={entry}/>)
        }
      </div>
    </div>
  )
}

export default App
