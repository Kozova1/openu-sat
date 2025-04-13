import {Course, Semester} from "./types.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ScheduleState, solveSchedule} from "./course-solver.ts";
import Button from "@mui/material/Button";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";

export default function ScheduleResult({semesters, coursesState, setCoursesState}: {
    semesters: Semester[],
    coursesState: Course[],
    setCoursesState: Dispatch<SetStateAction<Course[]>>
}) {
    const [sat, setSat] = useState<ScheduleState>(ScheduleState.Uninitialized);

    async function solveScheduleComponent() {
        const data = await solveSchedule({
            semesters,
            coursesState,
            setCoursesState,
            maxCoursesPerSemester: 3,
            maxSemesterDifficulty: 10,
        });
        setSat(data);
    }

    function isSolverRunning() {
        return sat === ScheduleState.Solving;
    }

    function runSolver() {
        setSat(ScheduleState.Solving);
        solveScheduleComponent().catch(console.error);
    }

    useEffect(runSolver, []);

    return (
        <>
            <Typography variant="h2">מצב הלו"ז: {sat}</Typography>
            {
                (isSolverRunning())
                    ? (<LinearProgress/>)
                    : (<></>)
            }
            <Button onClick={runSolver} disabled={isSolverRunning()}>חשב שנית</Button>
            <List
                sx={{
                    height: 300,
                    overflow: "auto"
                }}
            >
                {
                    ...semesters.map(semester => {
                        const relevantCourses = coursesState
                            .filter(course => course.chosenSemester === semester)
                            .map(course => (<ListItemText
                                key={course.id}>{course.toString()}</ListItemText>));

                        return relevantCourses.length > 0 ? (
                            <ListItem key={semester.toString()}>
                                <Accordion sx={{width: "100%"}}>
                                    <AccordionSummary>{semester.toString()}</AccordionSummary>
                                    <AccordionDetails>
                                        <List>
                                            {
                                                relevantCourses
                                            }
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            </ListItem>
                        ) : (<></>);
                    })
                }
            </List>
        </>
    )
}