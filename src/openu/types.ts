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
    id: string
    courseId: CourseId;
    name: string;
    difficulty: Difficulty;
    availableInSemesters: YearPart[];
    dependencies: string[] = [];
    isActive: boolean;

    constructor(
        id: string,
        courseId: CourseId,
        name: string,
        difficulty: Difficulty,
        availableInSemesters: YearPart[],
        dependencies: string[] = [],
        isActive: boolean = true
    ) {
        this.id = id;
        this.courseId = courseId;
        this.name = name;
        this.difficulty = difficulty;
        this.dependencies = dependencies;
        this.availableInSemesters = availableInSemesters;
        this.isActive = isActive;
    }

    static of(params: {
        id: string,
        courseId: CourseId,
        name: string,
        difficulty: Difficulty,
        availableInSemesters: YearPart[],
        dependencies: string[],
        isActive: boolean
    }) {
        return new Course(
            params.id,
            params.courseId,
            params.name,
            params.difficulty,
            [...params.availableInSemesters],
            [...params.dependencies],
            params.isActive
        );
    }

    with(params: {
        courseId?: CourseId,
        name?: string,
        difficulty?: Difficulty,
        availableInSemesters?: YearPart[],
        dependencies?: string[],
        isActive?: boolean
    }) {
        const {
            courseId,
            name,
            difficulty,
            dependencies,
            availableInSemesters,
            isActive
        } = params;

        return new Course(
            this.id,
            courseId ?? this.courseId,
            name ?? this.name,
            difficulty ?? this.difficulty,
            [...(availableInSemesters ?? this.availableInSemesters)],
            [...(dependencies ?? this.dependencies)],
            isActive ?? this.isActive,
        );
    }

    toString(): string {
        return `${this.courseId} - ${this.name}`;
    }
}