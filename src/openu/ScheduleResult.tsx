import {Course, Semester} from "./types.ts";
import {Dispatch, SetStateAction, useState} from "react";
import {solveSchedule} from "./course-solver.ts";
import Button from "@mui/material/Button";

export default function ScheduleResult({semesters, coursesState, setCoursesState}: {
    semesters: Semester[],
    coursesState: Course[],
    setCoursesState: Dispatch<SetStateAction<Course[]>>
}) {
    const [sat, setSat] = useState<"sat" | "unsat" | "בטעינה" | "יש ללחוץ על 'חשב שוב'">("יש ללחוץ על 'חשב שוב'");

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
        return sat === "בטעינה";
    }

    function runSolver() {
        setSat("בטעינה");
        solveScheduleComponent().catch(console.error);
    }

    return (
        <>
            <h1>מצב הלו"ז: {sat}</h1>
            <Button onClick={runSolver} disabled={isSolverRunning()}>חשב שוב</Button>
            <table>
                <thead>
                <tr>
                    <th scope="col">סמסטר</th>
                    <th scope="col">קורסים</th>
                </tr>
                </thead>
                <tbody>
                {
                    ...semesters.map(sem => (
                        <tr>
                            <th scope="row">{sem.toString()}</th>
                            {
                                coursesState
                                    .filter(c => c.chosenSemester === sem)
                                    .map(course => (<td key={course.id}>{course.toString()}</td>))
                            }
                        </tr>
                    ))
                }
                <tr>
                </tr>
                </tbody>
            </table>
        </>
    )
}