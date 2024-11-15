interface CoursePartBase{
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase{
  description: string;
}

interface CoursePartBasic extends CoursePartDescription{
  kind: 'basic';
}

interface CoursePartGroup extends CoursePartBase{
  groupProjectCount: number;
  kind: 'group';
}

interface CoursePartBackground extends CoursePartDescription{
  backgroundMaterial: string;
  kind: 'background';
}

interface CoursePartSpecial extends CoursePartDescription{
  requirements: string[];
  kind: 'special';
}

type CoursePart =  CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const Part = ({part}: {part: CoursePart}) => {
  switch (part.kind) {
    case 'basic': {
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong><br/>
          <em>{part.description}</em>
        </p>
      )
    }
    case 'group': {
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong><br/>
          project exercises: {part.groupProjectCount}
        </p>
      )
    }
    case 'background': {
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong><br/>
          <em>{part.description}</em><br/>
          submit to {part.backgroundMaterial}
        </p>
      )
    }
    case 'special': {
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong><br/>
          <em>{part.description}</em><br/>
          Requirements: {part.requirements.join(', ')}
        </p>
      )
    }
  }
}

interface HeaderProps{
  name: string;
}

const Header = (props: HeaderProps) => {
  return <h1>{props.name}</h1>;
}

interface CourseParts {
  parts: CoursePart[] 
}

const Content = (props: CourseParts) => {
  return (
    <div>
      {props.parts.map(part => <Part key={part.name} part={part}/>)}
    </div>
  );
};

interface Exercises{
  totalExercises: number;
}

const Total = (props: Exercises) => {
  return (
    <p>
      Number of exercises {props.totalExercises}
    </p>
  );
}

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName}/>
      <Content parts={courseParts}/>
      <Total totalExercises={totalExercises}/>
    </div>
  );
};

export default App;