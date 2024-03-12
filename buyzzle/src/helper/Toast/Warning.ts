import { toast } from "react-toastify";

const displayedToasts: string[] = [];

export const toastWarn = (message: string) => {
    if (!displayedToasts.includes(message)) {
        toast.warn(message);
        displayedToasts.push(message);

        setTimeout(() => {
            displayedToasts.length = 0;
        }, 6000);
    }
}