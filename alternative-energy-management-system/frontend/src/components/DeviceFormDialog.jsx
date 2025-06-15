import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const DeviceFormDialog = ({
    visible,
    device,
    submitted,
    categories,
    priorityOptions,
    onHide,
    onSave,
    onChange,
    onNumberChange
}) => {
    const footer = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={onSave} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Device Details"
            modal
            className="p-fluid"
            footer={footer}
            onHide={onHide}
        >
            <div className="field">
                <label htmlFor="category">Category</label>
                <Dropdown
                    id="category"
                    value={device.category}
                    options={categories}
                    onChange={(e) => onChange(e, 'category')}
                    placeholder="Select a Category"
                    className={classNames({ 'p-invalid': submitted && !device.category })}
                />
                {submitted && !device.category && <small className="p-error">Category is required.</small>}
            </div>

            <div className="field">
                <label htmlFor="modelBrand">Brand and Model</label>
                <InputText
                    id="modelBrand"
                    value={device.modelBrand || ''}
                    onChange={(e) => onChange(e, 'modelBrand')}
                    required
                    className={classNames({ 'p-invalid': submitted && !device.modelBrand?.trim() })}
                />
                {submitted && !device.modelBrand?.trim() && <small className="p-error">Brand and Model are required.</small>}
            </div>

            <div className="field">
                <label htmlFor="powerConsumption">Power Consumption (Watts)</label>
                <InputNumber
                    id="powerConsumption"
                    value={device.powerConsumption}
                    onValueChange={(e) => onNumberChange(e, 'powerConsumption')}
                    min={0}
                />
            </div>

            <div className="field">
                <label htmlFor="dailyUsageHours">Daily Usage (Hours): {device.dailyUsageHours}</label>
                <Slider
                    id="dailyUsageHours"
                    value={device.dailyUsageHours}
                    onChange={(e) => onNumberChange(e, 'dailyUsageHours')}
                    min={0}
                    max={24}
                />
            </div>

            <div className="field">
                <label htmlFor="priority">Priority</label>
                <Dropdown
                    id="priority"
                    value={device.priority}
                    options={priorityOptions}
                    onChange={(e) => onChange(e, 'priority')}
                    placeholder="Select Priority"
                />
            </div>
        </Dialog>
    );
};

export default DeviceFormDialog;