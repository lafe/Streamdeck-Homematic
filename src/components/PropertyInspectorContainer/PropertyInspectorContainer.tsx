import * as React from "react";
import { css } from "../../common/css";
import "./sdpi.css";

export interface PropertyInspectorContainerProps {
    className?: string;
}


export function PropertyInspectorContainer(props: React.PropsWithChildren<PropertyInspectorContainerProps>) {
    return (
        <div className={css("sdpi-wrapper", props.className)}>
            {props.children}
        </div>
    );
}
