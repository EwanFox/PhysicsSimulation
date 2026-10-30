import DataTable from "./Table";
import Table from "./Table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { columns, Log } from "./table-columns"
import { Button } from "./ui/button";

interface TableProps {
    data: Log[],
    recordValueHandler: () => void,
    resetTableHandler: () => void
}

export default function TableManager(props: TableProps) {
    return <div className="w-full flex content-center align-center justify-center pr-24 pl-24 pb-4">
        <Card className="w-full ">
            <CardHeader>
                <CardTitle>
                    Data Table
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={props.recordValueHandler}>Record Values</Button>
                <Button onClick={props.resetTableHandler}>Clear Table</Button>
                <DataTable columns={columns} data={props.data}></DataTable>
            </CardContent>
        </Card>
    </div>
}