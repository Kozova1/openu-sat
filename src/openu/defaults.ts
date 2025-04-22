import {Course, Semester} from "./types.ts";

const defaultCourses = [
    new Course(crypto.randomUUID(), "20476", "מתמטיקה בדידה", 6, ["א", "ב", "ג"]),
    new Course(crypto.randomUUID(), "20109", "אלגברה לינארית 1", 8, ["א", "ב", "ג"]),
    new Course(crypto.randomUUID(), "20474", "חשבון אינפיניטסימלי 1", 7, ["א", "ב", "ג"]),
    new Course(crypto.randomUUID(), "20475", "חשבון אינפיניטסימלי 2", 9, ["א", "ב", "ג"], ["20474"]),
    new Course(crypto.randomUUID(), "20425", "הסתברות ומבוא לסטטיסטיקה למדעי המחשב", 4, ["א", "ב", "ג"]),
    new Course(crypto.randomUUID(), "20441", "מבוא למדעי המחשב ושפת Java", 6, ["א", "ב"]),
    new Course(crypto.randomUUID(), "20407", "מבני נתונים ומבוא לאלגוריתמים", 7, ["א", "ב"], ["20441"]),
    new Course(crypto.randomUUID(), "20417", "אלגוריתמים", 7, ["א", "ב"], ["20407"]),
    new Course(crypto.randomUUID(), "20465", "מעבדה בתכנות מערכות", 6, ["א", "ב"], ["20441"]),
    new Course(crypto.randomUUID(), "20604", "מודלים חישוביים", 3, ["א", "ב"], ["20407"]),
    new Course(crypto.randomUUID(), "20471", "ארגון המחשב", 6, ["א", "ג"], ["20441"]),
    new Course(crypto.randomUUID(), "20466", " לוגיקה למדעי המחשב", 1, ["א", "ב"], ["20476"]),
    new Course(crypto.randomUUID(), "20594", "מערכות הפעלה", 7, ["א", "ב"], ["20465", "20407"]),
    new Course(crypto.randomUUID(), "20905", "שפות תכנות", 3, ["ב"], ["20407", "20604", "20417", "20465"]),
];

defaultCourses.forEach((course: Course) => {
    course.dependencies = course.dependencies.map(
        depCourseId => defaultCourses.find(candidateCourse => candidateCourse.courseId === depCourseId)!
    ).map(dependency => dependency.id);
});

export const initialCourses = defaultCourses;

const defaultSemestersCount = 10;
const firstSemester = new Semester(new Date().getFullYear() + 1, "א");
const semesters = [firstSemester];
[...Array(defaultSemestersCount).keys()].forEach(() => {
    semesters.push(semesters[semesters.length - 1].next());
});

export const defaultSemesters = semesters;
