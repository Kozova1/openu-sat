import {Arith} from "z3-solver";

export type CourseId = string;
export type Difficulty = number;
export type YearPart = "א" | "ב" | "ג";

export class Semester {
    year!: number;
    part!: YearPart;

    constructor(year: number, semester: string) {
        this.year = year;
        if (semester === "א" || semester === "ב" || semester == "ג") {
            this.part = semester;
        } else {
            throw Error(`Semester ${semester} is not a valid semester`);
        }
    }

    toString(): string {

        return `${this.year}${this.part}`;
    }
}

export class Course {
    id!: CourseId;
    name!: string;
    difficulty!: Difficulty;
    availableInSemesters!: YearPart[];
    dependencies: CourseId[] = [];
    satVar?: Arith = undefined;
    chosenSemester?: Semester = undefined;

    constructor(
        id: CourseId,
        name: string,
        difficulty: Difficulty,
        availableInSemesters: YearPart[],
        dependencies: CourseId[] = [],
    ) {
        this.id = id;
        this.name = name;
        this.difficulty = difficulty;
        this.dependencies = dependencies;
        this.availableInSemesters = availableInSemesters;
    }

    toString(): string {
        return `${this.id} - ${this.name}`;
    }
}