import {Arith} from "z3-solver";

export type CourseId = string;
export type Difficulty = number;
export type YearPart = "א" | "ב" | "ג";

export class Semester {
    year!: number;
    part!: YearPart;
    maxDifficulty!: Difficulty;

    constructor(year: number, semester: string) {
        this.year = year;
        if (semester === "א" || semester === "ב" || semester == "ג") {
            this.part = semester;
        } else {
            throw Error(`Semester ${semester} is not a valid semester`);
        }
        this.maxDifficulty = 10;
    }

    toString(): string {
        return `${this.year}${this.part}`;
    }

    next(): Semester {
        switch (this.part) {
            case "א":
                return new Semester(this.year, "ב");
            case "ב":
                return new Semester(this.year, "ג");
            case "ג":
                return new Semester(this.year + 1, "א");
        }
    }

    previous(): Semester {
        switch (this.part) {
            case "א":
                return new Semester(this.year - 1, "ג");
            case "ב":
                return new Semester(this.year, "א");
            case "ג":
                return new Semester(this.year, "ב");
        }
    }
}

export class Course {
    id!: string
    courseId!: CourseId;
    name!: string;
    difficulty!: Difficulty;
    availableInSemesters!: YearPart[];
    dependencies: CourseId[] = [];
    satVar?: Arith = undefined;
    chosenSemester?: Semester = undefined;

    constructor(
        immutableId: string,
        id: CourseId,
        name: string,
        difficulty: Difficulty,
        availableInSemesters: YearPart[],
        dependencies: CourseId[] = [],
    ) {
        this.id = immutableId;
        this.courseId = id;
        this.name = name;
        this.difficulty = difficulty;
        this.dependencies = dependencies;
        this.availableInSemesters = availableInSemesters;
    }

    equals(other: Course): boolean {
        return (this.courseId === other.courseId) &&
            (this.name === other.name) &&
            (this.difficulty === other.difficulty) &&
            (this.availableInSemesters === other.availableInSemesters);
    }

    static arraysEqual(a: Course[], b: Course[]): boolean {
        return (a.length === b.length) && a.every((ai, i) => ai.equals(b[i]));
    }

    toString(): string {
        return `${this.courseId} - ${this.name}`;
    }
}