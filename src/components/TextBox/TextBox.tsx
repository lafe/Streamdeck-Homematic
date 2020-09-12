import * as React from "react";
import { getLogger } from "../../common/Logger";
import { ControlWrapper } from "../ControlWrapper/ControlWrapper";
import { Label } from "../Label/Label";

export interface TextBoxProps {
    className?: string;
    label?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;

    onChange?: (newValue?: string) => void;
}

export function TextBox(props: React.PropsWithChildren<TextBoxProps>) {
    //const [value, setValue] = React.useState(props.defaultValue);
    const logger = getLogger("TextBox");

    const onChange = (newValue?: string) => {
        logger.log(`New value: ${newValue}`);
        //setValue(newValue);
        if (props.onChange != null) {
            props.onChange(newValue);
        }
    };

    return (
        <ControlWrapper className={props.className}>
            <Label>{props.label}</Label>
            <input className="sdpi-item-value"
                type="text" 
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                disabled={props.disabled}
                onInput={(ev) => onChange(ev.currentTarget.value)} />
        </ControlWrapper>
    );
}
