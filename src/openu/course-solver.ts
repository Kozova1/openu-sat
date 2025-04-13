import Z3 from "./z3-consts.ts"
import {Course, Difficulty, Semester} from "./types.ts";
import {
    CoursesComeAfterDependencies,
    CoursesInPossibleSemesters,
    MaxCoursesPerSemester,
    SemesterDifficultyCapped
} from "./constraints.ts";
import {Max} from "./z3-utils.ts";
import {Dispatch, SetStateAction} from "react";

export enum ScheduleState {
    Uninitialized = "יש ללחוץ על 'חשב שנית'",
    Solving = "מנסים לפתור, רק רגע...",
    Unsat = "בלתי פתיר",
    Sat = "נפתר",
}

export async function solveSchedule(
    {semesters, coursesState, setCoursesState, maxSemesterDifficulty, maxCoursesPerSemester}: {
        semesters: Semester[],
        coursesState: Course[],
        setCoursesState: Dispatch<SetStateAction<Course[]>>,
        maxSemesterDifficulty: Difficulty,
        maxCoursesPerSemester: number
    }
): Promise<ScheduleState> {
    const courses = coursesState.map(course => new Course(
        course.id,
        course.name,
        course.difficulty,
        [...course.availableInSemesters],
        [...course.dependencies],
    ))

    courses.forEach(course => {
        course.satVar = Z3.Int.const(course.id);
    })

    const solver = new Z3.Optimize();

    // All courses must be taken in given semesters
    solver.add(...CoursesInPossibleSemesters(courses, semesters));

    // No more than maxCoursesPerSemester courses per semester
    solver.add(...MaxCoursesPerSemester(courses, maxCoursesPerSemester));

    // Courses with dependencies come after their dependencies
    solver.add(...CoursesComeAfterDependencies(courses));

    // Difficulty of any semester does not exceed maxSemesterDifficulty
    solver.add(...SemesterDifficultyCapped(semesters, courses, maxSemesterDifficulty));

    // Goal is to get the minimal end time
    solver.minimize(
        Max(...courses.map(course => course.satVar!))
    );

    if (await solver.check() == "unsat") {
        return ScheduleState.Unsat;
    }

    const model = solver.model();
    courses.forEach((course) => {
        course.chosenSemester = semesters[
            parseInt(model.eval(course.satVar!).toString())
        ];
    })
    setCoursesState(courses);

    return ScheduleState.Sat;
}
