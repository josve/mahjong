import React from "react";
import {Box} from "@mui/material";

export const CustomTabPanel = (props: { value: number; index: number; children: React.ReactNode }) => {
    const { value, index, children } = props;
    return (
        <div role="tabpanel" hidden={value !== index} style={{ paddingTop: "15px" }}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
};