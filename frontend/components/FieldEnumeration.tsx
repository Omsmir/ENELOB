import React from 'react';
import CustomFormField, { FormFieldType } from './CustomFormField';
import { SelectItem } from './ui/select';

interface FieldEnumerationProps {
    name: string;
    placeHolder?: string;
    form: any;
    label?: string;
    Array?: readonly string[];
}

interface FieldSelectionProps {
    name: string;
    placeHolder?: string;
    form: any;
    selectArray?: string[];
    label?: string;
}

export const SelectionField = ({
    name,
    form,
    placeHolder,
    selectArray,
    label,
}: FieldSelectionProps) => {
    return (
        <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name={name}
            placeholder={placeHolder}
            label={label || ' '}
        >
            {selectArray &&
                selectArray.map((value, index) => (
                    <SelectItem
                        key={index}
                        value={value}
                        className="transition-all hover:bg-slate-200 cursor-pointer"
                    >
                        <div className="flex justify-center items-center">
                            <p className="text-md mx-2 text-black">{value}</p>
                        </div>
                    </SelectItem>
                ))}
        </CustomFormField>
    );
};

const FieldEnumeration = ({ name, placeHolder, form, label, Array }: FieldEnumerationProps) => {
    switch (name) {
        case 'Account Name':
            return (
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="full_name"
                    placeholder={placeHolder}
                    className="max-h-[25px] w-32 overflow-hidden rounded-sm"
                />
            );
        case 'occupation':
        case 'height':
        case 'weight':
        case 'gender':
        case 'numbers':
            return (
                <SelectionField
                    name={name}
                    form={form}
                    label={label}
                    placeHolder={placeHolder}
                    selectArray={Array && [...Array]}
                />
            );
        default:
            return null;
    }
};

export default FieldEnumeration;
