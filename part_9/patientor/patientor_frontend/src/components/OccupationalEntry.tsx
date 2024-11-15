import { useState } from "react";
import { Diagnosis, EntryWithoutId, Patient } from "../types";
import patientService from '../services/patients';
import axios from "axios";
import { Input, MenuItem, Select } from "@mui/material";

interface Props{
  id: string;
  setEntryType: React.Dispatch<React.SetStateAction<string>>;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  type: string;
  diagnosisCodes: Array<Diagnosis['code']>;
}

const OccupationalEntry = (props: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [employer, setEmployer] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diagnosesCodes, setDiagnosesCodes] = useState<Array<Diagnosis['code']>>([]);
  const [errorMessage, setErrorMessage] = useState('');

  if (props.type !== 'occupational') {
    return null;
  }

  const handleOnAdd = async () => {
    const newEntry: EntryWithoutId = {
      type: 'OccupationalHealthcare',
      description: description,
      date: date,
      specialist: specialist,
      employerName: employer
    };

    if(diagnosesCodes.length !== 0) {
      newEntry.diagnosisCodes = diagnosesCodes;
    }

    if(startDate !== '' && endDate !== '') {
      newEntry.sickLeave = {startDate: startDate, endDate: endDate};
    }

    try{
      const addedEntry = await patientService.createEntry(newEntry, props.id);
      const updatedPatient = {
        ...props.patient,
        entries: props.patient!.entries.concat(addedEntry),
      };
      props.setPatient(updatedPatient);

      setDescription('');
      setDate('');
      setSpecialist('');
      setEmployer('');
      setStartDate('');
      setEndDate('');
      setDiagnosesCodes([]);
      props.setEntryType('');
    } catch (error: unknown) {
      console.log(error);
      let message = 'Error: ';
        if (axios.isAxiosError(error)) {
          if (error.response?.data.error[0].code === 'invalid_enum_value') {
            message += `Value of HealthCheckRating incorrect: ${error.response?.data.error[0].received}`;
          }
          else {
            message += error.response?.data.error[0].message;
          }
          setErrorMessage(message);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }
        else {
          setErrorMessage('Unknown error');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }
    }
  };

  const handleOnCancel = () => {
    setDescription('');
    setDate('');
    setSpecialist('');
    setEmployer('');
    setStartDate('');
    setEndDate('');
    setDiagnosesCodes([]);
    props.setEntryType('');
  };

  console.log(diagnosesCodes);
  return (
    <div>
      <p>{errorMessage}</p>
      <h3>New Occupational Healthcare entry</h3>
      <div>
        Description
        <input value={description} onChange={(event) => setDescription(event.target.value)}/>
      </div>
      <div>
        Date:
        <Input type='date' value={date} onChange={(event) => setDate(event.target.value)}/>
      </div>
      <div>
        Specialist
        <input value={specialist} onChange={(event) => setSpecialist(event.target.value)}/>
      </div>
      <div>
        Employer
        <input value={employer} onChange={(event) => setEmployer(event.target.value)}/>
      </div>
      <div>
        Sick Leave:
        <div>
          start date:
          <Input type='date' value={startDate} onChange={(event) => setStartDate(event.target.value)}/>
        </div>
        <div>
          end date:
          <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)}/>
        </div>
      </div>
      <div>
        Diagnosis Codes
        <Select label='code' multiple value={diagnosesCodes} onChange={(event) => {
          if (typeof event.target.value !== 'string') {
            setDiagnosesCodes(event.target.value);
          }
        }}>
          {props.diagnosisCodes.map(code => <MenuItem key={code} value={code}>{code}</MenuItem>)}
        </Select>
      </div>
      <button onClick={handleOnAdd}>add</button>
      <button onClick={handleOnCancel}>cancel</button>
    </div>
  );
};

export default OccupationalEntry;