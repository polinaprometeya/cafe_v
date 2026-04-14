import "./Component.css"

function Table({ theadData = [], tbodyData = [], customClass }) {
    const TableHeadItem = ({ item }) => (
        <td title={item}>{item}</td>
    );

    const TableRow = ({ data = [] }) => {
        return (
            <tr>
                {data.map((item, idx) => {
                    return <td key={idx}>{item}</td>;   // item can be string, JSX, array of JSX
                })}
            </tr>
        );
    };

    return (
        <table className={customClass}>
            <thead>
                <tr>
                    {theadData.map((h, idx) => (
                        <TableHeadItem key={idx} item={h} />
                    ))}
                </tr>
            </thead>
            <tbody>
                {tbodyData.map((item, idx) => (
                    <TableRow key={item.id ?? idx} data={item.items ?? []} />
                ))}
            </tbody>
        </table>
    );
}

export default Table;