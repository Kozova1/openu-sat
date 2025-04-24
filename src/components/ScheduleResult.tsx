import {Course, Semester} from "../openu/types.ts";
import {useEffect, useState} from "react";
import {CourseAssignments, ScheduleState, solveSchedule} from "../openu/course-solver.ts";
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

export default function ScheduleResult({semesters, courses}: {
    semesters: Semester[],
    courses: Course[]
}) {
    const [sat, setSat] = useState<ScheduleState>(ScheduleState.Uninitialized);
    const [assignments, setAssignments] = useState<CourseAssignments>(new Map());

    function isSolverRunning() {
        return sat === ScheduleState.Solving;
    }

    function runSolver() {
        setSat(ScheduleState.Solving);
        (async () => {
            const [satisfiability, assignments] = await solveSchedule({
                semesters,
                courses: courses.filter(course => course.isActive)
            });

            setSat(satisfiability);
            setAssignments(assignments ?? new Map());
        })().catch(console.error);
    }

    useEffect(
        runSolver,
        [courses, semesters]
    );

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
                        const relevantCourses = (assignments.get(semester) ?? [])
                            .map(course => (
                                <ListItemText
                                    key={course.courseId}
                                >
                                    {course.toString()}
                                </ListItemText>
                            ));

                        return relevantCourses.length > 0
                            ? (
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
                            )
                            : (<></>);
                    })
                }
            </List>
        </>
    )
}