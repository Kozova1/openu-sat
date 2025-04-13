import {Semester} from "./types.ts";
import {Dispatch, SetStateAction} from "react";
import {IconButton, List, ListItem, ListItemText, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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

    function removeSemester(index: number) {
        setSemesters(semesters.filter((_, i) => i !== index));
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
                }}
            >
                {
                    semesters.map((semester: Semester, index) => (
                        <ListItem key={semester.toString()}>
                            <ListItemText primary={semester.toString()} />
                            {
                                semesters.length > 1 ? (
                                    <IconButton onClick={() => removeSemester(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                ) : (<></>)
                            }
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