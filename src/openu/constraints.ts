import {Course, Semester} from "./types.ts";
import {Arith, Bool} from "z3-solver";
import Z3 from "./z3-consts.ts";


type SatVars = Map<string, Arith>;

export function CoursesInPossibleSemesters(satVars: SatVars, courses: Course[], semesters: Semester[]): Bool[] {
    return courses.map(course => {
        const validSemesters = semesters
            // Semesters with a max difficulty lower than the easiest course must not have courses assigned to them
            .filter(semester => semester.maxDifficulty >= Math.min(...courses.map(course => course.difficulty)))
            .filter(semester => course.availableInSemesters.includes(semester.part))
            .map(semester => semesters.findIndex(sem => sem === semester));

        return Z3.Or(...validSemesters.map(
            semester => satVars.get(course.id)!.eq(semester)
        ))
    });
}

export function CoursesComeAfterDependencies(satVars: SatVars, courses: Course[]): Bool[] {
    return courses.flatMap(course =>
        course.dependencies.map(depId => satVars.get(course.id)!.gt(satVars.get(depId)!))
    )
}

export function SemesterDifficultyCapped(satVars: SatVars, semesters: Semester[], courses: Course[]): Bool[] {
    return semesters
        .filter(semester => semester.maxDifficulty >= Math.min(...courses.map(course => course.difficulty)))
        .map((semester, i) => {

        const coursesDifficultyIfRelevant = courses.map(course =>
            Z3.If(satVars.get(course.id)!.eq(i), Z3.Int.val(course.difficulty), Z3.Int.val(0))
        );
        return Z3.Sum(
            coursesDifficultyIfRelevant[0],
            ...coursesDifficultyIfRelevant.slice(1)
        ).le(semester.maxDifficulty);
    })
}