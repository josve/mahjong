import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {Button, Chip, Stack, TextField, Typography} from "@mui/material";
import Providers from "@/components/Providers";

// Every story is already wrapped in Providers by .storybook/preview.tsx;
// this story shows how the app theme styles common MUI components.
const meta = {
    title: "Components/Providers",
    component: Providers,
    args: {
        children: (
            <Stack spacing={2} sx={{maxWidth: 400}}>
                <Typography variant="h4">Rubrik</Typography>
                <Typography variant="body1">Brödtext i appens tema.</Typography>
                <TextField label="Textfält"/>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained">Contained</Button>
                    <Button variant="outlined">Outlined</Button>
                    <Button variant="contained" color="secondary">Secondary</Button>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Chip label="Primary" color="primary"/>
                    <Chip label="Error" color="error"/>
                    <Chip label="Warning" color="warning"/>
                </Stack>
            </Stack>
        ),
    },
} satisfies Meta<typeof Providers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Theme: Story = {};
