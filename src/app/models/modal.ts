export interface Modal {
    title: string;
    message: string;
    onCancel: Function;
    onConfirm: Function;
    isInformative: boolean;
}