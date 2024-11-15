import { useState } from "react";
import { EntryWithoutId, Patient, Diagnosis } from "../types";
import patientService from '../services/patients';
import axios from "axios";
import { Select, MenuItem, Input } from "@mui/material";

interface Props{
  id: string;
  setEntryType: React.Dispatch<React.SetStateAction<string>>;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  type: string;
  diagnosisCodes: Array<Diagnosis['code']>;
}

const HospitalEntry = (props: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [diagnosesCodes, setDiagnosesCodes] = useState<Array<Diagnosis['code']>>([]);
  const [errorMessage, setErrorMessage] = useState('');

  if (props.type !== 'hospital') {
    return null;
  }

  const handleOnAdd = async () => {
    const newEntry: EntryWithoutId = {
      type: 'Hospital',
      description: description,
      date: date,
      specialist: specialist,
      discharge: {
        date: dischargeDate,
        criteria: dischargeCriteria
      }
    };

    if(diagnosesCodes.length !== 0) {
      newEntry.diagnosisCodes = diagnosesCodes;
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
      setDischargeDate('');
      setDischargeCriteria('');
      setDiagnosesCodes([]);
      props.setEntryType('');
    } catch (error: unknown) {
      console.log(error);
      let message = 'Error: ';
        if (axios.isAxiosError(error)) {
          message += error.response?.data.error[0].message;
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
    setDischargeDate('');
    setDischargeCriteria('');
    setDiagnosesCodes([]);
    props.setEntryType('');
  };

  return (
    <div>
      <p>{errorMessage}</p>
      <h3>New Hospital entry</h3>
      <div>
        Description
        <input value={description} onChange={(event) => setDescription(event.target.value)}/>
      </div>
      <div>
        Date
        <Input type='date' value={date} onChange={(event) => setDate(event.target.value)}/>
      </div>
      <div>
        Specialist
        <input value={specialist} onChange={(event) => setSpecialist(event.target.value)}/>
      </div>
      <div>
        Discharge
        <div>
          date:
          <Input type='date' value={dischargeDate} onChange={(event) => setDischargeDate(event.target.value)}/>
        </div>
        <div>
          criteria:
          <input value={dischargeCriteria} onChange={(event) => setDischargeCriteria(event.target.value)}/>
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

export default HospitalEntry;