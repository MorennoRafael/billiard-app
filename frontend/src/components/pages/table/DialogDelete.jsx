import { useState } from "react";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import {
    Dialog,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { BsTrash } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";

export default function DialogDelete({ selectedTable, refreshData }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenDialog = () => {
        setIsOpen(true);
    };

    const handleCloseDialog = () => {
        setIsOpen(false);
    };

    const handleSubmitDelete = async () => {
        try {
            if (!selectedTable) {
                toast.error("Table not found!");
                return;
            }

            await axios.delete(`http://localhost:4000/table/${selectedTable}`);
            toast.success("Delete table successfull");
            refreshData();
        } catch (error) {
            console.error(error);
            toast.error("Delete table not successfull")
        }
    };

    return (
        <>
            <button className="text-[#BA181B] cursor-pointer" onClick={handleOpenDialog}>
                <BsTrash size={20} />
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-black-primary text-2xl">Delete table</DialogTitle>
                        <DialogDescription className="font-medium text-md text-primary-light">
                            Are you sure you want to delete this table?
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
                            className="w-2/5 px-2 py-1 rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white"
                            onClick={handleSubmitDelete}
                        >
                            Delete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DialogDelete.propTypes = {
    selectedTable: PropTypes.number,
    refreshData: PropTypes.func
};
