import {ReactNode, useState} from 'react'
import './App.css'
import {Course, Semester} from "./openu/types.ts";
import ScheduleResult from "./components/ScheduleResult.tsx";
import CoursesEditor from "./components/CoursesEditor.tsx";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {Box, CssBaseline, Grid, Stack, Step, StepLabel, Stepper} from "@mui/material";
import {defaultCourses, defaultSemesters} from "./openu/defaults.ts";
import Button from "@mui/material/Button";
import SemestersEditor from "./components/SemestersEditor.tsx";
import CoursesDependenciesEditor from "./components/CoursesDependenciesEditor.tsx";

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
    ]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <CacheProvider value={rtlCache}>
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
            </CacheProvider>
        </ThemeProvider>
    )
}

export default App;
