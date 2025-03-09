import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { IoFilter } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

const data = [
    { id: 1, name: "Success", email: "success@example.com", date: "2023-06-01", status: "Unread" },
    { id: 2, name: "Warning", email: "warning@example.com", date: "2023-05-28", status: "Unread" },
    { id: 3, name: "Error", email: "error@example.com", date: "2023-05-15", status: "Read" },
    { id: 4, name: "Info", email: "info@example.com", date: "2023-04-30", status: "Read" },
    { id: 5, name: "Update", email: "update@example.com", date: "2023-04-25", status: "Unread" },
    { id: 6, name: "Test", email: "test@example.com", date: "2023-03-20", status: "Read" },
    { id: 7, name: "Test", email: "test@example.com", date: "2023-03-20", status: "Read" },
    { id: 8, name: "Test", email: "test@example.com", date: "2023-03-20", status: "Read" },
    { id: 9, name: "Test", email: "test@example.com", date: "2023-03-20", status: "Read" },
    { id: 10, name: "Test", email: "test@example.com", date: "2023-03-20", status: "Read" },
    { id: 11, name: "Test", email: "test@example.com", date: "2023-03-20", status: "Read" },
    { id: 12, name: "Test", email: "test@example.com", date: "2023-03-20", status: "Read" },
];

const itemsPerPage = 8;

export default function TableReport() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

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
                <button className="flex items-center gap-1 text-neutral-600">
                    <IoFilter size={24} />
                    <p className="font-semibold">Filter</p>
                </button>
                <button className="flex items-center gap-1 text-neutral-600">
                    <CiSearch size={24} />
                    <p className="font-semibold">Search</p>
                </button>
            </div>

            <div className="bg-white py-2 px-4 shadow-md rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">No</TableHead>
                            <TableHead className="w-32">Employee Name</TableHead>
                            <TableHead className="w-32">Email</TableHead>
                            <TableHead className="w-32">Date</TableHead>
                            <TableHead className="w-32">Status</TableHead>
                            <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{startIndex + index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                            <span className="sr-only">Mark as read</span>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <span className="sr-only">View details</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
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
