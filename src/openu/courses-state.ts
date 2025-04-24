import {Course} from "./types.ts"

type AddCourseCommand = {
    type: "AddCourse",
    course: Course
}

type UpdateCourseCommand = {
    type: "UpdateCourse",
    course: Course
}

type DeleteCourseCommand = {
    type: "DeleteCourse",
    id: string
}

type ResetStateCommand = {
    type: "ResetState",
}

export type CourseAction = AddCourseCommand | UpdateCourseCommand | DeleteCourseCommand | ResetStateCommand;

export function createDefaultCourse(): Course {
    return new Course(crypto.randomUUID(), "", "", 1, []);
}

export function handleCourseAction(currentState: Course[], action: CourseAction): Course[] {
    switch (action.type) {
        case "AddCourse": {
            return [...currentState, action.course];
        }
        case "UpdateCourse": {
            return currentState.map(course =>
                course.id === action.course.id
                    ? action.course
                    : course
            )
        }
        case "DeleteCourse": {
            return currentState
                .filter(course => course.id !== action.id)
                .map(course => course.with({
                    dependencies: course.dependencies.filter(dep => dep != action.id)
                }));
        }
        case "ResetState": {
            return [createDefaultCourse()];
        }
    }
}