import {Course, YearPart} from "./types.ts";
import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {
    Checkbox,
    FormControlLabel,
    FormGroup, Grid,
    Rating,
    styled,
    TextField,
    Typography
} from "@mui/material";

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

export default function CourseEditor(
    {courses, setCourses, courseIndex}: {
        courses: Course[],
        setCourses: Dispatch<SetStateAction<Course[]>>,
        courseIndex: number,
    }) {

    const course = courses[courseIndex];

    function setCourse(c: Course) {
        setCourses(courses.map((originalCourse, i) =>
            i === courseIndex
                ? c
                : originalCourse
        ));
    }

    function semesterCheckboxChecked(semester: YearPart) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                if (!course.availableInSemesters.includes(semester)) {
                    const newAvailableInSemesters = course.availableInSemesters.concat(semester);
                    setCourse(new Course(
                        course.id,
                        course.name,
                        course.difficulty,
                        newAvailableInSemesters,
                        [...course.dependencies],
                    ));
                }
            } else {
                if (course.availableInSemesters.includes(semester)) {
                    const newAvailableInSemesters = course.availableInSemesters.filter(sem => sem !== semester);
                    setCourse(new Course(
                        course.id,
                        course.name,
                        course.difficulty,
                        newAvailableInSemesters,
                        [...course.dependencies],
                    ));
                }
            }
        }
    }

    return (
        <Grid container spacing={2}>
            <TextField size="small" variant="outlined" label="מספר הקורס" value={course.id} onChange={event => {
                setCourse(new Course(
                    event.target.value,
                    course.name,
                    course.difficulty,
                    [...course.availableInSemesters],
                    [...course.dependencies],
                ));
            }}></TextField>
            <TextField size="small" variant="outlined" label="שם הקורס" value={course.name} onChange={event => {
                setCourse(new Course(
                    course.id,
                    event.target.value,
                    course.difficulty,
                    [...course.availableInSemesters],
                    [...course.dependencies],
                ));
            }}></TextField>
            <Typography component="legend">קושי</Typography>
            <StyledRating
                max={10}
                value={course.difficulty}
                onChange={
                    (_, newDifficulty) => {
                        setCourse(new Course(
                            course.id,
                            course.name,
                            newDifficulty ?? course.difficulty,
                            [...course.availableInSemesters],
                            [...course.dependencies],
                        ));
                    }
                }>

            </StyledRating>
            <Typography component="legend">זמין בסמסטרים</Typography>
            <FormGroup row sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                {
                    Array.from("אבג").map(l => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={semesterCheckboxChecked(l as YearPart)}
                                    checked={course.availableInSemesters.includes(l as YearPart)}/>
                            }
                            label={`${l}'`}
                            key={l}
                        />
                    ))
                }
            </FormGroup>
        </Grid>
    );
}