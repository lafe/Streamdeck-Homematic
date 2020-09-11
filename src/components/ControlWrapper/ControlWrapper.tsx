import * as React from "react";
import { css } from "../../common/css";

export interface ControlWrapperProps {
    className?: string;
    style?: React.CSSProperties;
}

export function ControlWrapper(props: React.PropsWithChildren<ControlWrapperProps>) {
    return (
        <div className={css("sdpi-item", props.className)} style={props.style}>
            {props.children}
        </div>
    );
}
