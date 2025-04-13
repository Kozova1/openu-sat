import {
    Autocomplete,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Course} from "./types.ts";
import {Dispatch, SetStateAction} from "react";


function CourseDependencyEditor({courses, setCourses, courseId}: {
                                    courses: Course[],
                                    setCourses: Dispatch<SetStateAction<Course[]>>,
                                    courseId: string
                                }
) {
    const course = courses.find((course) => course.id === courseId)!;

    function setCourse(c: Course) {
        setCourses(courses.map(originalCourse => originalCourse.id === courseId ? c : originalCourse));
    }

    function doesRecursivelyRequire(maybeRequires: Course): boolean {
        let toCheckQueue = [maybeRequires];

        while (toCheckQueue.length > 0) {
            const dependencies = toCheckQueue.flatMap(
                course => course.dependencies.map(
                    depId => courses.find(c => c.id === depId)!
                )
            );

            for (const toCheck of toCheckQueue) {
                if (toCheck.id === course.id) {
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
            value={course.dependencies.map(depId => courses.find(c => c.id === depId))}
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
                    course.name,
                    course.difficulty,
                    [...course.availableInSemesters],
                    value.filter(c => c !== undefined).map(c => c.id),
                ))
            }}
        />
    )
}


export default function CoursesDependenciesEditor({courses, setCourses}: {
    setCourses: Dispatch<SetStateAction<Course[]>>,
    courses: Course[],
}) {
    return (
        <TableContainer>
            <Table>
                <TableBody>
                    {
                        courses.map(course => (
                            <TableRow key={course.id}>
                                <TableCell>
                                    <Typography component="label">{course.toString()}</Typography>
                                </TableCell>
                                <TableCell>
                                    <CourseDependencyEditor courses={courses} setCourses={setCourses}
                                                            courseId={course.id}/>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}