import NavigationButton from "../../button/NavigationButton";
import { IoIosInformationCircleOutline } from "react-icons/io";
import PropTypes from "prop-types";
import { useState } from "react";

export default function InformationDetail({ tables, selectedTable, transactions }) {
    const [isOpen, setIsOpen] = useState(false);

    const latestTransaction = transactions.find(transaction => transaction.is_active) || null;
    const isTableSelected = selectedTable !== null && selectedTable !== undefined;

    return (
        <div className="flex flex-col gap-1">
            <NavigationButton
                text="Detail Information"
                icon={IoIosInformationCircleOutline}
                color="#616161"
                onClick={() => setIsOpen(!isOpen)}
                isSelectedTableEmpty={!isTableSelected}
            />
            {isOpen && tables && (
                <div className="flex flex-col py-2 px-3 border border-double-light rounded-md">
                    <div className="grid grid-cols-2 gap-x-4 text-md font-semibold space-y-0">
                        <div>Table Name:</div>
                        <div className="font-normal text-gray-600">{tables ? `${tables.table_name}` : "No table selected"}</div>

                        {latestTransaction ? (
                            <>
                                <div>Date:</div>
                                <div className="font-normal text-gray-600">{latestTransaction.date}</div>

                                <div>Customer Name:</div>
                                <div className="font-normal text-gray-600">{latestTransaction.customer_name}</div>

                                <div>Start Time:</div>
                                <div className="font-normal text-gray-600">
                                    {new Date(latestTransaction.time_start).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </div>

                                <div>End Time:</div>
                                <div className="font-normal text-gray-600">
                                    {new Date(latestTransaction.time_end).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </div>

                                <div>Total Cost:</div>
                                <div className="font-normal text-gray-600">{latestTransaction.total_price}</div>
                            </>
                        ) : (
                            <div className="col-span-2 text-gray-500">No transaction data available</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

InformationDetail.propTypes = {
    tables: PropTypes.object,
    transactions: PropTypes.array,
    selectedTable: PropTypes.number,
};
