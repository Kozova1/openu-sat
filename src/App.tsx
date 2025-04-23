import {ReactNode, useReducer, useState} from 'react'
import './App.css'
import {Course, Semester} from "./openu/types.ts";
import ScheduleResult from "./components/ScheduleResult.tsx";
import {Box, Grid, Stack, Step, StepLabel, Stepper} from "@mui/material";
import {initialCourses, defaultSemesters} from "./openu/defaults.ts";
import Button from "@mui/material/Button";
import SemestersEditor from "./components/SemestersEditor.tsx";
import {CourseAction, handleCourseAction} from './openu/courses-state.ts';
import {CoursesEditor} from "./components/CoursesEditor.tsx";

enum EditingState {
    ChooseSemesters,
    ChooseCourses,
    ObserveResults,
}

const editingStateToStageName = new Map<EditingState, string>([
    [EditingState.ChooseSemesters, "בחירת סמסטרים"],
    [EditingState.ChooseCourses, "בחירת קורסים"],
    [EditingState.ObserveResults, "צפייה בתוצאות"],
]);


function App() {
    const [coursesState, dispatchCourses] = useReducer<Course[], [CourseAction]>(handleCourseAction, initialCourses);
    const [semestersState, setSemestersState] = useState<Semester[]>(defaultSemesters);
    const [editingState, setEditingState] = useState<EditingState>(EditingState.ChooseSemesters);

    const semestersEditor = (
        <SemestersEditor semesters={semestersState} setSemesters={setSemestersState}/>
    );
    const coursesEditor = ( // TODO: a bit laggy but mostly works - maybe find way to fix this.
        <CoursesEditor courses={coursesState} dispatchCourses={dispatchCourses} />
    );
    // synchronizing using useEffect maybe for the SAT?
    const scheduleResult = (
        <ScheduleResult semesters={semestersState} courses={coursesState} />
    );

    const stageToElement = new Map<EditingState, ReactNode>([
        [EditingState.ChooseSemesters, semestersEditor],
        [EditingState.ChooseCourses, coursesEditor],
        [EditingState.ObserveResults, scheduleResult],
    ]);

    return (
        <Stack>
            <Stepper activeStep={editingState}>
                {
                    Array.from(editingStateToStageName.entries()).map(([stage, stageName]) => (
                        <Step
                            disabled={stage === EditingState.ObserveResults ? editingState !== EditingState.ObserveResults : false}>
                            <StepLabel>{stageName}</StepLabel>
                        </Step>
                    ))
                }
            </Stepper>
            {stageToElement.get(editingState)!}
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                size={12}
            >
                {(editingState === 0)
                    ? (<Box></Box>)
                    : (
                        <Button
                            onClick={() => setEditingState(oldState => oldState - 1)}
                            variant="contained"
                        >
                            חזור
                        </Button>
                    )
                }
                {
                    (editingState === EditingState.ObserveResults)
                        ? (<Box></Box>)
                        : (
                            <Button
                                onClick={() => setEditingState(oldState => oldState + 1)}
                                variant="contained"
                            >
                                {
                                    (editingState === EditingState.ObserveResults - 1)
                                        ? "סיים וחשב"
                                        : "המשך"
                                }
                            </Button>
                        )
                }
            </Grid>
        </Stack>
    )
}

export default App;
