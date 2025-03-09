import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import NavigationButton from "@/components/button/NavigationButton";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function DialogEnd({ Icon, tables, selectedTable, selectedTransaction, onSessionEnd }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenDialog = () => {
        if (!selectedTransaction) {
            toast.error("Tidak ada transaksi aktif untuk meja ini!");
            return;
        }
        setIsOpen(true);
    };

    const handleCloseDialog = () => {
        setIsOpen(false);
    };

    const handleEndSession = () => {
        if (!selectedTransaction) {
            toast.error("Tidak ada transaksi untuk diakhiri!");
            return;
        }

        socket.emit("endSession", { id: selectedTransaction });
        toast.success("Sesi berhasil diakhiri!");

        onSessionEnd();
        setIsOpen(false);
    };

    return (
        <>
            <NavigationButton
                text="End Session"
                icon={Icon}
                color="#BA181B"
                isSelectedTableEmpty={selectedTable === null}
                onClick={handleOpenDialog}
            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-black-primary text-2xl">End Session</DialogTitle>
                        <DialogDescription className="font-medium text-md text-primary-light">
                            {tables ? `Are you sure you want to end the session for ${tables.table_name}?` : "No table selected"}
                        </DialogDescription>

                    </DialogHeader>
                    <DialogFooter className="justify-center">
                        <button
                            type="button"
                            onClick={handleCloseDialog}
                            className="w-2/5 px-2 py-1 rounded-md border border-double-light bg-white font-semibold text-base text-primary-light hover:bg-double-light hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleEndSession}
                            className="w-2/5 px-2 py-1 rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white"
                        >
                            End Session
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DialogEnd.propTypes = {
    Icon: PropTypes.elementType,
    tables: PropTypes.object,
    selectedTable: PropTypes.number,
    selectedTransaction: PropTypes.number,
    onSessionEnd: PropTypes.func.isRequired,
};
