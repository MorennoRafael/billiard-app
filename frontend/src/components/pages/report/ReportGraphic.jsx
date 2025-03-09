import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportGraphic({ title }) {
    return (
        <Card className="gap-4 px-6 h-64">
            <div className="flex flex-col gap-2">
                <CardHeader className="px-0">
                    <CardTitle className="w-full">
                        <p className="text-md text-neutral-500 font-medium">{title}</p>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 p-0 w-full">
                    Uhuy
                </CardContent>
            </div>
        </Card>
    );
}

ReportGraphic.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
};
