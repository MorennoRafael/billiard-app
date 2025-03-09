import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeeCard({ icon: Icon, title, count, color }) {
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
                </CardContent>
            </div>
        </Card>
    );
}

EmployeeCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
};
