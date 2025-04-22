import {Course, Semester} from "./types.ts";
import {Bool} from "z3-solver";
import Z3 from "./z3-consts.ts";


export function CoursesInPossibleSemesters(courses: Course[], semesters: Semester[]): Bool[] {
    return courses.map(course => {
        const validSemesters = semesters
            .filter(semester => semester.maxDifficulty >= Math.min(...courses.map(course => course.difficulty)))
            .filter(semester => course.availableInSemesters.includes(semester.part))
            .map(semester => semesters.findIndex(sem => sem === semester));

        return Z3.Or(...validSemesters.map(
            semester => course.satVar!.eq(semester)
        ))
    });
}

export function CoursesComeAfterDependencies(courses: Course[]): Bool[] {
    return courses.flatMap(course =>
        courses
            .filter(course2 => course.dependencies.includes(course2.courseId))
            .map(course2 => course.satVar!.gt(course2.satVar!))
    )
}

export function SemesterDifficultyCapped(semesters: Semester[], courses: Course[]): Bool[] {
    return semesters
        .filter(semester => semester.maxDifficulty >= Math.min(...courses.map(course => course.difficulty)))
        .map((semester, i) => {

        const coursesDifficultyIfRelevant = courses.map(course =>
            Z3.If(course.satVar!.eq(i), Z3.Int.val(course.difficulty), Z3.Int.val(0))
        );
        return Z3.Sum(
            coursesDifficultyIfRelevant[0],
            ...coursesDifficultyIfRelevant.slice(1)
        ).le(semester.maxDifficulty);
    })
}