import {Course, YearPart} from "../openu/types.ts";
import {ChangeEvent, Dispatch, ReactNode, SetStateAction} from "react";
import {
    Card,
    Checkbox,
    FormControlLabel,
    FormGroup, Grid, IconButton,
    Rating,
    styled,
    TextField,
    Typography, useMediaQuery, useTheme
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
    {courses, setCourses, courseIndex, button}: {
        courses: Course[],
        setCourses: Dispatch<SetStateAction<Course[]>>,
        courseIndex: number,
        button?: {
            onClick: () => void,
            icon: ReactNode
        }
    }) {

    const theme = useTheme();
    const isVeryWide = useMediaQuery(theme.breakpoints.up("xl"));

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
        <Card
            sx={{
                padding: "1rem",
            }}
        >
            <Grid
                container
                spacing={2}
                direction={isVeryWide ? "row" : "column"}
                alignItems={isVeryWide ? "center" : "flex-start"}
            >
                <TextField
                    size="small"
                    variant="outlined"
                    label="מספר הקורס"
                    value={course.id}
                    onChange={event => {
                        setCourse(new Course(
                            event.target.value,
                            course.name,
                            course.difficulty,
                            [...course.availableInSemesters],
                            [...course.dependencies],
                        ));
                    }}
                />

                <TextField
                    size="small"
                    variant="outlined"
                    label="שם הקורס"
                    value={course.name}
                    onChange={event => {
                        setCourse(new Course(
                            course.id,
                            event.target.value,
                            course.difficulty,
                            [...course.availableInSemesters],
                            [...course.dependencies],
                        ));
                    }}
                />

                <Grid
                    container
                    direction={isVeryWide ? "row" : "column"}
                    alignItems={isVeryWide ? "center" : "flex-start"}
                >
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
                        }
                    />
                </Grid>

                <Grid
                    container
                    direction="row"
                    alignItems={isVeryWide ? "center" : "flex-start"}
                >
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        size={isVeryWide ? 4 : 12}
                    >
                        <Typography component="legend">מוצע בסמסטר</Typography>
                    </Grid>
                    <Grid size={isVeryWide ? 7 : 10}>
                        <FormGroup>
                            <Grid
                                container
                                direction="row"
                            >
                                <Grid>
                                    {
                                        Array.from("אבג").map(l => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        // size="small"
                                                        onChange={semesterCheckboxChecked(l as YearPart)}
                                                        checked={course.availableInSemesters.includes(l as YearPart)}/>
                                                }
                                                label={`${l}`}
                                                key={l}
                                            />
                                        ))
                                    }
                                </Grid>
                            </Grid>
                        </FormGroup>
                    </Grid>
                    <Grid size={1}>
                        {
                            (button !== undefined)
                                ? (
                                    <IconButton
                                        sx={{
                                            alignSelf: "flex-end"
                                        }}
                                        onClick={button.onClick}
                                    >
                                        {button.icon}
                                    </IconButton>
                                )
                                : (
                                    <></>
                                )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}