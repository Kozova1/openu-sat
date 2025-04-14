import {Semester} from "../openu/types.ts";
import {Dispatch, SetStateAction} from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Slider, SliderValueLabel, SliderValueLabelProps,
    Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

export default function SemestersEditor({semesters, setSemesters}: {
    semesters: Semester[],
    setSemesters: Dispatch<SetStateAction<Semester[]>>
}) {
    function addPreviousSemester() {
        setSemesters([
            semesters[0].previous(),
            ...semesters
        ]);
    }

    function addNextSemester() {
        setSemesters([
            ...semesters,
            semesters[semesters.length - 1].next()
        ]);
    }

    return (
        <Stack spacing={2}>
            <Button
                variant="contained"
                component="label"
                startIcon={<AddIcon />}
                onClick={addPreviousSemester}
            >
                הוסף סמסטר קודם
            </Button>
            <List
                sx={{
                    overflow: "auto",
                    height: 300,
                    paddingInlineEnd: 5,
                }}
            >
                {
                    semesters.map((semester: Semester, index) => (
                        <ListItem key={semester.toString()} sx={{
                            padding: 3,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <ListItemText primary={semester.toString()} />
                            <Box width="2rem" />
                            <Slider
                                step={1}
                                max={50}
                                value={semester.maxDifficulty}
                                slots={{
                                    valueLabel: (props: SliderValueLabelProps) => (
                                        <SliderValueLabel {...props} value={`מגבלת קושי: ${props.value}`} />
                                    )
                                }}
                                valueLabelDisplay="auto"
                                onChange={(_, newDifficulty) => {
                                    const newSemester = new Semester(semester.year, semester.part);
                                    newSemester.maxDifficulty = newDifficulty;

                                    setSemesters(semesters.map((oldSem, i) =>
                                        (i === index) ? newSemester : oldSem
                                    ));
                                }}
                            />
                        </ListItem>
                    ))
                }
            </List>
            <Button
                variant="contained"
                component="label"
                startIcon={<AddIcon />}
                onClick={addNextSemester}
            >
                הוסף סמסטר הבא
            </Button>
        </Stack>
    );
}