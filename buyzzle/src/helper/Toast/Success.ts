import { toast } from "react-toastify";

const displayedToasts: string[] = [];

export const toastSuccess = (message: string) => {
    if (!displayedToasts.includes(message)) {
        toast.success(message);
        displayedToasts.push(message);

        setTimeout(() => {
            displayedToasts.length = 0;
        }, 6000);
    }
}