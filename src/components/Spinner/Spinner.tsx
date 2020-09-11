import * as React from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { ControlWrapper } from "../ControlWrapper/ControlWrapper";

interface SpinnerProps {
    className?: string;
    size?: number;
    margin?: number;
}

export function Spinner(props: SpinnerProps) {
    return (
        <ControlWrapper className={props.className} style={{ flexFlow: "column" }} >
            <PulseLoader size={props.size} margin={props.margin} />
        </ControlWrapper>
    );
}
