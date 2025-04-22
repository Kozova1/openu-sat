import {
    Autocomplete,
    Checkbox, Grid, Stack,
    TextField,
    Typography
} from "@mui/material";
import {Course} from "../openu/types.ts";
import {ActionDispatch} from "react";
import {CourseAction} from "../openu/courses-state.ts";


export function CourseDependencyEditor(
    {courses, dispatchCourses, courseId}: {
        courses: Course[],
        dispatchCourses: ActionDispatch<[CourseAction]>,
        courseId: string
    }
) {
    const course = courses.find((course) => course.courseId === courseId)!;

    function setCourse(course: Course) {
        dispatchCourses({
            type: "UpdateCourse",
            course: course,
        })
    }

    function doesRecursivelyRequire(maybeRequires: Course): boolean {
        let toCheckQueue = [maybeRequires];

        while (toCheckQueue.length > 0) {
            const dependencies = toCheckQueue.flatMap(
                course => course.dependencies.map(
                    depId => courses.find(c => c.courseId === depId)!
                )
            );

            for (const toCheck of toCheckQueue) {
                if (toCheck.courseId === course.courseId) {
                    return true;
                }
            }

            toCheckQueue = dependencies;
        }

        return false;
    }

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            limitTags={2}
            fullWidth
            options={courses.filter(currentCourse => !doesRecursivelyRequire(currentCourse))}
            value={course.dependencies.map(depId => courses.find(c => c.courseId === depId))}
            getOptionLabel={option => option!.toString()}
            size="small"
            sx={{
                maxHeight: 40,
                minWidth: "fit-content",
            }}
            renderOption={(props, option, {selected}) => {
                const {key, ...optionProps} = props;
                return (
                    <li key={key} {...optionProps}>
                        <Checkbox
                            checked={selected}
                        />
                        {option!.toString()}
                    </li>
                );
            }}
            renderInput={(params) => (<TextField {...params} label="דרישות"/>)}

            onChange={(_, value) => {
                setCourse(new Course(
                    course.id,
                    course.courseId,
                    course.name,
                    course.difficulty,
                    [...course.availableInSemesters],
                    value.filter(c => c !== undefined).map(c => c.id),
                ))
            }}
        />
    )
}


export default function CoursesDependenciesEditor({courses, dispatchCourses}: {
    dispatchCourses: ActionDispatch<[CourseAction]>,
    courses: Course[],
}) {
    return (
        <Stack
            spacing={2}
        >
            {
                courses.map(course => (
                    <Grid container key={course.courseId}>
                        <Grid size={4}>
                            <Typography component="label">{course.toString()}</Typography>
                        </Grid>
                        <Grid size={7}>
                            <CourseDependencyEditor
                                courses={courses}
                                dispatchCourses={dispatchCourses}
                                courseId={course.courseId}
                            />
                        </Grid>
                    </Grid>
                ))
            }
        </Stack>
    )
}