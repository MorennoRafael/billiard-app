import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaArrowUp } from "react-icons/fa6";

export default function ReportCard({ icon: Icon, title, count, color }) {
    return (
        <Card className="gap-4 px-6">
            <div className="flex items-start gap-3">
                <CardHeader className="px-0">
                    <CardTitle className="w-6 h-6">
                        <Icon className={`w-full h-full ${color}`} />
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 p-0 w-full">
                    <p className="text-2xl font-bold">{count ? count : "0"}</p>
                    <p className="text-md text-neutral-500 font-medium">{title}</p>
                    <div className="flex items-center text-sm font-medium text-green-500">
                        <FaArrowUp className="mr-1" />
                        more than last quarter
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}

ReportCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
};
