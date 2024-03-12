import { toast } from "react-toastify";

const displayedToasts: string[] = [];

export const toastError = (message: string) => {
    if (!displayedToasts.includes(message)) {
        toast.error(message);
        displayedToasts.push(message);

        setTimeout(() => {
            displayedToasts.length = 0;
        }, 6000);
    }
}