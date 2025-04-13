import {ReactNode, useState} from 'react'
import './App.css'
import {Course, Semester} from "./openu/types.ts";
import ScheduleResult from "./openu/ScheduleResult.tsx";
import CoursesEditor from "./openu/CoursesEditor.tsx";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {Box, CssBaseline, Step, StepLabel, Stepper} from "@mui/material";
import {defaultCourses, defaultSemesters} from "./openu/defaults.ts";
import Button from "@mui/material/Button";
import SemestersEditor from "./openu/SemestersEditor.tsx";
import CoursesDependenciesEditor from "./openu/CoursesDependenciesEditor.tsx";

enum EditingState {
    ChooseSemesters,
    ChooseCourses,
    SetCourseDependencies,
    ObserveResults,
}

const editingStateToStageName = new Map<EditingState, string>([
    [EditingState.ChooseSemesters, "בחירת סמסטרים"],
    [EditingState.ChooseCourses, "בחירת קורסים"],
    [EditingState.SetCourseDependencies, "הגדרת דרישות קורסים"],
    [EditingState.ObserveResults, "צפייה בתוצאות"],
]);

const theme = createTheme({
    direction: "rtl",
    palette: {
        mode: "dark",
    }
});

// Create rtl cache
const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
    const [coursesState, setCoursesState] = useState<Course[]>(defaultCourses);
    const [semestersState, setSemestersState] = useState<Semester[]>(defaultSemesters);
    const [editingState, setEditingState] = useState<EditingState>(EditingState.ChooseSemesters);

    const semestersEditor = (
        <SemestersEditor semesters={semestersState} setSemesters={setSemestersState}/>
    );
    const coursesEditor = (
        <CoursesEditor courses={coursesState} setCourses={setCoursesState}/>
    );
    const coursesDependenciesEditor = (
        <CoursesDependenciesEditor courses={coursesState} setCourses={setCoursesState}/>
    );
    const scheduleResult = (
        <ScheduleResult semesters={semestersState} coursesState={coursesState} setCoursesState={setCoursesState}/>
    );

    const stageToElement = new Map<EditingState, ReactNode>([
        [EditingState.ChooseSemesters, semestersEditor],
        [EditingState.ChooseCourses, coursesEditor],
        [EditingState.SetCourseDependencies, coursesDependenciesEditor],
        [EditingState.ObserveResults, scheduleResult],
    ])


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <CacheProvider value={rtlCache}>
                <Box>
                    <Box sx={{width: "100%"}}>
                        <Stepper activeStep={editingState}>
                            {
                                Array.from(editingStateToStageName.entries()).map(([stage, stageName]) => (
                                    <Step
                                        disabled={stage === EditingState.ObserveResults ? editingState !== EditingState.ObserveResults : false}>
                                        <StepLabel onClick={() => setEditingState(stage)}>{stageName}</StepLabel>
                                    </Step>
                                ))
                            }
                        </Stepper>
                    </Box>
                    <Box padding={2}>
                        {stageToElement.get(editingState)!}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
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
                    </Box>
                </Box>
            </CacheProvider>
        </ThemeProvider>
    )
}

export default App;
