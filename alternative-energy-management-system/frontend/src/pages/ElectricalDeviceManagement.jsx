import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

import { deviceService } from '../services/deviceService';
import { authService } from '../services/authService';
import ConsumptionCharts from '../components/ConsumptionCharts';
import DeviceFormDialog from '../components/DeviceFormDialog';

const ElectricalDeviceManagement = () => {
    const toast = useRef(null);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [deviceDialog, setDeviceDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const currentUser = authService.getCurrentUser();
    const userId = currentUser ? currentUser.uid : null;
    function getEmptyDevice() {
        return {
            id: null,
            userId: userId,
            category: '',
            modelBrand: '',
            powerConsumption: 0,
            dailyUsageHours: 0,
            priority: 1
        };
    }
    const [device, setDevice] = useState(getEmptyDevice());
    
    const categories = [
        { label: 'Air Conditioning', value: 'AC' },
        { label: 'Lighting', value: 'Lighting' },
        { label: 'Kitchen Appliances', value: 'Kitchen' },
        { label: 'Entertainment', value: 'Entertainment' },
        { label: 'Office Equipment', value: 'Office' },
        { label: 'Others', value: 'Others' }
    ];
    
    const priorityOptions = [
        { label: 'Low', value: 1 },
        { label: 'Medium', value: 2 },
        { label: 'High', value: 3 },
        { label: 'Critical', value: 4 }
    ];


    useEffect(() => {
        if (userId) {
            loadDevices();
        } else {
            setLoading(false);
            toast.current.show({
                severity: 'warn',
                summary: 'Authentication',
                detail: 'Please log in to manage your devices',
                life: 3000
            });
        }
    }, [userId]);
    
    const loadDevices = async () => {
        if (!userId) return;
        
        try {
            setLoading(true);
            const data = await deviceService.getAllDevices(userId);
            setDevices(data);
        } catch (error) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to load devices', 
                life: 3000 
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setDevice(getEmptyDevice());
        setSubmitted(false);
        setDeviceDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDeviceDialog(false);
    };

    const saveDevice = async () => {
        setSubmitted(true);
        
        if (!userId) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'You must be logged in to save devices',
                life: 3000
            });
            return;
        }
        
        if (device.modelBrand?.trim() && device.category) {
            try {
                let savedDevice;
                
                if (device.id) {
                    savedDevice = await deviceService.updateDevice(device);
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Device Updated', 
                        life: 3000 
                    });
                } else {
                    savedDevice = await deviceService.createDevice(device);
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Device Created', 
                        life: 3000 
                    });
                }
                
                await loadDevices();
                
                setDeviceDialog(false);
                setDevice(getEmptyDevice());
            } catch (error) {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to save device', 
                    life: 3000 
                });
            }
        }
    };

    const editDevice = (device) => {
        setDevice({...device});
        setDeviceDialog(true);
    };

    const confirmDeleteDevice = (device) => {
        setDevice(device);
        confirmDialog({
            message: 'Are you sure you want to delete this device?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteDevice(device.id)
        });
    };

    const deleteDevice = async (id) => {
        try {
            await deviceService.deleteDevice(id);
            await loadDevices();
            toast.current.show({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'Device Deleted', 
                life: 3000 
            });
        } catch (error) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to delete device', 
                life: 3000 
            });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _device = {...device};
        _device[name] = val;
        setDevice(_device);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _device = {...device};
        _device[name] = val;
        setDevice(_device);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex justify-content-end">
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-success mr-2" 
                    onClick={() => editDevice(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger" 
                    onClick={() => confirmDeleteDevice(rowData)} 
                />
            </div>
        );
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h5 className="m-0">Manage Electrical Devices</h5>
            <Button 
                label="Add New Device" 
                icon="pi pi-plus" 
                className="p-button-success" 
                onClick={openNew} 
                disabled={!userId}
            />
        </div>
    );

    const priorityBodyTemplate = (rowData) => {
        const priority = priorityOptions.find(option => option.value === rowData.priority);
        return priority ? priority.label : '';
    };

    const dailyConsumptionTemplate = (rowData) => {
        return <span>{(rowData.powerConsumption * rowData.dailyUsageHours).toFixed(2)} W</span>;
    };

    const categoryBodyTemplate = (rowData) => {
        const category = categories.find(cat => cat.value === rowData.category);
        return category ? category.label : rowData.category;
    };

    const renderContent = () => {
        if (!userId) {
            return (
                <div className="flex flex-column align-items-center p-5">
                    <i className="pi pi-lock text-6xl mb-3 text-yellow-500"></i>
                    <h3>Authentication Required</h3>
                    <p>Please log in to manage your electrical devices.</p>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="flex justify-content-center py-5">
                    <ProgressSpinner />
                </div>
            );
        }

        return (
            <>
                <DataTable 
                    value={devices} 
                    selection={selectedDevice} 
                    onSelectionChange={(e) => setSelectedDevice(e.value)}
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25]} 
                    className="p-datatable-responsive"
                    header={header}
                    emptyMessage="No devices found"
                    removableSort
                >
                    <Column field="id" header="ID" sortable style={{ width: '5%' }}></Column>
                    <Column field="category" header="Category" body={categoryBodyTemplate} sortable style={{ width: '15%' }}></Column>
                    <Column field="modelBrand" header="Model/Brand" sortable style={{ width: '20%' }}></Column>
                    <Column field="powerConsumption" header="Power (W)" sortable style={{ width: '10%' }}></Column>
                    <Column field="dailyUsageHours" header="Daily Use (h)" sortable style={{ width: '10%' }}></Column>
                    <Column header="Daily Consumption" body={dailyConsumptionTemplate} sortable style={{ width: '15%' }}></Column>
                    <Column field="priority" header="Priority" body={priorityBodyTemplate} sortable style={{ width: '10%' }}></Column>
                    <Column body={actionBodyTemplate} style={{ width: '10%' }}></Column>
                </DataTable>
                
                {devices.length > 0 && (
                    <div className="mt-4">
                        <ConsumptionCharts devices={devices} />
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div className="col-12">
                <h1>Electrical Device Management</h1>
                <p className="text-500">Manage and monitor the energy consumption of your electrical devices</p>
            </div>
            
            <div className="col-12">
                <Card>
                    {renderContent()}
                </Card>
            </div>
            
            <DeviceFormDialog
                visible={deviceDialog}
                device={device}
                submitted={submitted}
                categories={categories}
                priorityOptions={priorityOptions}
                onHide={hideDialog}
                onSave={saveDevice}
                onChange={onInputChange}
                onNumberChange={onInputNumberChange}
            />
        </div>
    );
};

export default ElectricalDeviceManagement;