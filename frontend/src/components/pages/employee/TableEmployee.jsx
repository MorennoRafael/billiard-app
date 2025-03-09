import { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { CiSearch } from "react-icons/ci";
import AddEmployee from "./AddEmployee";
import DialogEdit from "./DialogEdit";
import DialogDelete from "./DialogDelete";

const itemsPerPage = 8;

export default function TableEmployee() {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:4000/employee", {
                params: { search: searchText },
                withCredentials: true
            });
            setEmployees(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);


    const refreshData = () => {
        fetchEmployees();
    };

    const totalPages = Math.ceil(employees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = employees.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        let pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            pages.push(
                <PaginationItem key={1}>
                    <PaginationLink href="#" isActive={1 === currentPage} onClick={() => handlePageChange(1)}>
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) {
                pages.push(<PaginationEllipsis key="ellipsis-start" />);
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                pages.push(<PaginationEllipsis key="ellipsis-end" />);
            }

            pages.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink href="#" isActive={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-4 justify-end">
                {isOpen ? (
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onBlur={() => setIsOpen(false)}
                        className="border border-gray-300 w-64 rounded-md bg-white px-2 py-1 focus:outline-none"
                        autoFocus
                    />
                ) : (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-1 text-neutral-600 cursor-pointer"
                    >
                        <CiSearch size={24} />
                        <p className="font-semibold">Search</p>
                    </button>
                )}
                <AddEmployee refreshData={refreshData} />
            </div>

            <div className="bg-white py-2 px-4 shadow-md rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">No</TableHead>
                            <TableHead className="w-32">Employee Name</TableHead>
                            <TableHead className="w-32">Email</TableHead>
                            <TableHead className="w-32">Role</TableHead>
                            <TableHead className="w-32">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((employee, index) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell>{employee.employee_name}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{employee.role}</Badge>
                                    </TableCell>
                                    <TableCell className="flex items-center gap-4">
                                        <DialogEdit dataEmployee={employee} refreshData={refreshData} />
                                        <DialogDelete selectedEmployee={employee.id} refreshData={refreshData} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No employees found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
                    </PaginationItem>
                    {renderPageNumbers()}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
