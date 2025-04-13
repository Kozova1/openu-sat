import {useState} from 'react'
import './App.css'
import {Course, Semester} from "./openu/types.ts";
import ScheduleResult from "./openu/ScheduleResult.tsx";
import CoursesEditor from "./CoursesEditor.tsx";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {CssBaseline} from "@mui/material";
import {defaultCourses} from "./openu/defaults.ts";

const semesters = [
    new Semester(2026, "א"),
    new Semester(2026, "ב"),
    new Semester(2026, "ג"),
    new Semester(2027, "א"),
    new Semester(2027, "ב"),
    new Semester(2027, "ג"),
    new Semester(2028, "א"),
    new Semester(2028, "ב"),
    new Semester(2028, "ג"),
];

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CacheProvider value={rtlCache}>
                <div>
                    <CoursesEditor courses={coursesState} setCourses={setCoursesState}/>
                    <ScheduleResult semesters={semesters} coursesState={coursesState} setCoursesState={setCoursesState}/>
                </div>
            </CacheProvider>
        </ThemeProvider>
    )
}

export default App;
