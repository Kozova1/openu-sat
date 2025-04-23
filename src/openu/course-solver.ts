import Z3 from "./z3-consts.ts"
import {Course, Semester} from "./types.ts";
import {
    CoursesComeAfterDependencies,
    CoursesInPossibleSemesters,
    SemesterDifficultyCapped
} from "./constraints.ts";
import {Max} from "./z3-utils.ts";

export enum ScheduleState {
    Uninitialized = "יש ללחוץ על 'חשב שנית'",
    Solving = "מנסים לפתור, רק רגע...",
    UnSat = "בלתי פתיר",
    Sat = "נפתר",
}

export type CourseAssignments = Map<Semester, Course[]>;

export async function solveSchedule(
    {semesters, courses}: {
        semesters: Semester[],
        courses: Course[]
    }
): Promise<[ScheduleState, CourseAssignments | null]> {
    const satVars = new Map(courses.map(
        course => [course.id, Z3.Int.const(course.id)]
    ));

    const solver = new Z3.Optimize();

    // All courses must be taken in given semesters
    solver.add(...CoursesInPossibleSemesters(satVars, courses, semesters));

    // Courses with dependencies come after their dependencies
    solver.add(...CoursesComeAfterDependencies(satVars, courses));

    // Difficulty of any semester does not exceed maxSemesterDifficulty
    solver.add(...SemesterDifficultyCapped(satVars, semesters, courses));

    // Goal is to get the minimal end time
    solver.minimize(
        Max(...satVars.values())
    );

    if (await solver.check() == "unsat") {
        return [ScheduleState.UnSat, null];
    }

    const model = solver.model();
    const assignments = new Map();

    courses.forEach(course => {
        const semester = semesters[parseInt(model.eval(satVars.get(course.id)!).toString())]!;
        if (!assignments.has(semester)) {
            assignments.set(semester, [course]);
        } else {
            assignments.set(semester, [...assignments.get(semester), course]);
        }
    });

    return [ScheduleState.Sat, assignments];
}
