import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { IoFilter } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import DialogDelete from "./DialogDelete";
import DialogEdit from "./DialogEdit";

const itemsPerPage = 8;

export default function TableBilliard() {
    const [tables, setTables] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filters, setFilters] = useState({ role: "", price: "" });
    const [uniquePrices, setUniquePrices] = useState([]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    const clearFilters = () => {
        setFilters({ role: "", price: "" });
    };

    const fetchTables = async () => {
        try {
            let query = `http://localhost:4000/tables?search=${searchText}`;
            if (filters.role) query += `&role=${filters.role}`;
            if (filters.price) query += `&price=${filters.price}`;

            const response = await axios.get(query, { withCredentials: true });
            setTables(response.data);

            const prices = [...new Set(response.data.map(table => table.price))];
            setUniquePrices(prices);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, searchText]);


    const refreshData = () => {
        fetchTables(searchText);
    };

    const totalPages = Math.ceil(tables.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTables = tables.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        fetchTables(value);
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

            if (currentPage > 3) pages.push(<PaginationEllipsis key="ellipsis-start" />);

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

            if (currentPage < totalPages - 2) pages.push(<PaginationEllipsis key="ellipsis-end" />);

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
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-1 text-neutral-600 px-3 py-2 rounded-lg">
                            <IoFilter size={24} />
                            <p className="font-semibold">Filter</p>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-4 space-y-2">
                        <div>
                            <p className="text-sm font-semibold mb-1">Role</p>
                            <Select onValueChange={(value) => handleFilterChange("role", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vip">VIP</SelectItem>
                                    <SelectItem value="regular">Regular</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <p className="text-sm font-semibold mb-1">Harga</p>
                            <Select onValueChange={(value) => handleFilterChange("price", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Harga" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniquePrices.map((price) => (
                                        <SelectItem key={price} value={price.toString()}>
                                            {price.toLocaleString("id-ID")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <button
                            onClick={clearFilters}
                            className="w-full text-center bg-gray-200 text-sm font-semibold py-2 rounded-md mt-2"
                        >
                            Bersihkan Filter
                        </button>
                    </PopoverContent>

                </Popover>

                {isSearchOpen ? (
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearch}
                        onBlur={() => setIsSearchOpen(false)}
                        className="border border-gray-300 w-64 rounded-md bg-white px-2 py-1 focus:outline-none"
                        autoFocus
                    />
                ) : (
                    <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-1 text-neutral-600 cursor-pointer">
                        <CiSearch size={24} />
                        <p className="font-semibold">Search</p>
                    </button>
                )}
            </div>

            <div className="bg-white py-2 px-4 shadow-md rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">No</TableHead>
                            <TableHead className="w-32">Table Name</TableHead>
                            <TableHead className="w-32">Role</TableHead>
                            <TableHead className="w-32">Price</TableHead>
                            <TableHead className="w-32">Condition</TableHead>
                            <TableHead className="w-32">LED Pin</TableHead>
                            <TableHead className="w-32">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTables.length > 0 ? (
                            paginatedTables.map((table, index) => (
                                <TableRow key={table.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell>{table.table_name}</TableCell>
                                    <TableCell>{table.role}</TableCell>
                                    <TableCell>{table.price}</TableCell>
                                    <TableCell>{table.table_condition}</TableCell>
                                    <TableCell>{table.led_pin}</TableCell>
                                    <TableCell className="flex items-center gap-4">
                                        <DialogEdit dataTable={table} refreshData={refreshData} />
                                        <DialogDelete selectedTable={table.id} refreshData={refreshData} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">No tables found</TableCell>
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
